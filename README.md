# Air Canvas - Draw with Hand Gestures
BY Y1-2024-25-G246
KHUSHI 2401201102 TEESHA 2401201039 VIVAN 240120199 DEEPAK 2401201071

VIDEO LINK https://github.com/Dahiyakhushi/khushi_BCAB_AIRCANVAS/blob/main/project%20explanation.mp4

Air Canvas is a web-based application that allows users to draw in the air using hand gestures captured through their webcam. The application uses MediaPipe for hand tracking and provides features like color selection, drawing saving, and a gallery view.

## Features

- ✨ Hand gesture-based drawing
- 🎨 Multiple color options
- 💾 Save drawings
- 🖼️ Gallery view
- 👤 User authentication
- 🔄 Real-time hand tracking

## Prerequisites

Before you begin, ensure you have:
- Python 3.11 or later
- PostgreSQL database
- Webcam access

## Database Setup

1. First, ensure you have PostgreSQL installed and running.

2. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/aircanvas
SESSION_SECRET=your-secret-key
```

3. The tables will be automatically created when you first run the application, including:
- `users` - Stores user authentication information
- `drawings` - Stores saved drawings

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd air-canvas
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask application:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Usage Instructions

1. **Authentication**
   - Register a new account or login with existing credentials
   - Access is required to save drawings

2. **Drawing**
   - Allow webcam access when prompted
   - Raise only your index finger to draw
   - Put down your index finger or raise other fingers to stop drawing
   - The status indicator shows when you're actively drawing

3. **Tools**
   - Use the color picker to change drawing color
   - Click "Clear" to erase the canvas
   - Click "Save" to store your drawing
   - Access saved drawings through the Gallery button

## Troubleshooting

- If webcam access fails, ensure your browser has permission to access the camera
- If drawing isn't working, try adjusting your hand position to be more visible to the camera
- For database connection issues, verify your DATABASE_URL is correct and PostgreSQL is running

## Tech Stack

- Backend: Flask, Flask-SQLAlchemy
- Database: PostgreSQL
- Hand Tracking: MediaPipe Hands
- Computer Vision: OpenCV
- Frontend: HTML, CSS, JavaScript

## Development

The project uses:
- Flask for the web framework
- Flask-SQLAlchemy for database ORM
- MediaPipe for hand gesture recognition
- OpenCV for webcam handling
- Jinja2 for HTML templating

To modify the database schema:
1. Edit `models.py`
2. Restart the application - tables will be automatically updated
