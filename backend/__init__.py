from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

# =========================
# INITIALIZE EXTENSIONS
# =========================
db = SQLAlchemy()
jwt = JWTManager()


# =========================
# CREATE APP
# =========================
def create_app():
    app = Flask(__name__)

    # =========================
    # CORS CONFIGURATION
    # =========================
    CORS(app)

    # =========================
    # PROJECT PATHS
    # =========================
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, "..", "instance", "mechconnect.db")

    # =========================
    # DATABASE CONFIGURATION
    # =========================
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + db_path
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # SECRET KEYS
    # =========================
    app.config["SECRET_KEY"] = os.environ.get(
        "SECRET_KEY",
        "mechconnect_secret_key"
    )

    app.config["JWT_SECRET_KEY"] = os.environ.get(
        "JWT_SECRET_KEY",
        "mechconnect_jwt_secret_key"
    )

    # =========================
    # JWT CONFIGURATION
    # =========================
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60  # 1 hour

    # =========================
    # UPLOAD CONFIGURATION
    # =========================
    upload_folder = os.path.join(basedir, "uploads")

    app.config["UPLOAD_FOLDER"] = upload_folder
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # =========================
    # INITIALIZE EXTENSIONS
    # =========================
    db.init_app(app)
    jwt.init_app(app)

    # =========================
    # IMPORT MODELS
    # =========================
    from backend.models.user_model import User
    from backend.models.upload_model import Upload

    # =========================
    # CREATE DATABASE TABLES
    # =========================
    with app.app_context():
        db.create_all()

    # =========================
    # REGISTER BLUEPRINTS
    # =========================
    from backend.routes.auth_routes import auth
    app.register_blueprint(auth, url_prefix="/api/auth")

    from backend.routes.upload_routes import upload
    app.register_blueprint(upload, url_prefix="/api/upload")

    # =========================
    # HOME ROUTE
    # =========================
    @app.route("/")
    def home():
        return {
            "status": "success",
            "message": "MECHCONNECT API is running."
        }

    return app