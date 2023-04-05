import { PropsWithChildren } from "react";

type MainRoute = {
  path: "/";
  Component: () => JSX.Element;
};

type AuthRoute = {
  path: "/" | "/login" | "/register";
  Component: () => JSX.Element;
};

export type MainLayoutRoutes = {
  Layout: (children: PropsWithChildren) => JSX.Element;
  routes: MainRoute[];
};

export type AuthLayoutRoutes = {
  Layout: (children: PropsWithChildren) => JSX.Element;
  routes: AuthRoute[];
};
