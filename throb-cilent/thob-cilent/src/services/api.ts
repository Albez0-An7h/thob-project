import type { Material, Size, Addon, ConfigurationResponse, Configuration } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}

export async function getMaterials(): Promise<Material[]> {
  const response = await fetchAPI<{ success: boolean; data: Material[] }>('/materials');
  return response.data;
}

export async function getSizes(): Promise<Size[]> {
  const response = await fetchAPI<{ success: boolean; data: Size[] }>('/sizes');
  return response.data;
}

export async function getAddons(): Promise<Addon[]> {
  const response = await fetchAPI<{ success: boolean; data: Addon[] }>('/addons');
  return response.data;
}

export async function submitConfiguration(config: Configuration): Promise<ConfigurationResponse> {
  return fetchAPI<ConfigurationResponse>('/configure', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}
