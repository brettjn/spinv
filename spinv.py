#!/usr/bin/env python3
"""
Space Invaders Clone
Use Left and Right arrow keys to move, Space to shoot
"""

import pygame
import random
import sys
import math

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 800  # Make it square for circular layout
FPS = 60
CENTER_X = SCREEN_WIDTH // 2
CENTER_Y = SCREEN_HEIGHT // 2

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)
CYAN = (0, 255, 255)

# Player settings
PLAYER_WIDTH = 50
PLAYER_HEIGHT = 40
PLAYER_RADIUS = 100  # Radius of player's circular path
PLAYER_ANGULAR_SPEED = 0.05  # Radians per frame

# Enemy settings
ENEMY_WIDTH = 40
ENEMY_HEIGHT = 30
ENEMY_ROWS = 5
ENEMY_COLS = 11
ENEMY_BASE_RADIUS = 200  # Starting radius for first row of enemies
ENEMY_RADIUS_SPACING = 60  # Space between enemy rows
ENEMY_ANGULAR_SPEED = 0.02  # Radians per frame

# Bullet settings
BULLET_WIDTH = 4
BULLET_HEIGHT = 15
BULLET_SPEED = 7
ENEMY_BULLET_SPEED = 4


class Player(pygame.sprite.Sprite):
    """Player ship moving on an inner circle"""
    
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface([PLAYER_WIDTH, PLAYER_HEIGHT], pygame.SRCALPHA)
        # Draw a simple ship shape pointing outward
        pygame.draw.polygon(self.image, GREEN, [
            (PLAYER_WIDTH // 2, 0),
            (0, PLAYER_HEIGHT),
            (PLAYER_WIDTH // 2, PLAYER_HEIGHT - 10),
            (PLAYER_WIDTH, PLAYER_HEIGHT)
        ])
        self.original_image = self.image.copy()
        self.rect = self.image.get_rect()
        
        # Angular position (in radians, 0 = right, increases counter-clockwise)
        self.angle = -math.pi / 2  # Start at top
        self.radius = PLAYER_RADIUS
        self.angular_speed = PLAYER_ANGULAR_SPEED
        
        self.update_position()
        
    def update_position(self):
        """Update cartesian position based on angle"""
        x = CENTER_X + self.radius * math.cos(self.angle)
        y = CENTER_Y + self.radius * math.sin(self.angle)
        
        # Rotate image to point outward from center
        angle_degrees = -math.degrees(self.angle) - 90
        self.image = pygame.transform.rotate(self.original_image, angle_degrees)
        self.rect = self.image.get_rect(center=(x, y))
        
    def update(self):
        """Move player based on keyboard input"""
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.angle += self.angular_speed  # Counter-clockwise
        if keys[pygame.K_RIGHT]:
            self.angle -= self.angular_speed  # Clockwise
            
        self.update_position()
    
    def get_shoot_position(self):
        """Get position and direction for shooting"""
        # Bullet should shoot radially outward
        return (self.rect.centerx, self.rect.centery, self.angle)


class Enemy(pygame.sprite.Sprite):
    """Enemy invader moving on circular paths"""
    
    def __init__(self, angle, row=0):
        super().__init__()
        self.image = pygame.Surface([ENEMY_WIDTH, ENEMY_HEIGHT], pygame.SRCALPHA)
        self.row = row
        self.angle = angle
        self.radius = ENEMY_BASE_RADIUS + row * ENEMY_RADIUS_SPACING
        
        # Alternate direction based on row
        self.direction = 1 if row % 2 == 0 else -1  # 1 = clockwise, -1 = counter-clockwise
        
        # Draw different monster shapes based on row
        if row == 0:
            # Octopus monster (top row) - most points
            self.draw_octopus()
            self.color = (255, 0, 255)  # Magenta
        elif row == 1:
            # Crab monster
            self.draw_crab()
            self.color = (0, 255, 255)  # Cyan
        elif row == 2:
            # Squid monster
            self.draw_squid()
            self.color = (255, 128, 0)  # Orange
        elif row == 3:
            # Jellyfish monster
            self.draw_jellyfish()
            self.color = (255, 255, 0)  # Yellow
        else:
            # Alien monster (bottom row) - least points
            self.draw_alien()
            self.color = (0, 255, 0)  # Green
        
        self.original_image = self.image.copy()
        self.rect = self.image.get_rect()
        self.update_position()
    
    def update_position(self):
        """Update cartesian position based on angle and radius"""
        x = CENTER_X + self.radius * math.cos(self.angle)
        y = CENTER_Y + self.radius * math.sin(self.angle)
        
        # Rotate image to face the direction of motion
        angle_degrees = -math.degrees(self.angle) - 90
        self.image = pygame.transform.rotate(self.original_image, angle_degrees)
        self.rect = self.image.get_rect(center=(x, y))
    
    def draw_octopus(self):
        """Draw octopus-style monster"""
        # Body
        pygame.draw.ellipse(self.image, (255, 0, 255), [8, 5, 24, 18])
        # Eyes
        pygame.draw.rect(self.image, WHITE, [12, 10, 5, 5])
        pygame.draw.rect(self.image, WHITE, [23, 10, 5, 5])
        # Tentacles
        for i in range(6):
            x = 8 + i * 4
            pygame.draw.line(self.image, (255, 0, 255), (x, 20), (x, 28), 2)
    
    def draw_crab(self):
        """Draw crab-style monster"""
        # Claws
        pygame.draw.rect(self.image, (0, 255, 255), [2, 8, 6, 8])
        pygame.draw.rect(self.image, (0, 255, 255), [32, 8, 6, 8])
        # Body
        pygame.draw.rect(self.image, (0, 255, 255), [10, 5, 20, 18])
        # Eyes
        pygame.draw.circle(self.image, WHITE, (15, 12), 3)
        pygame.draw.circle(self.image, WHITE, (25, 12), 3)
        # Legs
        for i in range(4):
            x = 12 + i * 5
            pygame.draw.line(self.image, (0, 255, 255), (x, 23), (x - 3, 28), 2)
    
    def draw_squid(self):
        """Draw squid-style monster"""
        # Head
        pygame.draw.rect(self.image, (255, 128, 0), [12, 4, 16, 14])
        # Eyes (angry)
        pygame.draw.polygon(self.image, WHITE, [(14, 10), (18, 8), (18, 12)])
        pygame.draw.polygon(self.image, WHITE, [(26, 10), (22, 8), (22, 12)])
        # Tentacles (wavy)
        for i in range(5):
            x = 10 + i * 5
            pygame.draw.line(self.image, (255, 128, 0), (x, 18), (x + 2, 26), 2)
    
    def draw_jellyfish(self):
        """Draw jellyfish-style monster"""
        # Bell/head
        pygame.draw.ellipse(self.image, (255, 255, 0), [10, 3, 20, 16])
        # Eyes
        pygame.draw.circle(self.image, WHITE, (17, 10), 2)
        pygame.draw.circle(self.image, WHITE, (23, 10), 2)
        pygame.draw.circle(self.image, BLACK, (17, 10), 1)
        pygame.draw.circle(self.image, BLACK, (23, 10), 1)
        # Tentacles (straight down)
        for i in range(7):
            x = 11 + i * 3
            y_offset = i % 2 * 2
            pygame.draw.line(self.image, (255, 255, 0), (x, 18), (x, 24 + y_offset), 1)
    
    def draw_alien(self):
        """Draw classic alien monster"""
        # Head
        pygame.draw.rect(self.image, (0, 255, 0), [10, 8, 20, 14])
        # Antennas
        pygame.draw.line(self.image, (0, 255, 0), (14, 8), (12, 3), 2)
        pygame.draw.line(self.image, (0, 255, 0), (26, 8), (28, 3), 2)
        pygame.draw.circle(self.image, (0, 255, 0), (12, 3), 2)
        pygame.draw.circle(self.image, (0, 255, 0), (28, 3), 2)
        # Eyes
        pygame.draw.rect(self.image, WHITE, [14, 12, 4, 4])
        pygame.draw.rect(self.image, WHITE, [22, 12, 4, 4])
        # Mouth
        pygame.draw.line(self.image, WHITE, (16, 19), (24, 19), 2)
        # Legs
        pygame.draw.line(self.image, (0, 255, 0), (14, 22), (12, 27), 2)
        pygame.draw.line(self.image, (0, 255, 0), (26, 22), (28, 27), 2)
        
    def update(self):
        """Move enemy in circular path"""
        # Move clockwise or counter-clockwise based on row
        self.angle -= self.direction * ENEMY_ANGULAR_SPEED
        self.update_position()


class Bullet(pygame.sprite.Sprite):
    """Player bullet shooting radially outward"""
    
    def __init__(self, x, y, angle):
        super().__init__()
        self.image = pygame.Surface([BULLET_WIDTH, BULLET_HEIGHT])
        self.image.fill(YELLOW)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        
        # Store angle and velocity components
        self.angle = angle
        self.vx = BULLET_SPEED * math.cos(angle)
        self.vy = BULLET_SPEED * math.sin(angle)
        
    def update(self):
        """Move bullet radially outward"""
        self.rect.x += self.vx
        self.rect.y += self.vy
        
        # Remove if off screen
        if (self.rect.x < -20 or self.rect.x > SCREEN_WIDTH + 20 or
            self.rect.y < -20 or self.rect.y > SCREEN_HEIGHT + 20):
            self.kill()


class EnemyBullet(pygame.sprite.Sprite):
    """Enemy bullet shooting radially inward"""
    
    def __init__(self, x, y, angle):
        super().__init__()
        self.image = pygame.Surface([BULLET_WIDTH, BULLET_HEIGHT])
        self.image.fill(CYAN)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        
        # Shoot toward center (opposite direction)
        self.angle = angle + math.pi  # Reverse direction
        self.vx = ENEMY_BULLET_SPEED * math.cos(self.angle)
        self.vy = ENEMY_BULLET_SPEED * math.sin(self.angle)
        
    def update(self):
        """Move bullet radially inward"""
        self.rect.x += self.vx
        self.rect.y += self.vy
        
        # Remove if too close to center or off screen
        dx = self.rect.centerx - CENTER_X
        dy = self.rect.centery - CENTER_Y
        dist = math.sqrt(dx*dx + dy*dy)
        if dist < 50 or (self.rect.x < -20 or self.rect.x > SCREEN_WIDTH + 20 or
            self.rect.y < -20 or self.rect.y > SCREEN_HEIGHT + 20):
            self.kill()


class Game:
    """Main game class"""
    
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Space Invaders")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        
        self.reset_game()
        
    def reset_game(self):
        """Reset game state"""
        self.all_sprites = pygame.sprite.Group()
        self.enemies = pygame.sprite.Group()
        self.bullets = pygame.sprite.Group()
        self.enemy_bullets = pygame.sprite.Group()
        
        # Create player
        self.player = Player()
        self.all_sprites.add(self.player)
        
        # Create enemies
        self.create_enemies()
        
        # Game state
        self.score = 0
        self.enemy_shoot_timer = 0
        self.game_over = False
        self.won = False
        
    def create_enemies(self):
        """Create enemies in concentric circles"""
        for row in range(ENEMY_ROWS):
            for col in range(ENEMY_COLS):
                # Distribute enemies evenly around the circle
                angle = (col / ENEMY_COLS) * 2 * math.pi
                enemy = Enemy(angle, row)
                self.enemies.add(enemy)
                self.all_sprites.add(enemy)
    
    def handle_events(self):
        """Handle game events"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not self.game_over:
                    self.shoot_bullet()
                elif event.key == pygame.K_r and self.game_over:
                    self.reset_game()
                elif event.key == pygame.K_ESCAPE:
                    return False
        return True
    
    def shoot_bullet(self):
        """Player shoots a bullet radially outward"""
        x, y, angle = self.player.get_shoot_position()
        bullet = Bullet(x, y, angle)
        self.bullets.add(bullet)
        self.all_sprites.add(bullet)
    
    def enemy_shoot(self):
        """Random enemy shoots a bullet radially inward"""
        if len(self.enemies) > 0:
            shooter = random.choice(list(self.enemies))
            bullet = EnemyBullet(shooter.rect.centerx, shooter.rect.centery, shooter.angle)
            self.enemy_bullets.add(bullet)
            self.all_sprites.add(bullet)
    
    def update(self):
        """Update game state"""
        if self.game_over:
            return
        
        # Update player
        self.player.update()
        
        # Update bullets
        self.bullets.update()
        self.enemy_bullets.update()
        
        # Update enemies (they now move autonomously in circles)
        for enemy in self.enemies:
            enemy.update()
        
        # Enemy shooting
        self.enemy_shoot_timer += 1
        if self.enemy_shoot_timer > 60:  # Shoot every second
            self.enemy_shoot_timer = 0
            if random.random() < 0.3:  # 30% chance per second
                self.enemy_shoot()
        
        # Check collisions between bullets and enemies
        for bullet in self.bullets:
            hit_enemies = pygame.sprite.spritecollide(bullet, self.enemies, True)
            if hit_enemies:
                bullet.kill()
                self.score += 10 * len(hit_enemies)
        
        # Check collisions between enemy bullets and player
        if pygame.sprite.spritecollide(self.player, self.enemy_bullets, True):
            self.game_over = True
        
        # Check if all enemies are destroyed
        if len(self.enemies) == 0:
            self.game_over = True
            self.won = True
    
    def draw(self):
        """Draw everything"""
        self.screen.fill(BLACK)
        
        # Draw circular paths (for visual reference)
        # Player's path
        pygame.draw.circle(self.screen, (50, 50, 50), (CENTER_X, CENTER_Y), PLAYER_RADIUS, 1)
        
        # Enemy paths with alternating colors to show rotation direction
        for row in range(ENEMY_ROWS):
            radius = ENEMY_BASE_RADIUS + row * ENEMY_RADIUS_SPACING
            color = (40, 40, 60) if row % 2 == 0 else (60, 40, 40)  # Blue-ish for clockwise, red-ish for counter
            pygame.draw.circle(self.screen, color, (CENTER_X, CENTER_Y), radius, 1)
        
        # Draw center point
        pygame.draw.circle(self.screen, (80, 80, 80), (CENTER_X, CENTER_Y), 5)
        
        # Draw all sprites
        self.all_sprites.draw(self.screen)
        
        # Draw score
        score_text = self.small_font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        # Draw instructions at bottom
        if not self.game_over:
            inst_text = self.small_font.render("Arrow Keys: Rotate | Space: Shoot", True, WHITE)
            self.screen.blit(inst_text, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT - 25))
        
        # Draw game over message
        if self.game_over:
            if self.won:
                text = self.font.render("YOU WIN!", True, GREEN)
            else:
                text = self.font.render("GAME OVER", True, RED)
            text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 30))
            self.screen.blit(text, text_rect)
            
            restart_text = self.small_font.render("Press R to Restart or ESC to Quit", True, WHITE)
            restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 20))
            self.screen.blit(restart_text, restart_rect)
        
        pygame.display.flip()
    
    def run(self):
        """Main game loop"""
        running = True
        while running:
            running = self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()


def main():
    """Entry point"""
    game = Game()
    game.run()


if __name__ == "__main__":
    main()
