import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useUser } from "./user";
import { getAppointments, createAppointment, deleteAppointment, getAppointment } from "../services/appointmentService";
import type { AppointmentCreateRequest, AppointmentResponse } from "../services/appointmentService";

export type Appointment = {
  id: string;
  confirmationNumber?: string;
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
  status: "Confirmed" | "Pending";
};

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  addAppointment: (a: Omit<Appointment, "id" | "status" | "confirmationNumber">) => Promise<Appointment>;
  removeAppointment: (id: string) => Promise<void>;
  refreshAppointments: () => Promise<void>;
  getAppointment: (id: string) => Promise<Appointment | null>;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAppointments = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setAppointments([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments(token);
      setAppointments(data.map(convertApiResponseToAppointment));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  // Load appointments when user logs in
  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const addAppointment = useCallback(async (request: AppointmentCreateRequest): Promise<Appointment> => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await createAppointment(request, token);
    const newAppointment = convertApiResponseToAppointment(response);

    setAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  }, [token]);

  const removeAppointment = useCallback(async (id: string): Promise<void> => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    await deleteAppointment(id, token);
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, [token]);

  const getAppointmentById = useCallback(async (id: string): Promise<Appointment | null> => {
    if (!token) {
      return null;
    }

    try {
      const response = await getAppointment(id, token);
      return convertApiResponseToAppointment(response);
    } catch (err) {
      console.error('Failed to get appointment:', err);
      return null;
    }
  }, [token]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        addAppointment,
        removeAppointment,
        refreshAppointments,
        getAppointment: getAppointmentById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

function convertApiResponseToAppointment(api: AppointmentResponse): Appointment {
  return {
    id: api.id,
    confirmationNumber: api.confirmationNumber,
    topicId: api.topicId,
    topicName: api.topicName,
    topicIcon: api.topicIcon,
    branchId: api.branchId,
    branchName: api.branchName,
    slotId: api.slotId,
    startAtISO: api.startAtISO,
    dateLabel: api.dateLabel,
    timeLabel: api.timeLabel,
    customerName: api.customerName,
    customerEmail: api.customerEmail,
    notes: api.notes,
    status: api.status as "Confirmed" | "Pending",
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return ctx;
}
