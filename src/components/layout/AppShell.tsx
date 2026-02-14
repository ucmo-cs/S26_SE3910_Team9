import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { appBg } from "../../styles/layout";

function AppShell() {
  return (
    <div className={appBg}>
      <TopNav />
      <Outlet />
    </div>
  );
}

export default AppShell;
