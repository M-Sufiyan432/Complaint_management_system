-- ============================================
-- Complaint Management System Database Setup
-- ============================================

-- Step 1: Create Database
-- (Run this first as postgres user)
CREATE DATABASE complaint_system
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE complaint_system IS 'Database for complaint management system with user authentication and onboarding';

-- Step 2: Connect to the database
-- \c complaint_system;

-- Step 3: Create Extensions (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- The tables will be auto-created by TypeORM
-- But here's the schema for reference:
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    onboarding_stage INTEGER DEFAULT 0,
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_onboarding ON users(onboarding_stage, onboarding_complete);

-- Complaints Table
CREATE TYPE complaint_type_enum AS ENUM ('live_demo', 'billing_issue', 'technical_issue', 'feedback');
CREATE TYPE complaint_status_enum AS ENUM ('raised', 'in_progress', 'waiting_on_user', 'resolved', 'closed');

CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    complaint_type complaint_type_enum NOT NULL,
    status complaint_status_enum DEFAULT 'raised',
    details JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_type ON complaints(complaint_type);

-- Notifications Table
CREATE TYPE notification_type_enum AS ENUM ('complaint_status', 'onboarding_reminder');

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type notification_type_enum NOT NULL,
    title VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_sent ON notifications(is_sent);

-- Onboarding Reminders Table
CREATE TABLE IF NOT EXISTS onboarding_reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    stage INTEGER NOT NULL,
    reminder_level INTEGER NOT NULL,
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, stage, reminder_level)
);

CREATE INDEX idx_onboarding_reminders_user_stage ON onboarding_reminders(user_id, stage);
CREATE INDEX idx_onboarding_reminders_sent ON onboarding_reminders(sent);

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample user (password: test123)
-- INSERT INTO users (name, email, password, onboarding_stage, onboarding_complete) 
-- VALUES 
-- ('Test User', 'test@example.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 0, false);

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE complaint_system TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- ============================================
-- Verify Setup
-- ============================================

-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check database size
SELECT pg_size_pretty(pg_database_size('complaint_system')) AS database_size;