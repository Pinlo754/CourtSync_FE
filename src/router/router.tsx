import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import { LoginPage } from "../pages/Login/LoginPage";
import { AdminPage } from "../pages/Admin/AdminPage";
import { StaffPage } from "../pages/Staff/StaffPage";
import TestPage from "../pages/Test/TestPage";

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
    element: <ProfileScreen/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  }, 
  {
    path: "/admin",
    element: <AdminPage/>,
  },
  {
    path: "/staff",
    element: <StaffPage/>,
  },
  {
    path: "/test",
    element: <TestPage/>,
  },
]);

export default routers;
