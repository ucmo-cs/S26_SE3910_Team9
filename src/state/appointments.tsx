import { createContext, useCallback, useContext, useEffect, useState } from "react";

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
  addAppointment: (a: Omit<Appointment, "id" | "status" | "confirmationNumber">) => Appointment;
  removeAppointment: (id: string) => void;
  clearAppointments: () => void;
  getAppointment: (id: string) => Appointment | undefined;
}

const STORAGE_KEY = "appointments";
const AppointmentContext = createContext<AppointmentContextType | null>(null);

function toDisplayConfirmationNumber(value: number) {
  return value.toString().padStart(4, "0");
}

function nextConfirmationNumber(current: Appointment[]) {
  const maxValue = current.reduce((max, item) => {
    const source = item.confirmationNumber ?? item.id;
    const digits = source.replace(/\D/g, "");
    if (!digits) return max;
    const parsed = Number.parseInt(digits, 10);
    if (Number.isNaN(parsed)) return max;
    return Math.max(max, parsed);
  }, 999);

  return toDisplayConfirmationNumber(maxValue + 1);
}

function normalizeStoredAppointments(stored: unknown): Appointment[] {
  if (!Array.isArray(stored)) return [];
  return stored
    .filter((item): item is Appointment => Boolean(item && typeof item === "object"))
    .map((item) => {
      const fallbackDigits = String(item.id ?? "").replace(/\D/g, "");
      const fallback = fallbackDigits
        ? toDisplayConfirmationNumber(Number.parseInt(fallbackDigits.slice(-4), 10) || 1000)
        : "1000";

      return {
        ...item,
        confirmationNumber: item.confirmationNumber ?? fallback,
      };
    });
}

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return normalizeStoredAppointments(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to load appointments from storage", err);
    }
    return [];
  });

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (err) {
      console.warn("Failed to save appointments to storage", err);
    }
  }, [appointments]);

  const addAppointment = useCallback((a: Omit<Appointment, "id" | "status" | "confirmationNumber">) => {
    const confirmationNumber = nextConfirmationNumber(appointments);
    const newAppt: Appointment = {
      ...a,
      id: confirmationNumber,
      confirmationNumber,
      status: "Confirmed",
    };
    setAppointments((prev) => [...prev, newAppt]);
    return newAppt;
  }, [appointments]);

  const removeAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAppointments = useCallback(() => {
    setAppointments([]);
  }, []);

  const getAppointment = useCallback(
    (id: string) => appointments.find((a) => a.id === id),
    [appointments]
  );

  return (
    <AppointmentContext.Provider
      value={{ appointments, addAppointment, removeAppointment, clearAppointments, getAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return ctx;
}
