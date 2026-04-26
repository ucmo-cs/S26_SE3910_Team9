import { Link, NavLink, useMatch, useNavigate } from "react-router-dom";
import logo from "../../assets/image.png";
import { useUser } from "../../state/user";
import { navWrap, navInner, brand, navLinks, linkBase, linkIdle, linkActive } from "../../styles/nav";

type TopNavProps = {
  isDark: boolean;
  onThemeToggle: () => void;
};

function TopNav({ isDark, onThemeToggle }: TopNavProps) {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useUser();
  const onAppointmentsList = Boolean(useMatch({ path: "/appointments", end: true }));
  const onCreateAppointment = Boolean(useMatch("/appointments/create"));
  const onAppointmentDetail = Boolean(useMatch({ path: "/appointments/:appointmentId", end: true })) && !onCreateAppointment;
  const onAccountPage = Boolean(useMatch("/account/create"));

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className={navWrap}>
      <div className={navInner}>
        {/* Logo/brand always routes back home */}
        <Link to="/" className={brand} aria-label="Go to home page">
          <span className="flex h-10 w-10 overflow-hidden rounded-full bg-slate-950/0 dark:bg-slate-950">
            <img src={logo} alt="Commerce Bank logo" className="h-full w-full object-contain" />
          </span>
          <span>Commerce Bank</span>
        </Link>

        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{isDark ? "Dark" : "Light"}</span>
            <span className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isDark}
                onChange={onThemeToggle}
                aria-label="Toggle dark mode"
              />
              <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 dark:bg-slate-700" />
              <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
          </label>

          <div className={navLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            Home
          </NavLink>

          <NavLink
            to="/appointments"
            className={onAppointmentsList || onAppointmentDetail ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`}
          >
            My Appointments
          </NavLink>

          <NavLink
            to="/appointments/create"
            className={onCreateAppointment ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`}
          >
            Book Now
          </NavLink>

          <NavLink
            to="/account/create"
            className={onAccountPage ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`}
          >
            {isAuthenticated ? "Account" : "Sign In"}
          </NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              className={`${linkBase} ${linkIdle} border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
