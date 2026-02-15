import { NavLink } from "react-router-dom";
import { navWrap, navInner, brand, navLinks, linkBase, linkIdle, linkActive } from "../../styles/nav";

function TopNav() {
  return (
    <div className={navWrap}>
      <div className={navInner}>
        <div className={brand}>Bank Appointment (Prototype)</div>

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
            Appointments
          </NavLink>

          <NavLink
            to="/appointments/create"
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            Book
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
