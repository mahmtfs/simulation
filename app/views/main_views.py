from flask import render_template
from app import app


"""
<div class="col-lg-8  offset-lg-2">
    <h3 class="mt-5">Live Streaming</h3>
    <img src="{{ url_for('video_feed') }}" width="100%">
</div>
"""


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')
