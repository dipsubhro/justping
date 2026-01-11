// API client for monitor operations
const API_BASE_URL = 'http://localhost:3002/api'

export interface Monitor {
  _id: string
  userId: string
  websiteName: string
  targetType: string
  url: string
  selector?: string | null
  status: 'active' | 'paused' | 'error'
  lastChecked: string
  frequency: {
    value: number
    unit: 'minutes' | 'hours'
  }
  hasChanged: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMonitorData {
  websiteName: string
  targetType: string
  url: string
  selector?: string
  frequency?: {
    value: number
    unit: 'minutes' | 'hours'
  }
}

// Helper to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Send cookies with request
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response
}

export const monitorApi = {
  // Get all monitors for current user
  async getMonitors(): Promise<Monitor[]> {
    const response = await fetchWithAuth(`${API_BASE_URL}/monitors`)
    return response.json()
  },

  // Create a new monitor
  async createMonitor(data: CreateMonitorData): Promise<Monitor> {
    const response = await fetchWithAuth(`${API_BASE_URL}/monitors/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Get single monitor by ID
  async getMonitor(id: string): Promise<Monitor> {
    const response = await fetchWithAuth(`${API_BASE_URL}/monitors/${id}`)
    return response.json()
  },

  // Update monitor
  async updateMonitor(id: string, data: Partial<CreateMonitorData>): Promise<Monitor> {
    const response = await fetchWithAuth(`${API_BASE_URL}/monitors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Delete monitor
  async deleteMonitor(id: string): Promise<void> {
    await fetchWithAuth(`${API_BASE_URL}/monitors/${id}`, {
      method: 'DELETE',
    })
  },
}
