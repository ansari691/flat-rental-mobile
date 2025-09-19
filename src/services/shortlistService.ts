import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, getHeaders, handleResponse } from '../config/apiConfig';

export const shortlistService = {
  async addToShortlist(propertyId: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/shortlist`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async removeFromShortlist(propertyId: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/shortlist`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.status === 204;
  },

  async isShortlisted(propertyId: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/shortlist`, {
      headers: getHeaders(token),
    });
    return response.status === 200;
  },

  async getShortlistedProperties() {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/shortlisted`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};