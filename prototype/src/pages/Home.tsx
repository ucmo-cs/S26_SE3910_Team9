import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, grid3 } from "../styles/layout";
import { button, buttonPrimary, muted } from "../styles/ui";

function Home() {
  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Schedule an Appointment"
          subtitle="Frontend-only prototype (mock data). Topic → Branch → Time → Details → Confirm."
          right={
            <Link to="/appointments/create" className={`${button} ${buttonPrimary}`}>
              Book Appointment
            </Link>
          }
        />

        <div className={grid3}>
          <Card>
            <div className="font-semibold">Topic-based flow</div>
            <div className={muted}>Pick a reason, then branches filter based on support.</div>
          </Card>
          <Card>
            <div className="font-semibold">30-minute slots</div>
            <div className={muted}>Shows only available times (mock availability).</div>
          </Card>
          <Card>
            <div className="font-semibold">Confirmation screen</div>
            <div className={muted}>Review details and “reserve” locally (prototype).</div>
          </Card>
        </div>

        <Card>
          <div className="font-semibold">Quick links</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/appointments" className={button}>
              View Appointments
            </Link>
            <Link to="/appointments/create" className={button}>
              Start Booking
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Home;
