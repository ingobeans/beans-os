class BiscuitClicker extends Program{
    constructor(){
        super("Biscuit Clicker","assets/bisquitclicker.png", true, true, 700, 328, 500, 328);

        this.onOpen();
    }
    clickBiscuit(){
        this.cash += Math.floor(this.valuePerClick);
        this.textLabel.text = "$" + this.cash.toString();
    }
    upgradeValue(){
        if (this.cash >= this.upgradeValueCost){
            this.valuePerClick = this.valuePerClick * 1.3 + 1;
            this.cash -= this.upgradeValueCost;
            this.textLabel.text = "$" + this.cash.toString();

            this.upgradeValueCost = Math.ceil(this.upgradeValueCost * 4.5 + 90);
            this.upgradeValueButton.text = "$" + this.upgradeValueCost + " - Upgrade value / click";
        }
    }
    onOpen(){
        this.textLabel = new Label(0,0,90,40,"#ffffff",windowBackgroundColor,"$0");
        this.biscuitButton = new ImageButton(0,40,160,160,this.clickBiscuit,"assets/bisquitclicker.png",windowBackgroundColor,windowBackgroundColor)
        this.upgradeValueButton = new PopButton(this.width - 310, 0, 310, 45, this.upgradeValue, "$10 - Upgrade value / click");
        
        this.cash = 0;
        this.valuePerClick = 1;
        this.upgradeValueCost = 10

        this.addComponent(this.textLabel);
        this.addComponent(this.biscuitButton);
        this.addComponent(this.upgradeValueButton);
    }
}

registerProgram(BiscuitClicker);