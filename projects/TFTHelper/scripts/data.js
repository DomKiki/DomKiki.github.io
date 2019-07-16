let items = [
    [ 2,   "BF Sword", "bfsword" ],
    [ 3,   "Rod", "needlesslylargerod" ],
    [ 5,   "Bow", "recurvebow" ],
    [ 7,   "Tear", "tearofthegoddess" ],
    [ 11,  "Chainvest", "chainvest" ],
    [ 13,  "Negatron", "negatroncloak" ],
    [ 17,  "Belt", "giantsbelt" ],
    [ 19,  "Spatula", "spatula" ],
    [ 4,   "IE", "infinityedge" ],
    [ 6,   "Hextech", "hextechgunblade" ],
    [ 10,  "Divine", "swordofthedivine" ],
    [ 14,  "Shojin", "spearofshojin" ],
    [ 22,  "Guardian Angel", "guardianangel" ],
    [ 26,  "Bloodthirster", "bloodthirster" ],
    [ 34,  "Zeke", "zekesherald" ],
    [ 38,  "Youmuu", "youmuusghostblade" ],
    [ 9,   "Rabadon", "rabadonsdeathcap" ],
    [ 15,  "Guinsoo", "guinsoosrageblade" ],
    [ 21,  "Luden", "ludensecho" ],
    [ 33,  "Solari", "locketoftheironsolari" ],
    [ 39,  "Ionic", "ionicspark" ],
    [ 51,  "Morello", "morellonomicon" ],
    [ 57,  "Yuumi", "yuumi" ],
    [ 25,  "Firecannon", "rapidfirecannon" ],
    [ 35,  "Statik", "statikkshiv" ],
    [ 55,  "Phantom Dancer", "phantomdancer" ],
    [ 65,  "Cursed Blade", "cursedblade" ],
    [ 85,  "Titanic", "titanichydra" ],
    [ 95,  "BotRK", "bladeoftheruinedking" ],
    [ 49,  "Seraph", "seraphsembrace" ],
    [ 77,  "Frozen Heart", "frozenheart" ],
    [ 91,  "Silence", "hush" ],
    [ 119, "Redemption", "redemption" ],
    [ 133, "Darkin", "darkin" ],
    [ 121, "Thornmail", "thornmail" ],
    [ 143, "Disarm", "swordbreaker" ],
    [ 187, "Red Buff", "redbuff" ],
    [ 209, "Knight's Vow", "knightsvow" ],
    [ 169, "Claw", "dragonsclaw" ],
    [ 221, "Zephyr", "zephyr" ],
    [ 247, "Runaan", "runaanshurricane" ],
    [ 289, "Warmog", "warmogsarmor" ],
    [ 323, "Frozen Mallet", "frozenmallet" ],
    [ 361, "Force of Nature", "forceofnature" ]
];

function getItem(index) {
    for (var i = 0; i < items.length; i++)
        if (items[i][0] == index)
            return items[i];
    return -1;
}

function combineItems(item1, item2) {
    if ((item1 > 19) || (item2 > 19)) return -1;
    return ((getItem(item1) == -1) || (getItem(item2) == -1)) ? -1 : getItem(item1 * item2);
}