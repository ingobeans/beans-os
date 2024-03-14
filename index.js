const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;
// dont anti alias images when upscaling

wallpaper = [
    {offset: 0, color: 'rgb(204,84,131)'},
    {offset: 1, color: 'rgb(255,175,148)'},
];
document.body.style.backgroundColor = wallpaper;

windowBackgroundColor = "#9c9c9c";
windowBarColor = "#6d6d6d";
windowBorderWith = 1;
taskbarColor = "rgb(41,41,41)";
taskbarIconBackgroundColor = "#161616";

homeIcon = new Image();
homeIcon.src = "assets/home.png"

taskbarHeight = 48;

topbarHeight = 24;
topbarButtonWidth = 24;

currentCursor = "inherit";

markColor = "rgba(89,103,230,0.25)";
markingDesktop = false;
markingDesktopStartX = 0;
markingDesktopStartY = 0;

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

class Component {
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
        this.onResizeWindowEvent = null;

        this.hoverLast = false;
        this.parent = null;
    }
    setParent(parent){
        this.parent = parent;
        if(this.onHoverEvent != null){
            this.onHoverEvent = this.onHoverEvent.bind(parent);
        }
        if(this.onExitHoverEvent != null){
            this.onExitHoverEvent = this.onExitHoverEvent.bind(parent);
        }
        if(this.onReleaseEvent != null){
            this.onReleaseEvent = this.onReleaseEvent.bind(parent);
        }
        if(this.onClickEvent != null){
            this.onClickEvent = this.onClickEvent.bind(parent);
        }
        if(this.onResizeWindowEvent != null){
            this.onResizeWindowEvent = this.onResizeWindowEvent.bind(parent);
        }
    }
    onResizeWindow(){
        if(this.onResizeWindowEvent != null){
            this.onResizeWindowEvent(this);
        }
    }
    draw(offsetX, offsetY){

    }
    update(){

    }
    onHover(){
        if(this.onHoverEvent != null){
            this.onHoverEvent(this);
        }
    }
    exitHover(){
        if(this.onExitHoverEvent != null){
            this.onExitHoverEvent(this);
        }
    }
    onRelease(){
        if(this.onReleaseEvent != null){
            this.onReleaseEvent(this);
        }
    }
    onClick(){
        if(this.onClickEvent != null){
            this.onClickEvent(this);
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

class PopButton extends Component{
    // another style of button

    constructor(x, y, width, height, onClickEvent, text) {
        super(x, y, width, height, windowBackgroundColor);
        this.onClickEvent = onClickEvent;
        this.text = text;
        this.hovered = false;
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
        // draw border
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, "#000");

        drawRect(this.x + offsetX + 1, this.y + offsetY + 1, this.width - 2, this.height - 2, this.hovered ? "#969696" : windowBackgroundColor);
        drawText(this.x + offsetX, this.y + offsetY, this.text, "#ffffff");
    }
}

class Sprite extends Component{
    constructor(x, y, width, height, imageSrc){
        super(x,y,width,height,null);

        this.imageSrc = imageSrc;
        this.image = new Image();
        this.image.src = this.imageSrc;
    }
    draw(offsetX, offsetY){
        drawSprite(this.x + offsetX, this.y + offsetY, this.width, this.height, this.image);
    }
}

class ImageButton extends Component{
    constructor(x, y, width, height, onClickEvent, imageSrc, color = windowBackgroundColor,  hoveredColor = "#000000") {
        super(x, y, width, height, color);
        this.onClickEvent = onClickEvent;

        this.imageSrc = imageSrc;
        this.image = new Image();
        this.image.src = this.imageSrc;

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
        drawSprite(this.x + offsetX, this.y + offsetY, this.width, this.height, this.image);
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

class Input extends Component{
    constructor(x, y, width, height, placeholder="", allowEnterSend=false, textColor="#fff", backgroundColor=windowBackgroundColor){
        super(x,y,width,height,textColor);
        this.backgroundColor = backgroundColor;
        this.value = "";
        this.submitted = false;
        this.placeholder = placeholder;
        this.allowEnterSend = allowEnterSend;
        this.lineBlinkTimer = 30;
        this.line = false;
    }
    onHover(){
        currentCursor = "text";
        this.hovered = true;
    }
    exitHover(){
        currentCursor = "inherit";
        this.hovered = false;
    }
    onClick(){
        this.parent.selectedInputField = this;
    }
    onKeyPress(key){
        if (this.submitted){
            return;
        }
        if (key == "Backspace"){
            this.value = this.value.substring(0, this.value.length - 1);
        } else if (key == "Enter"){
            if (this.allowEnterSend){
                this.submitted = true;
                return;
            }
        }
        else if (key.length == 1) {
            this.value += key;
        }
    }
    setParent(parent){
        super.setParent(parent);
        parent.selectedInputField = this;
    }
    draw(offsetX, offsetY){
        var x = this.x + offsetX;
        var y = this.y + offsetY;
        drawRect(x, y, this.width, this.height, "#000");
        drawRect(x + 1, y + 1, this.width - 2, this.height - 2, this.backgroundColor);
        if (this.value != ""){
            drawText(x, y, this.value, this.color);
        }else {
            drawText(x, y, this.placeholder, "#bbb");
        }
        if (this.parent.selectedInputField == this){
            this.lineBlinkTimer -= 1;
            if (this.lineBlinkTimer <= 0){
                this.lineBlinkTimer = 30;
                this.line = !this.line;
            }
            if (this.line){
                drawRect(x + this.value.length * 10, y + 3, 2, 17, this.color);
            }
        }
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
        this.onResizeWindowEvent = this.reload;
    }
    onResizeWindow(){
        this.width = this.parent.width;
    }
    draw(offsetX, offsetY){
        drawRect(this.x + offsetX, this.y + offsetY, this.width, this.height, this.backgroundColor);
        drawSprite(this.x + offsetX, this.y + offsetY, 24, 24, this.parent.icon);
        drawText(this.x + offsetX + 26, this.y + offsetY, this.text, this.color);
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
    constructor(name,icon,resizable,hasTopbar,width=500,height=328,minWidth=200,minHeight=128){
        this.name = name;
        this.width = width;
        this.height = height;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.resizable = resizable
        this.minimized = false;
        this.hasTopbar = hasTopbar;
        this.preMinimizedPosX = 0;
        this.preMinimizedPosY = 0;
        this.components = [];
        
        if (this.hasTopbar){
            this.addTopbar();
        }

        this.selectedInputField = null;
        this.iconSrc = icon;
        this.icon = new Image();
        this.icon.src = this.iconSrc;
    }
    onKeyPress(key){
        if (this.selectedInputField != null){
            this.selectedInputField.onKeyPress(key);
        }
    }
    onInputBoxReceive(response){

    }
    onSelect(){

    }
    onSelectionLost(){

    }
    addTopbar(){
        var minimizeButton = new Button(this.width - topbarButtonWidth * 2, -topbarHeight, topbarButtonWidth, topbarHeight, this.minimize, windowBarColor," -");
        minimizeButton.onResizeWindowEvent = function(button) {
            button.x = this.width - topbarButtonWidth * 2;
        }
        minimizeButton.setParent(this);
        
        var exitButton = new Button(this.width - topbarButtonWidth, -topbarHeight, topbarButtonWidth, topbarHeight, this.exit, "#ff0000"," X");
        exitButton.onResizeWindowEvent = function(button) {
            button.x = this.width - topbarButtonWidth;
        }
        exitButton.setParent(this);
        
        var topbar = new Topbar(0, -topbarHeight, this.width, topbarHeight, "#ffffff", windowBarColor, this.name);
        topbar.setParent(this);
        

        this.components.splice(0,3,minimizeButton,exitButton,topbar)
    }
    exit(includedInTaskbar = true){
        for (let index = this.components.length - 1; index >= 0; index--) {
            const component = this.components[index];
            component.exitHover();
        }
        selectProgram(null);

        programs.splice(programs.indexOf(this),1);

        if(includedInTaskbar){
            taskbarPrograms.splice(taskbarPrograms.indexOf(this),1);
        }

        updateHoveredComponents();
    }
    maximize(){
        this.minimized = false;
        this.x = this.preMinimizedPosX;
        this.y = this.preMinimizedPosY;
        
        updateHoveredComponents();
    }
    minimize(){
        for (let index = 0; index < this.components.length; index++) {
            const component = this.components[index];
            component.exitHover();
        }
        this.preMinimizedPosX = this.x;
        this.preMinimizedPosY = this.y;

        this.y = canvas.height * 2;
        selectProgram(null, true);
        this.minimized = true;

        updateHoveredComponents();
    }
    drawRect(x, y, width, height, color){
        drawRect(x + this.x, y + this.y, width, height, color);
    }
    drawGradientRect(x, y, width, height, colorStops){
        drawGradientRect(x + this.x, y + this.y, width, height, colorStops);
    }
    drawText(x, y, text, color){
        drawText(x + this.x, y + this.y, text, color);
    }
    drawSprite(x, y, width, height, image) {
        drawSprite(x + this.x, y + this.y, width, height, image);
    }
    addComponent(component){
        component.setParent(this); 
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

        for (let index = 0; index < this.components.length; index++) {
            const component = this.components[index];
            component.onResizeWindow();
        }
    }
    sendInputBox(prompt){
        var inputBox = new InputBox(programs.indexOf(this).toString() + " " + prompt);
        programs.unshift(inputBox);
        selectProgram(inputBox);
    }
    update(){
        for (let index = 0; index < this.components.length; index++) {
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
    onClick(){
        if (this.selectedInputField != null){
            this.selectedInputField = null;
        }
    }
    onOpen(){
        
    }
}

class AppMenu extends Program{
    constructor(){
        super("App Menu","assets/home.png", false, false);
        this.reload()
    }
    onSelectionLost(){
        this.minimize();
        // hide app menu when you click away
    }
    onProgramClicked(button){
        launchProgram(button.programClass);
    }
    reload(){
        this.width = 204;
        this.height = allPrograms.length * 24 + 48;
        this.x = 0;
        this.y = canvas.height - this.height - taskbarHeight;
        this.minimize();
        this.components = [];

        for (let index = 0; index < allPrograms.length; index++) {
            const program = allPrograms[index];
            var button = new Button(0,index * 24, this.width,24,this.onProgramClicked,windowBackgroundColor,program.name);
            button.programClass = program;
            // define a new variable programClass of the button, to be the actual app's class
            // this way, we can on button press get the class to be able to launch it

            this.addComponent(button);
        }
    }
}

class InputBox extends Program{
    constructor(startArgs){
        var launcherId = parseInt(startArgs.split(" ")[0]);
        var text = startArgs.split(" ")[1];
        var launcher = programs[launcherId];
        super(text, launcher.iconSrc, false, true, 400, 150);
        this.launcherId = launcherId;
        this.text = text;
        this.launcher = launcher;
        this.input = new Input(this.width / 2 - 260 / 2, this.height / 2 - 40 / 2, 260, 40, this.text, false);

        this.cancelButton = new PopButton(this.width - 130 - 10, this.height - 30 - 10, 130, 30, this.sendCancel, "   Cancel");
        this.okButton = new PopButton(this.width - 130 - 10 - 129, this.height - 30 - 10, 130, 30, this.sendResponse, "     Ok");

        this.addComponent(this.input);
        this.addComponent(this.okButton);
        this.addComponent(this.cancelButton);
    }
    sendCancel(){
        this.launcher.onInputBoxReceive(false);
        this.exit(false);
    }
    sendResponse(){
        this.launcher.onInputBoxReceive(this.input.value);
        this.exit(false);
    }
}

function registerProgram(program){
    allPrograms.push(program);
    activeAppMenu.reload();
    fileSystem.createFile("/beans/programs/"+program.name+".exe",program.name);
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

    return programInstance;
}

function getTaskbarIconPositionFromIndex(index){
    return [index * 42 + 2, canvas.height - taskbarHeight + 4];
}

var fileSystem = new BeansFileSystem();
fileSystem.createDirectory("/home");
fileSystem.createDirectory("/beans");
fileSystem.createDirectory("/beans/programs");

var allPrograms = [];
// all "installed" programs

var programs = [];
var taskbarPrograms = [...programs];
// an identical list to programs of value
// but isnt reordered whenever you select a program
// so that the programs dont move in the taskbar whenever you select a new program

var selectedProgram = null;

activeAppMenu = launchProgram(AppMenu);

function update() {
    clearScreen();

    if (markingDesktop){
        drawRect(markingDesktopStartX, markingDesktopStartY, mouseX - markingDesktopStartX, mouseY - markingDesktopStartY, markColor);
    }
    
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
        var taskbarPos = getTaskbarIconPositionFromIndex(index); 

        if (selectedProgram == program){
            drawRect(taskbarPos[0] - 2, taskbarPos[1] - 4, 42, 48, taskbarIconBackgroundColor);
        }

        // draw taskbar icon
        drawSprite(taskbarPos[0], taskbarPos[1],40,40,program.icon);
    }

    for (let index = programs.length - 1; index >= 0; index--) {
        const program = programs[index];
        program.draw();
    }
    
    if (selectedProgram != null){
        selectedProgram.update();
    }

    
    canvas.style.cursor = currentCursor;
    requestAnimationFrame(update);
}

function clearScreen() {
    drawGradientRect(0,0,canvas.width,canvas.height,wallpaper);
}

function drawRect(x, y, width, height, color) {
    if (color == null){
        return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGradientRect(x, y, width, height, colorStops) {
    var gradient = ctx.createLinearGradient(x, y, x + width, y + height);

    colorStops.forEach(function(colorStop) {
        gradient.addColorStop(colorStop.offset, colorStop.color);
    });
    
    ctx.fillStyle = gradient;
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
        
        for (let index = 0; index < program.components.length; index++) {
            const component = program.components[index];
            let x = component.x + program.x;
            let y = component.y + program.y;

            if (
                mouseX >= x &&
                mouseX < x+component.width &&
                mouseY >= y &&
                mouseY < y+component.height

                && !(hoveredProgram != null && program != hoveredProgram)
                // only allow a component to be "hovered" if its program is the currently hovered
                // this is so you cant trigger hover events through the body of another program
            ){
                component.onHover();
                component.hoverLast = true;
            }else if (component.hoverLast){
                // still allow components to exit hover even if their program isnt currently hovered
                // so that components still update when you leave their hover by moving cursor straight to another program
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
        var taskbarPos = getTaskbarIconPositionFromIndex(index);
        if (
            mouseX >= taskbarPos[0] &&
            mouseX < taskbarPos[0] + 40 + 2
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
        if (selectedProgram == hoveredProgram){
            hoveredProgram.onClick();
        } else {
            selectProgram(hoveredProgram);
        }
    }else {
        selectProgram(null);
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

    if (selectedProgram == null){
        markingDesktop = true;
        markingDesktopStartX = mouseX;
        markingDesktopStartY = mouseY;
    }
}
function handleMouseUp(event) {
    event.preventDefault();
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (markingDesktop){
        markingDesktop = false;
        markingDesktopStartX = 0;
        markingDesktopStartY = 0;
    }

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

function handleKeyPress(event) {
    if (selectedProgram != null){
        selectedProgram.onKeyPress(event.key);
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.font = "16px IBM Plex Mono, monospace";
    clearScreen();
    activeAppMenu.reload();
});

document.addEventListener("keydown", handleKeyPress);
canvas.addEventListener('mousemove', handleMouseMove, false);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);

requestAnimationFrame(update);