# application.py
# WSGI entry point for deploying the Flask app on AWS Elastic Beanstalk (production environment).

from src.app import start_app
from src.config import ProdConfig

# The WSGI application object for Elastic Beanstalk
application = start_app(ProdConfig)
