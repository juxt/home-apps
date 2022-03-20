import axios from 'axios';

export const api_key = '99fdc21a0b0ef55c0cbc002c0ae96fd6';

export const client = axios.create({
  baseURL: 'https://api.themoviedb.org',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
