from flask import Blueprint, request, jsonify, redirect, url_for, flash, render_template
from . import db, login_manager
from .models import User
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.form or request.json
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'All fields are required.'}), 400

    if User.query.filter((User.username==username) | (User.email==email)).first():
        return jsonify({'success': False, 'message': 'Username or email already exists.'}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return jsonify({'success': True, 'message': 'Account created.'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.form or request.json
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'success': False, 'message': 'Missing credentials.'}), 400

    # allow login by username or email
    user = User.query.filter((User.username==identifier) | (User.email==identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid credentials.'}), 401

    login_user(user)
    return jsonify({'success': True, 'message': 'Logged in.'}), 200

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out.'}), 200

# flask-login user loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
