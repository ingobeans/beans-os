const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

wallpaperColor = "#20873F";
document.body.style.backgroundColor = wallpaperColor;

windowBackgroundColor = "#9c9c9c";
windowBarColor = "#6d6d6d";
windowBorderWith = 1;
taskbarColor = "#131E16";

homeIcon = new Image();
homeIcon.src = "assets/home.png"

taskbarHeight = 48;

topbarHeight = 24;
topbarButtonWidth = 24;

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

        this.onHoverEvent = null;
        this.onExitHoverEvent = null;
        this.onClickEvent = null;
        this.onReleaseEvent = null;

        this.hoverLast = false;
        this.parent = null;
    }
    draw(offsetX, offsetY){

    }
    update(){

    }
    onHover(){
        if(this.onHoverEvent != null){
            this.onHoverEvent();
        }
    }
    exitHover(){
        if(this.onExitHoverEvent != null){
            this.onExitHoverEvent();
        }
    }
    onRelease(){
        if(this.onReleaseEvent != null){
            this.onReleaseEvent();
        }
    }
    onClick(){
        if(this.onClickEvent != null){
            this.onClickEvent();
        }
    }
}

class Button extends Component{
    constructor(x, y, width, height, onClickEvent, color, text) {
        super(x, y, width, height, color);
        this.onClickEvent = onClickEvent;
        this.text = text;
    }
    onHover(){
        canvas.style.cursor = "pointer";
    }
    exitHover(){
        canvas.style.cursor = "inherit";
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
        this.text = text;
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.backgroundColor);
        drawText(this.x + offsetX, this.y + offsetY, this.text, this.color);
    }
}

class Topbar extends Label{
    // a regular label but has mouse events to allow dragging the window
    constructor(x, y, width, height, textColor, backgroundColor, text){
        super(x,y,width,height,textColor);
        this.backgroundColor = backgroundColor;
        this.text = text;

        this.pressing = false;
        this.startPressMouseX = 0;
        this.startPressMouseY = 0;
        this.startPressWindowX = 0;
        this.startPressWindowY = 0;
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.backgroundColor);
        drawText(this.x + offsetX, this.y + offsetY, this.text, this.color);
    }
    update(){
        if (this.pressing){
            this.parent.x = mouseX - this.startPressMouseX + this.startPressWindowX;
            this.parent.y = mouseY - this.startPressMouseY + this.startPressWindowY;
        }
    }
    onClick(){
        this.pressing = true;
        this.startPressMouseX = mouseX;
        this.startPressMouseY = mouseY;
        this.startPressWindowX = this.parent.x;
        this.startPressWindowY = this.parent.y;
    }
    onRelease(){
        this.pressing = false;
        this.startPressMouseX = 0;
        this.startPressMouseY = 0;
        this.startPressWindowX = 0;
        this.startPressWindowY = 0;
    }
}

class Program{
    constructor(name,icon){
        this.name = name;
        this.width = 500;
        this.height = 328;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.minimized = false;
        this.preMinimizedPosX = 0
        this.preMinimizedPosY = 0
        this.components = [];
        
        // components for top bar:
        this.addComponent(new Button(this.width - topbarButtonWidth * 2, -topbarHeight, topbarButtonWidth, topbarHeight, this.minimize, windowBarColor," -"));
        this.addComponent(new Button(this.width - topbarButtonWidth, -topbarHeight, topbarButtonWidth, topbarHeight, this.exit, "#ff0000"," X"));
        this.addComponent(new Topbar(0, -topbarHeight, this.width, topbarHeight, "#ffffff", windowBarColor, this.name));

        this.iconSrc = icon;
        this.icon = new Image();
        this.icon.src = this.iconSrc;
    }
    exit(){
        for (let index = this.parent.components.length - 1; index >= 0; index--) {
            const component = this.parent.components[index];
            component.exitHover();
        }
        selectedProgram = null;

        console.log("removing " + this.parent.name);
        console.log("removing " + this.parent.name);

        programs.splice(programs.indexOf(this.parent),1);
        taskbarPrograms.splice(taskbarPrograms.indexOf(this.parent),1);
    }
    maximize(){
        this.minimized = false;
        this.x = this.preMinimizedPosX;
        this.y = this.preMinimizedPosY;
    }
    minimize(){
        for (let index = 0; index < this.parent.components.length; index++) {
            const component = this.parent.components[index];
            component.exitHover();
        }
        this.parent.preMinimizedPosX = this.parent.x;
        this.parent.preMinimizedPosY = this.parent.y;

        this.parent.y = canvas.height * 2;
        selectedProgram = null;
        this.parent.minimized = true;
    }
    drawRect(x, y, width, height, color){
        drawRect(x + this.x, y + this.y, width, height, color);
        drawRect(x + this.x, y + this.y, width, height, color);
    }
    drawText(x, y, text, color){
        drawText(x + this.x, y + this.y, text, color);
    }
    drawSprite(x, y, width, height, image) {
        drawSprite(x + this.x, y + this.y, width, height, image);
    }
    addComponent(component){
        component.parent = this;
        this.components.push(component);
    }
    update(){
        for (let index = this.components.length - 1; index >= 0; index--) {
            const component = this.components[index];
            component.update();
        }
    }
    moveTo(x, y){
        this.x = x;
        this.y = y;
    }
    draw(){
        this.drawRect(- windowBorderWith, - windowBorderWith - topbarHeight, this.width + windowBorderWith * 2, this.height + windowBorderWith * 2 + topbarHeight, "#000000");
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
        super("Testing App","assets/testingapp.png");
        this.onOpen();
    }
    testButton(){
        this.parent.presses += 1;
        this.parent.textLabel.text = "Presses: " + this.parent.presses.toString();
    }
    onOpen(){
        this.textLabel = new Label(0,80,90,40,"#ffffff",windowBackgroundColor,"Presses: 0");
        this.presses = 0;

        this.addComponent(this.textLabel);
        this.addComponent(new Button(0,0,40,40,this.testButton,"#333333","Test"))
    }
}

class TestApp2 extends Program{
    constructor(){
        super("Testing App 2","assets/testingapp2.png");
        this.onOpen();
    }
    onOpen(){
        this.textLabel = new Label(0,80,90,40,"#ffffff",windowBackgroundColor,"howdy world");
        this.addComponent(this.textLabel);
    }
}

var allPrograms = [new TestApp(), new TestApp(), new TestApp2()];

var programs = allPrograms;
var taskbarPrograms = [...programs];
// an identical list to programs of value
// but isnt reordered whenever you select a program
// so that the programs dont move in the taskbar whenever you select a new program

var selectedProgram = programs[0];

function update() {
    clearScreen(wallpaperColor);

    // draw taskbar
    drawRect(0, canvas.height - taskbarHeight, canvas.width, taskbarHeight, taskbarColor);
    drawSprite(5, canvas.height - taskbarHeight + 4,40,40,homeIcon);

    for (let index = programs.length - 1; index >= 0; index--) {
        const program = programs[index];
        program.draw();
    }

    for (let index = 0; index < taskbarPrograms.length; index++) {
        const program = taskbarPrograms[index];

        // draw taskbar icon
        drawSprite(index * 60 + 65, canvas.height - taskbarHeight + 4,40,40,program.icon);
        if (selectedProgram == program){
            drawRect(index * 60 + 65, canvas.height - taskbarHeight + 4, 8, 8, "#ff0000")
        }
    }
    
    if (selectedProgram != null){
        selectedProgram.update();
        drawText(20,20,selectedProgram.name,"#ffffff"); // for debug, write the name of the selected program
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

function drawSprite(x, y, width, height, image) {
    ctx.drawImage(image, x, y, width, height);
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
    if (selectedProgram == null){
        return null;
    }
    for (let index = 0; index < selectedProgram.components.length; index++) {
        const component = selectedProgram.components[index];
        let x = component.x + selectedProgram.x;
        let y = component.y + selectedProgram.y;

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

function getHoveredProgram(){
    for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        if (
            mouseX >= program.x &&
            mouseX < program.x + program.width &&
            mouseY >= program.y - topbarHeight &&
            mouseY < program.y + program.height
        ){
            return program;
        }
    }
    return null;
}

function getHoveredTaskbarIcon(){
    for (let index = 0; index < taskbarPrograms.length; index++) {
        const program = taskbarPrograms[index];
        if (
            mouseX >= index * 60 + 65 &&
            mouseX < index * 60 + 65 + 40
        ){
            return program;
        }
    }
    return null;
}

function moveElementToStart(index) {
    if (Array.isArray(programs) && index >= 0 && index < programs.length) {
      const elementToMove = programs.splice(index, 1)[0];
      programs.unshift(elementToMove);
    } else {
      console.error("Invalid index or 'programs' is not an array");
    }
}

function selectProgram(program){
    selectedProgram = program;
    moveElementToStart(programs.indexOf(program));
}

function handleMouseDown(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    selectProgram(getHoveredProgram());

    var component = getHoveredComponent();

    if (event.button === 0){
        if (component != null){
            component.onClick();
        }else {
            // this means we press somewhere on the desktop
            // check for taskbar icon press

            if (mouseY >= canvas.height - taskbarHeight){
                // mouse in the taskbar area
                var program = getHoveredTaskbarIcon();
                if (program != null){
                    selectProgram(program);
                    
                    if (program.minimized){
                        program.maximize();
                    }
                }
            }
        }
    } else if (event.button === 2){

    }
}
function handleMouseUp(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    var component = getHoveredComponent();
    if (event.button === 0){
        if (component != null){
            component.onRelease();
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
canvas.addEventListener('mouseup', handleMouseUp);

requestAnimationFrame(update);