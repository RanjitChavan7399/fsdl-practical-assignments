# DriveInsight AI 🚀

A complete full-stack web application designed as an AI-powered placement preparation platform for college students. DriveInsight AI allows students to search for companies, get AI-driven insights (interview processes, preparation tips), generate mock interview questions (Aptitude, Coding, HR), and share their own interview experiences.

## ✨ Features

- **Company Search**: Search any company and receive beautifully formatted basic information.
- **AI Company Analysis**: Deep dive into the company's interview process, along with tailored preparation tips - powered by OpenAI (includes a smart fallback mechanism if no API key is provided).
- **AI Question Generator**: Instantly generate realistic mock questions (Aptitude, Coding, HR) for any researched company.
- **Experience Module**: Read verified interview experiences submitted by peers, and easily submit your own.
- **Beautiful UI**: Modern, responsive, and vibrant interface built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router DOM, Axios, React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI Integration**: OpenAI API (`gpt-3.5-turbo`), implemented with robust fallback behaviors.

## 📂 Folder Structure

```
DriveInsight/
├── client/                 # React Frontend built with Vite
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── pages/          # Full pages (Home, Dashboard, Experience)
│   │   ├── App.jsx         # App routing
│   │   └── main.jsx        # React entry point
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB connection logic
│   ├── controllers/        # Route logic and AI handlers
│   ├── models/             # Mongoose schemas (Experience)
│   ├── routes/             # API routing configurations
│   ├── server.js           # Express app entry
│   └── package.json
├── package.json            # Root package for running client+server concurrently
└── README.md
```

## 🚀 Step-by-Step Setup

### 1. Clone or Download Repository
Ensure you have the `DriveInsight` folder open in your code editor or terminal.

### 2. Install Dependencies
Open a terminal in the root folder (`DriveInsight/`) and run the following command to install dependencies for root, client, and server simultaneously:
*(Note: If you run into issues, you can CD into client and server separately and run `npm install` in each).*

### 3. Setup Environment Variables
Navigate to the `server/` directory and create a file named `.env` if it doesn't already exist.
Add the following content to `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/driveinsight
OPENAI_API_KEY=your_openai_api_key_here
```
*(Note: The application has a smart fallback mock function. Even if you don't provide a valid OpenAI API key, the app will continue to function properly using mock data!)*

### 4. Run the Application
You can run both the frontend and backend concurrently from the Root `DriveInsight/` folder using:

```bash
npm run dev
```

Alternatively, you can run them separately:
- **Backend:** `cd server` -> `npm start` (Runs on http://localhost:5000)
- **Frontend:** `cd client` -> `npm run dev` (Runs on http://localhost:5173)

### 5. Open in Browser
Visit `http://localhost:5173` to experience DriveInsight AI.

## 🔌 Example API Usage

**POST /api/experience**
```json
{
  "companyName": "Google",
  "aptitudeQuestions": "Time & Work, Probability...",
  "codingQuestions": "Reverse Linked List...",
  "hrQuestions": "Why Google?"
}
```

**POST /api/ai/analyze**
```json
{
  "companyName": "Microsoft"
}
```

## 📸 Screenshots Placeholder
*(Add images of your running application here, showcasing the Home Page, AI Analysis Dashboard, and the Experience Form.)*
![Home View](#)
![Dashboard View](#)
![Experience View](#)

---
*Built with ❤️ for student placements.*
