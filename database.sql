CREATE DATABASE IF NOT EXISTS kadmiel_portfolio;
USE kadmiel_portfolio;

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
    event_type VARCHAR(50),
    page VARCHAR(255),
    path TEXT,
    source VARCHAR(255),
    ip VARCHAR(45),
    referrer TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    country VARCHAR(255),
    device VARCHAR(50),
    user_agent TEXT,
    language VARCHAR(50),
    timezone VARCHAR(100),
    screen_width INT,
    screen_height INT,
    session_id VARCHAR(255),
    consent_analytics BOOLEAN DEFAULT TRUE,
    ad_interests JSON,
    ad_click_source VARCHAR(255),
    retargeting_eligible BOOLEAN DEFAULT FALSE,
    color_scheme VARCHAR(20),
    device_memory FLOAT,
    hardware_concurrency INT,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technical levels table
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

-- Availability table
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

-- Table pour stocker les sessions/cookies uniques par utilisateur
CREATE TABLE IF NOT EXISTS cookies_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE,
    ip VARCHAR(45),
    device VARCHAR(50),
    user_agent TEXT,
    language VARCHAR(50),
    country VARCHAR(255),
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
