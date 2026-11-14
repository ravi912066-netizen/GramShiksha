import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExploreCourses from "./pages/ExploreCourses";
import CourseDetails from "./pages/CourseDetails";
import StudentDashboard from "./pages/StudentDashboard";
import MyLearning from "./pages/MyLearning";
import LessonPage from "./pages/LessonPage";
import Profile from "./pages/Profile";
import OfflinePage from "./pages/OfflinePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageLessons from "./pages/admin/ManageLessons";
import ManageStudents from "./pages/admin/ManageStudents";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public and Student Routes wrapped in standard Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/courses"
              element={
                <Layout>
                  <ExploreCourses />
                </Layout>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <Layout>
                  <CourseDetails />
                </Layout>
              }
            />
            <Route
              path="/offline"
              element={
                <Layout>
                  <OfflinePage />
                </Layout>
              }
            />

            {/* Public Only (Unauthenticated) Routes */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Layout>
                    <Login />
                  </Layout>
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Layout>
                    <Register />
                  </Layout>
                </PublicOnlyRoute>
              }
            />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-learning"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyLearning />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/learn"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LessonPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes with Dedicated AdminLayout */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ManageCourses />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/lessons"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ManageLessons />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ManageStudents />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <Layout>
                  <div className="max-w-4xl mx-auto py-20 text-center px-4">
                    <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
                    <p className="text-slate-500 mt-2">The page you requested does not exist.</p>
                  </div>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
