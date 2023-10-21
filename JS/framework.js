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

function Animator(animations){
    
    const [ firstItem ] = Object.values(animations);

    var animation = Animation()


    function play(name){
        animation.set_frames(animations[name]);
    }
    function update(dt){
        animation.update(dt)
    }
    function get_animation_frame(){
        return animation.get_frame()
    }
    return{
        play,
        update,
        get_animation_frame,
    }
}

function Animation(_frames,_duration,_loop){
    var frames = _frames||[];
    var loop = _loop || true;
    var duration = _duration || 0.15;
    var frame = 0;
    var time = 0;
    var onComplete = undefined;

    function update(dt){
        time += dt / 1000;
        if (time >= duration) {
            time = 0;
            frame++;

            if (frame >= frames.length) {
                if (loop) {
                    frame = 0;
                } else {
                    frame = frames.length - 1;
                    onComplete && onComplete();
                }
            }
        }
    }

    function set_frames(_frames){
        frames = _frames;
        frame = 0;
    }

    function get_frame(){
        return frames[frame]
    }


    return{
        update,
        set_frames,
        get_frame
    }
}

function Sprite(img, _width, _height, px = 0, py = 0){
    var image = img;
    var width = _width;
    var height = _height;
    var x = px;
    var y = py;
    var tx = 0;//texture x
    var ty = 0;
    var frame = 0;
    var col = image.naturalWidth / width;

    function set_position(_x,_y){
        this.x = _x;
        this.y = _y;
    }

    function set_image(img){
        this.image = img;
    }
    function set_frame(_frame){
        this.frame = _frame;
        this.tx = this.frame % col;
        this.ty = Math.floor(this.frame / col);
       
    }

    return{
       image, width,height,x,y,tx,ty,
       set_frame,set_position,set_image
    }
}

function Entity(config){

    var sprite = Sprite(config.image,config.width,config.height);
    var width = config.width;
    var height = config.height;
    var tile_x = config.tile_x;
    var tile_y = config.tile_y;

    return{
        sprite,
        tile_x,tile_y,
    }
}

function Character(config){
    
    var entity = Entity(config.entity);
    var animator = Animator(config.animations);
    var machine;

    function update(dt){
        animator.update(dt);
        entity.sprite.set_frame(animator.get_animation_frame());
        //console.log(animator.get_animation_frame(),entity.sprite.tx)
    }

   

    return{
        update,
        entity,
        animator,
    }
}



function move_behavior(tile_size){
    
}

function TileMap(){

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
function Renderer(config){
    var width = config.width || 320;
    var height = config.height || 2400;

    var backgroundColor = config.backgroundColor || "gray";
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.style.border = config.border || "2px dashed red";
    canvas.style.backgroundColor = backgroundColor;
    document.body.appendChild(canvas);
    var context = canvas.getContext("2d");
    function drawSprite(sprite){
        context.drawImage(sprite.image, sprite.tx * sprite.width, sprite.ty * sprite.height,
            sprite.width, sprite.height,
            sprite.x, sprite.y, sprite.width, sprite.height);
    }
    function drawCircle(){}
    function startDraw(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
    }
    function endDraw(){
        context.restore();
    }
    return{
        startDraw,
        endDraw,
        drawSprite,
        drawCircle
    }
}

function Tester(){

     
    var w = Keyboard(KEY.W);
    w.press = () => { console.log('w press');};

    function init(){
       
    }
    return{
        init,
    }
}
function Application(config){
    var name = config.name || 'Game App';
    document.title = name;
    var renderer = Renderer(config)

    let time_step = 1000 / 30;
    let last_time = null;
    let total_time = 0;
    let accumulated_lag = 0;
    let number_of_updates = 0;

    var assets = Assets();
    var hero;
    var w = Keyboard(KEY.W);
    var a = Keyboard(KEY.A);
    var s = Keyboard(KEY.S);
    var d = Keyboard(KEY.D);
    function test1(){
        assets.add("walk", "./images/walk_cycle.png");
        assets.load();
        assets.onComplete = () => {
            characters.hero.entity.image = assets.get(characters.hero.entity.image);
            hero = Character(characters.hero)
            hero.animator.play('up')
            loop();
        }
       
        w.press = () => { hero.animator.play('up') };
        s.press = () => { hero.animator.play('down') };
        a.press = () => { hero.animator.play('left') };
        d.press = () => { hero.animator.play('right') };
    }
   
    
    function start(){
        console.log('app start...');
        test1()
        // loop();
    }

    function loop(){
       
        let current_time = window.performance.now()
        if (last_time === null) last_time = current_time;
        const delta_time = current_time - last_time;
        total_time += delta_time;
        accumulated_lag += delta_time;
        last_time = current_time;
        while (accumulated_lag >= time_step) {
            accumulated_lag -= time_step;
            update(time_step);

            if (number_of_updates++ >= 300) {
                number_of_updates = 0;
                console.log("300");
                // readCurrencyValueFromLocalStorage();
                break;
            }
        }
        render(time_step)
        requestAnimationFrame(loop)
       
        
    }
    function update(dt){
        //console.log('update:' + dt)
        hero.update(dt)
    }   
    function render(dt){
        
        renderer.startDraw();

        renderer.drawSprite(hero.entity.sprite)
        renderer.endDraw();
    }

    return{
        start ,
      
    }
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

    
        console.log('key init')
        window.addEventListener(
            "keydown", key.down.bind(key), false
        );
        window.addEventListener(
            "keyup", key.up.bind(key), false
        );

    
   
    return key
 
}

