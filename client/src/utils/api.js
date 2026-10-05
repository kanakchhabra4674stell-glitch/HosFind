import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const extractRequirementsAPI = async (text) => {
  const response = await api.post('/extract-requirements', { text });
  return response.data;
};

export const matchHospitalsAPI = async (requirements, userLocation) => {
  const response = await api.post('/match-hospitals', {
    requirements,
    userLocation
  });
  return response.data;
};

export const getHospitalsAPI = async () => {
  const response = await api.get('/hospitals');
  return response.data;
};

export const getHospitalByIdAPI = async (id) => {
  const response = await api.get(`/hospitals/${id}`);
  return response.data;
};

export const updateHospitalAvailabilityAPI = async (id, data) => {
  const response = await api.put(`/hospitals/${id}/availability`, data);
  return response.data;
};

export const getBloodInventoryAPI = async (group, lat, lng) => {
  const params = {};
  if (group) params.group = group;
  if (lat) params.lat = lat;
  if (lng) params.lng = lng;
  const response = await api.get('/blood', { params });
  return response.data;
};

export const getMedicineInventoryAPI = async (search, lat, lng) => {
  const params = {};
  if (search) params.search = search;
  if (lat) params.lat = lat;
  if (lng) params.lng = lng;
  const response = await api.get('/medicines', { params });
  return response.data;
};

export default api;
