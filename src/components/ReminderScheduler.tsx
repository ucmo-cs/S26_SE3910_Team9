import { useEffect, useRef } from "react";
import { useAppointments } from "../state/appointments";
import { useUser } from "../state/user";
import { sendAppointmentReminder } from "../services/emailService";

const CHECK_INTERVAL_MS = 1000 * 60 * 5; // every 5 minutes
const REMINDER_WINDOW_MS = 1000 * 60 * 60 * 6; // send reminders for appointments within 6 hours

function ReminderScheduler() {
  const { appointments } = useAppointments();
  const { account, isAuthenticated } = useUser();
  const sentReminderIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !account) return;

    const checkForReminders = async () => {
      const now = Date.now();
      const targets = appointments.filter((appointment) => {
        if (appointment.customerEmail.toLowerCase() !== account.email.toLowerCase()) {
          return false;
        }
        if (!appointment.startAtISO) return false;
        if (sentReminderIds.current.has(appointment.id)) return false;

        const appointmentTime = new Date(appointment.startAtISO).getTime();
        const timeUntil = appointmentTime - now;
        return timeUntil > 0 && timeUntil <= REMINDER_WINDOW_MS;
      });

      for (const appointment of targets) {
        try {
          await sendAppointmentReminder({
            customerEmail: appointment.customerEmail,
            customerName: appointment.customerName,
            topicName: appointment.topicName,
            branchName: appointment.branchName,
            dateLabel: appointment.dateLabel,
            timeLabel: appointment.timeLabel,
            confirmationNumber: appointment.confirmationNumber || appointment.id,
          });
          sentReminderIds.current.add(appointment.id);
        } catch (error) {
          console.error("Reminder sending failed", error);
        }
      }
    };

    checkForReminders();
    const interval = window.setInterval(checkForReminders, CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [appointments, account, isAuthenticated]);

  return null;
}

export default ReminderScheduler;
