# FROOTS

Full-stack fruits explorer with favorites, Google login (id_token verify), profile editing, and AI nutritional suggestions.

## Stack
- Backend: Node.js, Express, Sequelize (PostgreSQL), Google Auth, JWT, OpenAI
- Frontend: Vite + React, Redux Toolkit, React Router, Axios, Bootstrap (minimal usage)

## Features
- Google login, JWT sessions
- Fruit catalog (search, sort, infinite scroll)
- Favorites CRUD
- Profile (fullName, nickName, dateOfBirth, gender)
- AI suggestions (nutrient centroid + GPT explanation)
- OpenAPI spec (`server/openapi.yaml`)
- Tests with Jest + Supertest (>=90% coverage target)

## Environment Variables
Backend `.env` (see `server/.env.example`):
```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/froots_dev
DATABASE_URL_TEST=postgres://user:pass@localhost:5432/froots_test
JWT_SECRET=replace_me_with_strong_value
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
OPENAI_API_KEY=sk-...
ALLOWED_ORIGIN=http://localhost:5173
```
Frontend `.env`:
```
VITE_API_URL=http://localhost:4000
```
Create `froots_dev` and `froots_test` databases in Postgres (DBeaver or psql).

## Setup
```bash
# backend
cd server
npm install
cp .env.example .env   # then edit values
npm run seed:fruits
npm run dev
# frontend
cd ../client
npm install
npm run dev
```

## Testing
```bash
cd server
npm test                      # NODE_ENV=test uses DATABASE_URL_TEST if set
npm run test:coverage
```

## OpenAI Mocking in Tests
AI service mocked in `ai.test.js` using jest mock of openai package.

## Project Structure
```
server/
	src/
		config/ database.js
		models/ User.js Fruit.js Favorite.js index.js
		controllers/ authController.js fruitController.js favoriteController.js profileController.js aiController.js
		services/ fruitService.js aiService.js
		middleware/ auth.js errorHandler.js validate.js
		routes/ authRoutes.js fruitRoutes.js favoriteRoutes.js profileRoutes.js aiRoutes.js
		scripts/ seedFruityvice.js
		utils/ createError.js
	tests/
client/
	src/ (React + Redux slices + pages/components)
openapi.yaml
```

## AI Suggestions Details
1. Fetch all fruits from DB
2. Build nutrient vectors (calories, fat, sugar, carbohydrates, protein)
3. Compute centroid and cosine similarity per fruit
4. Return top N fruits with similarity score
5. Query `gpt-4-1106-nano` for concise nutritional explanations (fallback gracefully if OpenAI fails)

## Security Notes
- Use strong `JWT_SECRET`
- Restrict CORS origins in production
- Ensure Google Client ID matches frontend

## Future Enhancements
- Pagination cursors
- Refresh token rotation
- Optimistic UI updates for favorites
- Rate limiting & caching
- More granular Zod validation per route

