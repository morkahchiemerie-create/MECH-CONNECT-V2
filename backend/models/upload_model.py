from backend import db
from datetime import datetime


class Upload(db.Model):
    __tablename__ = "uploads"

    # =========================
    # PRIMARY KEY
    # =========================
    id = db.Column(db.Integer, primary_key=True)

    # =========================
    # BASIC INFO
    # =========================
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    media_type = db.Column(db.String(50), nullable=False)

    # =========================
    # ACADEMIC INFO
    # =========================
    level = db.Column(db.String(20), nullable=False)
    semester = db.Column(db.String(50), nullable=False)
    specialization = db.Column(db.String(50), nullable=True)
    course_code = db.Column(db.String(100), nullable=False)

    # =========================
    # FILE INFO
    # =========================
    filename = db.Column(db.String(300), nullable=False)
    original_filename = db.Column(db.String(300), nullable=False)
    filepath = db.Column(db.String(500), nullable=False)
    filetype = db.Column(db.String(50), nullable=False)
    mimetype = db.Column(db.String(150), nullable=False)
    filesize = db.Column(db.Float, nullable=False)

    # =========================
    # USER INFO
    # =========================
    uploaded_by = db.Column(db.String(150), nullable=True)

    # =========================
    # EXTRA CONTENT
    # =========================
    description = db.Column(db.Text, nullable=True)

    # =========================
    # SYSTEM DATA
    # =========================
    upload_date = db.Column(db.Date, nullable=False)
    downloads = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)