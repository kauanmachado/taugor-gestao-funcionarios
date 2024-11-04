import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import { Routers } from "./routes/routes";
import { AuthProvider } from "./context/auth-provider";
import { Layout } from "./components/layout/layout";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
        <Layout>
        <Routers />
        </Layout>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
