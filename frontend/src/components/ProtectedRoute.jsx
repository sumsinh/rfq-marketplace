import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token")
  const userData = localStorage.getItem("user")

  if (!token || !userData) {
    return <Navigate to="/login" replace />
  }

  let user

  try {
    user = JSON.parse(userData)
  } catch {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    if (user.role === "buyer") {
      return <Navigate to="/buyer/dashboard" replace />
    }

    if (user.role === "supplier") {
      return <Navigate to="/supplier/dashboard" replace />
    }

    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute