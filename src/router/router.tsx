import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import RegisterPage from "../pages/Register/Register";
import LoginPage from "../pages/Login/Login";
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
    path: "/register",
    element: <RegisterPage/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  }, 
]);

export default routers;
