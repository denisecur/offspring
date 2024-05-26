import axios from 'axios';
import { getToken } from '../helpers'; // Stelle sicher, dass diese Funktion korrekt importiert wird
import { API } from '../constant';

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchUserGrades = async () => {
  try {
    const response = await apiClient.get('/users/me?populate=ausbildung.noten,ausbildung.noten.ausbildungsfach,ausbildung.noten.lernfeld');
    return response.data;
  } catch (error) {
    console.error('Error fetching grades:', error);
    throw error;
  }
};

export const addUserGrade = async (gradeData) => {
  try {
    const response = await apiClient.post('/notes', {
      data: gradeData,
    });
    return response.data;
  } catch (error) {
    console.error('Error posting grade:', error);
    throw error;
  }
};
