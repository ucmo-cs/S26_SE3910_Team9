const API_BASE_URL = 'http://localhost:3001/api';

export interface AppointmentCreateRequest {
  topicId: string;
  topicName: string;
  topicIcon: string;
  branchId: string;
  branchName: string;
  slotId: string;
  startAtISO: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  customerEmail: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: string;
  confirmationNumber: string;
  topicId: string;
  topicName: string;
  topicIcon: string;
  branchId: string;
  branchName: string;
  slotId: string;
  startAtISO: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  customerEmail: string;
  notes: string;
  status: string;
  createdAt: string;
}

export async function getAppointments(token: string): Promise<AppointmentResponse[]> {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }

  return response.json();
}

export async function createAppointment(request: AppointmentCreateRequest, token: string): Promise<AppointmentResponse> {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create appointment');
  }

  return response.json();
}

export async function getAppointment(id: string, token: string): Promise<AppointmentResponse> {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appointment');
  }

  return response.json();
}

export async function deleteAppointment(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
}