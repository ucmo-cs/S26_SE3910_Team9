import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { page, stack, grid3 } from "../styles/layout";
import { button, muted } from "../styles/ui";

function Home() {
  return (
    <div className={page}>
      <div className={stack}>
        {/* Hero Section */}
        <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-12 text-center text-white shadow-xl shadow-slate-200/40 md:px-12 md:py-20 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-md dark:shadow-black/35">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Banking made personal.
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-slate-300 dark:text-slate-200">
            Skip the line and book a meeting with a specialist at a time that works for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/appointments/create" className={`${button} bg-white text-slate-900 hover:bg-blue-50 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white`}>
              Book an Appointment
            </Link>
            <Link to="/appointments" className={`${button} border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700`}>
              My Scheduled Visits
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className={grid3}>
          <Card>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              {/* Icon placeholder */}
              <span className="text-xl">🏦</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">In-Branch Service</div>
            <div className={muted}>Meet face-to-face with our experts at a branch near you.</div>
          </Card>
          
          <Card>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <span className="text-xl">📅</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">Flexible Scheduling</div>
            <div className={muted}>Real-time availability for accounts, loans, and wealth management.</div>
          </Card>

          <Card>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <span className="text-xl">🛡️</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">Secure & Private</div>
            <div className={muted}>Your mock data is handled securely within this prototype.</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;