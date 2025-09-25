import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  it('should send default message if err.message is falsy', () => {
    err.message = '';
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
  it('should call next(err) if headersSent is true', () => {
    res.headersSent = true;
    errorHandler(err, req, res, next);
    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  let err, req, res, next;

  beforeEach(() => {
    err = new Error('Test error');
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    // Suppress console.error for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should set status to err.status if it exists', () => {
    err.status = 404;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should set status to 500 if err.status does not exist', () => {
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should send a json response with the error message', () => {
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });

  it('should log the error to the console', () => {
    errorHandler(err, req, res, next);
    expect(console.error).toHaveBeenCalledWith(err);
  });
});
