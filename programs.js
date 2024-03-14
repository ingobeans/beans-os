class FileExplore extends Program{
    constructor(args="/"){
        super("File Explore","assets/fileexplore.png", true, true, 500, 328, 500, 200);
        this.path = args;
        this.selectedItemIndex = -1;
        this.lastSelectedItemIndex = -1;
        this.renaming = false;
        this.reload();
    }
    openFolder(button){
        this.path = button.actualPath;
        this.selectedItemIndex = -1;
        this.reload()
    }
    onInputBoxReceive(response){
        if (this.renaming == false){
            return
        }
        if (response == false){
            return
        }
        if (response.includes("/")){
            return;
        }
        if (!fileSystem.isFile(this.path + this.renaming) && response.includes(".")){
            return
        }
        console.log(this.path + this.renaming + "/");
        fileSystem.rename(this.path + this.renaming, response);
        this.reload();
    }
    onClick(){
        super.onClick();
        for (let index = 2; index < this.components.length; index++) {
            const component = this.components[index];

            if (component.hoveredColor){
                // when we click the body of the program, loop through all components
                // check if hoveredColor exists, to verify the program is a button
                // and reset their color
                component.color = null;
                component.hoveredColor = null;
            }
        }
        this.lastSelectedItemIndex = this.selectedItemIndex;
        this.selectedItemIndex = -1;
    }
    clickItem(button){
        if (this.lastSelectedItemIndex == button.index){
            if (!button.isFile){
                this.openFolder(button);
                this.selectedItemIndex = -1;
                return;
            }
        }
        this.selectedItemIndex = button.index;
        button.color = markColor;
        button.hoveredColor = markColor;
    }
    goUpFolder(button){
        this.path = fileSystem.getParentDirectory(this.path);
        this.selectedItemIndex = -1;
        this.reload();
    }
    addNavigationBar(){
        this.addComponent(new PopButton(0,0,120,32,this.goUpFolder,"Go Up Folder"))
        this.addComponent(new PopButton(120-1,0,130,32,null,"Create Folder"))
        this.addComponent(new PopButton(120+130-2,0,110,32,null,"Create File"))

        var renameButton = new PopButton(120+130+110-3,0,this.width - 120 - 130 - 110 + 4,32,this.clickRename,"Rename");
        renameButton.onResizeWindowEvent = function(button){
            button.width = this.width - 120 - 130 - 110 + 4;
        };
        this.addComponent(renameButton);
    }
    clickRename(button){
        if (this.lastSelectedItemIndex == -1){
            return;
        }
        this.renaming = this.contents[this.lastSelectedItemIndex];
        this.selectedItemIndex = -1;
        this.lastSelectedItemIndex = -1;
        this.sendInputBox("Rename...");
    }
    reload(){
        var contents = fileSystem.readDirectory(this.path);
        this.contents = contents;
        this.name = "File Explore - " + this.path;
        this.components = []
        this.addTopbar();
        this.addNavigationBar();
        
        for (let index = 0; index < contents.length; index++) {
            const item = contents[index];
            var text = "  " + item;
            var isFile = fileSystem.isFile(this.path + item);
            var y = index * 24 + 36;
            
            var button = new Button(0, y, this.width, 24, null, null, text, null);
            button.onClickEvent = this.clickItem;
            button.actualPath = this.path + item + "/";
            button.isFile = isFile;
            button.index = index;
            
            if(!isFile){
                this.addComponent(new Sprite(0, y, 20, 20, "assets/filetypes/folder.png"));
            }else{
                this.addComponent(new Sprite(0, y, 20, 20, "assets/filetypes/unknown.png"));
            }
            this.addComponent(button);
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