/**
 * Email service - communicates with backend API to send appointment confirmations
 */

const API_BASE_URL = 'http://localhost:3001/api';

export interface AppointmentEmailData {
  customerEmail: string;
  customerName: string;
  topicName: string;
  branchName: string;
  dateLabel: string;
  timeLabel: string;
  confirmationNumber: string;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<{
  success: boolean;
  message?: string;
  previewUrl?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Email API error:', result);
      return {
        success: false,
        error: result.error || 'Failed to send email',
      };
    }

    return result;
  } catch (error) {
    console.error('Error calling email API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function sendAppointmentReminder(data: AppointmentEmailData): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/send-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Reminder email API error:', result);
      return {
        success: false,
        error: result.error || 'Failed to send reminder email',
      };
    }

    return result;
  } catch (error) {
    console.error('Error calling reminder API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Check if the email backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
