class ClickerGame extends Program{
    constructor(){
        super("Clicker Game","assets/testingapp.png", true, true);
        this.onOpen();
    }
    testButton(){
        this.presses += 1;
        this.textLabel.text = "Presses: " + this.presses.toString();
    }
    onOpen(){
        this.textLabel = new Label(0,80,90,40,"#ffffff",windowBackgroundColor,"Presses: 0");
        this.presses = 0;

        this.addComponent(this.textLabel);
        this.addComponent(new Button(0,0,40,40,this.testButton,"#333333","Test"))
    }
}

registerProgram(ClickerGame);