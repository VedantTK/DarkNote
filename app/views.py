from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    # show all notes (latest first)
    notes = Note.query.order_by(Note.created_at.desc()).all()
    return render_template('index.html', notes=notes)

@main_bp.route('/dashboard')
@login_required
def dashboard():
    notes = Note.query.order_by(Note.created_at.desc()).all()
    return render_template('dashboard.html', user=current_user, notes=notes)

@main_bp.route('/notes/create', methods=['POST'])
@login_required
def create_note():
    # accepts form-encoded or JSON payload with "content"
    data = request.form or request.get_json() or {}
    content = (data.get('content') or '').strip()
    if not content:
        return jsonify({'success': False, 'message': 'Note content is required.'}), 400

    note = Note(content=content, author_id=current_user.id)
    db.session.add(note)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Note created.',
        'note': {
            'id': note.id,
            'content': note.content,
            'author': current_user.username,
            'created_at': note.created_at.isoformat()
        }
    }), 201
