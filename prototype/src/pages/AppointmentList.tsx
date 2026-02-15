import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, grid2 } from "../styles/layout";
import { button, buttonPrimary, muted, emptyState } from "../styles/ui";

type Appointment = {
  id: string;
  topicId: string;
  topicName: string;
  branchId: string;
  branchName: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
};

const mockAppointments: Appointment[] = [
  {
    id: "a1",
    topicId: "t1",
    topicName: "Open a new account",
    branchId: "b1",
    branchName: "Downtown Branch",
    dateLabel: "Fri, Feb 20",
    timeLabel: "10:30 AM",
    customerName: "Taylor",
  },
  {
    id: "a2",
    topicId: "t3",
    topicName: "Loan consultation",
    branchId: "b2",
    branchName: "West Branch",
    dateLabel: "Sat, Feb 21",
    timeLabel: "1:00 PM",
    customerName: "Jordan",
  },
];

function AppointmentList() {
  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Appointments"
          subtitle="Mock reserved appointments (prototype)."
          right={
            <Link to="/appointments/create" className={`${button} ${buttonPrimary}`}>
              Book New
            </Link>
          }
        />

        {mockAppointments.length === 0 ? (
          <div className={emptyState}>
            No appointments yet. <Link to="/appointments/create">Book one</Link>.
          </div>
        ) : (
          <div className={grid2}>
            {mockAppointments.map((a) => (
              <Card key={a.id}>
                <div className="font-semibold">{a.topicName}</div>
                <div className={muted}>
                  {a.branchName} • {a.dateLabel} • {a.timeLabel}
                </div>
                <div className={`mt-3 ${muted}`}>Name: {a.customerName}</div>

                <div className="mt-4">
                  <Link to={`/appointments/${a.id}`} className={button}>
                    View Details
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
