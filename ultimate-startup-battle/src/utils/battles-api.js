import axios from 'axios';
import { getAccessToken } from './auth';

const BASE_URL = 'http://localhost:3333';

export function getPublicStartupBattles() {
  const url = `${BASE_URL}/api/battles/public`;
  return axios.get(url).then(response => response.data);
}

export function getPrivateStartupBattles() {
  const url = `${BASE_URL}/api/battles/private`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` } }).then(response => response.data);
}

//  /api/public/v1/boats
export function getBoats() {
  const url = `${BASE_URL}/api/public/v1/boats`;
  return axios.get(url).then(response => response.data);
}

// /api/public/v1/boat/:boatId
export function getBoat(boatId) {
  const url = `${BASE_URL}/api/public/v1/boat/`.concat(boatId);
  return axios.get(url).then(response => response.data);
}