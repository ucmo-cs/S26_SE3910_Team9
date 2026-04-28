import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";

import Home from "./pages/Home";
import AccountCreate from "./pages/AccountCreate";
import AccountProfile from "./pages/AccountProfile";
import AppointmentList from "./pages/AppointmentList";
import AppointmentCreate from "./pages/AppointmentCreate";
import AppointmentDetail from "./pages/AppointmentDetail";
import NotFound from "./pages/NotFound";

import { AppointmentProvider } from "./state/appointments";
import { UserProvider } from "./state/user";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppointmentProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/account/create" element={<AccountCreate />} />
              <Route path="/account/profile" element={<AccountProfile />} />
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/appointments/create" element={<AppointmentCreate />} />
              <Route path="/appointments/:appointmentId" element={<AppointmentDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AppointmentProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
