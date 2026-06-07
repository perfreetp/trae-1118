import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Patrol from "@/pages/Patrol";
import Events from "@/pages/Events";
import Crowd from "@/pages/Crowd";
import Facility from "@/pages/Facility";
import Merchant from "@/pages/Merchant";
import Drill from "@/pages/Drill";
import Reports from "@/pages/Reports";
import Notices from "@/pages/Notices";
import Contacts from "@/pages/Contacts";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patrol" element={<Patrol />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="/crowd" element={<Crowd />} />
          <Route path="/facility" element={<Facility />} />
          <Route path="/merchant" element={<Merchant />} />
          <Route path="/drill" element={<Drill />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </Router>
  );
}
