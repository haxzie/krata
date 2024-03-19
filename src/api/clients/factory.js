
import axios from 'axios'
import authInterceptor from './authInterceptor'

/**
 * Generates an httpClients based on given configuration
 * @param {Object} Options
 * @param {String} Options.name Name of the client
 * @param {String} Options.baseURL Base URL of the API
 * @param {Boolean} Options.requireAuth  Is the endpoint auth protected?
 */
function createClient({ name, baseURL, withCredentials = false, requireAuth = false }) {
  const httpClient = axios.create({
    baseURL,
    withCredentials: withCredentials,
  })

  // assign the name to the HTTP Client
  Object.assign(httpClient, { clientName: name })

  // assign auth interceptor if requested
  if (requireAuth) {
    httpClient.interceptors.request.use(authInterceptor)
  }

  return httpClient
}

export default createClient