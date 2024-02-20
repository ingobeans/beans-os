class FileExplore extends Program{
    constructor(){
        super("File Explore","assets/fileexplore.png", true, true);
        this.path = "/";
        this.reload();
    }
    clickFolder(button){
        this.path += button.actualPath + "/";
        this.reload()
    }
    reload(){
        var contents = fileSystem.readDirectory(this.path);
        this.components = []
        this.addTopbar();
        for (let index = 0; index < contents.length; index++) {
            const item = contents[index];
            var text = "  "+item
            var isFile = fileSystem.isFile(this.path + item);
            var button = new Button(0, index * 24, text.length * 10, 24, this.clickFolder, null, text, null);
            button.actualPath = item;
            this.addComponent(button);

            if(!isFile){
                this.addComponent(new Sprite(0, index * 24, 20, 20, "assets/fileexplore.png"));
            }else{
                this.addComponent(new Sprite(0, index * 24, 20, 20, "assets/file.png"));
            }
        }
    }
}

registerProgram(FileExplore);

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
        
        this.upgradeValueButton.onResizeWindowEvent = function(button) {
            button.x = this.width - 310;
        }

        this.cash = 0;
        this.valuePerClick = 1;
        this.upgradeValueCost = 10

        this.addComponent(this.textLabel);
        this.addComponent(this.biscuitButton);
        this.addComponent(this.upgradeValueButton);
    }
}

registerProgram(BiscuitClicker);