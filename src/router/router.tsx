import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import { LoginPage } from "../pages/Login/LoginPage";
import { AdminPage } from "../pages/Admin/AdminPage";
import { StaffPage } from "../pages/Staff/StaffPage";
import TestPage from "../pages/Test/TestPage";
import { FacilityOwnerDashboard } from "../pages/FacilityManagement/FacilityOwnerDashBoard";
import { AuthGuard } from "../guards/authGuard";
import { UserRole } from "../types/role";
import { FacilityDetailPage } from "../pages/FacilityManagement/FacilityDetailPage";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "/profile",
    element: <ProfileScreen />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <AuthGuard requiredRole={UserRole.ADMIN}>
        <AdminPage />
      </AuthGuard>
    ),
  },
  {
    path: "/staff",
    element: (
      <AuthGuard requiredRole={UserRole.FACILITY_STAFF}>
        <StaffPage />
      </AuthGuard>
    ),
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/facility-management",
    element: (
      <AuthGuard requiredRole={UserRole.FACILITY_OWNER}>
        <FacilityOwnerDashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/facility-detail/:id",
    element: (
      <AuthGuard requiredRole={UserRole.FACILITY_OWNER}>
        <FacilityDetailPage />
      </AuthGuard>
    ),
  }
]);

export default routers;
