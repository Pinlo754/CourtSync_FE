import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import { LoginPage } from "../pages/Login/LoginPage";
import { CourtBooking } from "../pages/Booking/CourtBooking";
import { BookingConfirmation } from "../pages/BookingConfirmation/BookingConfirmation";
import PaymentResponsePage from "../pages/Payment/PaymentInfomation";
import { AdminPage } from "../pages/Admin/AdminPage";
import { StaffPage } from "../pages/Staff/StaffPage";
import TestPage from "../pages/Test/TestPage";
import { FacilityOwnerDashboard } from "../pages/FacilityManagement/FacilityOwnerDashBoard";
import { AuthGuard } from "../guards/authGuard";
import { UserRole } from "../types/role";
import { FacilityDetailPage } from "../pages/FacilityManagement/FacilityDetailPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import { BookingSuccess } from "../pages/BookingResult/BookingResult";
import { TransactionsPage } from "../pages/Transactions";
import { BookingsPage } from "../pages/Bookings";


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
    path: "/profile",
    element: <ProfileScreen />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/facility/:facilityId",
    element: <CourtBooking />,
  },
  {
    path: "/bookingconfirmation",
    element: <BookingConfirmation />,
  },
  {
    path: "Payment/PaymentResponse",
    element: <PaymentResponsePage />,
  },
  {
    path: "*",
    element: <NotFound />,
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
    path: "/reports",
    element: <ReportsPage />,
  },
  {
    path: "/reports/:reportId",
    element: <ReportsPage />,
  },
  {
    path: "/transactions",
    element: (
      <AuthGuard requiredRole={UserRole.FACILITY_OWNER}>
        <TransactionsPage />
      </AuthGuard>
    ),
  },
  {
    path: "/bookings",
    element: (
      <AuthGuard requiredRole={UserRole.FACILITY_OWNER}>
        <BookingsPage />
      </AuthGuard>
    ),
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
  },
  {
    path: "/BookingSuccess",
    element: <BookingSuccess />,
  },
]);

export default routers;
