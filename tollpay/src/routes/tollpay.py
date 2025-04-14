from flask import Blueprint, request, jsonify
from src.db import mysql

tollpay_bp = Blueprint('tollpay', __name__)

@tollpay_bp.route('/calculate-toll', methods=['POST'])
def calculate_toll():
    data = request.get_json()
    source = data.get('source')
    destination = data.get('destination')
    vehicle_type = data.get('vehicle_type')
    toll_price = calculate_toll_price(source, destination, vehicle_type)  # Implement this function

    print(f"Source: {source}, Destination: {destination}, Vehicle Type: {vehicle_type}, Toll Price: {toll_price}")

    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO tollpay_details (source, destination, vehicle_type, toll_price) VALUES (%s, %s, %s, %s)",
        (source, destination, vehicle_type, toll_price)
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Toll calculated successfully', 'toll_price': toll_price}), 200

def calculate_toll_price(source, destination, vehicle_type):
    # Implement the logic to calculate toll price based on source, destination, and vehicle type
    return 10.00  # Placeholder value