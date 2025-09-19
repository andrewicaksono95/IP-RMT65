if (!process.env.DATABASE_URL_TEST) {
	// Provide a clear error if test DB not set
	console.warn('DATABASE_URL_TEST not set. Set it to a Postgres test database.');
}
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
