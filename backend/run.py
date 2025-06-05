# run.py
# Entry point for running the Flask backend application in development mode.

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

from src.app import start_app
from src.config import DevConfig

# Create the Flask app using the development configuration
app = start_app(DevConfig)

if __name__ == "__main__":
    # Run the Flask app with debug mode enabled
    app.run(debug=True)
