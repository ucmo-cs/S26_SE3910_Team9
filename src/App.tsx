import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";

import Home from "./pages/Home";
import AppointmentList from "./pages/AppointmentList";
import AppointmentCreate from "./pages/AppointmentCreate";
import AppointmentDetail from "./pages/AppointmentDetail";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/create" element={<AppointmentCreate />} />
          <Route path="/appointments/:appointmentId" element={<AppointmentDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
