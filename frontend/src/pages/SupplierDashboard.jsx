import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function SupplierDashboard() {
  const [rfqs, setRfqs] = useState([])
  const [quotations, setQuotations] = useState([])

  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(true)
  const [quotationsLoading, setQuotationsLoading] = useState(true)

  const [error, setError] = useState("")
  const [quotationsError, setQuotationsError] = useState("")

  const fetchRfqs = async () => {
    try {
      setError("")

      const response = await api.get("/rfqs/")

      setRfqs(response.data.rfqs)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to load available RFQs."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotations = async () => {
    try {
      setQuotationsError("")

      const response = await api.get("/quotations/my")

      setQuotations(response.data.quotations)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to load your quotations."

      setQuotationsError(message)
    } finally {
      setQuotationsLoading(false)
    }
  }

  useEffect(() => {
    fetchRfqs()
    fetchQuotations()
  }, [])

  const filteredRfqs = rfqs.filter((rfq) => {
    const searchText = search.toLowerCase()

    return (
      rfq.product_name.toLowerCase().includes(searchText) ||
      rfq.description.toLowerCase().includes(searchText) ||
      rfq.delivery_location.toLowerCase().includes(searchText)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              RFQ Marketplace
            </h1>

            <p className="text-sm text-gray-500">
              Supplier Dashboard
            </p>
          </div>

          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Logout
          </Link>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h2>

          <p className="text-gray-500 mt-1">
            Discover requirements and manage your quotations.
          </p>
        </div>


       

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Available RFQs
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : rfqs.length}
            </p>
          </div>


          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500">
              My Quotations
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {quotationsLoading ? "..." : quotations.length}
            </p>
          </div>


          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Open RFQs
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : rfqs.length}
            </p>
          </div>

        </div>


       

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">

          <div className="p-6 border-b border-gray-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Available RFQs
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Find requirements that match your business.
                </p>
              </div>


              <div className="w-full md:w-80">

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search RFQs..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

          </div>


          {error && (
            <div className="m-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {loading && (
            <div className="p-12 text-center">
              <p className="text-gray-500">
                Loading available RFQs...
              </p>
            </div>
          )}


          {!loading && !error && filteredRfqs.length === 0 && (
            <div className="p-12 text-center">

              <div className="text-4xl mb-4">
                🔎
              </div>

              <h4 className="text-lg font-semibold text-gray-900">
                {search ? "No matching RFQs" : "No RFQs available"}
              </h4>

              <p className="text-gray-500 mt-2">
                {search
                  ? "Try searching for a different product or location."
                  : "New buyer requirements will appear here."
                }
              </p>

            </div>
          )}


          {!loading && filteredRfqs.length > 0 && (
            <div className="divide-y divide-gray-200">

              {filteredRfqs.map((rfq) => (

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

                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
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


                    <div className="flex-shrink-0">

                      <Link
                        to={`/supplier/rfqs/${rfq.id}`}
                        className="inline-block px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        View RFQ
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>


        

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-gray-200">

            <h3 className="text-lg font-semibold text-gray-900">
              My Quotations
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Quotations you have submitted to buyers.
            </p>

          </div>


          {quotationsError && (
            <div className="m-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {quotationsError}
            </div>
          )}


          {quotationsLoading && (
            <div className="p-12 text-center">
              <p className="text-gray-500">
                Loading your quotations...
              </p>
            </div>
          )}


          {!quotationsLoading &&
            !quotationsError &&
            quotations.length === 0 && (
              <div className="p-12 text-center">

                <div className="text-4xl mb-4">
                  💬
                </div>

                <h4 className="text-lg font-semibold text-gray-900">
                  No quotations yet
                </h4>

                <p className="text-gray-500 mt-2">
                  Your submitted quotations will appear here.
                </p>

              </div>
            )}


          {!quotationsLoading &&
            quotations.length > 0 && (
              <div className="divide-y divide-gray-200">

                {quotations.map((quotation) => (

                  <div
                    key={quotation.id}
                    className="p-6"
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                      <div>

                        <p className="text-sm text-gray-500">
                          RFQ #{quotation.rfq_id}
                        </p>

                        <h4 className="text-lg font-semibold text-gray-900 mt-1">
                          Quotation #{quotation.id}
                        </h4>

                        {quotation.message && (
                          <p className="text-sm text-gray-500 mt-3">
                            {quotation.message}
                          </p>
                        )}

                      </div>


                      <div className="grid grid-cols-2 gap-6 text-sm">

                        <div>
                          <p className="text-gray-500">
                            Quoted Price
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            ₹{Number(quotation.quoted_price).toLocaleString("en-IN")}
                          </p>
                        </div>


                        <div>
                          <p className="text-gray-500">
                            Delivery
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            {quotation.estimated_delivery_time} days
                          </p>
                        </div>

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

export default SupplierDashboard