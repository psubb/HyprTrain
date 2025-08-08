import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ActiveDayPage from "@/pages/ActiveDayPage";
import ProgramBuilderPage from "@/pages/ProgramBuilderPage";
import CustomExercisesPage from "@/pages/CustomExercisesPage";
import ProgramsPage from "@/pages/ProgramsPage";
import ProgramDetailPage from "@/pages/ProgramDetailPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
        }>
        <Route index element={<Navigate to="/workout-days/active" replace />} />
        <Route path="/workout-days/active" element={<ActiveDayPage />} />
        <Route path="/programs/new" element={<ProgramBuilderPage />} />
        <Route path="/exercises/custom" element={<CustomExercisesPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}