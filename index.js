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

currentCursor = "inherit";

resizeWindowHoverSize = 4;
resizingWindow = false;
resizeStartX = 0;
resizeStartY = 0;
resizeStartProgramX = 0;
resizeStartProgramY = 0;
resizeStartWidth = 0;
resizeStartHeight = 0;
resizeActiveProgram = null;
resizeDirection = "";

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
    constructor(x, y, width, height, onClickEvent, color, text, hoveredColor = "#000000") {
        super(x, y, width, height, color);
        this.onClickEvent = onClickEvent;
        this.text = text;
        this.hovered = false;
        this.hoveredColor = hoveredColor;
    }
    onHover(){
        currentCursor = "pointer";
        this.hovered = true;
    }
    exitHover(){
        currentCursor = "inherit";
        this.hovered = false;
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.hovered ? this.hoveredColor : this.color);
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
    constructor(name,icon,resizable,hasTopbar){
        this.name = name;
        this.width = 500;
        this.height = 328;
        this.minWidth = 200;
        this.minHeight = 128;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.resizable = resizable
        this.minimized = false;
        this.hasTopbar = hasTopbar;
        this.preMinimizedPosX = 0;
        this.preMinimizedPosY = 0;
        this.components = [];
        this.parent = this;
        
        if (this.hasTopbar){
            this.addTopbar();
        }

        this.iconSrc = icon;
        this.icon = new Image();
        this.icon.src = this.iconSrc;
    }
    onSelect(){

    }
    onSelectionLost(){

    }
    addTopbar(){
        var minimizeButton = new Button(this.width - topbarButtonWidth * 2, -topbarHeight, topbarButtonWidth, topbarHeight, this.minimize, windowBarColor," -");
        minimizeButton.parent = this;
        
        var exitButton = new Button(this.width - topbarButtonWidth, -topbarHeight, topbarButtonWidth, topbarHeight, this.exit, "#ff0000"," X");
        exitButton.parent = this;
        
        var topbar = new Topbar(0, -topbarHeight, this.width, topbarHeight, "#ffffff", windowBarColor, this.name);
        topbar.parent = this;
        

        this.components.splice(0,3,minimizeButton,exitButton,topbar)
    }
    exit(){
        for (let index = this.parent.components.length - 1; index >= 0; index--) {
            const component = this.parent.components[index];
            component.exitHover();
        }
        selectProgram(null);

        programs.splice(programs.indexOf(this.parent),1);
        taskbarPrograms.splice(taskbarPrograms.indexOf(this.parent),1);

        updateHoveredComponents();
    }
    maximize(){
        this.minimized = false;
        this.x = this.preMinimizedPosX;
        this.y = this.preMinimizedPosY;
        
        updateHoveredComponents();
    }
    minimize(){
        for (let index = 0; index < this.parent.components.length; index++) {
            const component = this.parent.components[index];
            component.exitHover();
        }
        this.parent.preMinimizedPosX = this.parent.x;
        this.parent.preMinimizedPosY = this.parent.y;

        this.parent.y = canvas.height * 2;
        selectProgram(null, true);
        this.parent.minimized = true;

        updateHoveredComponents();
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
    resize(width,height){
        if (width < this.minWidth){
            width = this.minWidth;
        }
        if (height < this.minHeight){
            height = this.minHeight;
        }
        this.width = width;
        this.height = height;

        if (this.hasTopbar){
            this.addTopbar();
        }
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
        var topbarOffset = this.hasTopbar ? topbarHeight : 0;
        this.drawRect(- windowBorderWith, - windowBorderWith - topbarOffset, this.width + windowBorderWith * 2, this.height + windowBorderWith * 2 + topbarOffset, "#000000");
        // draw a slightly larger border if program has topbar, to include it

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
        super("Testing App","assets/testingapp.png", true, true);
        this.onOpen();
    }
    testButton(){
        this.parent.presses += 1;
        this.parent.resize(500+this.parent.presses*4,328);
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
        super("Testing App 2","assets/testingapp2.png", true, false);
        this.onOpen();
    }
    onSelectionLost(){
        this.textLabel.text = "hey, stop ignoring me!";
    }
    onSelect(){
        this.textLabel.text = "hello there!";
    }
    onOpen(){
        this.textLabel = new Label(0,80,90,40,"#ffffff",windowBackgroundColor,"howdy world");
        this.addComponent(this.textLabel);
    }
}

class AppMenu extends Program{
    constructor(){
        super("App Menu","assets/home.png", false, false);
        this.reload()
    }
    onSelectionLost(){
        this.minimize();
    }
    onProgramClicked(){
        launchProgram(this.programClass);
    }
    onSelect(){
        this.components = [];
        for (let index = 0; index < allPrograms.length; index++) {
            const program = allPrograms[index];
            var button = new Button(0,index * 24, this.width,24,this.onProgramClicked,windowBackgroundColor,program.name);
            button.programClass = program;
            this.addComponent(button);
        }
    }
    reload(){
        this.width = 100;
        this.height = allPrograms.length * 24 + 48;
        this.minimized = true;
        this.preMinimizedPosX = 0;
        this.preMinimizedPosY = canvas.height - this.height - taskbarHeight;
        this.x = 0;
        this.y = canvas.height * 2;
    }
}

function registerProgram(program){
    allPrograms.push(program);
    activeAppMenu.reload();
}

function launchProgram(program){
    var programInstance = new program();
    var x = canvas.width / 2 - programInstance.width / 2;
    var y = canvas.height / 2 - programInstance.height / 2;
    var foundValid = false;

    while (!foundValid){
        var match = false;
        for (let index = 0; index < programs.length; index++) {
            const program = programs[index];
            if (program.x == x && program.y == y){
                match = true;
            }
        }
        if (!match){
            foundValid = true;
            break;
        }
        x += 24;
        y += 24;
    }

    programInstance.x = x;
    programInstance.y = y;

    programs.unshift(programInstance);
    taskbarPrograms.push(programInstance);
    selectProgram(programInstance);
}

var allPrograms = [TestApp, TestApp2];

activeAppMenu = new AppMenu();
var programs = [activeAppMenu];
var taskbarPrograms = [...programs];
// an identical list to programs of value
// but isnt reordered whenever you select a program
// so that the programs dont move in the taskbar whenever you select a new program

var selectedProgram = null;

function update() {
    clearScreen(wallpaperColor);

    // draw taskbar
    drawRect(0, canvas.height - taskbarHeight, canvas.width, taskbarHeight, taskbarColor);

    if (resizingWindow){
        var differenceX = mouseX - resizeStartX;
        var differenceY = mouseY - resizeStartY;
        
        if (resizeDirection == "s-resize" || resizeDirection == "n-resize"){
            differenceX = 0;
        }
        else if (resizeDirection == "e-resize" || resizeDirection == "w-resize"){
            differenceY = 0;
        }
        if (resizeDirection == "n-resize" || resizeDirection == "w-resize" || resizeDirection == "nw-resize"){
            differenceX *= -1;
            differenceY *= -1;
        }
        
        resizeActiveProgram.resize(resizeStartWidth + differenceX, resizeStartHeight + differenceY);
        if (resizeDirection == "n-resize" || resizeDirection == "w-resize" || resizeDirection == "nw-resize"){
            offsetX = differenceX;
            offsetY = differenceY;

            if (resizeActiveProgram.width - resizeActiveProgram.minWidth <= 0){
                offsetX = (resizeStartWidth - resizeActiveProgram.width)*-1;
            }
            if (resizeActiveProgram.height - resizeActiveProgram.minHeight <= 0){
                offsetY = (resizeStartHeight - resizeActiveProgram.height)*-1;
            }

            resizeActiveProgram.x = resizeStartProgramX - offsetX;
            resizeActiveProgram.y = resizeStartProgramY - offsetY;
        }
        
    }

    for (let index = 0; index < taskbarPrograms.length; index++) {
        const program = taskbarPrograms[index];

        // draw taskbar icon
        drawSprite(index * 60 + 5, canvas.height - taskbarHeight + 4,40,40,program.icon);
        if (selectedProgram == program){
            drawRect(index * 60 + 5, canvas.height - taskbarHeight + 4, 8, 8, "#ff0000")
        }
    }

    for (let index = programs.length - 1; index >= 0; index--) {
        const program = programs[index];
        program.draw();
    }
    
    if (selectedProgram != null){
        selectedProgram.update();
        drawText(20,20,selectedProgram.name,"#ffffff"); // for debug, write the name of the selected program
    }
    
    canvas.style.cursor = currentCursor;
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

function updateHoveredComponents(){
    var hoveredProgram = getHoveredProgram();

    for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        if (hoveredProgram != null && program != hoveredProgram){
            continue;
        }
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

function isInRange(value, min, max) {
    return value >= min && value < max;
}

function getWindowCornerHovered() {
    var hoveredProgram = getHoveredProgram();
    
    for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        if (!program.resizable) continue;
        if (hoveredProgram != null && program != hoveredProgram){
            continue;
        }

        const topbarOffset = program.hasTopbar ? topbarHeight : 0;
        const nearBottom = isInRange(mouseY, program.y + program.height - resizeWindowHoverSize, program.y + program.height + resizeWindowHoverSize) && isInRange(mouseX, program.x - resizeWindowHoverSize, program.x + program.width + resizeWindowHoverSize);
        const nearRight = isInRange(mouseX, program.x + program.width - resizeWindowHoverSize, program.x + program.width + resizeWindowHoverSize) && isInRange(mouseY, program.y - topbarOffset - resizeWindowHoverSize, program.y + program.height + resizeWindowHoverSize);
        const nearTop = isInRange(mouseY, program.y - topbarOffset - resizeWindowHoverSize, program.y - topbarOffset + resizeWindowHoverSize) && isInRange(mouseX, program.x - resizeWindowHoverSize, program.x + program.width + resizeWindowHoverSize);
        const nearLeft = isInRange(mouseX, program.x - resizeWindowHoverSize, program.x + resizeWindowHoverSize) && isInRange(mouseY, program.y - topbarOffset - resizeWindowHoverSize, program.y + program.height + resizeWindowHoverSize);

        if (nearBottom && nearRight) {
            return ["se-resize", program];
        } else if (!nearTop && nearRight) {
            return ["e-resize", program];
        } else if (nearBottom && !nearRight && !nearLeft) {
            return ["s-resize", program];
        } else if (nearTop && nearLeft) {
            return ["nw-resize", program];
        } else if (nearTop && !nearRight && !nearLeft) {
            return ["n-resize", program];
        } else if (!nearBottom && nearLeft) {
            return ["w-resize", program];
        }
    }
    return ["inherit", null];
}

function handleMouseMove(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (resizingWindow){
        currentCursor = resizeDirection;
        return;
    }
    var cursor = getWindowCornerHovered()[0];
    
    currentCursor = cursor;
    updateHoveredComponents();
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
        var topbarOffset = program.hasTopbar ? topbarHeight : 0;
        if (
            mouseX >= program.x &&
            mouseX < program.x + program.width &&
            mouseY >= program.y - topbarOffset &&
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
            mouseX >= index * 60 + 5 &&
            mouseX < index * 60 + 5 + 40
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

function selectProgram(program,skipCallingOnSelectionLost = false){
    if (selectedProgram == program){
        return;
    }
    if (selectedProgram != null && !skipCallingOnSelectionLost){
        selectedProgram.onSelectionLost();
    }
    selectedProgram = program;
    if (program != null){
        moveElementToStart(programs.indexOf(program));
        program.onSelect();
    }
}

function handleMouseDown(event) {
    event.preventDefault();
    mouseX = event.clientX;
    mouseY = event.clientY;

    hoveredProgram = getHoveredProgram()
    if (hoveredProgram != null){
        selectProgram(hoveredProgram);
    }else {
        selectProgram(null);;
    }

    var component = getHoveredComponent();

    if (event.button === 0){
        // this means we press somewhere on the desktop
        // check for taskbar icon press

        if (mouseY >= canvas.height - taskbarHeight){
            // mouse in the taskbar area
            var program = getHoveredTaskbarIcon();
            if (program != null){
                if (program != selectedProgram){
                    selectProgram(program);
                    
                    if (program.minimized){
                        program.maximize();
                    }
                }
            }
        } 
        if (!(mouseY >= canvas.height - taskbarHeight) || getHoveredTaskbarIcon() == null) {
            // check if a window corner is being clicked, to resize
            var result = getWindowCornerHovered();
            if (result[1] != null){
                resizingWindow = true;
                resizeStartX = mouseX;
                resizeStartY = mouseY;
                resizeActiveProgram = result[1];
                resizeDirection = result[0];
                resizeStartWidth = result[1].width;
                resizeStartHeight = result[1].height;
                resizeStartProgramX = result[1].x;
                resizeStartProgramY = result[1].y;
                selectProgram(result[1]);
            } else if (component != null){
                component.onClick();
            }

        }
    } else if (event.button === 2){

    }
}
function handleMouseUp(event) {
    event.preventDefault();
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (resizingWindow){
        resizingWindow = false;
        resizeStartX = 0;
        resizeStartY = 0;
        resizeActiveProgram = null;
        resizeDirection = "";
        resizeStartWidth = 0;
        resizeStartHeight = 0;
        resizeStartProgramX = 0;
        resizeStartProgramY = 0;
        
        return;
    }

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