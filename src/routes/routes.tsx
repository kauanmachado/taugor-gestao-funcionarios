// src/routes/index.tsx
import {  Routes, Route, Navigate } from "react-router-dom"
import { SignInPage } from "../pages/sign-in"
import { useAuth } from "../context/auth-provider"
import { Home } from "../pages/home"
import { ListEmployees } from "../pages/list-employees"
import { AddEmployee } from "../pages/add-employee"
import { EmployeeHistory } from "../pages/employee-history"
import { PromoteEmployee } from "../pages/promote-employee"
import { UpdateEmployeeContactInfo } from "../pages/update-employee-contactinfo"
import { SignUpPage } from "../pages/sign-up"


export const Routers = () => {
  const { user } = useAuth()

  return(
      <Routes>
        {user ? (
          <>
          <Route path="/home" element={<Home />} />
          <Route path="/list-employees" element={<ListEmployees />} />
          <Route path="/employee-history/:id" element={<EmployeeHistory />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/promote-employee/:id" element={<PromoteEmployee />} />
          <Route path="/update-employee-contactinfo/:id" element={<UpdateEmployeeContactInfo />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </>
        )}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
        
      </Routes>
  )
}




