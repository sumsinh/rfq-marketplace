
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../services/api"

function BuyerRFQDetails() {
  const { id } = useParams()

  const [rfq, setRfq] = useState(null)
  const [quotations, setQuotations] = useState([])

  const [loading, setLoading] = useState(true)
  const [quotationsLoading, setQuotationsLoading] = useState(true)

  const [error, setError] = useState("")
  const [quotationsError, setQuotationsError] = useState("")

  const fetchRFQ = async () => {
    try {
      setError("")

      const response = await api.get(`/rfqs/${id}`)

      setRfq(response.data.rfq)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to load RFQ."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotations = async () => {
    try {
      setQuotationsError("")

      const response = await api.get(`/quotations/rfq/${id}`)

      setQuotations(response.data.quotations)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to load quotations."

      setQuotationsError(message)
    } finally {
      setQuotationsLoading(false)
    }
  }

  useEffect(() => {
    fetchRFQ()
    fetchQuotations()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading RFQ...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">

          <Link
            to="/buyer/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </header>


      <main className="max-w-5xl mx-auto px-6 py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}


        {rfq && (
          <>

            

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-500 mb-2">
                    RFQ #{rfq.id}
                  </p>

                  <h1 className="text-2xl font-bold text-gray-900">
                    {rfq.product_name}
                  </h1>

                </div>


                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                  {rfq.status}
                </span>

              </div>


              <div className="mt-6">

                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  Requirement
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {rfq.description}
                </p>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6 pt-6 border-t border-gray-200">

                <div>

                  <p className="text-sm text-gray-500">
                    Quantity
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {rfq.quantity}
                  </p>

                </div>


                <div>

                  <p className="text-sm text-gray-500">
                    Delivery Location
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {rfq.delivery_location}
                  </p>

                </div>


                <div>

                  <p className="text-sm text-gray-500">
                    Deadline
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {rfq.deadline}
                  </p>

                </div>

              </div>

            </div>


            

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

              <div className="p-6 border-b border-gray-200">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Quotations Received
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Review quotations submitted by suppliers.
                    </p>

                  </div>


                  <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                    {quotationsLoading
                      ? "..."
                      : `${quotations.length} quotation${quotations.length === 1 ? "" : "s"}`
                    }
                  </div>

                </div>

              </div>


              {quotationsError && (
                <div className="m-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {quotationsError}
                </div>
              )}


              {quotationsLoading && (
                <div className="p-12 text-center">
                  <p className="text-gray-500">
                    Loading quotations...
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

                    <h3 className="text-lg font-semibold text-gray-900">
                      No quotations yet
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Suppliers have not submitted any quotations for this RFQ yet.
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

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                          <div className="min-w-0">

                            <p className="text-sm text-gray-500">
                              Quotation #{quotation.id}
                            </p>

                            <h3 className="text-lg font-semibold text-gray-900 mt-1">
  {quotation.supplier_name}
</h3>

<p className="text-sm text-gray-500 mt-1">
  {quotation.supplier_email}
</p>

                            {quotation.message && (
                              <div className="mt-4">

                                <p className="text-sm font-medium text-gray-700">
                                  Message / Notes
                                </p>

                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                  {quotation.message}
                                </p>

                              </div>
                            )}

                          </div>


                          <div className="grid grid-cols-2 gap-6 flex-shrink-0">

                            <div>

                              <p className="text-sm text-gray-500">
                                Quoted Price
                              </p>

                              <p className="text-lg font-bold text-gray-900 mt-1">
                                ₹{Number(quotation.quoted_price).toLocaleString("en-IN")}
                              </p>

                            </div>


                            <div>

                              <p className="text-sm text-gray-500">
                                Delivery
                              </p>

                              <p className="text-lg font-bold text-gray-900 mt-1">
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

          </>
        )}

      </main>

    </div>
  )
}

export default BuyerRFQDetails

