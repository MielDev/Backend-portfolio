-- Drop in reverse dependency order. Safe because we have no FKs yet.
DROP TABLE IF EXISTS cookies_data;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS technical_levels;
DROP TABLE IF EXISTS analytics;
DROP TABLE IF EXISTS hero;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS about;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS testimonial_tokens;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
