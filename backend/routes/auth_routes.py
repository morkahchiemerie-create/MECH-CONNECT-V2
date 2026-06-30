from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from backend import db
from backend.models.user_model import User
from datetime import datetime
import bcrypt

auth = Blueprint("auth", __name__)


# =========================
# REGISTER ROUTE
# =========================
@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    matric_or_staff_id = data.get("matric_or_staff_id")
    level = data.get("level")
    residence = data.get("residence")
    password = data.get("password")
    role = data.get("role")

    # =========================
    # VALIDATION
    # =========================
    if not full_name or not email or not matric_or_staff_id or not password or not role:
        return jsonify({
            "message": "Please fill in all required fields."
        }), 400

    # =========================
    # CHECK IF USER EXISTS
    # =========================
    existing_user = User.query.filter(
        (User.email == email) |
        (User.matric_or_staff_id == matric_or_staff_id)
    ).first()

    if existing_user:
        return jsonify({
            "message": "Email or Matric/Staff ID already exists."
        }), 400

    # =========================
    # HASH PASSWORD
    # =========================
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    # =========================
    # CREATE USER
    # =========================
    new_user = User(
        full_name=full_name,
        email=email,
        matric_or_staff_id=matric_or_staff_id,
        level=level,
        residence=residence,
        password=hashed_password,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful."
    }), 201


# =========================
# LOGIN ROUTE
# =========================
@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    identifier = data.get("identifier")
    password = data.get("password")

    # =========================
    # FIND USER
    # =========================
    user = User.query.filter(
        (User.email == identifier) |
        (User.matric_or_staff_id == identifier)
    ).first()

    if not user:
        return jsonify({
            "message": "Invalid email/matric number or password."
        }), 401

    # =========================
    # VERIFY PASSWORD
    # =========================
    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    ):
        return jsonify({
            "message": "Invalid email/matric number or password."
        }), 401

    # =========================
    # UPDATE LOGIN INFO
    # =========================
    user.login_count += 1
    user.last_login = datetime.utcnow()

    db.session.commit()

    # =========================
    # CREATE JWT TOKEN
    # =========================
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "name": user.full_name
        }
    )

    # =========================
    # RETURN RESPONSE
    # =========================
    return jsonify({
    "message": "Login successful.",
    "access_token": access_token,
    "user": {
        "id": user.id,
        "full_name": user.full_name,
        "role": user.role,
        "level": user.level,
        "matric_or_staff_id": user.matric_or_staff_id,
        "residence": user.residence,
        "login_count": user.login_count
    }
}), 200