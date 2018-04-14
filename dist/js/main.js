!function(){var n={},i=[];function t(e){if(n[e])return n[e];var t=new Image;t.onload=function(){n[e]=t,o()&&i.forEach(function(e){e()})},n[e]=!1,t.src=e}function o(){var e=!0;for(var t in n)n.hasOwnProperty(t)&&!n[t]&&(e=!1);return e}window.Resources={load:function(e){e instanceof Array?e.forEach(function(e){t(e)}):t(e)},get:function(e){return n[e]},onReady:function(e){i.push(e)},isReady:o}}();var Engine=function(e){var t,n,i,o,r,a=e.document,l=e.window,s=a.getElementById("gameCanvas"),c=s.getContext("2d"),u=(n=83,i=101,o=[[0,0,0,0,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[2,2,2,2,2]],r=["images/water-block.png","images/stone-block.png","images/grass-block.png"],{numRows:function(){return o.length},numCols:function(){return o[0].length},getBlockWidth:function(){return i},getBlockHeight:function(){return n},getImage:function(e){return r[e]},getType:function(e,t){return o[e][t]},getBlock:function(e,t){return Math.floor(e/i)+(Math.floor(t/n)+1)*this.numCols()}});function g(){var n,e=Date.now();n=(e-t)/1e3,allEnemies.forEach(function(e,t){e.update(n,t),e.checkCollisions()}),player.update(),function(){var e,t;for(c.clearRect(0,0,s.width,s.height),e=0;e<u.numRows();e++)for(t=0;t<u.numCols();t++)c.drawImage(Resources.get(u.getImage(u.getType(e,t))),t*u.getBlockWidth(),e*u.getBlockHeight());allEnemies.forEach(function(e){e.render()}),player.render()}(),t=e,l.requestAnimationFrame(g)}s.width=u.numCols()*u.getBlockWidth(),s.height=(u.numRows()+1)*u.getBlockHeight(),Resources.load(["images/stone-block.png","images/water-block.png","images/grass-block.png","images/enemy-bug.png","images/char-boy.png"]),Resources.onReady(function(){t=Date.now(),g()}),e.ctx=c,e.ctx.tiles=u}(this),tiles=ctx.tiles;function getRandomInt(e,t){return Math.floor(Math.random()*Math.floor(t))+Math.floor(e)}var Enemy=function(){this.sprite="images/enemy-bug.png",this.x=this.getInitialX(),this.y=this.getInitialY(),this.velocity=getRandomInt(100,500)};Enemy.prototype.getInitialX=function(){return-tiles.getBlockWidth()/4},Enemy.prototype.getInitialY=function(){var e=tiles.getBlockHeight();return e*getRandomInt(1,tiles.numRows()-2)-e/4},Enemy.prototype.update=function(e,t){this.x+=this.velocity*e,this.x>ctx.canvas.width-tiles.getBlockWidth()/8&&allEnemies.splice(t,1)},Enemy.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y)},Enemy.prototype.checkCollisions=function(){tiles.getBlock(this.x,this.y)===player.getBlock()&&player.manageCollision()};var allEnemies=[new Enemy],manageEnemies=function(){1===getRandomInt(0,2)&&allEnemies.push(new Enemy)};setInterval(manageEnemies,250);var player=function(){var i=0,e=function(){return tiles.getBlockHeight()*(tiles.numCols()-2.5)},t=function(){return tiles.getBlockWidth()*tiles.numRows()/1.44},o=e(),r=t();return{getBlock:function(){return tiles.getBlock(o,r)},update:function(){document.getElementById("timer").innerHTML=timerVal,document.getElementById("score").innerHTML=i,r<tiles.getBlockHeight()/2&&setTimeout(function(){o=e(),r=t()},600)},handleInput:function(e){var t=tiles.getBlockHeight(),n=tiles.getBlockWidth();"up"===e&&t/2<r&&(r-=t)<t/2&&(i+=1),"down"===e&&r<t*(tiles.numRows()-2)&&(r+=t),"left"===e&&n/2<o&&(o-=n),"right"===e&&o<n*(tiles.numCols()-1)&&(o+=n)},reset:function(){o=e(),r=t(),i=0},render:function(){ctx.drawImage(Resources.get("images/char-boy.png"),o,r)},manageCollision:function(){o=e(),r=t()}}}(),timerVal=30;setInterval(function(){0===timerVal&&(timerVal=30,allEnemies=[],player.reset()),timerVal-=1},1e3),document.addEventListener("keyup",function(e){player.handleInput({37:"left",38:"up",39:"right",40:"down"}[e.keyCode])});