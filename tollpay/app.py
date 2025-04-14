from flask import Flask, render_template
from src.db import mysql
from src.routes.registration import registration_bp
from src.routes.login import login_bp
from src.routes.tollpay import tollpay_bp
 
app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Replace with your actual MySQL username
app.config['MYSQL_PASSWORD'] = 'Jhansi'  # Replace with your actual MySQL password
app.config['MYSQL_DB'] = 'tollpay'

mysql.init_app(app)

app.register_blueprint(registration_bp, url_prefix='/api')
app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(tollpay_bp, url_prefix='/api')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login.html')
def login_page():
    return render_template('login.html')

@app.route('/registration.html')
def registration_page():
    return render_template('registration.html')

@app.route('/tollpay.html')
def tollpay_page():
    return render_template('tollpay.html')

@app.route('/samplepayment.html')
def samplepayment_page():
    return render_template('samplepayment.html')

@app.route('/payment')
def payment():
    return render_template('payment.html')

if __name__ == '__main__':
    app.run(debug=True)