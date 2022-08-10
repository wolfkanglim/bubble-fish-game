const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const bubbles = [];
let gameFrame = 0;
let gameSpeed = 1;
let score = 0;
let timer = 0;
let deltaTime;
let gameOver = false;
const replayBtn = document.getElementById('replayBtn');

let mouse = {
     x: canvas.width/2,
     y: canvas.height/2,
     click: false
}

let canvasPos = canvas.getBoundingClientRect();
canvas.addEventListener('mousedown', function(e) {
     mouse.click = true;    
    mouse.x = e.clientX * 800 / canvasPos.width - canvasPos.left;
    mouse.y = e.clientY * 500 / canvasPos.height - canvasPos.top;
    if(!gameOver){
     playerTurn.volume = 0.2;
     playerTurn.currentTime = 0;
     playerTurn.play();
     }
    
})
canvas.addEventListener('mouseup', function(e) {
     mouse.click = false;
})

/////////// audios ////////////
const playerTurn = document.getElementById('playerTurn');
const bubblesArray = document.getElementById('bubblesArray');
const bubblesPop = document.getElementById('bubblesPop');
const bubblesPop3 = document.getElementById('bubblesPop3');
const bubblesBgm = document.getElementById('bubblesBgm');
const collisionSound = document.getElementById('collisionSound');
const enemy1Sound = document.getElementById('enemy1');
const enemy3Sound = document.getElementById('enemy3');
const enemy5Sound = document.getElementById('enemy5');

class Player {
     constructor(){
          this.image = document.getElementById('kissing_fish');
          this.spriteWidth = 256;
          this.spriteHeight = 256;
          this.width = this.spriteWidth * 0.42;
          this.height = this.spriteHeight * 0.42;
          this.radius = 25;
          this.angle = 0;
          this.frameX = 0;
          this.frameY = 0;
          this.frame = 0;
          this.x = 0;
          this.y = canvas.height / 2;

     }
     update(){
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          if(mouse.x != this.x) this.x -= dx / 25;
          if(mouse.y != this.y) this.y -= dy / 25;
          let tanAngle = Math.atan2(dy, dx);
          this.angle = tanAngle; 
          
          if(gameFrame % 5 == 0){
               this.frame++;
               if(mouse.x > this.x){
                   
                    if(this.frame >= 24) this.frame = 0;
                    if(this.frameX == 5 || this.frameX == 11 || this.frameX == 17 || this.frameX == 23) this.frameX = 0;
                    else this.frameX++;
                    if(this.frameX < 5) this.frameY = 0;
                    else if(this.frameX < 11) this.frameY = 2;
                    else if(this.frameX < 17) this.frameY = 2;
                    else if(this.frameX < 23) this.frameY = 0;
                    else this.frameY = 0;  
               }
               
               else {
                    if(this.frame >= 24) this.frame = 0;
                    if(this.frameX == 5 || this.frameX == 11 || this.frameX == 17 || this.frameX == 23) this.frameX = 0;
                    else this.frameX++;
                    if(this.frameX < 5) this.frameY = 1;
                    else if(this.frameX < 11) this.frameY = 1;
                    else if(this.frameX < 17) this.frameY = 3;
                    else if(this.frameX < 23) this.frameY = 3;
                    else this.frameY = 1;
                    
               }
          } 
              

          if(this.x < 0) this.x = 0;
          if(this.x > canvas.width - this.radius) this.x = canvas.width - this.radius;
          if(this.y < 0) this.y = 0;
          if(this.y > canvas.height - this.radius) this.y = canvas.height - this.radius;
     }
     draw() {
          if(mouse.click){
              ctx.lineWidth = 0.3;
               ctx.beginPath();
               ctx.moveTo(this.x, this.y);
               ctx.lineTo(mouse.x, mouse.y); 
               ctx.stroke();
          }          

          /* ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
          ctx.fillRect(this.x, this.y, this.radius, 10); */

          ctx.save();
          ctx.translate(this.x, this.y);
          if(mouse.x > this.x){
               ctx.rotate(this.angle + Math.PI);
               ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 67, 0 - 52, this.width, this.height);
          }
          else{
              if(this.frameY % 2 == 1){
               ctx.rotate(this.angle);
               ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY  * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 36, 0 - 52, this.width, this.height);
              } ;
          }
          ctx.restore();
     }
}

class PlayerTrail {
     constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 7;
          this.speedY = Math.random() * 0.3 - 0.5;
     }
     draw(){
          ctx.fillStyle = 'rgba(250, 250, 250, 0.55';
          ctx.beginPath();
          if(mouse.x > player.x) {
               ctx.arc(this.x - 7, this.y + 20, this.size, 0, Math.PI * 2);
          } else {
               ctx.arc(this.x + 20, this.y + 10, this.size, 0, Math.PI * 2);
          }
          ctx.fill();
     }
     update(){
          this.x -= 0.5;
          this.y += this.speedY;
     }
}
const trails = [];
function trailHandler(){
     trails.unshift(new PlayerTrail(player.x, player.y));
     trails.forEach(trail => {
          trail.draw();
          trail.update();
     })
     if(trails.length > 75){
          for(let i = 0; i < 35; i++){
               trails.pop(trails[i]);
          }
     }
}

class Bubble{
     constructor(){
          this.image = document.getElementById('bubble_pop_1');
          this.spriteWidth = 394;
          this.spriteHeight = 394;
          this.radius = Math.random() * 30 + 10;
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
          this.markedForDeletion = false;
          this.speed = Math.random() * 2 + 0.5;
          this.counted = false;
          this.distance;
          //this.color = color;
     }
     update(){
          
          this.y -= this.speed;
          if(this.y < 0 - this.radius - 100) this.markedForDeletion = true;
          let dX = this.x - player.x;
          let dY = this.y - player.y;
          this.distance = Math.sqrt(dX * dX + dY * dY); 
          
     }
     draw(){
          let h = Math.random() * 360;
          let color =`hsl(${h}, 100%, 50%)`;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
          ctx.stroke();
          ctx.drawImage(this.image, this.x - this.radius - 5, this.y - this.radius *1.6, this.radius * 2 + 7, this.radius * 2.6 + 5);
     }
}
function handleBubbles(){
     
     if(gameFrame % 70 === 0){
          bubblesArray.volume = 0.5;
          bubblesArray.play();
          bubbles.push(new Bubble());
     }
     for (let i = 0; i < bubbles.length; i++){
          bubbles[i].update();
          bubbles[i].draw();
     }
     for(let i = 0; i < bubbles.length; i++ ){
          if(bubbles[i].y < 0 - bubbles[i].radius - 100){
               bubbles.splice(i, 1);
          }
          if(bubbles[i].distance < bubbles[i].radius + player.radius){
               if(!bubbles[i].counted){
                    score++;
                    bubbles[i].counted = true;
                    bubbles.splice(i, 1);
                    i--;
               }
               if(Math.random() < 0.5) {
                     bubblesPop3.currentTime = 0;
                    bubblesPop.play();
               } else  {
                    bubblesPop3.currentTime = 0;
                    bubblesPop3.play();
               }    
          }     
     }
}     
     
const wondrous = document.getElementById('wondrous');
function handleScore() {
     const formattedTime = (timer * 0.001).toFixed(2);
     ctx.fillStyle = '#222';
     ctx.font = '20px Arial';
     ctx.fillText('SCORE: ' + score, 632, 52, 80, 30);
     ctx.fillText('TIMER: ' + formattedTime, 632, 32, 80, 30);
     ctx.fillStyle = '#fff';
     ctx.fillText('SCORE: ' + score, 630, 50, 80, 30);
     ctx.fillText('TIMER: ' + formattedTime, 630, 30, 80, 30);
     ctx.drawImage(wondrous, 750, 20, 30, 30);
     if(score >= 100){
          gameOver = true;
          ctx.font = '50px Arial'
          ctx.fillStyle = 'white';
          ctx.fillText('You Just Kissed 100 Times!',  100, canvas.height / 2);
          replayBtn. classList.add('show');
     }
}

//// enemies
const enemyRed = document.getElementById('fish_red_swim');
const enemyBlack = document.getElementById('fish_black_swim');
const enemyBlue = document.getElementById('fish_blue_swim');
const enemyPurple = document.getElementById('fish_purple_swim');
const enemyGreen = document.getElementById('fish_green_swim');
const enemyYellow = document.getElementById('fish_yellow_swim');

class Enemy {
     constructor(enemy){
          this.enemy = enemy;
          this.spriteWidth = 498;
          this.spriteHeight = 327;
          this.x = canvas.width;
          this.y = Math.random() * (canvas.height - this.spriteHeight / 2) + 50;
          this.frame = 0;
          this.frameX = 0;
          this.frameY = 0;
          this.radius = 35;
          this.markedForDeletion = false;
          this.speedX = Math.random() * 3 + 0.21;
     }
     update(){
          this.x -= this.speedX * Math.random() + 0.2;
          if(gameFrame % 7 === 0) {
               this.frame ++;
               if(this.frame >= 12) this.frame = 0;
               if(this.frameX == 3 || this.frameX == 7 || this.frameX == 11) this.frameX = 0;
               else this.frameX++;
               if(this.frameX < 3) this.frameY = 0;
               else if(this.frameX < 7) this.frameY = 1;
               else if(this.frameX < 11) this.frameY = 2;
               else this.frameY = 0;
          }
          if(this.x < 0 - this.spriteWidth) this.markedForDeletion = true; 
          //collision
          let dx = this.x - player.x;
          let dy = this.y - player.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if(distance < this.radius + player.radius){
               collisionSound.volume = 0.3;
               collisionSound.play();
               enemy1Sound.pause();
               gameOverHandler();
               
          }
     }
     draw(){
         /*  ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath(); */
          ctx.drawImage(this.enemy, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 50, this.y - 45, this.spriteWidth / 4, this.spriteHeight / 4);
     }
}

let enemies = [];
let enemyTimer = 0;
let enemyInterval = 1500 + Math.random() * 15000;

function enemyHandler(deltaTime){
     if(enemyTimer > enemyInterval){
         const enemy1 = new Enemy(enemyRed);
          const enemy2 = new Enemy(enemyBlack);
          const enemy3 = new Enemy(enemyBlue);
          const enemy4 = new Enemy(enemyPurple);
          const enemy5 = new Enemy(enemyGreen);
          const enemy6 = new Enemy(enemyYellow);
          const enemyArray = [enemy1, enemy2, enemy3,enemy4, enemy5, enemy6];
          let randomEnemy = Math.floor(Math.random() * enemyArray.length);
          enemies.push(enemyArray[randomEnemy]);
          enemyTimer = 0;
          if(randomEnemy < 2){               
               enemy1Sound.volume = 0.2;
               enemy1Sound.currentTime = 0;
               enemy1Sound.play();
           } else if(randomEnemy < 4){               
               enemy3Sound.volume = 0.2;
               enemy3Sound.currentTime = 0;
               enemy3Sound.play();
           }  else {               
               enemy5Sound.volume = 0.2;
               enemy5Sound.currentTime = 0;
               enemy5Sound.play();
           }
     }
     enemies.forEach(enemy => {
          enemy.update();
          enemy.draw();
     })
          enemies = enemies.filter(enemy => !enemy.markedForDeletion);                               
          enemyTimer += deltaTime;
     
}

//// background
const bgImage = document.getElementById('undersea_merzed');
const BG = {
     x1: 0,
     x2: 1768,
     y: 0,
     width: 1768,
     height: canvas.height
}
function backgroundHandler(){
     BG.x1 -= gameSpeed / 4;
     if(BG.x1 < - BG.width) BG.x1 = BG.width;
     BG.x2 -= gameSpeed / 4;
     if(BG.x2 < - BG.width) BG.x2 = BG.width;
     ctx.drawImage(bgImage, BG.x1, BG.y, BG.width, BG.height);
     ctx.drawImage(bgImage, BG.x2, BG.y, BG.width, BG.height);
}


function gameOverHandler(){
     ctx.fillStyle = '#222';
     ctx.font = '60px Arial';
    
     ctx.fillText('Oooops! Try Again', canvas.width /4 + 3, canvas.height / 2 + 3, 400, 100);
     ctx.fillStyle = '#fff';
     ctx.fillText('Oooops! Try Again', canvas.width /4, canvas.height / 2, 400, 100);
     gameOver = true;

     
     replayBtn.classList.add('show');
}

replayBtn.addEventListener('click', function(){
     if(gameOver = true){
         replayBtn.classList.remove('show');
          score = 0;
          enemyTimer = 0;
          deltaTime = 0;
          player.x = 0;
          player.y = canvas.height /2;
          enemies = [];
          gameFrame = 0;
          gameOver = false;
          animate(0);
     } 
})

const player = new Player();
let lastTime = 0;

function animate(timeStamp) {
     deltaTime = timeStamp - lastTime;
     lastTime = timeStamp;
     timer += deltaTime;
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     backgroundHandler();
     handleBubbles();
     trailHandler();
     player.draw();
     player.update();
     enemyHandler(deltaTime);
     handleScore();
     gameFrame++;
     if(!gameOver){
          bubblesBgm.volume = 0.1;
          bubblesBgm.play();
          requestAnimationFrame(animate);
     }          
}
animate(0);

window.addEventListener('resize', function(){
     canvasPos = canvas.getBoundingClientRect();
 })
 
