
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function CreateRFQ() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    quantity: "",
    delivery_location: "",
    deadline: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      await api.post("/rfqs/", {
        product_name: formData.product_name,
        description: formData.description,
        quantity: Number(formData.quantity),
        delivery_location: formData.delivery_location,
        deadline: formData.deadline,
      })

      
      navigate("/buyer/dashboard")
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to create RFQ. Please try again."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">

          <Link
            to="/buyer/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </header>

      
      <main className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create RFQ
          </h1>

          <p className="text-gray-500 mt-2">
            Tell suppliers what you need and receive competitive quotations.
          </p>
        </div>

       
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6">

          <form onSubmit={handleSubmit} className="space-y-6">

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product or Service Name
              </label>

              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="e.g. Office Chairs"
                required
                minLength={2}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirement Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your requirements in detail..."
                required
                minLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 500"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Location
                </label>

                <input
                  type="text"
                  name="delivery_location"
                  value={formData.delivery_location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, Karnataka"
                  required
                  minLength={2}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFQ Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Suppliers will be able to submit quotations until this date.
              </p>
            </div>

            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

              <Link
                to="/buyer/dashboard"
                className="px-5 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create RFQ"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  )
}

export default CreateRFQ

