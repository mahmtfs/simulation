from flask import Flask


app = Flask(__name__)


from app.views import main
from app.views import video
