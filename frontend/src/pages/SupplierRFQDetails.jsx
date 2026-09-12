import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../services/api"

function SupplierRFQDetails() {
  const { id } = useParams()

  const [rfq, setRfq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [quotedPrice, setQuotedPrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [message, setMessage] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")

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

  useEffect(() => {
    fetchRFQ()
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      await api.post("/quotations/", {
        rfq_id: Number(id),
        quoted_price: Number(quotedPrice),
        estimated_delivery_time: Number(deliveryTime),
        message: message || null,
      })

      setSuccess("Quotation submitted successfully.")

      setQuotedPrice("")
      setDeliveryTime("")
      setMessage("")
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to submit quotation. Please try again."

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

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
            to="/supplier/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to RFQs
          </Link>
        </div>
      </header>


      <main className="max-w-5xl mx-auto px-6 py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}


        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6">
            {success}
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

                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    rfq.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
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


            

            {rfq.status !== "open" && (
              <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 text-center">

                <div className="text-3xl mb-3">
                  🔒
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  This RFQ is closed
                </h2>

                <p className="text-gray-500 mt-2">
                  This RFQ is no longer accepting quotations.
                </p>

                <Link
                  to="/supplier/dashboard"
                  className="inline-block mt-5 px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>

              </div>
            )}


            

            {rfq.status === "open" && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-gray-900">
                    Submit Your Quotation
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Provide your best price and delivery estimate.
                  </p>

                </div>


                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quoted Price
                      </label>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={quotedPrice}
                        onChange={(event) =>
                          setQuotedPrice(event.target.value)
                        }
                        placeholder="e.g. 45000"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>


                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Delivery Time
                      </label>

                      <div className="flex">

                        <input
                          type="number"
                          min="1"
                          value={deliveryTime}
                          onChange={(event) =>
                            setDeliveryTime(event.target.value)
                          }
                          placeholder="e.g. 15"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-l-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <span className="flex items-center px-4 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-500">
                          days
                        </span>

                      </div>

                    </div>

                  </div>


                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message / Notes
                    </label>

                    <textarea
                      rows="5"
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      maxLength="1000"
                      placeholder="Add any information about your quotation..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      Maximum 1000 characters.
                    </p>

                  </div>


                  <div className="flex justify-end pt-6 border-t border-gray-200">

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Quotation"}
                    </button>

                  </div>

                </form>

              </div>
            )}

          </>
        )}

      </main>

    </div>
  )
}

export default SupplierRFQDetails