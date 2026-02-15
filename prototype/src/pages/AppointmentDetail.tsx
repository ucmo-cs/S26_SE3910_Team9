import { Link, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, muted, divider } from "../styles/ui";

function AppointmentDetail() {
  const params = useParams();
  const appointmentId = params.appointmentId ?? "unknown";

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Appointment Confirmation"
          subtitle="Mock confirmation page (prototype)."
          right={
            <Link to="/appointments" className={button}>
              Back to List
            </Link>
          }
        />

        <Card>
          <div className={section}>
            <div className="font-semibold">Appointment ID</div>
            <div className={muted}>{appointmentId}</div>

            <div className={divider} />

            <div className="font-semibold">Summary (mock)</div>
            <div className={muted}>Topic: Open a new account</div>
            <div className={muted}>Branch: Downtown Branch</div>
            <div className={muted}>Time: Fri, Feb 20 • 10:30 AM</div>
            <div className={muted}>Name: Taylor</div>
            <div className={muted}>Email: taylor@example.com</div>

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
