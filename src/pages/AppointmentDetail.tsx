import { Link, useParams, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, muted, divider } from "../styles/ui";

import { useAppointments } from "../state/appointments";

function AppointmentDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const appointmentId = params.appointmentId ?? "";
  const { getAppointment } = useAppointments();
  const appt = getAppointment(appointmentId || "");

  if (!appt) {
    // if not found, navigate back to list
    navigate("/appointments");
    return null;
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Appointment Confirmation"
          subtitle="Here's the information for your appointment."
          right={
            <Link to="/appointments" className={button}>
              Back to List
            </Link>
          }
        />

        <Card>
          <div className={section}>
            <div className="font-semibold">Appointment ID</div>
            <div className={muted}>{appt.id}</div>

            <div className={divider} />

            <div className="font-semibold">Summary</div>
            <div className={muted}>
              Topic: {appt.topicIcon} {appt.topicName}
            </div>
            <div className={muted}>Branch: {appt.branchName}</div>
            <div className={muted}>
              Time: {appt.dateLabel} • {appt.timeLabel}
            </div>
            <div className={muted}>Name: {appt.customerName}</div>
            <div className={muted}>Email: {appt.customerEmail}</div>

            <div className={divider} />

            <div className={muted}>
              Stretch goals like email confirmation and branch business hours can be added later.
            </div>
          </div>
        </Card>

        <Link to="/appointments/create" className={button}>
          Book Another Appointment
        </Link>
      </div>
    </div>
  );
}

export default AppointmentDetail;
