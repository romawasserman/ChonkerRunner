import { Dust, Fire, Splash, Shitty } from './particles.js';

const states = {
    SITTING : 0,
    RUNNING : 1,
    JUMPING : 2,
    FALLING : 3,
    ROLLING : 4,
    DIVING : 5,
    HIT : 6,
    SHIT : 7
};

class State{
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State{
    constructor(game){
        super('SITTING', game);
    }
    enter(){
        this.game.player.spriteHeight = 600;
        this.game.player.startY = 0;
        this.game.player.spriteWidth = 723;
    }
    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight') || input.includes('ArrowUp')) {
            this.game.player.setState(states.RUNNING, 1);
        }else if (input.includes('Enter') && this.game.player.energy > 10){
            this.game.player.setState(states.ROLLING, 2.5);
        }else if (input.includes('Control')) {
            this.game.player.setState(states.SHIT, 0);
        }
    }
}

export class Running extends State{
    constructor(game){
        super('RUNNING', game);
    }
    enter(){
        this.game.player.spriteHeight = 600;
        this.game.player.startY = 600;
        this.game.player.spriteWidth = 730;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.2, this.game.player.y + this.game.player.height * 0.63));
        if (input.includes('ArrowDown')) {
            this.game.player.setState(states.SITTING, 0);
        }   else if (input.includes('ArrowUp')){
            this.game.player.setState(states.JUMPING, 1);
        }   else if (input.includes('Enter') && this.game.player.energy > 10){
            this.game.player.setState(states.ROLLING, 2.5);
        }
    }
}

export class Jumping extends State{
    constructor(game){
        super('JUMPING', game);
    }
    enter(){
        if (this.game.player.onGround()) this.game.player.vy -= 28;
        this.game.player.spriteHeight = 600;
        this.game.player.startY = 600;
        this.game.player.spriteWidth = 730;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.2, this.game.player.y + this.game.player.height * 0.63));
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        }   else if (input.includes('Enter') && this.game.player.energy > 10){
            this.game.player.setState(states.ROLLING, 2.5);
        }   else if (input.includes('ArrowDown') && this.game.player.energy > 10){
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State{
    constructor(game){
        super('FALLING', game);
    }
    enter(){
        this.game.player.spriteHeight = 600;
        this.game.player.startY = 600;
        this.game.player.spriteWidth = 730;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.2, this.game.player.y + this.game.player.height * 0.63));
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1 );
        }   else if (input.includes('ArrowDown') && this.game.player.energy > 10){
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Rolling extends State{
    constructor(game){
        super('ROLLING', game);
    }
    enter(){
        this.game.player.spriteHeight = 450;
        this.game.player.startY = 1150;
        this.game.player.spriteWidth = 730;
        this.game.player.rollSound.play();

    }
    handleInput(input){
        this.game.player.energy -= 1;
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.3, this.game.player.y + this.game.player.height * 0.3));
        if (!input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1 );
        }else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1 );
        }else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()) {
            this.game.player.vy -=  27;
        }else if (input.includes('ArrowDown') && !this.game.player.onGround() && this.game.player.energy > 10){
            this.game.player.setState(states.DIVING, 0);
        }else if (this.game.player.energy < 1){
            this.game.player.setState(states.RUNNING, 1 );
        }
        
    }
}

export class Diving extends State{
    constructor(game){
        super('DIVING', game);
    }
    enter(){
        this.game.player.spriteHeight = 450;
        this.game.player.startY = 1150;
        this.game.player.spriteWidth = 730;
        this.game.player.vy = 15;
        this.game.player.energy -= 10;
        this.game.player.rollSound.play();
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.3, this.game.player.y + this.game.player.height * 0.3));
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1 );
            for ( let i = 0; i < 50; i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.2, this.game.player.y + this.game.player.height * 0.5));
            } 
        }else if (input.includes('Enter') && this.game.player.onGround() && this.game.player.energy > 10) {
            this.game.player.setState(states.ROLLING, 2.5 );
        }
    }
}

export class Hit extends State{
    constructor(game){
        super('HIT', game);
        this.timer = 0;
    }
    enter(){
        this.timer = 0;
        this.game.player.spriteHeight = 600;
        this.game.player.spriteWidth = 723;
        this.game.player.startY = 3150;
        this.game.player.hitSound.play();

    }
    handleInput(input){
    //     if (this.game.player.frameX >= this.game.player.maxFrame && this.game.player.onGround()){
    //         this.game.player.setState(states.RUNNING, 1);
    //     }else if (this.game.player.frameX >= this.game.player.maxFrame && !this.game.player.onGround()){
    //         this.game.player.setState(states.FALLING, 1);
    // }
        this.timer++;
    if(this.timer > 100 && this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
    else if (this.timer > 100 && !this.game.player.onGround()) this.game.player.setState(states.FALLING, 1);
}}

export class Shit extends State{
    constructor(game){
        super('SHIT', game);
        this.timer = 0;
    }
    enter(){
        this.timer = 0;
        this.game.player.spriteHeight = 600;
        this.game.player.spriteWidth = 723;
        this.game.player.startY = 1520;
        this.game.player.hitSound.play();

    }
    handleInput(input){
        for ( let i = 0; i < 50; i++) {
            this.game.particles.unshift(new Shitty(this.game, this.game.player.x + this.game.player.width, this.game.player.y + this.game.player.height * 0.63));
        }
    this.timer++;
    if(this.timer > 100 && this.game.player.onGround()) this.game.player.setState(states.SITTING, 0);
    else if (this.timer > 100 && !this.game.player.onGround()) this.game.player.setState(states.FALLING, 1);
}}