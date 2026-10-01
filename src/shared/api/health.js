import apiClient from './client'

export const fetchHealth = async () => apiClient.get('/health')
