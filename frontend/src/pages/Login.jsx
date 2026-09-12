import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { access_token, user } = response.data

      
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))

    
      if (user.role === "buyer") {
        navigate("/buyer/dashboard")
      } else {
        navigate("/supplier/dashboard")
      }
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to login. Please try again."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to your RFQ Marketplace account
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>
    </div>
  )
}

export default Login