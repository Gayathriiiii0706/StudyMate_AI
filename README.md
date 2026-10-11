StudyMate AI – AI-Powered Student Study Planner

StudyMate AI is a web application that helps students organize their subjects, manage study tasks, track progress, and generate personalized study plans using local AI.

Features

- Dashboard: View study tasks and monitor study progress.
- Subject Management: Add and organize subjects.
- Study Task Management: Create tasks, assign subjects, and track task status.
- AI Study Planner: Generate personalized study plans based on the subject, number of days, and daily study hours.
- Local AI Integration: Uses Ollama with the Llama 3.2 model to generate study plans without a paid AI API.
- Database Integration: Stores subjects and study tasks in Oracle Database.
- Responsive Interface: Built with React and CSS for a user-friendly experience.

Technologies Used

Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

Backend

- Python
- Django
- Django REST Framework
- REST APIs

Database

- Oracle Database 21c XE
- Oracle SQL

AI Integration

- Ollama
- Llama 3.2 (3B)

Project Structure

StudyMate_AI/
├── backend/
│   ├── config/
│   └── planner/
├── frontend/
│   └── src/
├── venv/
├── .gitignore
└── README.md

Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- Oracle Database
- Ollama

Setup Instructions

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd StudyMate_AI

Replace "YOUR_GITHUB_REPOSITORY_URL" with your actual repository URL.

2. Set Up the Backend

Open a terminal in the project folder.

Activate the existing virtual environment on Windows:

.\venv\Scripts\Activate.ps1

Install the backend dependencies using the project's "requirements.txt" file:

pip install -r backend/requirements.txt

Set the Oracle database password as an environment variable in the backend terminal:

$env:ORACLE_DB_PASSWORD = "YOUR_ORACLE_DATABASE_PASSWORD"

Replace the placeholder with your local Oracle database password. Never commit the real password to GitHub.

Run database migrations:

cd backend
python manage.py migrate

Start the Django development server:

python manage.py runserver

Backend URL: "http://127.0.0.1:8000/"

3. Set Up the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend URL: "http://localhost:5173/"

4. Set Up Local AI

Install and start Ollama, then download the required model:

ollama pull llama3.2:3b

Ensure Ollama is running before using the AI Study Planner.

Security Notes

- Do not upload database passwords, API keys, or ".env" files.
- Configure your own Oracle database credentials locally.
- Keep virtual environments and installed dependencies out of GitHub.

Project Status

The core features include subject management, study task management, progress tracking, and AI-generated study plans.

Author

Developed as a Python Full Stack Development project.