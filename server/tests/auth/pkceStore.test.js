import { jest } from '@jest/globals';
import { putState, consumeState, __clearAll } from '../../src/auth/pkceStore.js';

describe('PKCE Store', () => {
  beforeEach(() => {
    __clearAll();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should store and retrieve a verifier', () => {
    const state = 'test_state';
    const verifier = 'test_verifier';
    putState(state, verifier);
    expect(consumeState(state)).toBe(verifier);
  });

  it('should return null for a non-existent state', () => {
    expect(consumeState('non_existent_state')).toBeNull();
  });

  it('should return null for an expired state', () => {
    const state = 'test_state';
    const verifier = 'test_verifier';
    putState(state, verifier);
    jest.advanceTimersByTime(6 * 60 * 1000); // 6 minutes
    expect(consumeState(state)).toBeNull();
  });

  it('should only allow a state to be consumed once', () => {
    const state = 'test_state';
    const verifier = 'test_verifier';
    putState(state, verifier);
    expect(consumeState(state)).toBe(verifier);
    expect(consumeState(state)).toBeNull();
  });
});
