import pygame, time, json,math

GAME_TITLE = "PY GAME"
GAME_FPS = 60
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

COLOR_BLACK = (0, 0, 0)
COLOR_WHITE = (255, 255, 255)
COLOR_GRAY = (155, 155, 155)
COLOR_GREEN = (0, 255, 0)
COLOR_RED = (255, 0, 0)
COLOR_BLUE = (0, 0, 255)

pygame.init()
pygame.display.set_caption(GAME_TITLE)
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))



class SpriteSheet:
    def __init__(self,file,w,h,col,start_frame = 0,scale = 1):
        self.scale = scale
        self.width = w
        self.height = h
        self.col = col
        self.frame = 0
        self.x = 0
        self.y = 0
        self.image = pygame.image.load(file).convert_alpha()
        self.sprite = pygame.Surface((w, h))

        self.set_frame(start_frame)

    def set_frame(self,frame):
        self.frame = frame
        self.x = self.frame % self.col
        self.y = math.floor(self.frame / self.col)

        self.sprite.fill(COLOR_BLACK)
        self.sprite.set_colorkey(COLOR_BLACK)
        self.sprite.blit(self.image,(0,0),(self.x*self.width,self.y*self.height,self.width,self.height))


class Atlas:
    def __init__(self, file):
        self.image = pygame.image.load(file).convert()
        js = file.split('.')[0] + ".json"
        with open(js) as f:
            self.data = json.load(f)
        f.close()

    def get_image(self, name,scale = 1):
        key = name+".png"
        img_data = self.data['frames'][key]
        img_frame = img_data['frame']
        x,y,w,h = img_frame['x'],img_frame['y'],img_frame['w'],img_frame['h']
        surface = pygame.Surface((w, h))
        surface.set_colorkey(COLOR_BLACK)
        surface.blit(self.image,(0,0),(x,y,w,h))
        surface = pygame.transform.scale(surface,(w*scale,h*scale))
        return surface


class Game:
    running = True
    clock = pygame.time.Clock()
    prev_time = time.time()

    atlas = Atlas('assets/atlas.png')
    hedgehog = atlas.get_image('tiger',1)

    sprite1 = SpriteSheet('assets/walk_cycle.png',16,24,16,0,3)
    index = 0
    hero = sprite1.sprite

    x=0
    def run(self):
        while self.running:
            now = time.time()
            dt = now - self.prev_time
            self.prev_time = now
            self.on_key_event()
            self.update(dt)
            self.render()
            pygame.display.update()
            self.clock.tick(GAME_FPS)

    def update(self, dt):
        self.x = self.x + dt



    def render(self):
        screen.fill(COLOR_GRAY)
        # pygame.draw.circle(screen, COLOR_BLUE, (250, 250), 75)
        screen.blit(self.hedgehog,(0,0))
        screen.blit(self.hero, (self.x, 50))
        pygame.display.flip()

    def on_key_event(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.index = self.index+1
                    self.sprite1.set_frame(self.index)


    def quit(self):
        pygame.quit()


if __name__ == '__main__':
    game = Game()
    game.run()
    game.quit()
