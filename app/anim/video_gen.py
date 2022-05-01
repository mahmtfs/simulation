import random

import cv2
import pygame

pygame.init()
surface = pygame.display.set_mode((800, 600), flags=pygame.HIDDEN)
done = False
color = (255, 0, 0)

def capture_frame():
    screen = pygame.display.get_surface()
    capture = pygame.surfarray.pixels3d(screen)
    capture = capture.transpose([1, 0, 2])
    capture_bgr = cv2.cvtColor(capture, cv2.COLOR_RGB2BGR)
    return capture_bgr


def gen_frames():
    global done
    global surface
    global color
    while not done:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = True
        color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        pygame.draw.rect(surface, color, pygame.Rect(30, 30, 60, 60))
        pygame.display.flip()
        frame = capture_frame()
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')



