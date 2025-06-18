from flask import Blueprint, render_template
from datetime import datetime

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def home():
    current_year = datetime.now().year
    return render_template('home.html', current_year=current_year)


