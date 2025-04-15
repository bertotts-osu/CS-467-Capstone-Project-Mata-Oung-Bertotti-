from flask import request, jsonify


def register_routes(app, cognito_client):
    @app.route("/")
    def index():
        return "Hello World!"

    @app.route("/signup", methods=["POST"])
    def signup():
        pass

    @app.route("/login", methods=["POST"])
    def login():
        pass