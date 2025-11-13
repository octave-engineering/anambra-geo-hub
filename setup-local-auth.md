# Setup Local Authentication

## 1. Enable Auth in Your Local .env

Add these lines to your `.env` file:

```env
# Enable authentication locally
AUTH_ENABLED=true

# JWT settings (generate your own secret)
JWT_SECRET=your_local_jwt_secret_64_chars_long_replace_this_with_random_string
JWT_EXPIRES_IN=12h

# Optional: API keys for testing
API_KEYS=test_key_1,test_key_2
```

## 2. Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('base64url'))"
```

Copy the output and replace `JWT_SECRET=...` in your `.env` file.

## 3. Create Users Table Locally

If you have a local PostgreSQL database, run:

```bash
# Replace with your local database connection details
psql -h localhost -U your_user -d your_database -f server/config/database.schema.sql
```

## 4. Generate Password Hash for 'arbmana1234'

```bash
# Install dependencies first
npm install

# Generate hash
node server/scripts/generate-password-hash.mjs arbmana1234
```

Copy the hash and update the SQL file, then re-run the schema creation.

## 5. Test Login

Start your servers:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run dev
```

Visit `http://localhost:5173/login` and try:
- **Username:** admin
- **Password:** arbmana1234

## Expected Behavior

- ❌ **Wrong credentials:** Should show "Invalid credentials" error
- ✅ **Correct credentials:** Should redirect to dashboard with JWT token
- 🔒 **Protected routes:** Should require login to access `/api/health-metrics/*`
