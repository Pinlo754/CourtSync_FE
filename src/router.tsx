import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/HomeScreen";
import About from "./pages/About/AboutScreen";
import NotFound from "./pages/NotFound/NotFoundScreen";
const routers = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },{
    path: "/not-found",
    element: <NotFound />,
  },
  
]);

export default routers;
