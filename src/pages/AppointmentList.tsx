import { Link, Navigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, grid2 } from "../styles/layout";
import { button, buttonPrimary, emptyState, pill } from "../styles/ui";

import { useAppointments } from "../state/appointments";
import { useUser } from "../state/user";

// we no longer need mock data; type reexported for clarity
export type Appointment = {
  id: string;
  confirmationNumber?: string;
  topicName: string;
  branchName: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  status: "Confirmed" | "Pending";
};

function AppointmentList() {
  const { appointments, removeAppointment } = useAppointments();
  const { account, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/account/create" replace />;
  }

  const visibleAppointments = appointments.filter(
    (appointment) => appointment.customerEmail.toLowerCase() === account.email.toLowerCase()
  );

  const getReferenceNumber = (appointmentId: string, confirmationNumber?: string) => {
    if (confirmationNumber) return confirmationNumber;
    const digits = appointmentId.replace(/\D/g, "");
    if (!digits) return "0000";
    return digits.slice(-4).padStart(4, "0");
  };

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="My Appointments"
          subtitle="Manage your upcoming visits."
          right={
            <Link to="/appointments/create" className={`${button} ${buttonPrimary}`}>
              + Book New
            </Link>
          }
        />

        {visibleAppointments.length === 0 ? (
          <div className={emptyState}>
            <div className="mb-2 text-4xl">📅</div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">No appointments yet</h3>
            <p className="mb-4 max-w-xs text-sm text-slate-500 dark:text-slate-300">
              You haven't booked any visits. Schedule a time with a specialist today.
            </p>
            <Link to={isAuthenticated ? "/appointments/create" : "/account/create"} className={`${button} ${buttonPrimary}`}>
              {isAuthenticated ? "Book Now" : "Create Account"}
            </Link>
          </div>
        ) : (
          <div className={grid2}>
            {visibleAppointments.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className={pill + " bg-blue-50 text-blue-700 border-blue-100 mb-2 w-fit dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-200"}>
                      {a.status}
                    </span>
                    <div className="font-bold text-slate-900 text-lg dark:text-slate-100">{a.topicName}</div>
                    <div className="text-slate-500 text-sm dark:text-slate-300">
                      {a.branchName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{a.timeLabel}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-300">{a.dateLabel}</div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-base text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950/35 dark:text-red-300 dark:hover:bg-red-900/45"
                    title="Cancel appointment"
                    aria-label={`Cancel appointment ${a.topicName}`}
                    onClick={() => {
                      if (window.confirm("Cancel this appointment?")) {
                        removeAppointment(a.id);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
                
                 <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                   <div className="text-xs text-slate-500 dark:text-slate-300">Confirmation #: {getReferenceNumber(a.id, a.confirmationNumber)}</div>
                   <Link to={`/appointments/${a.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                    View Details →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentList;