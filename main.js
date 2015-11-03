var userWeapon = "";
var chosenMonster = "";
var count = 0;
var weapons = [
	{ id: 1, Name: "sword", Damage: 15 },
	{ id: 2, Name: "halberd", Damage: 25 },
	{ id: 3, Name: "rapier", Damage: 10 },
	{ id: 4, Name: "claymore", Damage: 20 }
];
var actionArray = ["attack", "run", "talk"];
var keywordArray = ["inventory", "status", "enemy", "health"];
var userAction = "";
var userCheckKeyword = "";
function actor(Name, Health, Level) {
    this.Name = Name;
    this.Health = Health;
    this.Level = Level;
}


var newUser = new actor("you", 200, 1);
var monsters = [
    new actor("skeleton", 40, 1),
    new actor("wolf", 60, 1),
    new actor("highwayman", 200, 3),
    new actor("hobb", 120, 2)];

	
function start()
{
	writeToTextArea("Welcome to Our Text Based Adventure Game!");
	spawnMonster();
}	
	
	
function action() {
	var currentMonster = spawnMonster();
    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");
	if(count == 0){
		currentMonsterHealth = chosenMonster.health
	}else{

    for (var i = 0; i < strArray.length; i++) {
        for (var j = 0; j < weapons.length; j++) {
            if (strArray[i] == weapons[j].Name) {
                userWeapon = strArray[i];

            }
        }
    }

    for (var i = 0; i < strArray.length; i++) {
        for (var j = 0; j < actionArray.length; j++) {
            if (strArray[i] == actionArray[j]) {
                userAction = strArray[i];
				currentMonsterHealth = currentMonsterHealth - 
            }
        }
    }

    for (var i = 0; i < strArray.length; i++) {
        if (strArray[i] == "check") {
            for (var i = 0; i < strArray.length; i++) {
                for (var j = 0; j < keywordArray.length; j++) {

                    if (strArray[i] == keywordArray[j]) {
                        userCheckKeyword = strArray[i];

                        switch (userCheckKeyword) {

                            case "status":
                                userStatus();
                                break;

                            case "inventory":
                                userInventory();
                                break;

                            case "enemy":
                                enemy();
                                break;

                            case "health":
                                userHealth();
                                break;

                        }
                    }
                }

            }
        }
    }

    writeToTextArea("" + actor.Name + " " + userAction + " with " + userWeapon);
	}
}

function writeToTextArea(string) {
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}

function spawnMonster()
{
	 var rand = Math.floor(Math.random()*monsters.length);
	 chosenMonster = monsters[rand];
	 writeToTextArea("You are fighting: " + chosenMonster.Name);
	 return chosenMonster;
}

//function userStatus()
//{
//writeToTextArea("Your Current level is: " + newUser.Name);

//}

function damage(weapon, action, lvlMulti)
{
	
	
	
}
