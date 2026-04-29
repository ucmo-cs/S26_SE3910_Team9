import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, muted, divider } from "../styles/ui";

import { useAppointments } from "../state/appointments";
import { useUser } from "../state/user";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { Appointment } from "../state/appointments";

function AppointmentDetail() {
  useAuthRedirect();
  const params = useParams();
  const { account, isAuthenticated } = useUser();
  const appointmentId = params.appointmentId ?? "";
  const { getAppointment } = useAppointments();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!appointmentId) {
        setLoading(false);
        return;
      }
      try {
        const appointment = await getAppointment(appointmentId);
        setAppt(appointment);
      } catch (error) {
        console.error("Failed to load appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId, getAppointment]);

  const lookupNumber = appt
    ? appt.confirmationNumber ?? appt.id.replace(/\D/g, "").slice(-4).padStart(4, "0")
    : "";

  if (loading) {
    return (
      <div className={page}>
        <div className={stack}>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!appt || (isAuthenticated && account && appt.customerEmail.toLowerCase() !== account.email.toLowerCase())) {
    return <Navigate to="/appointments" replace />;
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Appointment Confirmation"
          subtitle="Here's the information for your appointment."
          right={
            <Link to="/appointments" className={`${button} text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800`}>
              Back to List
            </Link>
          }
        />

        <Card>
          <div className={section}>
            <div className="font-semibold text-slate-900 dark:text-slate-100">Confirmation Number</div>
            <div className="text-2xl font-bold tracking-wide text-slate-900 dark:text-slate-100">{lookupNumber}</div>
            <div className={muted}>Use this number if you need to change or cancel your appointment.</div>

            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-200">
              A confirmation email has been sent to {appt.customerEmail}.
            </div>

            <div className={divider} />

            <div className="font-semibold text-slate-900 dark:text-slate-100">Summary</div>
            <div className={muted}>
              Topic: {appt.topicIcon} {appt.topicName}
            </div>
            <div className={muted}>Branch: {appt.branchName}</div>
            <div className={muted}>
              Time: {appt.dateLabel} • {appt.timeLabel}
            </div>
            <div className={muted}>Name: {appt.customerName}</div>
            <div className={muted}>Email: {appt.customerEmail}</div>
            {appt.notes ? <div className={muted}>Notes: {appt.notes}</div> : null}

            <div className={divider} />
          </div>
        </Card>

        <Link to="/appointments/create" className={`${button} text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800`}>
          Book Another Appointment
        </Link>
      </div>
    </div>
  );
}

export default AppointmentDetail;
