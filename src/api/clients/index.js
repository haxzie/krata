import { KRATA_API_URL } from '@/utils/secrets'
import createClient from './factory'

export const krataApiAuthClient = createClient({
  name: 'Krata Auth Client',
  baseURL: KRATA_API_URL,
  withCredentials: false,
  requireAuth: true,
});

export const krataApiClient = createClient({
  name: 'Krata Auth Client',
  baseURL: KRATA_API_URL,
  withCredentials: false,
  requireAuth: true,
});

export const mapboxApiClient = createClient({
  name: 'Mapbox Client',
  baseURL: 'https://api.mapbox.com',
  requireAuth: false,
  withCredentials: false
});