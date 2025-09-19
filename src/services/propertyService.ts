import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, getHeaders, handleResponse } from '../config/apiConfig';

export const propertyService = {
  async createProperty(propertyData: {
    title: string;
    description: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    images: string[];
  }) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
  },

  async updateProperty(propertyId: string, propertyData: any) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
  },

  async deleteProperty(propertyId: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.status === 204;
  },

  async getPropertyById(propertyId: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async getLandlordProperties() {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/properties/landlord`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async searchProperties(filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    location?: {
      latitude: number;
      longitude: number;
      radius?: number;
    };
  }) {
    const token = await AsyncStorage.getItem('userToken');
    const params = new URLSearchParams();
    
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters.bedrooms) params.append('bedrooms', String(filters.bedrooms));
    if (filters.bathrooms) params.append('bathrooms', String(filters.bathrooms));
    if (filters.location) {
      params.append('lat', String(filters.location.latitude));
      params.append('lng', String(filters.location.longitude));
      if (filters.location.radius) {
        params.append('radius', String(filters.location.radius));
      }
    }

    const response = await fetch(`${API_BASE_URL}/properties?${params}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};