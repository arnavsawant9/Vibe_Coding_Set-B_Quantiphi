# Subscription Manager

A full-stack application for tracking and managing all your subscriptions in one place. Monitor your monthly burn rate, track upcoming renewals, and pause/resume subscriptions as needed.

## Features

- **Real-time Metrics**: View your total monthly burn rate and upcoming renewal alerts at a glance
- **Subscription Management**: Add, edit, pause, and track all subscriptions
- **Smart Calculations**: Automatic normalization of yearly costs to monthly equivalents
- **Renewal Tracking**: Get alerts when subscriptions are renewing within 7 days
- **Active/Paused States**: Toggle subscriptions on and off without deleting them
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Form Validation**: Real-time validation with helpful error messages

## Architecture

This application uses a **server-side business logic** approach:

- **Backend (Express.js)**: All business logic, calculations, and data aggregation
  - Cost normalization (Monthly vs Yearly billing cycles)
  - Renewal date calculations and "renewing soon" detection
  - Monthly burn rate aggregation
  - Metrics aggregation (upcoming renewals count)
  
- **Frontend (React)**: Pure presentation layer
  - Displays data from the API
  - Handles user interactions and form submission
  - No business logic calculation—all done server-side
  - Tailwind CSS for responsive styling

### Data Flow

```
User Action → React Component → Fetch API Call → Express Server
                                                      ↓
                                           (Business Logic)
                                           (Calculations)
                                                      ↓
                                           JSON Response
                                                      ↓
React Component ← Display Update ← Parse JSON
```

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. The app will automatically load your subscriptions and metrics
3. Use the form to add new subscriptions:
   - Service Name (required)
   - Cost (required, must be > $0)
   - Billing Cycle (Monthly or Yearly)
   - Next Renewal Date (required)
4. Click the **Active/Paused** button in each row to toggle a subscription
5. Watch the metrics update live as you toggle subscriptions on and off

## API Endpoints

### Subscriptions

- `GET /api/subscriptions` - Get all subscriptions with enriched data
- `POST /api/subscriptions` - Add a new subscription
- `PATCH /api/subscriptions/:id/toggle` - Toggle subscription active/paused state

### Metrics

- `GET /api/metrics` - Get aggregated metrics (total burn rate, upcoming renewals)

## Technologies Used

- **Backend**: Node.js, Express.js, CORS middleware
- **Frontend**: React 19, Vite, Tailwind CSS v4
- **HTTP**: Fetch API (no external HTTP library)
- **Storage**: In-memory (session data)

## What's NOT Included

- ❌ Authentication/Authorization
- ❌ Database (data resets on server restart)
- ❌ Charts or analytics visualizations
- ❌ Redux or complex state management
- ❌ Delete subscription functionality
- ❌ Email notifications

## Project Structure

```
Vibe_Coding_Set-B_Quantiphi/
├── backend/
│   ├── server.js           # Express server & API routes
│   ├── utils.js            # Business logic functions
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── main.jsx        # Entry point
│   │   ├── App.jsx         # Root component
│   │   ├── Dashboard.jsx   # Main UI component
│   │   ├── index.css       # Global styles + Tailwind
│   │   └── assets/
│   ├── vite.config.js      # Vite config with Tailwind plugin
│   ├── index.html
│   ├── package.json
│   └── node_modules/
└── README.md               # This file
```

## Notes

- All data is stored in-memory and will reset when the server restarts
- The application is optimized for Chrome, Firefox, Safari, and Edge
- Mobile responsiveness includes adaptive column hiding on smaller screens
  - Mobile: Service, Cost, Status
  - Tablet: + Billing Cycle
  - Desktop: All columns visible

## Future Enhancements

If you wanted to extend this application, consider:
- Adding a persistent database (PostgreSQL, MongoDB)
- User authentication and multi-user support
- Subscription edit functionality
- Email reminders for upcoming renewals
- Expense charts and analytics
- Export data to CSV

---

**Built with care** 💰
