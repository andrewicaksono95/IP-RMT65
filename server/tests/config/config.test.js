import { jest } from '@jest/globals';

describe('config.js', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should export development config with correct properties', async () => {
    process.env.DATABASE_URL = 'dev-url';
    process.env.DB_LOG_SQL = 'true';
    process.env.DB_SSL = 'true';
    const config = (await import('../../src/config/config.js')).default;
    const dev = config.development;
    expect(dev.url).toBe('dev-url');
    expect(dev.dialect).toBe('postgres');
  expect(typeof dev.logging).toBe('function');
    expect(dev.dialectOptions.ssl).toEqual({ require: true, rejectUnauthorized: false });
  });

  it('should export test config with correct properties', async () => {
    process.env.DATABASE_URL_TEST = 'test-url';
    process.env.DB_SSL = 'false';
    const config = (await import('../../src/config/config.js')).default;
    const testCfg = config.test;
    expect(testCfg.url).toBe('test-url');
    expect(testCfg.dialect).toBe('postgres');
    expect(testCfg.logging).toBe(false);
    expect(testCfg.dialectOptions.ssl).toBeUndefined();
  });

  it('should export production config with correct properties', async () => {
    process.env.DATABASE_URL = 'prod-url';
    process.env.DB_SSL = 'true';
    const config = (await import('../../src/config/config.js')).default;
    const prod = config.production;
    expect(prod.url).toBe('prod-url');
    expect(prod.dialect).toBe('postgres');
    expect(prod.logging).toBe(false);
    expect(prod.dialectOptions.ssl).toEqual({ require: true, rejectUnauthorized: false });
  });
});
