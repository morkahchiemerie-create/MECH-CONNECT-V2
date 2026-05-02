from flask import Blueprint, request, jsonify
from backend import db
from backend.models.user_model import User
from datetime import datetime
import bcrypt


auth = Blueprint("auth", __name__)


# =========================
# REGISTER ROUTE (STEP 8)
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

    # check if user exists
    existing_user = User.query.filter(
        (User.email == email) |
        (User.matric_or_staff_id == matric_or_staff_id)
    ).first()

    if existing_user:
        return jsonify({
            "message": "Email or Matric Number already exists"
        }), 400

    # 🔐 HASH PASSWORD (SECURITY LAYER)
    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    # create user
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
        "message": "Registration successful"
    }), 201


# =========================
# LOGIN ROUTE (STEP 9)
# =========================
@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    identifier = data.get("identifier")  # email OR matric OR staff ID
    password = data.get("password")

    # find user
    user = User.query.filter(
        (User.email == identifier) |
        (User.matric_or_staff_id == identifier)
    ).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # 🔐 VERIFY PASSWORD
    if not bcrypt.checkpw(
        password.encode('utf-8'),
        user.password.encode('utf-8')
    ):
        return jsonify({"message": "Incorrect password"}), 401

    # update login tracking
    user.login_count += 1
    user.last_login = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "role": user.role,
            "login_count": user.login_count
        }
    }), 200