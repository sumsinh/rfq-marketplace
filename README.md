# RFQ Marketplace

A full-stack B2B Request for Quotation (RFQ) marketplace where buyers can post business requirements and suppliers can discover those requirements and submit quotations.

## Features

### Buyer

* Register and login as a buyer
* Create RFQs
* Edit open RFQs
* Close RFQs
* View all created RFQs
* View quotations received for each RFQ
* Compare supplier price and delivery time
* View supplier name and email

### Supplier

* Register and login as a supplier
* Browse available open RFQs
* Search RFQs by product, description, or location
* View complete RFQ details
* Submit quotations
* View submitted quotations
* Cannot submit quotations for closed RFQs
* Cannot submit more than one quotation for the same RFQ

### Authentication & Security

* JWT-based authentication
* Role-based authorization
* Password hashing using bcrypt
* JWT token expiration
* Secret key stored in environment variables
* Protected frontend routes
* Database-level protection against duplicate quotations

## Tech Stack

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Python
* FastAPI
* SQLAlchemy
* JWT
* bcrypt

### Database

* SQLite for local development
* PostgreSQL recommended for production deployment

## Project Structure

```text
rfq-marketplace/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── dependencies.py
│   │   └── main.py
│   │
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│   └── rfq_marketplace.db
│
└── README.md
```

## Architecture

The application uses a simple client-server architecture.

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
FastAPI Backend
      │
      │ SQLAlchemy
      ▼
Database
```

The frontend communicates with the FastAPI backend using REST APIs. Authentication is handled using JWT tokens, and the user's role determines which operations they are allowed to perform.

## Main API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### RFQs

```text
POST   /rfqs/
GET    /rfqs/
GET    /rfqs/my
GET    /rfqs/{rfq_id}
PUT    /rfqs/{rfq_id}
PATCH  /rfqs/{rfq_id}/close
```

### Quotations

```text
POST /quotations/
GET  /quotations/my
GET  /quotations/received
GET  /quotations/rfq/{rfq_id}
```

## Validation

The application validates data on both the frontend and backend.

Examples:

* Product/service name must contain valid text
* Requirement description has a minimum length
* Quantity must be greater than zero
* Quoted price must be greater than zero
* Delivery time must be greater than zero
* Message is limited to 1000 characters
* RFQ deadlines cannot be in the past
* Only buyers can create, edit, and close RFQs
* Only suppliers can submit quotations
* Closed RFQs cannot accept quotations
* Suppliers cannot submit duplicate quotations for the same RFQ

## Error Handling

The application handles common API errors including:

* Invalid login credentials
* Duplicate email registration
* Unauthorized access
* Invalid roles
* RFQ not found
* Closed RFQ
* Duplicate quotation
* Invalid form input

The frontend also provides loading, empty, success, and error states for major API operations.

## Environment Variables

### Backend

Create a `.env` file inside `backend/`:

```env
SECRET_KEY=your-secret-key
```

### Frontend

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Environment files should not be committed to GitHub.

## Local Setup

### Backend

Open a terminal:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the API:

```bash
uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

## Assumptions

* A user selects either Buyer or Supplier during registration.
* Buyers manage only RFQs that they created.
* Suppliers can submit one quotation per RFQ.
* RFQs can be closed by their owner.
* Closed RFQs remain visible to their buyer but are no longer available for new supplier quotations.
* SQLite is used for local development to keep setup simple.
* PostgreSQL is recommended for production deployment.

## Future Improvements

Possible improvements for a production version include:

* PostgreSQL database
* Company profiles for buyers and suppliers
* Email notifications
* Quotation status such as pending, accepted, or rejected
* Supplier ratings and reviews
* Pagination for large RFQ lists
* File attachments for RFQ documents
* Advanced filtering
* Admin dashboard
* Automated database migrations

## Development Notes

This project was intentionally kept simple to demonstrate the core B2B RFQ workflow without unnecessary complexity.

The main workflow is:

```text
Buyer
  ↓
Create RFQ
  ↓
RFQ becomes available
  ↓
Supplier discovers RFQ
  ↓
Supplier submits quotation
  ↓
Buyer reviews quotations
  ↓
Buyer can close RFQ
```

## License

This project was created as a software development assignment.
