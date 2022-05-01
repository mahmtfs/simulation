from flask import Response
from app import app
from app.anim.video_gen import gen_frames


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
