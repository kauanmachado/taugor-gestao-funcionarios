// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import App from "../App"
import { AuthProvider, useAuth } from "../context/auth-provider"
import { PublicRoute } from "./public-route"
import { SignUp } from "../components/auth/sign-up"
import { ProtectedRoute } from "./protected-route"
import { Home } from "../pages/home"
import { Layout } from "../components/layout/layout"
import { ListEmployees } from "../pages/list-employees"
import { AddEmployee } from "../pages/add-employee"


export const Routers = () => {
  const { user } = useAuth()

  return(
      <Routes>
        {user ? (
          <>
          <Route path="/home" element={<Home />} />
          <Route path="/list-employees" element={<ListEmployees />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          </>
        ) : (
          <>
            <Route path="/" element={<App />} />
            <Route path="/sign-up" element={<SignUp />} />
          </>
        )}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
        
      </Routes>
  )
}




