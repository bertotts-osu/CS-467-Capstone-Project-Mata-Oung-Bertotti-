# entry point for Elastic Beanstalk
from src.app import start_app
from src.config import ProdConfig

application = start_app(ProdConfig)
