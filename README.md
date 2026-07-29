# IIIT Kota Student Resource Platform

Full-stack academic hub for IIIT Kota students to **upload, moderate, search, and share** previous-year question papers and notes — plus a peer **community Q&A**.

**Live:** [https://iiitkresourcesv3.netlify.app/](https://iiitkresourcesv3.netlify.app/)

## Highlights (production-oriented)

- **JWT auth** in httpOnly cookies (register, login, logout, OTP password reset)
- **GridFS** for exam PDFs/images with admin accept/decline workflow
- **Cloudinary** notes pipeline with subject / year / semester filters
- **Favorites** on papers & notes + **contribution stats** on profile
- **Debounced search** across paper metadata and notes
- **Community** posts with tags, upvotes, and replies
- Upload validation (PDF/images, 25MB), admin-protected role changes

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Data | MongoDB + GridFS, Cloudinary |
| Auth | JWT (cookies), bcrypt, Nodemailer OTP |

## Features

1. Browse & filter question papers (infinite scroll)
2. Browse & search notes
3. Authenticated uploads → pending → admin approval
4. Save favorites; view stats on profile
5. Community Q&A (ask / reply / upvote)
6. Admin dashboard for pending queues & role management

## Setup

### Prerequisites

- Node.js + npm
- MongoDB Atlas (or local)
- Cloudinary account (notes)
- SMTP credentials for OTP emails

### Backend

```bash
cd backend
npm install
# create .env (see below)
npm start
```

### Frontend

```bash
cd my-react-app
npm install
# set REACT_APP_API_URL and admin emails in .env
npm start
```

### Environment (backend `.env`)

```
PORT=5000
SECRET_KEY=your_jwt_secret
MONGO_URI=your_mongodb_uri
FRONTEND_LOCAL_URL=http://localhost:3000
FRONTEND_DEPLOY_URL=https://your-frontend.netlify.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_ADMIN1=admin1@iiitkota.ac.in
EMAIL_ADMIN2=admin2@iiitkota.ac.in
# plus Nodemailer SMTP vars used in utils/sendEmail.js
```

### Environment (frontend `.env`)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ADMIN1=...
REACT_APP_ADMIN2=...
```

## API map (selected)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/user/register` · `/user/login` | — | Auth |
| GET | `/user/me` · `/user/stats` · `/user/favorites` | user | Profile |
| POST | `/user/favorites` | user | Toggle favorite |
| GET | `/api/uploads` | public | Papers (`q`, year, branch) |
| GET | `/api/upload/notes` | public | Notes |
| GET | `/api/search` | public | Unified search |
| GET/POST | `/api/community` | public / user | Community feed & create |
| GET | `/api/health` | — | Health check |

## Resume / demo talking points

- Dual storage: **GridFS** for large exam files + **Cloudinary** for notes
- **Moderation workflow** before public visibility
- Hardened **role change** & password-reset OTP verification
- Product features interviewers notice: favorites, search, contribution metrics, community

## License

Student project — IIIT Kota Resources.
