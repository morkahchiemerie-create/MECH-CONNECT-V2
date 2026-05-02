# backend/models/user_model.py

from backend import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Basic Identity
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)

    # Student Matric Number OR Lecturer Staff ID
    matric_or_staff_id = db.Column(db.String(100), unique=True, nullable=False)

    # Academic Information
    level = db.Column(db.String(50), nullable=True)
    residence = db.Column(db.String(150), nullable=True)

    # Authentication
    password = db.Column(db.String(255), nullable=False)

    # Role Management
    role = db.Column(db.String(50), nullable=False)
    # Example: student / lecturer

    # Login Tracking
    login_count = db.Column(db.Integer, default=0)
    last_login = db.Column(db.DateTime, nullable=True)

    # Account Creation Time
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"