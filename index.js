const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

wallpaperColor = "#640d95";

windowBackgroundColor = "#9c9c9c";
windowBarColor = "#6d6d6d";
windowBarHeight = 24;
windowBarButtonWidth = 24;

var mouseX = 0;
var mouseY = 0;

ctx.font = "16px IBM Plex Mono, monospace";

class Component{
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.hoverLast = false;
        this.parent = null;
    }
    draw(offsetX, offsetY){

    }
    onHover(){
        
    }
    exitHover(){
        
    }
    onClick(){
        
    }
}

class Button extends Component{
    constructor(x, y, width, height, onClickEvent, color, text) {
        super(x,y,width,height,color);
        this.onClickEvent = onClickEvent;
        this.text = text;
    }
    onHover(){
        canvas.style.cursor = "pointer";
    }
    exitHover(){
        canvas.style.cursor = "inherit";
    }
    onClick(){
        if (this.onClickEvent != null){
            this.onClickEvent();
        }
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.color);
        drawText(this.x + offsetX, this.y + offsetY, this.text, "#ffffff");
    }
}

class Rect extends Component{
    constructor(x, y, width, height, color){
        super(x,y,width,height,color);
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.color);
    }
}

class Label extends Component{
    constructor(x, y, width, height, textColor, backgroundColor, text){
        super(x,y,width,height,textColor);
        this.backgroundColor = backgroundColor;
        this.text = text
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.backgroundColor);
        drawText(this.x + offsetX, this.y + offsetY, this.text, this.color)
    }
}

class Program{
    constructor(name){
        this.name = name;
        this.width = 500;
        this.height = 328;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.components = [];
        
        // components for top bar:
        this.addComponent(new Button(this.width - windowBarButtonWidth * 2, -windowBarHeight, windowBarButtonWidth, windowBarHeight, this.minimize, windowBarColor," -"));
        this.addComponent(new Button(this.width - windowBarButtonWidth, -windowBarHeight, windowBarButtonWidth, windowBarHeight, this.exit, "#ff0000"," X"));
        this.addComponent(new Label(0, -windowBarHeight, this.width, windowBarHeight, "#ffffff", windowBarColor, this.name));
    }
    exit(){
        for (let index = this.parent.components.length - 1; index >= 0; index--) {
            const component = this.parent.components[index];
            component.exitHover();
        }
        selectedProgram = null;
        programs.splice(programs.indexOf(this.parent,1));
    }
    minimize(){
        this.parent.y = canvas.height * 2;
        selectedProgram = null;
    }
    drawRect(x, y, width, height, color){
        drawRect(x + this.x, y + this.y, width, height, color);
        drawRect(x + this.x, y + this.y, width, height, color);
    }
    drawText(x, y, text, color){
        drawText(x + this.x, y + this.y, text, color);
    }
    addComponent(component){
        component.parent = this;
        this.components.push(component);
    }
    update(){
        
    }
    moveTo(x, y){
        this.x = x;
        this.y = y;
    }
    draw(){
        this.drawRect(0, 0, this.width, this.height, windowBackgroundColor);

        for (let index = this.components.length - 1; index >= 0; index--) {
            const component = this.components[index];
            component.draw(this.x, this.y);
        }
    }
    onOpen(){
        
    }
}

class TestApp extends Program{
    constructor(){
        super("Testing App");
        this.loadComponents();
    }
    testButton(){
        console.log("hi");
    }
    loadComponents(){
        this.addComponent(new Button(0,0,40,40,this.testButton,"#333333","Test"))
    }
    onOpen(){

    }
}

var allPrograms = [new TestApp()]
var programs = allPrograms
var selectedProgram = null;

function update() {
    clearScreen(wallpaperColor);
    for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        program.draw();
    }
    if (selectedProgram != null){
        selectedProgram.update();
    }
    requestAnimationFrame(update);
}

function clearScreen(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawText(x, y, text, color){
    ctx.fillStyle = color;
    ctx.fillText(text, x, y+16);
}

function handleMouseMove(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
    for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        for (let index = 0; index < program.components.length; index++) {
            const component = program.components[index];
            let x = component.x + program.x;
            let y = component.y + program.y;

            if (
                mouseX >= x &&
                mouseX < x+component.width &&
                mouseY >= y &&
                mouseY < y+component.height
            ){
                component.onHover();
                component.hoverLast = true;
            }else if (component.hoverLast){
                component.exitHover();
                component.hoverLast = false;
            }
        }
    }
}

function getHoveredComponent(){
    for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        for (let index = 0; index < program.components.length; index++) {
            const component = program.components[index];
            let x = component.x + program.x;
            let y = component.y + program.y;

            if (
                mouseX >= x &&
                mouseX < x+component.width &&
                mouseY >= y &&
                mouseY < y+component.height
            ){
                return component;
            }
        }
    }
}

function handleMouseDown(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    var component = getHoveredComponent();
    if (event.button === 0){
        if (component != null){
            component.onClick();
        }
    } else if (event.button === 2){

    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.font = "16px IBM Plex Mono, monospace";
    clearScreen(wallpaperColor);
});


canvas.addEventListener('mousemove', handleMouseMove, false);
canvas.addEventListener('mousedown', handleMouseDown);

requestAnimationFrame(update);