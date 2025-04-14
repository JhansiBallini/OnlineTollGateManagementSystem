from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from src.db import mysql

registration_bp = Blueprint('registration', __name__)

@registration_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    license_number = data.get('license_number')
    password = data.get('password')

    if not username or not email or not license_number or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(password)

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, license_number, password) VALUES (%s, %s, %s, %s)",
            (username, email, license_number, hashed_password)
        )
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Registration successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500