# CulleraDigital Frontend

Frontend for **CulleraDigital**, a local digital news platform.

This application is built with **React** and **Vite**, and consumes a REST API developed with Spring Boot to display local news content.

## 🚀 Technologies
- React
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## 🔧 Environment variables
The application uses environment variables to configure the backend API URL.

Example (`.env` file):

VITE_API_URL=http://localhost:8080

In production, this variable is configured directly in the deployment platform.

## 📦 Development
Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## To generate a production build:

```
npm run build
```

## Deployment

This frontend is intended to be deployed independently from the backend (e.g. on Vercel).

The backend API is deployed separately and accessed via HTTP requests.

## Autor:
### David Ferrer Sapiña
