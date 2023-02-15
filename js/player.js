import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit, Shit } from "./playerStates.js";
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from "./floatingMessages.js";

export class Player {
    constructor(game){
        this.game = game;
        this.spriteWidth = 730;
        this.spriteHeight = 600;
        this.width = this.spriteWidth/5;
        this.height = this.spriteHeight/5;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = player;
        this.frameX = 0;
        this.startY = 0;
        this.maxFrame = 5;
        this.fps = 10;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.maxEnergy = 10000;
        this.energy = this.maxEnergy - 10000;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game), new Shit(this.game)];
        this.currentState = null;
        this.hitSound = new Audio();
        this.hitSound.src = 'images/hit.mp3';
        this.rollSound = new Audio();
        this.rollSound.src = 'images/roll.mp3';
    }
    update(input,deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        //vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        //sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.energy < this.maxEnergy){
                this.energy+=2;
            }
    
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        //energy 

    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x + 20, this.y + 30, this.width - 20, this.height - 30);
        context.drawImage(this.image, this.frameX * this.spriteWidth , this.startY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    onGround(){
    return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (this.particles != []) {
                this.game.particles.forEach(particle => {
                    if (             
                        enemy.x < particle.x && 
                        enemy.x + enemy.width > particle.x &&
                        enemy.y < particle.y&&
                        enemy.y + enemy.height > particle.y
                    ) {
                        enemy.markedForDeletion = true;
                        this.game.score++;
                        this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 120,48));
                    }
                });
            }
            if (
                enemy.x < this.x + this.width && 
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) { 
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5] || this.currentState === this.states[6]) {
                    
                }else {
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        });
    }
}    