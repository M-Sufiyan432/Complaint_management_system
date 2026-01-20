# PgAdmin Database Setup Guide

## Method 1: Using PgAdmin GUI

### Step 1: Create Database
1. Open **PgAdmin**
2. Connect to your PostgreSQL server
3. Right-click on **Databases** → Select **Create** → **Database**
4. Fill in the details:
   - **Database**: `complaint_system`
   - **Owner**: `postgres`
   - **Encoding**: `UTF8`
   - **Template**: `template0`
   - **Collation**: `en_US.utf8`
   - **Character type**: `en_US.utf8`
5. Click **Save**

### Step 2: Execute SQL Script
1. Select the newly created `complaint_system` database
2. Click on **Tools** → **Query Tool**
3. Copy the contents of `setup-database.sql`
4. Paste into the Query Tool
5. Click **Execute/Run** button (▶️) or press **F5**

### Step 3: Verify Tables
1. Refresh the database in the tree view
2. Expand **complaint_system** → **Schemas** → **public** → **Tables**
3. You should see:
   - users
   - complaints
   - notifications
   - onboarding_reminders

---

## Method 2: Using Command Line (psql)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE complaint_system;

# Connect to the new database
\c complaint_system

# Exit psql
\q

# Run the setup script
psql -U postgres -d complaint_system -f setup-database.sql
```

---

## Method 3: Quick Command Line Setup

```bash
# One-liner to create database
psql -U postgres -c "CREATE DATABASE complaint_system;"

# Verify database exists
psql -U postgres -l | grep complaint_system
```

---

## Verify Database Setup

```sql
-- Connect to database
\c complaint_system

-- List all tables
\dt

-- Check users table
SELECT * FROM users LIMIT 5;

-- Check database encoding
SHOW SERVER_ENCODING;
```

---

## Connection Details

Use these details in your `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=complaint_system
```

---

## Troubleshooting

### Issue: "database already exists"
```sql
-- Drop existing database (WARNING: This deletes all data!)
DROP DATABASE IF EXISTS complaint_system;

-- Then create again
CREATE DATABASE complaint_system;
```

### Issue: Permission denied
```sql
-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE complaint_system TO postgres;
```

### Issue: Cannot connect to PostgreSQL
1. Check if PostgreSQL service is running
2. Verify port 5432 is not blocked
3. Check `pg_hba.conf` for connection rules

---

## Notes

- **TypeORM will auto-create tables** when you run the application with `synchronize: true` in development
- The SQL script is provided for reference and manual setup if needed
- Always use strong passwords in production
- Consider creating a dedicated database user instead of using `postgres` in production