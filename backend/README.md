# Zara AI Backend

A robust Node.js backend API for the Zara AI application with comprehensive authentication, user management, and security features.

## Features

- 🔐 **Complete Authentication System**
  - User registration with email verification
  - Secure login with JWT tokens
  - Password reset functionality
  - Refresh token rotation
  - Multi-device logout support

- 👤 **User Management**
  - Profile management
  - Password change
  - Account deactivation
  - User preferences
  - Activity tracking

- 🛡️ **Security**
  - Password hashing with bcrypt
  - JWT token authentication
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers

- 📧 **Email System**
  - Email verification
  - Password reset emails
  - Welcome emails
  - Responsive HTML templates

- 🗄️ **MongoDB Integration**
  - Mongoose ODM
  - Data validation
  - Indexing for performance
  - Connection management

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zara-ai
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running
   - Atlas: Use your MongoDB Atlas connection string

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/refresh` | Refresh access token | Public |
| POST | `/logout` | Logout user | Private |
| POST | `/logout-all` | Logout from all devices | Private |
| GET | `/verify-email/:token` | Verify email address | Public |
| POST | `/resend-verification` | Resend verification email | Public |
| POST | `/forgot-password` | Request password reset | Public |
| PUT | `/reset-password/:token` | Reset password | Public |
| GET | `/me` | Get current user | Private |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |
| DELETE | `/account` | Delete/deactivate account | Private |
| GET | `/dashboard` | Get dashboard data | Private |
| PUT | `/avatar` | Update user avatar | Private |
| GET | `/activity` | Get user activity log | Private |
| GET | `/admin/users` | Get all users | Admin |
| PUT | `/admin/users/:id/status` | Update user status | Admin |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | Health check | Public |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "agreeToTerms": true,
  "subscribeNewsletter": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isVerified": false
    }
  }
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isVerified": true,
      "role": "user",
      "preferences": {
        "theme": "system",
        "language": "en"
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token (7 days) for API access
2. **Refresh Token**: Long-lived token (30 days) for token renewal

### Using Access Tokens

Include the access token in the Authorization header:

```bash
Authorization: Bearer <access_token>
```

### Token Refresh

When an access token expires, use the refresh token:

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": "Additional error details (development only)"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/auth/login"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Database Schema

### User Model

```javascript
{
  firstName: String,          // Required, 2-50 characters
  lastName: String,           // Required, 2-50 characters
  email: String,             // Required, unique, validated
  password: String,          // Hashed with bcrypt
  avatar: String,            // URL to user avatar
  role: String,              // 'user', 'admin', 'moderator'
  isVerified: Boolean,       // Email verification status
  isActive: Boolean,         // Account active status
  subscribeNewsletter: Boolean,
  
  // OAuth fields
  googleId: String,
  githubId: String,
  
  // Email verification
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Refresh tokens
  refreshTokens: [{
    token: String,
    createdAt: Date,
    expiresAt: Date,
    deviceInfo: String
  }],
  
  // Login tracking
  lastLogin: Date,
  loginCount: Number,
  
  // Preferences
  preferences: {
    theme: String,           // 'light', 'dark', 'system'
    language: String,        // Language code
    notifications: {
      email: Boolean,
      marketing: Boolean
    }
  },
  
  // Usage analytics
  aiInteractions: Number,
  
  // Account status
  accountStatus: String,     // 'active', 'suspended', 'deactivated'
  
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Registration
- **firstName/lastName**: 2-50 characters, letters and spaces only
- **email**: Valid email format
- **password**: Minimum 8 characters, must contain uppercase, lowercase, and number
- **agreeToTerms**: Must be true

### Login
- **email**: Valid email format
- **password**: Required

### Profile Update
- **firstName/lastName**: 2-50 characters, letters and spaces only
- **email**: Valid email format (if provided)
- **preferences**: Valid preference options

## Security Features

1. **Password Security**
   - bcrypt hashing with configurable salt rounds
   - Strong password requirements
   - Password reset with time-limited tokens

2. **JWT Security**
   - Secure token generation
   - Token expiration
   - Refresh token rotation
   - Multi-device logout support

3. **Rate Limiting**
   - Global rate limiting (100 requests per 15 minutes)
   - Per-user rate limiting for sensitive operations

4. **Input Validation**
   - Express-validator for input sanitization
   - MongoDB injection prevention
   - XSS protection

5. **Email Security**
   - Secure token generation for email verification
   - Time-limited verification and reset tokens

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Access token expiration | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `30d` |
| `EMAIL_SERVICE` | Email service provider | `gmail` |
| `EMAIL_USERNAME` | Email username | Required |
| `EMAIL_PASSWORD` | Email password/app password | Required |
| `EMAIL_FROM` | From email address | Required |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | `15` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `BCRYPT_SALT_ROUNDS` | bcrypt salt rounds | `12` |

## Development

### Scripts

```bash
# Start development server with auto-restart
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Logging

The server includes comprehensive logging:
- Request/response logging
- Error logging with stack traces (development)
- Authentication events
- Database operations

### Testing

You can test the API using tools like:
- **Postman**: Import the collection (create one from the endpoints above)
- **curl**: Use curl commands for testing
- **Thunder Client**: VS Code extension for API testing

Example curl test:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123",
    "agreeToTerms": true
  }'
```

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Configure production database
4. Set up proper email service
5. Configure HTTPS
6. Set up monitoring and logging

### Security Checklist
- [ ] Strong JWT secrets
- [ ] HTTPS enabled
- [ ] Database authentication
- [ ] Email service secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Error logging set up
- [ ] Monitoring in place

## Support

For issues and questions:
1. Check the logs for error details
2. Verify environment configuration
3. Test database connectivity
4. Check email service configuration

## License

This project is licensed under the MIT License.
