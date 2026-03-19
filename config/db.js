const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // Permet d'exécuter plusieurs requêtes SQL d'un coup (nécessaire pour le script SQL)
});

const syncDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');

    // SQL Script for table creation
    const sqlScript = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Projects table
      CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image VARCHAR(255),
          github_url VARCHAR(255),
          demo_url VARCHAR(255),
          tags JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Skills table
      CREATE TABLE IF NOT EXISTS skills (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          technologies JSON,
          icon VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Experiences table
      CREATE TABLE IF NOT EXISTS experiences (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          start_date DATE,
          end_date DATE,
          description JSON,
          current BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Testimonials table
      CREATE TABLE IF NOT EXISTS testimonials (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255),
          company VARCHAR(255),
          content TEXT,
          photo VARCHAR(255),
          status ENUM('pending', 'published') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Blog Posts table
      CREATE TABLE IF NOT EXISTS blog_posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          content TEXT,
          read_minutes INT,
          image VARCHAR(255),
          tags JSON,
          status ENUM('draft', 'published') DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Messages table
      CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255),
          content TEXT,
          status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- About table
      CREATE TABLE IF NOT EXISTS about (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          title VARCHAR(255),
          bio TEXT,
          photo VARCHAR(255),
          resume_url VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(255),
          location VARCHAR(255),
          nationality VARCHAR(255),
          interests JSON,
          social_links JSON,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Settings table
      CREATE TABLE IF NOT EXISTS settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          setting_key VARCHAR(255) NOT NULL UNIQUE,
          value TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Hero table
      CREATE TABLE IF NOT EXISTS hero (
          id INT AUTO_INCREMENT PRIMARY KEY,
          greeting VARCHAR(255),
          name VARCHAR(255),
          role VARCHAR(255),
          description TEXT,
          cv VARCHAR(255),
          projects_count VARCHAR(50),
          experience_years VARCHAR(50),
          passion_icon VARCHAR(50)
      );

      -- Analytics table
      CREATE TABLE IF NOT EXISTS analytics (
          id INT AUTO_INCREMENT PRIMARY KEY,
          page VARCHAR(255),
          source VARCHAR(255),
          country VARCHAR(255),
          device VARCHAR(255),
          visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS technical_levels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type ENUM('hard', 'soft') NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          percent TINYINT UNSIGNED,
          icon VARCHAR(255),
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS availability (
          id INT AUTO_INCREMENT PRIMARY KEY,
          badge_text VARCHAR(255),
          headline TEXT,
          description TEXT,
          tags JSON,
          primary_cta_text VARCHAR(255),
          primary_cta_type VARCHAR(50),
          secondary_cta_text VARCHAR(255),
          secondary_cta_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    console.log('Synchronizing tables...');
    await connection.query(sqlScript);
    
    // Add CV column if it doesn't exist (Migration)
    try {
      await connection.query('ALTER TABLE hero ADD COLUMN IF NOT EXISTS cv VARCHAR(255) AFTER description');
    } catch (err) {
      // Some MySQL versions don't support ADD COLUMN IF NOT EXISTS
      try {
        await connection.query('ALTER TABLE hero ADD COLUMN cv VARCHAR(255) AFTER description');
      } catch (innerErr) {
        // Column probably already exists
      }
    }

    // Add Interests column to about if it doesn't exist
    try {
      await connection.query('ALTER TABLE about ADD COLUMN interests JSON AFTER location');
    } catch (err) {
      // Column probably already exists
    }

    // Add Nationality column to about if it doesn't exist
    try {
      await connection.query('ALTER TABLE about ADD COLUMN nationality VARCHAR(255) AFTER location');
    } catch (err) {
      // Column probably already exists
    }

    // Add Skills columns if they don't exist (Migration)
    try {
      await connection.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL AFTER id');
      await connection.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS description TEXT AFTER title');
      await connection.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS technologies JSON AFTER description');
      // Drop old columns if they exist
      try { await connection.query('ALTER TABLE skills DROP COLUMN name'); } catch (e) {}
      try { await connection.query('ALTER TABLE skills DROP COLUMN category'); } catch (e) {}
      try { await connection.query('ALTER TABLE skills DROP COLUMN level'); } catch (e) {}
    } catch (err) {
      // Fallback for MySQL versions that don't support IF NOT EXISTS in ALTER
      try { await connection.query('ALTER TABLE skills ADD COLUMN title VARCHAR(255) NOT NULL AFTER id'); } catch (e) {}
      try { await connection.query('ALTER TABLE skills ADD COLUMN description TEXT AFTER title'); } catch (e) {}
      try { await connection.query('ALTER TABLE skills ADD COLUMN technologies JSON AFTER description'); } catch (e) {}
    }

    // Drop Tasks column from projects if it exists
    try {
      await connection.query('ALTER TABLE projects DROP COLUMN tasks');
    } catch (err) {
      // Column probably already dropped
    }

    // Change description column type in experiences to JSON
    try {
      await connection.query('ALTER TABLE experiences MODIFY COLUMN description JSON');
    } catch (err) {
      // Column probably already modified
    }

    try {
      await connection.query('ALTER TABLE blog_posts ADD COLUMN read_minutes INT AFTER content');
    } catch (err) {
    }

    try {
      await connection.query('ALTER TABLE technical_levels ADD COLUMN sort_order INT DEFAULT 0');
    } catch (err) {
    }

    console.log('Database tables synchronized successfully');

    connection.release();
  } catch (error) {
    console.error('Error during database synchronization:', error.message);
  }
};

// Run sync at startup
syncDatabase();

module.exports = pool;
