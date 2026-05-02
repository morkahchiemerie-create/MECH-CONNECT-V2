# backend/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Global database object
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app)

    
    # Get current backend folder path
    basedir = os.path.abspath(os.path.dirname(__file__))

    # Database path → ../instance/mechconnect.db
    db_path = os.path.join(basedir, "..", "instance", "mechconnect.db")

    # Flask configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "mechconnect_secret_key"

    # Connect SQLAlchemy to Flask
    db.init_app(app)

    # Import model AFTER db is initialized
    from backend.models.user_model import User

    # Step 7 → Create database + tables automatically
    with app.app_context():
        db.create_all()
        
  # import and register routes
    from backend.routes.auth_routes import auth
    app.register_blueprint(auth, url_prefix="/api/auth")

    return app