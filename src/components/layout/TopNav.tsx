import { NavLink } from "react-router-dom";
import { navWrap, navInner, brand, navLinks, linkBase, linkIdle, linkActive } from "../../styles/nav";

function TopNav() {
  return (
    <div className={navWrap}>
      <div className={navInner}>
        {/* Added a mock logo icon */}
        <div className={brand}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            B
          </div>
          <span>Bank App (Prototype)</span>
        </div>

        <div className={navLinks}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            Home
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            My Appointments
          </NavLink>

          <NavLink
            to="/appointments/create"
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            Book Now
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
