import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, getHeaders, handleResponse } from '../config/apiConfig';

export const requestService = {
  async createRequest(requestData: {
    propertyId: string;
    message: string;
  }) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  async updateRequestStatus(requestId: string, status: 'approved' | 'rejected') {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: 'PUT',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  async getTenantRequests() {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/requests/tenant`, {
      headers: getHeaders(token || undefined),
    });
    return handleResponse(response);
  },

  async getLandlordRequests() {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/requests/landlord`, {
      headers: getHeaders(token || undefined),
    });
    return handleResponse(response);
  },

  async getRequestById(requestId: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      headers: getHeaders(token || undefined),
    });
    return handleResponse(response);
  },
};