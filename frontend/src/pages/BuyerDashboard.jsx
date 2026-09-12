import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function BuyerDashboard() {
  const navigate = useNavigate()

  const [rfqs, setRfqs] = useState([])
  const [quotationCount, setQuotationCount] = useState(0)

  const [loading, setLoading] = useState(true)
  const [quotationsLoading, setQuotationsLoading] = useState(true)

  const [error, setError] = useState("")
  const [quotationsError, setQuotationsError] = useState("")

  const [closingId, setClosingId] = useState(null)

  const fetchRfqs = async () => {
    try {
      setError("")

      const response = await api.get("/rfqs/my")

      setRfqs(response.data.rfqs)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to load your RFQs."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotationCount = async () => {
    try {
      setQuotationsError("")

      const response = await api.get("/quotations/received")

      setQuotationCount(response.data.total)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to load quotation count."

      setQuotationsError(message)
    } finally {
      setQuotationsLoading(false)
    }
  }

  useEffect(() => {
    fetchRfqs()
    fetchQuotationCount()
  }, [])

  const openRfqs = rfqs.filter(
    (rfq) => rfq.status === "open"
  )

  const handleCloseRFQ = async (rfqId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this RFQ? Suppliers will no longer be able to submit quotations."
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setClosingId(rfqId)

      await api.patch(`/rfqs/${rfqId}/close`)

      setRfqs((previousRfqs) =>
        previousRfqs.map((rfq) =>
          rfq.id === rfqId
            ? { ...rfq, status: "closed" }
            : rfq
        )
      )
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to close RFQ."

      setError(message)
    } finally {
      setClosingId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              RFQ Marketplace
            </h1>

            <p className="text-sm text-gray-500">
              Buyer Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>

        </div>

      </header>


      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your requirements and quotations.
            </p>
          </div>

          <Link
            to="/buyer/rfqs/create"
            className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Create RFQ
          </Link>

        </div>


        

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-gray-200 rounded-xl p-6">

            <p className="text-sm text-gray-500">
              Total RFQs
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : rfqs.length}
            </p>

          </div>


          <div className="bg-white border border-gray-200 rounded-xl p-6">

            <p className="text-sm text-gray-500">
              Open RFQs
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : openRfqs.length}
            </p>

          </div>


          <div className="bg-white border border-gray-200 rounded-xl p-6">

            <p className="text-sm text-gray-500">
              Quotations Received
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {quotationsLoading ? "..." : quotationCount}
            </p>

          </div>

        </div>


      

        {quotationsError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {quotationsError}
          </div>
        )}


     

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-gray-200">

            <h3 className="text-lg font-semibold text-gray-900">
              My RFQs
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Requirements you have posted.
            </p>

          </div>


          {error && (
            <div className="m-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {loading && (
            <div className="p-12 text-center">
              <p className="text-gray-500">
                Loading your RFQs...
              </p>
            </div>
          )}


          {!loading && !error && rfqs.length === 0 && (
            <div className="p-12 text-center">

              <div className="text-4xl mb-4">
                📋
              </div>

              <h4 className="text-lg font-semibold text-gray-900">
                No RFQs yet
              </h4>

              <p className="text-gray-500 mt-2 mb-6">
                Create your first RFQ to start receiving quotations from suppliers.
              </p>

              <Link
                to="/buyer/rfqs/create"
                className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Create your first RFQ
              </Link>

            </div>
          )}


          {!loading && rfqs.length > 0 && (
            <div className="divide-y divide-gray-200">

              {rfqs.map((rfq) => (

                <div
                  key={rfq.id}
                  className="p-6 hover:bg-gray-50 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="min-w-0">

                      <div className="flex items-center gap-3 flex-wrap">

                        <h4 className="text-lg font-semibold text-gray-900">
                          {rfq.product_name}
                        </h4>

                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            rfq.status === "open"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {rfq.status}
                        </span>

                      </div>


                      <p className="text-sm text-gray-500 mt-2">
                        {rfq.description}
                      </p>


                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">

                        <span>
                          <strong>Quantity:</strong> {rfq.quantity}
                        </span>

                        <span>
                          <strong>Location:</strong> {rfq.delivery_location}
                        </span>

                        <span>
                          <strong>Deadline:</strong> {rfq.deadline}
                        </span>

                      </div>

                    </div>


                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">

                      <Link
                        to={`/buyer/rfqs/${rfq.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View Quotations
                      </Link>


                      {rfq.status === "open" && (
                        <>

                          <Link
                            to={`/buyer/rfqs/${rfq.id}/edit`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            Edit
                          </Link>


                          <button
                            type="button"
                            onClick={() => handleCloseRFQ(rfq.id)}
                            disabled={closingId === rfq.id}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {closingId === rfq.id
                              ? "Closing..."
                              : "Close"
                            }
                          </button>

                        </>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default BuyerDashboard