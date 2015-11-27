var userWeapon = ""; // holds users current weapon 
var chosenMonster = ""; // stores the current monster the user is fighting as a montsers object 
var count = 0;
var monstersKilled = []; // this array holds the names of the montsers the user has killed 
var directionFace = "forward"; // characters direction 
var currentMonsterHealth; 
var userWeaponDamage; // stores chosen wepaon damage 
var userActionDamage; // stores chosen action damage 
var checkValue = 0;
var currentLocation = ""; // holds characters current location 
var choiceCount = 0;

var events = [
	{ Name: "Special-Weapon", Chance: 0.05 },
	{ Name: "Chest", Chance: 0.25 },           // array of events the user can find as they travel around the map
	{ Name: "Monster", Chance: 0.60 },
]

var locations = [
	{Name:"cave", Xaxis:1, Yaxis:1},		// stores the possible locations on the map, they are dependent on the users x and y axis 
	{Name:"graveyard", Xaxis: 2, Yaxis:4}
]

var caveEvents = [
	{Name:"SpecialCaveWeapon", Chance:0.05},   // events specifically for the cave location 
	{Name:"CaveLoot", Chance:0.25},
	{Name: "CaveMonster", Chance: 0.80}
]

var actionArray = [
{ Name: "attack", DamageMulti: 1.2 },
{ Name: "Slash", DamageMulti: 1.1 },   // all possbile actions the user can type into the first textbox
{ Name: "talk", DamageMulti: 0.8 }
];

//stores all the directions the user can take 
var directions = [
    { name: "forward", XAxis: 0, YAxis: 1 },  
    { name: "right", XAxis: 1, YAxis: 0 },
    { name: "backward", XAxis: 0, YAxis: -1 },   
    { name: "left", XAxis: -1, YAxis: 0 },
]

var keywordArray = ["inventory", "status", "enemy", "health"]; // added key words the text parser will recongnise 
var userAction = "";
var userCheckKeyword = "";

function coOrdinates(Xaxis, Yaxis) 
{
    this.Xaxis = Xaxis;      // coOrdinates constructor 
    this.Yaxis = Yaxis;
}


function actor(Name, Health, MaxHealth, Level, EXP, MaxEXP, CoOrdinates, MonDamage, Location, Profession) // actor class, requires all of these values when a new object is initiated 
{
    this.Name = Name;
    this.Health = Health;
    this.MaxHealth = MaxHealth;
    this.Level = Level;
    this.EXP = EXP;
    this.MaxEXP = MaxEXP;
    this.CoOrdinates = new coOrdinates(0, 0);
    this.MonDamage = MonDamage;
	this.Location = Location;
	this.Profession = Profession;
}

var newUser = new actor("you", 200, 200, 1, 0, 20, coOrdinates(0, 0), 0, "plainGround", " "); // actor object called newUser. 

var monsters = [
    new actor("skeleton", 40, 40, 1, 15, 15, 0, 5, " ", " "),
    new actor("wolf", 60, 60, 1, 20, 20, 0, 15, " ", " "),
    new actor("highwayman", 200, 200, 3, 40, 40, 0, 40, " ", " "),  // new actor objects stored in an array called monsters. each object has the required values stated in the actor constructor
    new actor("hobb", 120, 120, 2, 30, 30, 0, 30, " ", " "),
	new actor("null", 0,0,0,0,0,0,0, " ", " "),
];

var caveMonsters = [
	new actor("imp", 50, 50, 2, 25, 25, 0, 25, " ", " "), // new actor objects for monsters specifically for the cave
	new actor("null",0,0,0,0,0,0,0," ", " "),
]

function prefix(Name, DamageMod, ConditionMod, ValueMod, SpecialEffect, Rarity)
{
    this.Name = Name;
    this.DamageMod = DamageMod;
	this.ConditionMod = ConditionMod;   // weapon prefix class
	this.ValueMod = ValueMod;
	this.SpecialEffect = SpecialEffect;
	this.Rarity = Rarity;
}

var weaponPrefix = 
[
	new prefix("common", 1, 1, 1, "none", "none"),  		// new prefix objects for wepaons 
	new prefix("rusty", 0.6, 0.4, 0.4, "tetanus", "common"),
	new prefix("trusty", 1, 1, 1, "unbreakable", "unique"),
	new prefix("antique", 0.6, 0.2, 5.25, "none", "rare"),
	new prefix("crystalised", 3, 0.8, 0.7, "bleed", "v-rare"),
	new prefix("tempered", 1.1, 0.85, 0.9, "none", "rare"),
	new prefix("cursed", 1.5, 1.5, 2.5, "cursed?", "unique"),
	new prefix("baneforged", 2, 2, 0.1, "argh", "unique")
];

function weapons(Name, Damage, Condition, Value, Prefix)
{
    this.Name = Name;
    this.Damage = Damage;
	this.Condition = Condition; 			// weapon class with prefix added as an arguement 
	this.Value = Value;
    this.Prefix = new prefix("devNULL", 1);
}

var weapon = [
	new weapons("sword", 15, weaponPrefix[2]),
	new weapons("halberd", 25, weaponPrefix[0]),  // array of wepaon objects 
	new weapons("rapier", 10, weaponPrefix[0]),
	new weapons("claymore", 20, weaponPrefix[0])
];

var items = [ // order the items to the highest lootChance and the value has to be from 0 to 1
    { Name: "adrenaline", Inventory: 1, Value: 150, LootChance: 0.3 },
    { Name: "painkiller", Inventory: 3, Value: 50, LootChance: 0.4 },
    { Name: "nothing", Inventory: 0, Value: 50, LootChance: 1 },
];

function eventsGen()    // fucntion for calling the coresponding function depending on the randNum variable 
{						// this fucntion gets called only when the user in in the "plainGround" area this happens everytime the user moves coOrdinates
    var count = 0;
    var randNumb = Math.random();  // random number generater for chance of function call
	
    for (var i = 0; i < events.length; i++)
    {
        if (count == 0) {
            
            if (events[i].Name == "Monster" && events[i].Chance >= randNumb)  // if statement to check what event has been chosen by the randNumb 
            {
                writeToTextArea("You have encountered an enemy!");
                spawnMonster(); // calls coresponding function- in this case a monster will be spawned 
                count++;
            }
            else if (events[i].Name == "Chest" && events[i].Chance >= randNumb && randNumb < 0.5 )
            {
                
                spawnChest();
                count++;
            }
            else if (events[i].Name == "Special-Weapon" && events[i].Chance >= randNumb )
            {   
                roamingLoot();
                count++;
            }
        }
    }
}

function caveEventsGen()  // function for cave events. simular to above function  but only gets called when user is in the cave location
{
	var count = 0;
	var randNumb = Math.random();
	
	for (var i = 0; i < caveEvents.length; i++)
	{
		if (count == 0)
		{
		if(caveEvents[i].Name == "CaveMonster" && caveEvents[i].Chance >= randNumb)
		{
			writeToTextArea("You have encountered an enemy!");
            spawnCaveMonster();
            count++;
		}
		}
	}
}

function start()  // function linked to the on click property in our html page. gets called when the user clicks on the start button. 
{
    writeToTextArea("Welcome to Our Text Based Adventure Game!");  // writes to text area
		writeToTextArea("The Facility, is a secret government research organisation working to develop a variety of pacification methods. You decide the role you play in the ensuing chaos. The Scientist, The Engineer, or The Mercenary. Who will you choose?");
	
    //spawnMonster(); // spawns monster 
}


function drops()  // determines the loot you will receive from an action e.g. moving around the map 
{
    var randNumb = Math.random();
    var count = 0;
    for (i = 0; i < items.length; i++) 
	{
        if (count == 0) 
		{
            if (randNumb < items[i].LootChance) 
			{
                items[i].Inventory++;
                if (items[i].Name == "nothing") 
				{
                    items[i].Inventory--;
                }
                writeToTextArea("You received " + items[i].Name);
                count++;
            }
        }
    }
}

function action() // main function that gets called when the user clicks the action button
{
    var chanceTOCallFunction = Math.floor(Math.random() * 5) + 1;
    var playerTurn = 1; 
    var enemyTurn = 0;
	var userInput = document.getElementById("userInput").value.toLowerCase(); // gets the input from the user and converts it to lower case 
  
    var strArray = userInput.split(" ");  // splits user input by a space " " and stores the values in the strArray
	
if(newUser.Profession == " ")
{
    for (var i = 0; i < strArray.length; i++) {
        var bool = 0;
        
        if (strArray[i] == "description") {

            for (var i = 0; i < strArray.length; i++) {

                var professionCheck = strArray[i];

                switch (professionCheck) {
                    case "scientist":
                        infoScientist();
                        bool = 1;
                        break;
                    case "mercenary":
                        infoMercenary();
                        bool = 1;
                        break;
                    case "engineer":
                        infoEngineer();
                        bool = 1;
                        break;
					default:
						if(i >= 1 && bool != 1)
						 writeToTextArea("Try typing: <description> + the profession you wish to find out more about!");
						
                }
            }
        }
        else {
            bool = 0;
		
            if (strArray != "description" && strArray[i] != "yes") {

                writeToTextArea("Try typing: <description> + the profession you wish to find out more about!");

            }
			else {
                if (strArray[i] == "yes" && choiceCount == 1) {
                    writeToTextArea("You have chosen The Scientist");
                    newUser.Profession = "scientist";
                }
                else if (strArray[i] == "yes" && choiceCount == 2) {
                    writeToTextArea("You have chosen The Mercenary");
                    newUser.Profession = "mercenary";
                }
                else if (strArray[i] == "yes" && choiceCount == 3) {
                    writeToTextArea("You have chosen The Engineer");
                    newUser.Profession = "engineer";
                }
            }
        }
    }
}  
		
		
		
    for (var i = 0; i < strArray.length; i++) // loops through contense of strArray 
    {
        if (strArray[i] == "check")  // if key word "check" is found enter next loop 
        {
            for (var i = 0; i < strArray.length; i++) // now check has been found loop through the keyword Array to see if the user has type a key word 
            {
                for (var j = 0; j < keywordArray.length; j++)
                {

                    if (strArray[i] == keywordArray[j]) // if users input equals an element in the key word array 
                    {
                        userCheckKeyword = strArray[i]; // sets this variable to the users word.

                        switch (userCheckKeyword) // switch case used to identify what element in the keyword array was found 
                        {

                            case "status":  // exmaple if the user types check status this case would be true and the following code would be executed
                                userStatus();
								playerTurn = 0;
                                break;

                            case "inventory":
                                userInventory();
								playerTurn = 0;
                                break;

                            case "enemy":
                                enemyInfo();
								playerTurn = 0;
                                break;

                            case "health":
                                userHealth();
								playerTurn = 0;
                                break;
                        }
                    }
                }

            }
        }
    }
	
	// might want to move this text parser somewhere else as I don't know where to put it
    var countTemp = 0;
    for (var i = 0; i < strArray.length; i++) // this is the text parser for going around the map
    {
	
        if (strArray[i] == "go") // checking for the "go" keyword 
		{
            for (var i = 0; i < strArray.length; i++) 
			{
                for (var j = 0; j < directions.length; j++) // loops through direction array and checks whether a valid direction has been typed 
				{
                    if (countTemp == 0) 
					{
                        if (strArray[i] == directions[j].name) // gets the name of the direction object found by previous loop
						{

                            newUser.CoOrdinates.Yaxis = newUser.CoOrdinates.Yaxis + directions[j].YAxis; //increase or decreases the y axis of the user's character depending on the direction they are going
                            newUser.CoOrdinates.Xaxis = newUser.CoOrdinates.Xaxis + directions[j].XAxis; //increase or decreases the x axis of the user's character depending on the direction they are going
                            countTemp = 1;
                            //alert (newUser.CoOrdinates.Xaxis + " " + newUser.CoOrdinates.Yaxis)
                            if (newUser.CoOrdinates.Yaxis > Math.floor(Math.random() * 15) + 10 || newUser.CoOrdinates.YAxis < Math.floor(Math.random() * -15) - 10) //sets the boundaries of the for the y axis. The range is from 10 to 15 or 10 to 25???
                            {
                                writeToTextArea("You have left the (whatever place we are setting the game on)")
                            }
                            else if (newUser.CoOrdinates.XAxis > Math.floor(Math.random() * 15) + 10 || newUser.CoOrdinates.XAxis < Math.floor(Math.random() * -15) - 10) //sets the boundaries of the for the x axis. The range is from 10 to 15 or 10 to 25???
                            {
                                writeToTextArea("You have left the (whatever place we are setting the game on)")
                            }
                            else 
							{
								
								checkValue = 1;
                                writeToTextArea("You went " + directions[j].name); // writting to text area the direction the user chose to go 
								playerTurn = 0;
                                alert(newUser.CoOrdinates.Xaxis + "," + newUser.CoOrdinates.Yaxis);
								if(newUser.Location == "plainGround"){ // calls required function depending on the users location 
                                eventsGen();
								}
								else if(newUser.Location == "Cave"){
								caveEventsGen();
							}
							
                                //document.getElementById("input").value = "";
                            }
                            
							// the following if statements are to find out what coOrdinate the user wants to move to and what direction the user will now be facing  
							
							//forward
                            if (directions[j].name == "forward" && directionFace == "forward") {
                                directionFace = "forward"
                                directions[0].name = "forward"
                                directions[1].name = "right"
                                directions[2].name = "backward"
                                directions[3].name = "left"
                            }
                            if (directions[j].name == "left" && directionFace == "forward") {
                                directionFace = "left"
                                directions[0].name = "right"
                                directions[1].name = "backward"
                                directions[2].name = "left"
                                directions[3].name = "forward"
                            }
                            if (directions[j].name == "right" && directionFace == "forward") {
                                directionFace = "right"
                                directions[0].name = "left"
                                directions[1].name = "forward"
                                directions[2].name = "right"
                                directions[3].name = "backward"
                            }
                            if (directions[j].name == "backward" && directionFace == "forward") {
                                directionFace = "backward"
                                directions[0].name = "backward"
                                directions[1].name = "left"
                                directions[2].name = "forward"
                                directions[3].name = "right"
                            }

                            //right
                            if (directions[j].name == "forward" && directionFace == "right") {
                                directionFace = "right"
                                directions[0].name = "left"
                                directions[1].name = "forward"
                                directions[2].name = "right"
                                directions[3].name = "backward"
                            }
                            if (directions[j].name == "left" && directionFace == "right") {
                                directionFace = "forward"
                                directions[0].name = "forward"
                                directions[1].name = "right"
                                directions[2].name = "backward"
                                directions[3].name = "left"
                            }
                            if (directions[j].name == "right" && directionFace == "right") {
                                directionFace = "backward"
                                directions[0].name = "backward"
                                directions[1].name = "left"
                                directions[2].name = "forward"
                                directions[3].name = "right"
                            }
                            if (directions[j].name == "backward" && directionFace == "right") {
                                directionFace = "left"
                                directions[0].name = "right"
                                directions[1].name = "backward"
                                directions[2].name = "left"
                                directions[3].name = "forward"
                            }

                            //left
                            if (directions[j].name == "forward" && directionFace == "left") {
                                directionFace = "left"
                                directions[0].name = "left"
                                directions[1].name = "forward"
                                directions[2].name = "right"
                                directions[3].name = "backward"
                            }
                            if (directions[j].name == "left" && directionFace == "left") {
                                directionFace = "backward"
                                directions[0].name = "backward"
                                directions[1].name = "left"
                                directions[2].name = "forward"
                                directions[3].name = "right"
                            }
                            if (directions[j].name == "right" && directionFace == "left") {
                                directionFace = "forward"
                                directions[0].name = "forward"
                                directions[1].name = "right"
                                directions[2].name = "backward"
                                directions[3].name = "left"
                            }
                            if (directions[j].name == "backward" && directionFace == "left") {
                                directionFace = "right"
                                directions[0].name = "left"
                                directions[1].name = "forward"
                                directions[2].name = "right"
                                directions[3].name = "backward"
                            }

                            // back

                            if (directions[j].name == "forward" && directionFace == "backward") {
                                directionFace = "backward"
                                directions[0].name = "backward"
                                directions[1].name = "left"
                                directions[2].name = "forward"
                                directions[3].name = "right"
                            }
                            if (directions[j].name == "left" && directionFace == "backward") {
                                directionFace = "right"
                                directions[0].name = "backward"
                                directions[1].name = "right"
                                directions[2].name = "left"
                                directions[3].name = "backward"
                            }
                            if (directions[j].name == "right" && directionFace == "backward") {
                                directionFace = "left"
                                directions[0].name = "right"
                                directions[1].name = "backward"
                                directions[2].name = "left"
                                directions[3].name = "forward"
                            }
                            if (directions[j].name == "backward" && directionFace == "backward") {
                                directionFace = "forward"
                                directions[0].name = "forward"
                                directions[1].name = "right"
                                directions[2].name = "backward"
                                directions[3].name = "left"
                            }
                            
							
							for(var i = 0; i < locations.length; i++) 
							{
								if (locations[i].Xaxis == newUser.CoOrdinates.Xaxis && locations[i].Yaxis == newUser.CoOrdinates.Yaxis) // checks where the user is on the map and if they are in a new location 
								{
									writeToTextArea("You have discovered a " + locations[i].Name + "! move DOWN to explore!");
									currentLocation = locations[i].Name; 
								}
							}
							
							// dev comments  
							
							
							//if (newUser.CoOrdinates.Xaxis >= 3 && newUser.CoOrdinates.Yaxis >= 2 && newUser.CoOrdinates.Xaxis <= 5 && newUser.CoOrdinates.Yaxis <= 5) // just used as an example. i have suggested that within these coOrdinates the user can see the cave
							//{
							//	writeToTextArea("If you move to area 6,2 you will find a Forgotten Cave! or you can turn around and explore a different area!"); // i think we should tell the user where they are etc. allowing them to navigate to areas
							//}
							//if (newUser.CoOrdinates.Xaxis == 6 && newUser.CoOrdinates.Yaxis == 2) //this works and we can use this as a base to find locations.
							//{
							//	writeToTextArea("You have discovered The Forgotten Cave! move DOWN to explore!");
							//}
                        }	
                    }
					
                }
            }
					for (var j = 0; j < strArray.length; j++) // loop to find the key word Down! or up! 
								{
										if (strArray[j] == "down") 
										{
											
											writeToTextArea("You have moved down to " + currentLocation + " Have umm fun...?");
											newUser.CoOrdinates.Xaxis = 0; // reset coOrdinates to 0,0 as its a new area 
											newUser.CoOrdinates.Yaxis = 0;
											directionFace = "forward";
											newUser.Location = currentLocation;
										}
										else if (strArray[j] == "up" && newUser.CoOrdinates.Xaxis == 5 && newUser.CoOrdinates.Yaxis == 5) // if the user navigates to this spot and inputs up, they will return to original coOrdinates.
										{																						//allowing them to carry on with the game etc.
											newUser.CoOrdinates.Xaxis = locations[i].Xaxis;
											newUser.CoOrdinates.Yaxis = locations[i].Yaxis
											newUser.Location = "plainGround";
											writeToTextArea("You have now left" + currentLocation);
										}
								}
		}
		
    }
	
	
	if (chosenMonster.Name == "null" && checkValue == 0) // sets monster to null so the user cannot keep attacking that dead monster
	{
		writeToTextArea("There are no enemies to attack")
		document.getElementById("userInput").value = "";
	}
	else
	{
    if (playerTurn == 1)
    {
        if (count == 0)
        {
			
            currentMonsterHealth = chosenMonster.Health;
            count = 1;
			
        }
        else
        {
			checkValue = 1;
            //weapon text parser
            for (var i = 0; i < strArray.length; i++)
            {
                for (var j = 0; j < weapon.length; j++)
                {
                    if (strArray[i] == weapon[j].Name)
                    {
                        userWeapon = strArray[i];
                        userWeaponDamage = weapon[j].Damage;
                        playerTurn = 0;
                        enemyTurn = 1;
                    }
                }
            }
            //attack text parser
            for (var i = 0; i < strArray.length; i++)
            {
                for (var j = 0; j < actionArray.length; j++)
                {
                    if (strArray[i] == actionArray[j].Name)
                    {
                        userAction = strArray[i];
                        userActionDamage = actionArray[j].DamageMulti;
                        userOverallDamage = userWeaponDamage * userActionDamage;
                        currentMonsterHealth = currentMonsterHealth - userOverallDamage;
                        writeToTextArea("" + newUser.Name + " " + userAction + " " + chosenMonster.Name + " with " + userWeapon + " Dealing " + userOverallDamage);
                        writeToTextArea(chosenMonster.Name + " has " + currentMonsterHealth + " Health remaining");
                        playerTurn = 0;
                        enemyTurn = 1;
                    }
                }
            }
            //items text parser
            for (var i = 0; i < strArray.length; i++)
            {
                for (var j = 0; j < items.length; j++)
                {
                    if (strArray[i] == items[j].Name)
                    {
                        if (items[j].Inventory == 0)
                        {
                            writeToTextArea(newUser.Name + " don't have " + items[j].Name + "s in your inventory");
                        }
                        else
                        {
                            newUser.Health = newUser.Health + items[j].Value;
                            if (newUser.Health > newUser.MaxHealth)
                            {
                                newUser.Health = newUser.MaxHealth;
                            }
                            playerTurn = 0;
                            enemyTurn = 1;
                            items[j].Inventory--;
                            writeToTextArea("Your current health is " + newUser.Health + " " + newUser.Name + " have gained " + items[j].Value + "HP" + "\n" + "You have used " + items[j].Name);
                        }
                    }
                }
            }
        }
    }

    if (enemyTurn == 1)
    {
        playerTurn = 1;
        enemyTurn = 0;
        if (newUser.Health >= 0 && currentMonsterHealth >= 0) // statement that checks if the monsters health is less than 0 
        {
            newUser.Health = newUser.Health - chosenMonster.MonDamage;
            writeToTextArea(chosenMonster.Name + " has Attacked you! Dealing: " + chosenMonster.MonDamage + " Damage" + " You have: " + newUser.Health + " Health remaining");
        }
        if (newUser.Health <= 0)
        {
            writeToTextArea("\n\n You Have Been Defeated!\n\n");
            defeat();
        }
    }
	
    if (currentMonsterHealth <= 0)
    {
        count = 1;
        monstersKilled.push(chosenMonster.Name);
        newUser.EXP = newUser.EXP + chosenMonster.EXP; //adds the monster's exp to the user's current EXP
        //drops();
        while (newUser.EXP >= newUser.MaxEXP)
        {
            newUser.Level = newUser.Level + 1; //increase level by one
            newUser.MaxHealth = newUser.MaxHealth + 10 * newUser.Level; //increases user's max health by 10 * the user's current level
            newUser.Health = newUser.MaxHealth; //current health fills back up after levelling up
            //newUser.DMG =  Math.round((newUser.DMG + 2 + Math.floor(Math.random() * 3) + 1) * 1.02);
            newUser.EXP = newUser.EXP - newUser.MaxEXP; // used so that the loop will keep looping until newUser.EXP is lesser than newUser.MaxEXP
            newUser.MaxEXP = newUser.MaxEXP + 10 * newUser.Level;
            writeToTextArea("You levelled up to LVL: " + newUser.Level + "\nHealth is now: " + newUser.MaxHealth + "\nNext amount of EXP needed to level up is: " + newUser.MaxEXP);

        }
		if(chosenMonster.Name != "null")
        writeToTextArea("You gained " + chosenMonster.EXP + " EXP")
        //drops();
		chosenMonster = monsters[4];
        //spawnMonster(); // creates another monster to fight against
		checkValue = 0;
        count = 0;

    }
	}
}



function writeToTextArea(string) // function that takes a string as an arguement and writes that string to the text area 
{
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}
// gen monster 
function spawnMonster() 
{
    var rand = Math.floor(Math.random() * monsters.length);
	chosenMonster = monsters[rand];
	if(chosenMonster.Name == "null")
	{
		 spawnMonster();
	}else
	{
    currentMonsterHealth = chosenMonster.Health;
    writeToTextArea("You are fighting: " + chosenMonster.Name);
	}
}
 // spawns cave monsters  
function spawnCaveMonster()
{
	var rand = Math.floor(Math.random() * caveMonsters.length);
	chosenMonster = caveMonsters[rand];
	if(chosenMonster.Name == "null")
	{
		spawnCaveMonster();
	}
	else
	{
		currentMonsterHealth = chosenMonster.Health;
		writeToTextArea("You are fighting: " + chosenMonster.Name);
	}
}

function spawnChest() 
{
	checkValue = 1;
    writeToTextArea("You found a chest");
    drops();
}

function userStatus() {
    writeToTextArea("You have chosen to Check Status");
    writeToTextArea("Your Current level is: " + newUser.Level);			// functions linked to switch case  

    for (var i = 0; i < monstersKilled.length; i++) 
	{
        writeToTextArea("Monster killed: " + monstersKilled[i]);

    }
}

function userInventory() // function that writes the users current inventory to the text area 
{
    for (var i = 0; i < items.length; i++) 
	{
        if (items[i].Inventory > 0) 
		{
            writeToTextArea("Item Name: " + items[i].Name + " Quantity: " + items[i].Inventory);
        }
    }
    writeToTextArea("Your Inventory: ");
}

function enemyInfo()
{
    writeToTextArea("You are currently fighting: " + chosenMonster.Name);
    writeToTextArea(chosenMonster.Name + " Spawned with " + chosenMonster.Health + "HP" + " and now has: " + currentMonsterHealth + "HP remaining " + " Keep fighting!");
    writeToTextArea("Enemy Information: ");
}

function userHealth()
{
	writeToTextArea("Your health is now " + newUser.Health + " out of " + newUser.MaxHealth);
}

function roamingLoot() // special weapons function. this function has a low chance of ever being called 
{
	checkValue = 1;
    var weaponChance = Math.floor(Math.random() * 100) + 1;
	
	for(var i = 0; i < weapon.length; i++)
	{
		if(weapon[i].Name == "dragonblade" || weapon[i].Name == "ghostblade")
		{
			writeToTextArea("Found no New Item");
			return 0;
		}
		
	}
    if (newUser.Level <= 3 && weaponChance <= 70)
    {		
			weapon.push(new weapons("dragonblade", 45, weaponPrefix[4]));	
			writeToTextArea("You have found some special Loot!");
			writeWeaponToTextArea();
    }
    else if (newUser.Level > 3 && newUser.Level <= 5 && weaponChance > 70)
    {
        weapon.push(new weapons("ghostblade", 70, weaponPrefix[6]));
		writeToTextArea("You have found some special Loot!");
		writeWeaponToTextArea();
    }else
	{
		writeToTextArea("You have not found anything this time! maybe your level is not high enough!!");
	}
   
}
function writeWeaponToTextArea()
{
	 for (var i = 0; i < weapon.length; i++)
    {
        var count = i;
        if (count == weapon.length - 1)
        {
            writeToTextArea("New Weapon Found: " + weapon[count].Name);
        }
    }
	
}
function defeat()  // gets called if the user dies. game over 
{
    newUser.Health = 200;
    newUser.MaxHealth = 200;
    newUser.Level = 1;
    newUser.EXP = 0
    newUser.MaxEXP = 20;
    start();
}

function infoScientist()
{
	
	writeToTextArea("The Scientist: \nHere, in The Facility, you have made ground breaking genetic discoveries. Although, one deal with the Government has ruined the career you have built. This deal was to create a genetically enhanced weapon to pacify riots and eliminate opposition. That was until the failed prototypes escaped and the Government pinned the inhumane experiments on you. You are now exiled to the plains where most of these experiments now roam.");
	writeToTextArea("If you wish to take on this profession type yes");
	writeToTextArea("or keep reading the other descriptions");
	choiceCount = 1;
}

function infoMercenary()
{
	writeToTextArea("The Mercenary: \nExtensive combat experience had your instincts screaming at you that there was something off with this next job. The Facility was a highly classified Government research facility that had top notch security. The fact that they hired you was a mystery until the monsters broke free from their creators. As the lone survivor of the massacre, you have been exiled by the Government to the plains in order to maintain secrecy.");
	writeToTextArea("If you wish to take on this profession type yes");
	writeToTextArea("or keep reading the other descriptions");
	choiceCount = 2;
}

function infoEngineer()
{
    writeToTextArea("The Engineer: \nAs a craftsman, you made sure that every part of your product was built to your client’s specification. That was until the Government placed a very cryptic order for “very large and strong cages”. Not knowing what the purpose was for these cages, you proceeded to build them but once the cages were loaded with monstrosities beyond human belief you knew that the cages wouldn’t last long. Following the Government’s cryptic instructions proved to be your worst mistake. You have now been exiled from civilisation for suspected sabotage and treason.");
    writeToTextArea("If you wish to take on this profession type yes");
    writeToTextArea("or keep reading the other descriptions");
    choiceCount = 3;
}

