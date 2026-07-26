// Mock axios before importing the service module
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  return mockAxios;
});

import {
  restoreSession,
  getAccessToken,
  setAccessToken,
  login,
  logout,
  register
} from '../../services/api';

import axios from 'axios';

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  // Reset token to null between tests
  setAccessToken(null);
});

// ─── Pure helpers ────────────────────────────────────────────────────────────
describe('restoreSession', () => {
  it('returns null when localStorage has no staff entry', () => {
    expect(restoreSession()).toBeNull();
  });

  it('returns parsed staff object from localStorage', () => {
    const staff = { id: 1, name: 'Chef', role: 'admin' };
    localStorage.setItem('staff', JSON.stringify(staff));
    expect(restoreSession()).toEqual(staff);
  });

  it('returns null and cleans up when localStorage contains invalid JSON', () => {
    localStorage.setItem('staff', 'not-valid-json{{{');
    expect(restoreSession()).toBeNull();
    expect(localStorage.getItem('staff')).toBeNull();
  });
});

describe('getAccessToken / setAccessToken', () => {
  it('getAccessToken returns null by default', () => {
    expect(getAccessToken()).toBeNull();
  });

  it('setAccessToken stores a token retrievable by getAccessToken', () => {
    setAccessToken('my-token-123');
    expect(getAccessToken()).toBe('my-token-123');
  });

  it('setAccessToken(null) clears the token', () => {
    setAccessToken('some-token');
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});

// ─── login() ─────────────────────────────────────────────────────────────────
describe('login', () => {
  it('stores accessToken in memory on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        accessToken: 'access-abc',
        staff: { id: 1, name: 'Chef', role: 'admin' }
      }
    });
    await login('chef@test.com', 'password123');
    expect(getAccessToken()).toBe('access-abc');
  });

  it('saves staff info to localStorage on success', async () => {
    const staff = { id: 2, name: 'Manager', role: 'manager' };
    axios.post.mockResolvedValueOnce({ data: { accessToken: 'tok', staff } });
    await login('mgr@test.com', 'password123');
    expect(JSON.parse(localStorage.getItem('staff'))).toEqual(staff);
  });

  it('returns the response data on success', async () => {
    const data = { accessToken: 'tok', staff: { id: 1 } };
    axios.post.mockResolvedValueOnce({ data });
    const result = await login('x@x.com', 'pass');
    expect(result).toEqual(data);
  });

  it('throws a user-friendly error on API failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid email or password' } }
    });
    await expect(login('bad@test.com', 'wrong')).rejects.toThrow('Invalid email or password');
  });

  it('throws a fallback message when no response is received', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    await expect(login('x@x.com', 'pass')).rejects.toThrow('Login failed. Please try again.');
  });
});

// ─── logout() ────────────────────────────────────────────────────────────────
describe('logout', () => {
  it('clears accessToken from memory', async () => {
    setAccessToken('existing-token');
    axios.post.mockResolvedValueOnce({});
    await logout();
    expect(getAccessToken()).toBeNull();
  });

  it('removes staff from localStorage', async () => {
    localStorage.setItem('staff', JSON.stringify({ id: 1 }));
    axios.post.mockResolvedValueOnce({});
    await logout();
    expect(localStorage.getItem('staff')).toBeNull();
  });

  it('still clears local state even when server call fails', async () => {
    setAccessToken('token');
    localStorage.setItem('staff', JSON.stringify({ id: 1 }));
    axios.post.mockRejectedValueOnce(new Error('Network down'));
    await logout();
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem('staff')).toBeNull();
  });
});

// ─── register() ──────────────────────────────────────────────────────────────
describe('register', () => {
  it('stores accessToken and staff on success', async () => {
    const staff = { id: 10, name: 'Owner', role: 'admin' };
    axios.post.mockResolvedValueOnce({ data: { accessToken: 'reg-tok', staff } });
    const result = await register({
      restaurantName: 'My Place',
      adminName: 'Owner',
      email: 'owner@myplace.com',
      password: 'strongpass'
    });
    expect(getAccessToken()).toBe('reg-tok');
    expect(JSON.parse(localStorage.getItem('staff'))).toEqual(staff);
    expect(result.accessToken).toBe('reg-tok');
  });

  it('throws a user-friendly error on failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already in use' } }
    });
    await expect(register({ restaurantName: 'X', adminName: 'X', email: 'x@x.com', password: 'pass' }))
      .rejects.toThrow('Email already in use');
  });
});
