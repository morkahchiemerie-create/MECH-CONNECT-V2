from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from datetime import datetime

from backend import db
from backend.models.upload_model import Upload


upload = Blueprint("upload", __name__)

# =========================
# ALLOWED FILE TYPES
# =========================
ALLOWED_EXTENSIONS = {
    "pdf", "doc", "docx", "ppt", "pptx",
    "png", "jpg", "jpeg", "webp",
    "zip",
    "mp4", "mov", "mkv",
    "mp3"
}


def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# =========================
# UPLOAD ROUTE
# =========================
@upload.route("/upload", methods=["POST"])
def upload_file():

    try:

        # =========================
        # GET DATA FROM REQUEST
        # =========================
        title = request.form.get("title")
        category = request.form.get("category")
        media_type = request.form.get("media_type")

        level = request.form.get("level")
        semester = request.form.get("semester")
        specialization = request.form.get("specialization")

        course_code = request.form.get("course_code")

        upload_date = request.form.get("upload_date")

        description = request.form.get("description")

        file = request.files.get("file")

        # =========================
        # VALIDATION
        # =========================
        required_fields = [
            title,
            category,
            media_type,
            level,
            semester,
            course_code,
            upload_date
        ]

        if not all(required_fields):
            return jsonify({
                "error": "Missing required fields"
            }), 400

        if level in ["400L", "500L"] and not specialization:
            return jsonify({
                "error": "Specialization required for 400L/500L"
            }), 400

        if not file or file.filename == "":
            return jsonify({
                "error": "No file selected"
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                "error": "File type not supported"
            }), 400

        # =========================
        # PROCESS FILE
        # =========================
        original_filename = secure_filename(file.filename)

        unique_name = (
            str(datetime.utcnow().timestamp()).replace(".", "")
            + "_"
            + original_filename
        )

        filetype = original_filename.rsplit(".", 1)[1].lower()

        # file size in MB
        filesize = round(len(file.read()) / (1024 * 1024), 2)

        # reset file pointer after reading size
        file.seek(0)

        # =========================
        # MIME TYPE
        # =========================
        mimetype = file.mimetype

        # =========================
        # CATEGORY FOLDER MAPPING
        # =========================
        category_map = {
            "Past Questions": "past_questions",
            "Projects": "projects",
            "Reports": "reports",
            "Materials": "materials",
            "Assignments": "assignments"
        }

        folder = category_map.get(category, "materials")

        upload_folder = current_app.config.get("UPLOAD_FOLDER")

        save_dir = os.path.join(upload_folder, folder)

        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        file_path = os.path.join(save_dir, unique_name)

        # =========================
        # SAVE FILE
        # =========================
        file.save(file_path)

        # =========================
        # SAVE TO DATABASE
        # =========================
        new_upload = Upload(
            title=title,
            category=category,
            media_type=media_type,

            level=level,
            semester=semester,
            specialization=specialization,
            course_code=course_code,

            filename=unique_name,
            original_filename=original_filename,
            filepath=file_path,
            filetype=filetype,
            mimetype=mimetype,
            filesize=filesize,

            description=description,

            upload_date=datetime.strptime(upload_date, "%Y-%m-%d").date(),

            downloads=0,
            is_verified=False,
            is_active=True
        )

        db.session.add(new_upload)
        db.session.commit()

        return jsonify({
            "message": "Upload successful",
            "filename": unique_name
        }), 201

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500



# =========================
# GET FILES FOR COURSE PAGE
# =========================
@upload.route("/files", methods=["GET"])
def get_course_files():

    try:
        course_code = request.args.get("course_code")
        category = request.args.get("category", "all")

        if not course_code:
            return jsonify({
                "error": "course_code is required"
            }), 400

        query = Upload.query.filter_by(course_code=course_code)

        if category.lower() != "all":
            query = query.filter(
                Upload.category.ilike(category)
            )

        files = query.order_by(
            Upload.upload_date.desc()
        ).all()

        result = []

        for file in files:

            result.append({
                "id": file.id,
                "title": file.title,
                "category": file.category,
                "media_type": file.media_type,
                "description": file.description,
                "filetype": file.filetype,
                "filesize": file.filesize,
                "downloads": file.downloads,
                "upload_date": file.upload_date.strftime("%Y-%m-%d")
            })

        return jsonify({
            "files": result
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    

    # =========================
# DOWNLOAD / VIEW FILE
# =========================
@upload.route("/download/<int:file_id>", methods=["GET"])
def download_file(file_id):

    try:
        # =========================
        # FIND FILE IN DATABASE
        # =========================
        file_record = Upload.query.get(file_id)

        if not file_record:
            return jsonify({
                "error": "File not found"
            }), 404

        # =========================
        # CHECK IF FILE EXISTS ON DISK
        # =========================
        if not os.path.exists(file_record.filepath):
            return jsonify({
                "error": "File missing from server storage"
            }), 404

        # =========================
        # INCREMENT DOWNLOAD COUNT
        # =========================
        file_record.downloads += 1
        db.session.commit()

        # =========================
        # SEND FILE TO USER
        # =========================
        from flask import send_file

        return send_file(
            file_record.filepath,
            as_attachment=True,
            download_name=file_record.original_filename
        )

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================
# VIEW FILE
# =========================
@upload.route("/view/<int:file_id>", methods=["GET"])
def view_file(file_id):

    try:

        # =========================
        # FIND FILE
        # =========================
        file_record = Upload.query.get(file_id)

        if not file_record:
            return jsonify({
                "error": "File not found"
            }), 404

        # =========================
        # CHECK FILE EXISTS
        # =========================
        if not os.path.exists(file_record.filepath):
            return jsonify({
                "error": "File missing from server storage"
            }), 404

        # =========================
        # SEND FILE TO BROWSER
        # =========================
        from flask import send_file

        return send_file(
            file_record.filepath,
            mimetype=file_record.mimetype,
            as_attachment=False
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500



        # =========================
# GET ALL FILES
# =========================
@upload.route("/all-files", methods=["GET"])
def get_all_files():

    try:

        files = Upload.query.order_by(
            Upload.upload_date.desc()
        ).all()

        results = []

        for file in files:

            results.append({
                "id": file.id,
                "title": file.title,
                "description": file.description,
                "course_code": file.course_code,
                "category": file.category,
                "level": file.level,
                "filetype": file.filetype,
                "filesize": file.filesize,
                "downloads": file.downloads,
                "upload_date": file.upload_date.strftime("%Y-%m-%d") if file.upload_date else ""
            })

        return jsonify({
            "files": results
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500