const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export interface Alert {
  _id: string;
  userId: string;
  monitorId: string;
  monitorName?: string;
  checked: boolean;
  receivedAt: string;
  payload: Record<string, unknown>;
}

export interface MarkCheckedResponse {
  status: string;
  markedCount: number;
}

/**
 * Fetch all alerts for the logged-in user, sorted by receivedAt DESC
 */
export async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/api/alerts`, {
    method: 'GET',
    credentials: 'include', // Send cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - please log in');
    }
    throw new Error(`Failed to fetch alerts: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Mark all unchecked alerts as checked for the logged-in user
 */
export async function markAlertsAsChecked(): Promise<MarkCheckedResponse> {
  const response = await fetch(`${API_BASE_URL}/api/alerts/mark-checked`, {
    method: 'POST',
    credentials: 'include', // Send cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - please log in');
    }
    throw new Error(`Failed to mark alerts as checked: ${response.statusText}`);
  }

  return response.json();
}
