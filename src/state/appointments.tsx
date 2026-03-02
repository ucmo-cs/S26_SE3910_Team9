import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Appointment = {
  id: string;
  topicId: string;
  topicName: string;
  topicIcon: string;
  branchId: string;
  branchName: string;
  slotId: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  customerEmail: string;
  status: "Confirmed" | "Pending";
};

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, "id" | "status">) => Appointment;
  removeAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
}

const STORAGE_KEY = "appointments";
const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to load appointments from storage", err);
    }
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (err) {
      console.warn("Failed to save appointments to storage", err);
    }
  }, [appointments]);

  const addAppointment = useCallback((a: Omit<Appointment, "id" | "status">) => {
    const newAppt: Appointment = {
      ...a,
      id: crypto.randomUUID(),
      status: "Confirmed",
    };
    setAppointments((prev) => [...prev, newAppt]);
    return newAppt;
  }, []);

  const removeAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getAppointment = useCallback(
    (id: string) => appointments.find((a) => a.id === id),
    [appointments]
  );

  return (
    <AppointmentContext.Provider
      value={{ appointments, addAppointment, removeAppointment, getAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return ctx;
}
