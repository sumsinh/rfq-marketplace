
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      })

      
      navigate("/login")
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to create account. Please try again."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

         
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create an account
            </h1>

            <p className="text-gray-500 mt-2">
              Join the RFQ Marketplace
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
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            
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
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Password must be at least 6 characters.
              </p>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">

                
                <label
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    role === "buyer"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={role === "buyer"}
                    onChange={(event) => setRole(event.target.value)}
                    className="sr-only"
                  />

                  <div className="font-medium text-gray-900">
                    Buyer
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    Post requirements
                  </div>
                </label>

               
                <label
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    role === "supplier"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="supplier"
                    checked={role === "supplier"}
                    onChange={(event) => setRole(event.target.value)}
                    className="sr-only"
                  />

                  <div className="font-medium text-gray-900">
                    Supplier
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    Submit quotations
                  </div>
                </label>

              </div>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Register

