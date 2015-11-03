var userWeapon = "";
var chosenMonster = "";
var count = 0;
var weapons = [
	{ id: 1, Name: "sword", Damage: 15 },
	{ id: 2, Name: "halberd", Damage: 25 },
	{ id: 3, Name: "rapier", Damage: 10 },
	{ id: 4, Name: "claymore", Damage: 20 }
];
var actionArray = [
{Name: "attack", DamageMulti: 1.2},
{Name: "Slash", DamageMulti: 1.1}, 
{Name: "talk", DamageMulti: 0.8}
];

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
	
    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");
	if(count == 0){
		currentMonsterHealth = chosenMonster.Health;
		count = 1;
	}else{

    for (var i = 0; i < strArray.length; i++) {
        for (var j = 0; j < weapons.length; j++) {
            if (strArray[i] == weapons[j].Name) {
                userWeapon = strArray[i];
				userWeaponDamage = weapons[j].Damage;
            }
        }
    }

    for (var i = 0; i < strArray.length; i++) {
        for (var j = 0; j < actionArray.length; j++) {
            if (strArray[i] == actionArray[j].Name) {
                userAction = strArray[i];
				userActionDamage = actionArray[j].DamageMulti
				alert(currentMonsterHealth);
				currentMonsterHealth = currentMonsterHealth - userWeaponDamage * userActionDamage;
				alert(currentMonsterHealth);
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

    writeToTextArea("" + newUser.Name + " " + userAction + " with " + userWeapon);
	}
}

function writeToTextArea(string) {
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}
// gen monster 
function spawnMonster()
{
	 var rand = Math.floor(Math.random()*monsters.length);
	 chosenMonster = monsters[rand];
	 writeToTextArea("You are fighting: " + chosenMonster.Name);
	 
}

//function userStatus()
//{
//writeToTextArea("Your Current level is: " + newUser.Name);

//}


