import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';

// Mock the api service so no real HTTP calls are made
jest.mock('../../services/api', () => ({
  login: jest.fn(),
  register: jest.fn()
}));

import { login } from '../../services/api';

const onLogin = jest.fn();
const onRegister = jest.fn();

function renderLogin() {
  render(<Login onLogin={onLogin} onRegister={onRegister} />);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Login page', () => {
  describe('rendering', () => {
    it('renders the email input', () => {
      renderLogin();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders the password input', () => {
      renderLogin();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders the Sign In button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the Create your account link', () => {
      renderLogin();
      expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    });
  });

  describe('client-side validation', () => {
    it('shows an error when both fields are empty', async () => {
      renderLogin();
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(await screen.findByText(/please enter both email and password/i)).toBeInTheDocument();
    });

    it('shows an error for an invalid email address', async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });

    it('shows an error when password is too short', async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), 'chef@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), '123');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });
  });

  describe('successful login', () => {
    it('calls login() with the entered email and password', async () => {
      const staff = { id: 1, name: 'Chef', role: 'admin' };
      login.mockResolvedValueOnce({ accessToken: 'tok', staff });
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), 'chef@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      await waitFor(() => expect(login).toHaveBeenCalledWith('chef@test.com', 'password123'));
    });

    it('calls onLogin with the staff object on success', async () => {
      const staff = { id: 1, name: 'Chef', role: 'admin' };
      login.mockResolvedValueOnce({ accessToken: 'tok', staff });
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), 'chef@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      await waitFor(() => expect(onLogin).toHaveBeenCalledWith(staff));
    });
  });

  describe('failed login', () => {
    it('shows the API error message when login fails', async () => {
      login.mockRejectedValueOnce(new Error('Invalid email or password'));
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), 'chef@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
      expect(onLogin).not.toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('calls onRegister when the Create your account link is clicked', () => {
      renderLogin();
      fireEvent.click(screen.getByText(/Create your account/i));
      expect(onRegister).toHaveBeenCalled();
    });
  });
});
