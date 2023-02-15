export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.livesImage = heart; 
    }
    draw(context){
        context.font = this.fontSize + 'px' + ' ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;

        context.fillText('Score  ' + this.game.score, 20, 50);

        context.font = this.fontSize * 0.7 + 'px' + ' ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;

        context.fillText('Energy :  ' + this.game.player.energy, 20, 100);

        //timer 
        // context.font = this.fontSize * 0.8 + 'px' + ' ' + this.fontFamily;
        // context.fillText('Time:  ' + (this.game.time * 0.001).toFixed(1), 20, 80);
        //lives
        for (let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 25 * i + 20, 55, 25, 25);
        }

        //gameover
        if (this.game.gameOver){
            context.fillStyle = 'black';
            context.font = this.fontSize * 2 + 'px' + ' ' + this.fontFamily;
            context.fillText('ПЕРЕМОГА!', this.game.width * 0.33 - 2, this.game.height * 0.5 - 22); 

            context.font = this.fontSize * 0.7 + 'px' + ' ' + this.fontFamily;
            context.fillText('ДА ТЫ САМЫЙ КРУТОЙ ПИНЧЕРС В КОМНАТЕ!', this.game.width * 0.3 - 2, this.game.height * 0.5 + 18);
            context.fillStyle = 'white';
            context.textAlign = 'left';
            context.font = this.fontSize * 2 + 'px' + ' ' + this.fontFamily;
            context.fillText('ПЕРЕМОГА!', this.game.width * 0.33, this.game.height * 0.5 - 20); 

            context.font = this.fontSize * 0.7 + 'px' + ' ' + this.fontFamily;
            context.fillText('ДА ТЫ САМЫЙ КРУТОЙ ПИНЧЕРС В КОМНАТЕ!', this.game.width * 0.3, this.game.height * 0.5 + 20);
        }
    }
}