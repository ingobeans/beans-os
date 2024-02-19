class ClickerGame extends Program{
    constructor(){
        super("Clicker Game","assets/clickergame.png", true, true);
        this.onOpen();
    }
    testButton(){
        this.cash += 1;
        this.textLabel.text = "$" + this.cash.toString();
    }
    onOpen(){
        this.textLabel = new Label(0,0,90,40,"#ffffff",windowBackgroundColor,"$0");
        this.cash = 0;

        this.addComponent(this.textLabel);
        this.addComponent(new ImageButton(0,40,160,160,this.testButton,"assets/clickergame.png",windowBackgroundColor,windowBackgroundColor));
    }
}

registerProgram(ClickerGame);