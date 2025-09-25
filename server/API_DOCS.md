# Froots API Documentation

**Base URL:** `http://localhost:3000` (Backend API)  
**Frontend URL:** `http://localhost:5173` (React Development Server)  
**API Version:** 1.0.0  
**Authentication:** JWT Bearer tokens with Google OAuth2

---

## Table of Contents
- [Authentication](#authentication)
- [Health Check](#health-check)
- [Fruits](#fruits)
- [Favorites](#favorites)
- [Profile](#profile)
- [AI Suggestions](#ai-suggestions)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

---

## Authentication

The API uses Google OAuth2 with PKCE for authentication and JWT tokens for subsequent requests.

### POST /auth/google
Direct Google ID token authentication (legacy method).

**Request Body:**
```json
{
  "id_token": "string" // Google ID token
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "nickName": "johndoe"
  }
}
```

**Errors:**
- `400` - Missing id_token
- `401` - Invalid token

---

### GET /auth/google/url
Generate Google OAuth URL with PKCE for secure authentication flow.

**Response (200):**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&state=...&code_challenge=..."
}
```

**Errors:**
- `500` - Missing Google OAuth environment variables

---

### POST /auth/google/exchange
Exchange Google authorization code for JWT token.

**Request Body:**
```json
{
  "code": "google-auth-code",
  "state": "state-from-oauth-url"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "nickName": "johndoe"
  }
}
```

**Errors:**
- `400` - Missing code or state, invalid or expired state
- `502` - Token exchange failed

---

### GET /auth/verify
Verify current JWT token validity.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "nickName": "johndoe"
  }
}
```

**Errors:**
- `401` - Invalid or missing token

---

## Health Check

### GET /health
Check API server status.

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## Fruits

Manage fruit data from the Fruityvice API.

### GET /fruits
Get paginated list of fruits with optional filtering.

**Query Parameters:**
- `search` (string, optional) - Search fruits by name
- `sort` (string, optional) - Sort field (name, family, calories, etc.)
- `order` (string, optional) - Sort order (asc, desc)
- `family` (string, optional) - Filter by fruit family
- `limit` (number, optional, default: 20) - Number of results per page
- `offset` (number, optional, default: 0) - Number of results to skip

**Example Request:**
```
GET /fruits?search=apple&sort=name&order=asc&limit=10&offset=0
```

**Response (200):**
```json
{
  "fruits": [
    {
      "id": 1,
      "name": "Apple",
      "family": "Rosaceae",
      "order": "Rosales",
      "genus": "Malus",
      "calories": 52,
      "fat": 0.2,
      "sugar": 10.4,
      "carbohydrates": 11.4,
      "protein": 0.3,
      "imageUrl": "/svg/reshot-icon-red-apple-67KYC54EAQ.svg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 95,
  "hasMore": true
}
```

---

### GET /fruits/:id
Get detailed information about a specific fruit.

**Path Parameters:**
- `id` (number, required) - Fruit ID

**Example Request:**
```
GET /fruits/1
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Apple",
  "family": "Rosaceae",
  "order": "Rosales", 
  "genus": "Malus",
  "calories": 52,
  "fat": 0.2,
  "sugar": 10.4,
  "carbohydrates": 11.4,
  "protein": 0.3,
  "imageUrl": "/svg/reshot-icon-red-apple-67KYC54EAQ.svg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `404` - Fruit not found

---

## Favorites

Manage user's favorite fruits. All endpoints require authentication.

### GET /favorites
Get user's favorite fruits.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "note": "My favorite breakfast fruit!",
    "userId": 1,
    "fruitId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Fruit": {
      "id": 1,
      "name": "Apple",
      "family": "Rosaceae",
      "calories": 52,
      "fat": 0.2,
      "sugar": 10.4,
      "carbohydrates": 11.4,
      "protein": 0.3,
      "imageUrl": "/svg/reshot-icon-red-apple-67KYC54EAQ.svg"
    }
  }
]
```

---

### POST /favorites
Add a fruit to favorites.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fruitId": 1, // required, positive integer
  "note": "My favorite breakfast fruit!" // optional, max 255 characters
}
```

**Response (201):**
```json
{
  "id": 1,
  "note": "My favorite breakfast fruit!",
  "userId": 1,
  "fruitId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400` - Validation errors (missing fruitId, invalid format)
- `409` - Fruit already in favorites

---

### PUT /favorites/:id
Update a favorite fruit's note.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (number, required) - Favorite ID

**Request Body:**
```json
{
  "note": "Updated note text" // optional, max 255 characters
}
```

**Response (200):**
```json
{
  "id": 1,
  "note": "Updated note text",
  "userId": 1,
  "fruitId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Errors:**
- `400` - Validation errors
- `404` - Favorite not found or doesn't belong to user

---

### DELETE /favorites/:id
Remove a fruit from favorites.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Path Parameters:**
- `id` (number, required) - Favorite ID

**Response (204):**
No content.

**Errors:**
- `404` - Favorite not found or doesn't belong to user

---

## Profile

Manage user profile information. All endpoints require authentication.

### GET /profile
Get current user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "nickName": "johndoe",
  "dateOfBirth": "1990-05-15",
  "gender": "male"
}
```

---

### PUT /profile
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "fullName": "John Smith", // 1-120 characters
  "nickName": "johnsmith",  // 1-40 characters
  "dateOfBirth": "1990-05-15", // YYYY-MM-DD format
  "gender": "male" // enum: "male", "female", "other"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Smith",
  "nickName": "johnsmith",
  "dateOfBirth": "1990-05-15",
  "gender": "male"
}
```

**Errors:**
- `400` - Validation errors or no fields provided

---

## AI Suggestions

Get AI-powered fruit recommendations based on user preferences.

### GET /ai/suggestions
Get personalized fruit suggestions using AI.

**Query Parameters:**
- `favoriteIds` (string, optional) - Comma-separated list of favorite fruit IDs
- `limit` (number, optional, default: 6) - Number of suggestions to return

**Example Request:**
```
GET /ai/suggestions?favoriteIds=1,5,12&limit=4
```

**Response (200):**
```json
{
  "suggestions": [
    {
      "id": 15,
      "name": "Pear",
      "imageUrl": "/svg/reshot-icon-pear-6DPQASG2FY.svg",
      "order": "Rosales",
      "family": "Rosaceae", 
      "genus": "Pyrus",
      "calories": 57,
      "reason": "Shares the same **Rosaceae** family as **Apple**, offering similar texture with complementary sweetness levels and comparable fiber content.",
      "nutritionalHighlight": "57 calories"
    }
  ]
}
```

**Notes:**
- If no `favoriteIds` provided, returns suggestions based on nutritional similarity
- Uses Google Gemini AI for generating personalized explanations
- Suggestions exclude fruits already in favorites
- Prioritizes fruits from same botanical families and orders as favorites

---

## Error Handling

All endpoints return consistent error responses:

### Error Response Format
```json
{
  "message": "Error description",
  "details": "Additional error details (optional)",
  "code": "ERROR_CODE (optional)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid auth token)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
- `502` - Bad Gateway (external service error)

### Validation Errors
Validation errors include detailed field-level information:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "fruitId",
      "message": "fruitId required"
    }
  ]
}
```

---

## Data Models

### User
```javascript
{
  id: Integer (Primary Key, Auto Increment),
  googleSub: String (Unique, Not Null),
  email: String (Unique, Not Null, Email Format),
  fullName: String,
  nickName: String,
  dateOfBirth: Date (YYYY-MM-DD),
  gender: Enum("male", "female", "other"),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Fruit
```javascript
{
  id: Integer (Primary Key, Auto Increment),
  name: String (Unique, Not Null),
  family: String,
  order: String,
  genus: String,
  calories: Float,
  fat: Float,
  sugar: Float,
  carbohydrates: Float,
  protein: Float,
  imageUrl: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Favorite
```javascript
{
  id: Integer (Primary Key, Auto Increment),
  userId: Integer (Foreign Key -> User.id),
  fruitId: Integer (Foreign Key -> Fruit.id),
  note: String (Max 255 characters),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Environment Variables

Required environment variables for running the API:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/froots_db

# JWT
JWT_SECRET=your-jwt-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# AI (Optional)
GEMINI_API_KEY=your-gemini-api-key

# CORS
ALLOWED_ORIGIN=http://localhost:5173

# Server
PORT=3000
NODE_ENV=development
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

---

## CORS Configuration

The API supports configurable CORS with:
- Environment-based allowed origins
- Credential support
- Wildcard support for development

---

## Development

### Running the Server
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### Testing
```bash
npm test              # Run tests
npm run test:coverage # Run tests with coverage
```

### Database Seeding
```bash
npm run seed:fruits   # Populate fruits from Fruityvice API
```

---

**Last Updated:** December 2024  
**API Version:** 1.0.0