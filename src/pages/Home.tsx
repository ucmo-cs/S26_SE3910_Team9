import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { useUser } from "../state/user";
import { page, stack, grid3 } from "../styles/layout";
import { button, buttonPrimary, muted } from "../styles/ui";

function Home() {
  const { isAuthenticated } = useUser();

  return (
    <div className={page}>
      <div className={stack}>
        {/* Hero Section */}
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-800 to-teal-900 px-6 py-12 md:px-12 md:py-20 text-center text-white shadow-lg dark:border-teal-900 dark:from-teal-900 dark:to-slate-900/90 dark:shadow-md dark:shadow-black/35">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Banking made personal.
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-teal-100 dark:text-slate-200">
            Skip the line and book a meeting with a specialist at a time that works for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={isAuthenticated ? "/appointments/create" : "/account/create"}
              className={`${button} ${buttonPrimary}`}
            >
              {isAuthenticated ? "Book an Appointment" : "Create an Account"}
            </Link>
            <Link to="/appointments" className={`${button} border border-teal-400 bg-teal-700 text-white hover:bg-teal-600 dark:border-teal-600 dark:bg-teal-800 dark:hover:bg-teal-700`}>
              My Scheduled Visits
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className={grid3}>
          <Card>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
              {/* Icon placeholder */}
              <span className="text-xl">🏦</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">In-Branch Service</div>
            <div className={muted}>Meet face-to-face with our experts at a branch near you.</div>
          </Card>
          
          <Card>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
              <span className="text-xl">📅</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">Flexible Scheduling</div>
            <div className={muted}>Real-time availability for accounts, loans, and wealth management.</div>
          </Card>

          <Card>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
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