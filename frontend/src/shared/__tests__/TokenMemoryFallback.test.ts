import { afterEach } from 'vitest';

describe('Token memory + fallback', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('uses memory when set', async () => {
    const mod = await import('@shared/auth/tokenStore');
    mod.setToken('abc');
    expect(mod.getToken()).toBe('abc');
  });

  it('falls back to storage on new import', async () => {
    // set in storage as if from previous session
    localStorage.setItem('auth_token', 'from-storage');
    // reload module to reset memory
    vi.resetModules();
    const mod = await import('@shared/auth/tokenStore');
    expect(mod.getToken()).toBe('from-storage');
  });

  it('does not throw if storage is unavailable', async () => {
    const orig = localStorage.getItem;
    // @ts-expect-error override for test
    localStorage.getItem = () => {
      throw new Error('denied');
    };
    const mod = await import('@shared/auth/tokenStore');
    expect(() => mod.setToken('xyz')).not.toThrow();
    // restore
    localStorage.getItem = orig;
  });
});

