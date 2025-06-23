# 🎨 Author Finder – Frontend

This is the **frontend application** for Author Finder – a platform where users can discover, explore, and save information about authors they’re interested in.

The frontend is built using **React**, styled with **Bootstrap** and **MUI**, and deployed on **AWS S3**.

---

## 🌍 Live Application

👉 [http://author-finder-app-bucket.s3-website-us-east-1.amazonaws.com](http://author-finder-app-bucket.s3-website-us-east-1.amazonaws.com)

---

## 🚀 Features

- 🔐 Secure login and registration (integrated with backend)
- 🔎 Search and explore author profiles
- ❤️ Add or remove authors from favorites
- 👤 View personalized favorite collection
- 🌐 Responsive design optimized for all devices
- 📡 Integrated with a backend microservices architecture via REST API

---

## 🧱 Tech Stack

- **React** (with [Vite](https://vitejs.dev/))
- **TypeScript**
- **Bootstrap** and **MUI** for UI components
- **Axios** for API communication
- **React Router** for navigation
- Deployed to **AWS S3** as a static website

---

## 📁 Project Structure
src/
├── components/ # Reusable UI components
├── pages/ # Page-level components (Home, Login, Favorites, etc.)
├── services/ # API service handlers
├── context/ # Global state (e.g., AuthContext, FavoritesContext)
├── utils/ # Utility functions
├── App.tsx # Root component
└── main.tsx # App entry point

## 🧪 Running Locally

1. **Start the backend services first**  
   Before running the frontend, make sure the backend microservices (`auth-service`, `user-service`, `favorite-service`) are running.  
   👉 You can find the backend repo and setup instructions here:  
   [https://github.com/your-org/author-finder-backend](https://github.com/your-org/author-finder-backend)

2. **Clone this repo**:
   ```bash
   git clone https://github.com/AngeloAlcaraz/ust-training-author-finder-ui.git
   cd ust-training-author-finder-ui

3. Install dependencies:
npm install

4. Create a .env file at the root and configure the backend API URLs:
VITE_AUTH_SERVICE_URL=http://localhost:3000/api/v1
VITE_USER_SERVICE_URL=http://localhost:3001/api/v1
VITE_FAVORITE_SERVICE_URL=http://localhost:3002/api/v1

5. Run the frontend app:
npm run dev

6. Open the app in your browser:
http://localhost:5173

🛠️ Deployment
To deploy on AWS S3:
1. Build the project:
npm run build

2. Upload the contents of the dist/ folder to your S3 bucket configured for static website hosting.

🧩 Backend Repository
You can find the backend code here:
👉 https://github.com/your-org/author-finder-backend

📄 License
MIT
