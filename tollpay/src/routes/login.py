from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from src.db import mysql

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, password FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if user:
        print(f"User found: {user}")
        if check_password_hash(user[1], password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            print("Password does not match")
    else:
        print("User not found")

    return jsonify({'error': 'Invalid username or password'}), 401