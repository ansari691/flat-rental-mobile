import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { API_BASE_URL, getHeaders, handleResponse } from './apiConfig';

interface User {
  _id: string;
  email: string;
  userType: 'tenant' | 'landlord';
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export function userAuthentication() {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        } else {
          setUser(undefined);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setUser(undefined);
      }
    };

    checkAuthState();
  }, []);

  return {
    user,
  };
}

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    return { user: data.user };
  } catch (error) {
    throw error;
  }
};

export const signUp = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    return { user: data.user };
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    if (!userDataString) return null;
    return JSON.parse(userDataString);
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  } catch (error) {
    return false;
  }
};
