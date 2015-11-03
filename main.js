var userWeapon = "";
var chosenMonster = "";
var count = 0;

var actionArray = [
{ Name: "attack", DamageMulti: 1.2 },
{ Name: "Slash", DamageMulti: 1.1 },
{ Name: "talk", DamageMulti: 0.8 }
];

var keywordArray = ["inventory", "status", "enemy", "health"];
var userAction = "";
var userCheckKeyword = "";

function actor(Name, Health, MaxHealth, Level, EXP, MaxEXP) {
    this.Name = Name;
    this.Health = Health;
    this.MaxHealth = MaxHealth;
    this.Level = Level;
    this.EXP = EXP;
    this.MaxEXP = EXP;
}


var newUser = new actor("you", 200, 200, 1, 0, 20);
var monsters = [
    new actor("skeleton", 40, 40, 1, 15, 15),
    new actor("wolf", 60, 60, 1, 20, 20),
    new actor("highwayman", 200, 200, 3, 40, 40),
    new actor("hobb", 120, 120, 2, 30, 30)
];

function prefix(Name, DamageMod) {
    this.Name = Name;
    this.DamageMod = DamageMod;
}

var weaponPrefix = [
	new prefix("common", 1),
	new prefix("rusty", 0.6),
	new prefix("refined", 1.2),
	new prefix("legendary", 1000)
];

function weapons(Name, Damage, Prefix) {
    this.Name = Name;
    this.Damage = Damage;
    this.Prefix = weaponPrefix[0];
}

var weapon = [
	new weapons("sword", 15, weaponPrefix[0]),
	new weapons("halberd", 25, weaponPrefix[0]),
	new weapons("rapier", 10, weaponPrefix[0]),
	new weapons("claymore", 20, weaponPrefix[0])
];


function start() {
    writeToTextArea("Welcome to Our Text Based Adventure Game!");
    spawnMonster();
}


function action() {

    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");
    if (count == 0) {
        currentMonsterHealth = chosenMonster.Health;
        count = 1;
    } else {

        for (var i = 0; i < strArray.length; i++) {
            for (var j = 0; j < weapon.length; j++) {
                if (strArray[i] == weapon[j].Name) {
                    userWeapon = strArray[i];
                    userWeaponDamage = weapon[j].Damage;
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

        if (currentMonsterHealth <= 0) {
            newUser.EXP = newUser.EXP + chosenMonster.EXP;
            alert(newUser.EXP); //alerts current exp
            while (newUser.EXP >= newUser.MaxEXP) {
                newUser.Level = newUser.Level + 1; //increase level by one
                newUser.MaxHealth = newUser.MaxHealth + 10 * newUser.Level;
                newUser.Health = newUser.MaxHealth;
                //newUser.DMG =  Math.round((newUser.DMG + 2 + Math.floor(Math.random() * 3) + 1) * 1.02);
                newUser.EXP = newUser.EXP - newUser.MaxEXP;
                newUser.MaxEXP = newUser.MaxEXP + Math.round((10 * newUser.Level) / 1.1);
                writeToTextArea("You leveled up to LVL: " + newUser.Level + "\nHealth is now " + newUser.MaxHealth);

            }
            alert(newUser.MaxEXP);//alerts max exp
            spawnMonster();
            count = 0;
        }

    }
}

function writeToTextArea(string) {
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}
// gen monster 
function spawnMonster() {
    var rand = Math.floor(Math.random() * monsters.length);
    chosenMonster = monsters[rand];
    writeToTextArea("You are fighting: " + chosenMonster.Name);

}

//function userStatus()
//{
//writeToTextArea("Your Current level is: " + newUser.Name);

//}

