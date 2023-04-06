import { AuthLayoutRoutes, MainLayoutRoutes } from "./routeTypes";

import Home from "../pages/Home/Home";
import Layout from "../layouts/Layout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";

export const mainLayoutRoutes: MainLayoutRoutes = {
  Layout: Layout,
  routes: [{ path: HOME_PATH, Component: Home }],
};

export const authLayoutRoutes: AuthLayoutRoutes = {
  Layout: Layout,
  routes: [
    { path: HOME_PATH, Component: Home },
    { path: LOGIN_PATH, Component: Login },
    { path: REGISTER_PATH, Component: Register },
  ],
};
