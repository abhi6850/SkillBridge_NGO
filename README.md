# SkillBridge NGO

SkillBridge is a web platform built to connect volunteers with NGOs and non-profit organizations. It gives NGOs a space to post volunteering opportunities and manage applicants, while volunteers can browse, apply, and communicate with organizations directly through the platform.

This was built as a group project for our web development coursework at Manipal Institute of Technology, Bengaluru.

Live site: https://skillbridge-ngo.netlify.app


## What it does

The platform has two types of users — volunteers and NGOs — and the experience is different depending on which role you sign up as.

Volunteers can browse all available opportunities on the dashboard, filter by skill, location, or duration, apply to ones they are interested in, and track the status of their applications. They also have a profile page where they can list their skills and location.

NGOs can post new volunteering opportunities, edit or manage their existing ones, review applications from volunteers, and accept or reject applicants. There is also a real-time messaging feature so NGOs and volunteers can communicate once connected.


## Pages and features

- Landing page with an overview of the platform
- Sign up and sign in with role selection (volunteer or NGO)
- Forgot password flow with OTP verification via email
- Dashboard with search and filter for opportunities
- Opportunities management page for NGOs
- Applications page showing status for both sides
- Real-time messaging using Socket.IO
- Profile and edit profile pages
- Create and edit opportunity forms


## Tech stack

The frontend is built with React using Create React App, with React Router for navigation and Axios for API calls. Socket.IO client handles the real-time messaging.

The backend is a Node.js and Express server. It uses Mongoose to connect to a MongoDB database, JWT for authentication, bcryptjs for password hashing, Nodemailer for sending OTP emails, and Socket.IO for real-time communication.

The frontend is deployed on Netlify and the backend is deployed on Render. The database is hosted on MongoDB Atlas.


## Project structure

```
SkillBridge/
├── Frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   └── Navbar.js
│       └── pages/
│           ├── LandingPage.js
│           ├── SignIn.js
│           ├── SignUp.js
│           ├── Dashboard.js
│           ├── Opportunities.js
│           ├── Applications.js
│           ├── Messaging.js
│           ├── Profile.js
│           ├── EditProfile.js
│           ├── CreateOpportunity.js
│           ├── EditOpportunity.js
│           ├── ForgotPassword.js
│           ├── VerifyOtp.js
│           └── ResetPassword.js
└── Backend/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── lib/
    └── server.js
```


## Running it locally

You will need Node.js installed and a MongoDB instance running (either locally or on Atlas).

Clone the repository first.

```
git clone https://github.com/abhi6850/SkillBridge-NGO.git
cd SkillBridge-NGO
```

Setting up the backend:

```
cd Backend
npm install
```

Create a `.env` file inside the Backend folder with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGINS=http://localhost:3000
```

Then start the backend:

```
npm start
```

Setting up the frontend:

```
cd Frontend
npm install
```

Create a `.env` file inside the Frontend folder:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
```

Then start the frontend:

```
npm start
```

The app will be running at http://localhost:3000.


## Deployment

The frontend is configured for Netlify using a `netlify.toml` file at the root of the repository. The build command is `cd Frontend && npm install && npm run build` and the publish directory is `Frontend/build`.

The backend is deployed on Render as a Web Service with the root directory set to `Backend`. Environment variables are configured directly on Render.

The database is on MongoDB Atlas (free tier M0 cluster). Mongoose creates all collections automatically on first use, so no manual setup is needed.


## Environment variables reference

Backend (set on Render or in a local .env file):

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key used to sign JWT tokens |
| CLIENT_ORIGINS | Frontend URL for CORS (comma separated if multiple) |
| PORT | Port the server runs on (Render sets this automatically) |

Frontend (set on Netlify or in a local .env file):

| Variable | Description |
|---|---|
| REACT_APP_API_URL | Backend API base URL ending in /api |
| REACT_APP_WS_URL | Backend base URL for Socket.IO connection |


## Team

This project was built by Group 4 as part of the web development lab at MIT MAHE Bengaluru.
