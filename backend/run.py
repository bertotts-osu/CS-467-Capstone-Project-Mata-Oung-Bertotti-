from dotenv import load_dotenv
load_dotenv()

from src.app import start_app
from src.config import DevConfig

app = start_app(DevConfig)

if __name__ == "__main__":
    app.run(debug=True)
