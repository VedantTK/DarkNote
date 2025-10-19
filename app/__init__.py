import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'index'

    # import and register blueprints / views
    from .auth import auth_bp
    from .views import main_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    # create tables on startup (simple demo)
    with app.app_context():
        db.create_all()

    return app

# for gunicorn: expose 'app'
app = create_app()
