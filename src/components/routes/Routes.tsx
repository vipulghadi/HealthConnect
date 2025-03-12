import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../home";
import PatientDashboard from "../dashboard/PatientDashboard";
import DoctorDashboard from "../dashboard/DoctorDashboard";
import AuthOptions from "../auth/AuthOptions";
import SettingsPage from "../settings/SettingsPage";
import DoctorRecommendations from "../doctor/DoctorRecommendations";

interface AppRoutesProps {
  isAuthenticated?: boolean;
  userType?: "patient" | "doctor";
}

const AppRoutes = ({
  isAuthenticated = false,
  userType = "patient",
}: AppRoutesProps) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={`/${userType}/dashboard`} />
          ) : (
            <div className="container mx-auto py-12">
              <AuthOptions defaultTab="login" />
            </div>
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={`/${userType}/dashboard`} />
          ) : (
            <div className="container mx-auto py-12">
              <AuthOptions defaultTab="register" />
            </div>
          )
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          isAuthenticated && userType === "patient" ? (
            <PatientDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          isAuthenticated && userType === "doctor" ? (
            <DoctorDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/settings"
        element={
          isAuthenticated ? (
            <div className="container mx-auto py-12">
              <SettingsPage userType={userType} />
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/doctors"
        element={
          <div className="container mx-auto py-12">
            <DoctorRecommendations />
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
