import decode from 'jwt-decode';
import auth0 from 'auth0-js';
import Router from 'vue-router';

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const CLIENT_ID = 'oajox5fqVL3caUMduRThK6YXXn8xl5ul';
const CLIENT_DOMAIN = 'catslippers.eu.auth0.com';
const REDIRECT = 'http://localhost:8080/callback';
const SCOPE = 'full_access';
const AUDIENCE = 'https://www.yachthandicap.org';


const auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN,
});

const router = new Router({
  mode: 'history',
});

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  const match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  const accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  const idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE,
  });
}

export function logout() {
  clearIdToken();
  clearAccessToken();
  router.go('/');
}
