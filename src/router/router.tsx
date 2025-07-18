import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import { LoginPage } from "../pages/Login/LoginPage";
import { AdminPage } from "../pages/Admin/AdminPage";
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
]);

export default routers;
