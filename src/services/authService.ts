import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, getHeaders } from '../config/apiConfig';
import { useAuth } from '../context/AuthContext';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'landlord' | 'tenant';
  phoneNumber?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {

  async register(data: RegisterData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const { token, user } = await response.json();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login({ email, password }: LoginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { token, user } = await response.json();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
};