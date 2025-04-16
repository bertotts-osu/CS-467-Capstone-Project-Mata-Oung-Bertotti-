from flask import request, jsonify


def register_routes(app):
    @app.route("/")
    def index():
        return "Hello World!"

    @app.route("/users", methods=["POST"])
    def create_user_profile():
        pass