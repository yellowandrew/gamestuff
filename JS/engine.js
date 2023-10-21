var KEY = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
    A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
    TILDA: 192
}
var behaviors={
    // 'wait':wait,
    // 'move':move
}
var entities={
    hero:{
        image:"walk",
        width:16,
        height:24,
        tile_x:10,
        tile_y:10,
    }
}
var characters ={
    hero:{
        entity:entities.hero,
        animations:{
            'up':[0+16, 1+16, 2+16, 3+16],
            'left':[12+16, 13+16, 14+16, 15+16],
            'right':[4+16, 5+16, 6+16, 7+16],
            'down':[8+16, 9+16, 10+16, 11+16],
        }
    },
    npc:{

    },
}
function Keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.down = function (event) {

        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }

        event.preventDefault();
    };

    key.up = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    
        
        window.addEventListener(
            "keydown", key.down.bind(key), false
        );
        window.addEventListener(
            "keyup", key.up.bind(key), false
        );

    
   
    return key
 
}
function Assets(){
    var toLoad = 0;
    var loaded = 0;
    var imageExtensions = ["png", "jpg", "gif"];
    var fontExtensions = ["ttf", "otf", "ttc", "woff"];
    var jsonExtensions = ["json"];
    var audioExtensions = ["mp3", "ogg", "wav", "webm"];

    var sources = [];
    var dicts = {};
    var onComplete = undefined;
    function add(name, path) {
        sources.push({ name, path })
        toLoad++;
    }

    function progress() {
        return loaded / toLoad;
    }

    function load() {
        let promises = [];
        sources.forEach(source => {
            let extension = source.path.split(".").pop();
            if (imageExtensions.find(x => x === extension)) {
                let p = loadImage(source.path)
                    .then(img => {
                        dicts[source.name] = img;
                        loaded++;
                        console.log('load:(' + loaded + "){" + source.path + '}-> ' + progress() * 100 + '%')
                    })
                    .catch(err => console.log(err))
                promises.push(p);
            }
            //Load fonts 
            else if (fontExtensions.find(x => x === extension)) {
                let p = loadFont(source.path);
            }
            //Load JSON files  
            else if (jsonExtensions.find(x => x === extension)) {
                let p = loadJson(source.path).then(xhr => {
                    if (xhr.status === 200) {
                        loaded++;
                        console.log('load:(' + loaded + "){" + source.path + '}-> ' + progress() * 100 + '%')
                        //Convert the JSON data file into an ordinary object
                        let file = JSON.parse(xhr.responseText);
                        dicts[source.name] = file;

                    }
                })
                    .catch(err => console.log(err))
                promises.push(p);
            }
            //Load audio files  
            else if (audioExtensions.find(x => x === extension)) {
                let p = loadSound(source.path);
            }

        })
        // 全部加载完
        Promise.all(promises).then(() => {
            console.log("Assets finished loading");
            this.onComplete()
        }).catch(error => { console.log(error) })

    }
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        })
    }

    function loadJson(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "text";
            xhr.onload = () => resolve(xhr);
            xhr.onerror = reject;
            xhr.send();
        })
    }
    function loadFont(url) {
        return new Promise((resolve, reject) => {
            let fontFamily = url.split("/").pop().split(".")[0];
            //Append an `@afont-face` style rule to the head of the HTML
            //document. It's kind of a hack, but until HTML5 has a
            //proper font loading API, it will do for now
            let newStyle = document.createElement("style");
            let fontFace = "@font-face {font-family: '" + fontFamily + "'; src: url('" + source + "');}";
            newStyle.appendChild(document.createTextNode(fontFace));
            document.head.appendChild(newStyle);
        })
    }
    function loadSound(url) {
        return new Promise((resolve, reject) => {

        })
    }

    function get(name) {
        return dicts[name]
    }
    return {
        add,
        load,
        onComplete,
        get,
    }
}
class Animation{
    constructor(frames,duration,loop){
        this.frames = frames||[];
        this.loop = loop || true;
        this.duration = duration || 0.15;
        this.frame = 0;
        this.time = 0;
        this.onComplete = undefined;
    }
    update(dt){
        this.time += dt / 1000;
        if (this.time >= this.duration) {
            this.time = 0;
            this.frame++;

            if (this.frame >= this.frames.length) {
                if (this.loop) {
                    this.frame = 0;
                } else {
                    this.frame = this.frames.length - 1;
                    this.onComplete && this.onComplete();
                }
            }
        }
    }

    set_frames(frames){
        this.frames = frames;
        this.frame = 0;
    }

    get_frame(){
        return this.frames[this.frame]
    }

}
class Animator{
    constructor(animations){
        //const [ firstItem ] = Object.values(animations);
        this.animation =new Animation()
        this.animations = animations;
    }

    play(name){
        this.animation.set_frames(this.animations[name]);
    }
    update(dt){
        this.animation.update(dt)
    }
    get_animation_frame(){
        return this.animation.get_frame()
    }
}
class Sprite{
    constructor(image, width, height, px = 0, py = 0){
        this.image = image;
        this.width = width;
        this.height = height;
        this.x = px;
        this.y = py;
        this.tx = 0;//texture x
        this.ty = 0;
        this.rame = 0;
        this.col = image.naturalWidth / width;
    }

    set_position(x,y){
        this.x = x;
        this.y = y;
    }

    set_image(image){
        this.image = image;
    }
    set_frame(frame){
        this.frame = frame;
        this.tx = this.frame % this.col;
        this.ty = Math.floor(this.frame / this.col);
       
    }
}
class Entity{
    constructor(config){
        this.sprite =new Sprite(config.image,config.width,config.height);
        this.width = config.width;
        this.height = config.height;
        this.tile_x = config.tile_x;
        this.tile_y = config.tile_y;
    }
    

   
}
class Character{
    constructor(config){
        this.entity = new Entity(config.entity);
        this.animator = new Animator(config.animations);
        var controller;

    }
    update(dt){
        this.animator.update(dt);
        this.entity.sprite.set_frame(this.animator.get_animation_frame());
        //console.log(animator.get_animation_frame(),entity.sprite.tx)
    }
}
class Renderer{
    constructor(config){
        this.width = config.width || 320;
        this.height = config.height || 2400;

        this.backgroundColor = config.backgroundColor || "gray";
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        this.canvas.style.border = config.border || "2px dashed red";
        this.canvas.style.backgroundColor = this.backgroundColor;
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
    }
    drawSprite(sprite){
        this.context.drawImage(sprite.image, sprite.tx * sprite.width, sprite.ty * sprite.height,
            sprite.width, sprite.height,
            sprite.x, sprite.y, sprite.width, sprite.height);
    }
    drawCircle(){}
    startDraw(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
    }
    endDraw(){
        this.context.restore();
    }
}




class Game{
    constructor(config){
        var name = config.name || 'Game';
        document.title = name;
        this.time_step = 1000 / 30;
        this.last_time = null;
        this.total_time = 0;
        this.accumulated_lag = 0;
        this.number_of_updates = 0;
        this.renderer =new Renderer(config);
    }
    init(){
        console.log('game init')
        this.assets = Assets();
        this.hero = null;
        this.w = Keyboard(KEY.W);
        this.a = Keyboard(KEY.A);
        this.s = Keyboard(KEY.S);
        this.d = Keyboard(KEY.D);
        
        this.assets.add("walk", "./images/walk_cycle.png");
        this. assets.load();
        this.assets.onComplete = () => {
            characters.hero.entity.image = this.assets.get(characters.hero.entity.image);
            this.hero = new Character(characters.hero)
            this.hero.animator.play('up')
            this.loop();
        }
       
        this.w.press = () => { this.hero.animator.play('up') };
        this.s.press = () => { this.hero.animator.play('down') };
        this.a.press = () => { this.hero.animator.play('left') };
        this.d.press = () => { this.hero.animator.play('right') };
        
        
        
       // this.loop()
    }

    loop(){
        
        let current_time = window.performance.now()
        if (this.last_time === null) this.last_time = this.time_step;
        const delta_time = current_time - this.last_time;
        this.total_time += delta_time;
        this.accumulated_lag += delta_time;
        this.last_time = current_time;
       
        while (this.accumulated_lag >= this.time_step) {
            this.accumulated_lag -= this.time_step;
            this.update(this.time_step);

            if (this.number_of_updates++ >= 300) {
                this.number_of_updates = 0;
                console.log("300");
                // readCurrencyValueFromLocalStorage();
                break;
            }
        }
        this.render(this.time_step)
        requestAnimationFrame(this.loop.bind(this));
        
    }

    update(dt){
        //console.log('update:' + dt)
        this.hero.update(dt)
    }   
    render(dt){
        
         this.renderer.startDraw();
         this.renderer.drawSprite(this.hero.entity.sprite)
         this.renderer.endDraw();
    }

    // startLoop(){
    //     const step =()=>{
    //       //update... 
    //         requestAnimationFrame(()=>{step();})
    //     }
    //     step();
    // }
}