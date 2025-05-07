from flask import Flask, render_template, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SESSION_SECRET', 'dev-secret-key')

db = SQLAlchemy(app)

# Import models after db initialization
from models import User, Drawing

@app.route('/')
def home():
    if 'user_id' not in session:
        return render_template('login.html')
    return render_template('canvas.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
    user = User(username=data['username'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    session['user_id'] = user.id
    return jsonify({'success': True})

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True})

@app.route('/save-drawing', methods=['POST'])
def save_drawing():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
        
    data = request.json
    drawing = Drawing(
        user_id=session['user_id'],
        image_data=data['imageData']
    )
    db.session.add(drawing)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/get-drawings')
def get_drawings():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
        
    drawings = Drawing.query.filter_by(user_id=session['user_id']).all()
    return jsonify([{
        'id': d.id,
        'imageData': d.image_data,
        'created_at': d.created_at.isoformat()
    } for d in drawings])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
