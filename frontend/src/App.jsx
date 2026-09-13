import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import BuyerDashboard from "./pages/BuyerDashboard"
import CreateRFQ from "./pages/CreateRFQ"
import BuyerRFQDetails from "./pages/BuyerRFQDetails"
import EditRFQ from "./pages/EditRFQ"
import SupplierDashboard from "./pages/SupplierDashboard"
import SupplierRFQDetails from "./pages/SupplierRFQDetails"
import ProtectedRoute from "./components/ProtectedRoute"


function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        RFQ Marketplace
      </h1>
    </div>
  )
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Buyer */}

        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute role="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/rfqs/create"
          element={
            <ProtectedRoute role="buyer">
              <CreateRFQ />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/rfqs/:id"
          element={
            <ProtectedRoute role="buyer">
              <BuyerRFQDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/rfqs/:id/edit"
          element={
            <ProtectedRoute role="buyer">
              <EditRFQ />
            </ProtectedRoute>
          }
        />


        {/* Supplier */}

        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute role="supplier">
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier/rfqs/:id"
          element={
            <ProtectedRoute role="supplier">
              <SupplierRFQDetails />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App