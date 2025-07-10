import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/HomeScreen";
import About from "../pages/About/AboutScreen";
import NotFound from "../pages/NotFound/NotFoundScreen";
import { LoginPage } from "../pages/Login/LoginPage";
const routers = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  }, {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default routers;
