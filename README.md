# Weather-and-currency-exchange-rate-API-External-API-Services-
Website that utilizes on-demand API calls to a currency exchange rate API service and a weather API service

## Project Description
This project is a web application that uses two external API services:

- **Weather API** to display the current weather in Calgary
- **Currency API** to convert one currency into another

The application uses:

- **Node.js + Express** for the backend
- **Fetch API** for API requests
- **HTML, CSS, and JavaScript** for the frontend
- **localStorage** for client-side caching
- **server-side cache** to reduce repeated requests

---

## Features

### Weather Service
- Displays current weather in **Calgary**
- Shows:
  - temperature
  - weather description
  - timestamp
- Uses cached data when available

### Currency Converter
- Converts between selected currencies
- User can:
  - enter amount
  - select "from" currency
  - select "to" currency
- Displays:
  - exchange rate
  - converted result
  - updated time

### Data Persistence and Rate Limiting
- Uses **localStorage** to store weather and currency data
- Avoids unnecessary repeated API calls
- Uses a simple **5–10 minute cache**

### API Key Security
- API keys are stored in a `.env` file
- `.env` is excluded from GitHub using `.gitignore`

---

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- Fetch API
- localStorage
- dotenv

---

## Project Structure

assignment2/
│── server.js
│── package.json
│── package-lock.json
│── .gitignore
│── .env
└── public/
    │── index.html
    │── style.css
    └── script.js

---

## Open in browser
http://localhost:3000
