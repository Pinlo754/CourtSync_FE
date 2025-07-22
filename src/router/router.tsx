import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import { LoginPage } from "../pages/Login/LoginPage";
import { CourtBooking } from "../pages/Booking/CourtBooking";
import { BookingConfirmation } from "../pages/BookingConfirmation/BookingConfirmation";
import PaymentResponsePage from "../pages/Payment/PaymentInfomation";

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
]);

export default routers;
