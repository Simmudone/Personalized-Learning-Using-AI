
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Assignment from "./pages/Assignment";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import CourseLearningPage from "./pages/CourseLearningPage";
import AdminCourseEditor from "./pages/AdminCourseEditor";

const queryClient = new QueryClient();

/* 🔐 PROTECTED ROUTE COMPONENT */
const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role?: "student" | "admin";
}) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/student-login" replace />;
  }

  // Logged in but wrong role
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/learn/:courseId" element={<CourseLearningPage />} />
          <Route path="/admin-course/:courseId" element={<AdminCourseEditor />} />
          <Route path="/assignment/:courseId/:moduleId" element={<Assignment />} />
          {/* 🎓 Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute role="student">
                <Courses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:id"
            element={
              <ProtectedRoute role="student">
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assignment/:courseId/:domainId"
            element={
              <ProtectedRoute role="student">
                <Assignment />
              </ProtectedRoute>
            }
          />

          

          {/* <Route
            path="/resources"
            element={
              <ProtectedRoute role="student">
                <Resources />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🛠 Admin Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ❌ Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;