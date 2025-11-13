-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'partner', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert default admin user (password: arbmana1234)
-- Hash generated with bcrypt rounds=10 for password 'arbmana1234'
INSERT INTO users (username, email, password_hash, role) 
VALUES (
    'admin', 
    'admin@anambra-geohub.gov.ng', 
    '$2b$10$X/rub2bdy05GxEmn8.sZs.JkjbMlVXq/XsK9cb.4OdEyex/mS3PO.',
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- Insert demo users (password: arbmana1234)  
INSERT INTO users (username, email, password_hash, role) 
VALUES 
    ('partner1', 'partner@anambra-geohub.gov.ng', '$2b$10$X/rub2bdy05GxEmn8.sZs.JkjbMlVXq/XsK9cb.4OdEyex/mS3PO.', 'partner'),
    ('analyst', 'analyst@anambra-geohub.gov.ng', '$2b$10$X/rub2bdy05GxEmn8.sZs.JkjbMlVXq/XsK9cb.4OdEyex/mS3PO.', 'user')
ON CONFLICT (username) DO NOTHING;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
