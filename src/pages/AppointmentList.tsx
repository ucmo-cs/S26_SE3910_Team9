import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, grid2 } from "../styles/layout";
import { button, buttonPrimary, muted, emptyState, pill } from "../styles/ui";

type Appointment = {
  id: string;
  topicName: string;
  branchName: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  status: "Confirmed" | "Pending";
};

const mockAppointments: Appointment[] = [
  {
    id: "a1",
    topicName: "Open a new account",
    branchName: "Downtown Branch",
    dateLabel: "Fri, Feb 20",
    timeLabel: "10:30 AM",
    customerName: "Taylor",
    status: "Confirmed",
  },
  {
    id: "a2",
    topicName: "Loan consultation",
    branchName: "West Branch",
    dateLabel: "Sat, Feb 21",
    timeLabel: "1:00 PM",
    customerName: "Jordan",
    status: "Pending",
  },
];

function AppointmentList() {
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

        {mockAppointments.length === 0 ? (
          <div className={emptyState}>
            <div className="mb-2 text-4xl">📅</div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">No appointments yet</h3>
            <p className="mb-4 max-w-xs text-sm text-slate-500">
              You haven't booked any visits. Schedule a time with a specialist today.
            </p>
            <Link to="/appointments/create" className={`${button} ${buttonPrimary}`}>
              Book Now
            </Link>
          </div>
        ) : (
          <div className={grid2}>
            {mockAppointments.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className={pill + " bg-blue-50 text-blue-700 border-blue-100 mb-2 w-fit"}>
                      {a.status}
                    </span>
                    <div className="font-bold text-slate-900 text-lg">{a.topicName}</div>
                    <div className="text-slate-500 text-sm">
                      {a.branchName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">{a.timeLabel}</div>
                    <div className="text-xs text-slate-500">{a.dateLabel}</div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                   <div className="text-xs text-slate-400">Ref: #{a.id.toUpperCase()}</div>
                   <Link to={`/appointments/${a.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
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