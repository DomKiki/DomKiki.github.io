var possibleItems = document.getElementById("possibleItems");
var myPool = document.getElementById("myPool");

const MAX_ITEMS = 8;
var itemsBench  = [];

function refreshBench() {
    // Reset
    while (myPool.firstChild)
        myPool.removeChild(myPool.firstChild);
    // Fill
    for (var i = 0; i < itemsBench.length; i++) {
        var img = createImage(itemsBench[i], "items", "icon");
        const index = i;
        img.addEventListener("click", function() {
            removeItem(index);
        })
        myPool.appendChild(img);
    }
}

function refreshPossibleItems() {
    // Reset
    while (possibleItems.firstChild)
        possibleItems.removeChild(possibleItems.firstChild);
    // Fill
    var possible = [];
    for (var i = 0; i < (itemsBench.length - 1); i++)
        for (var j = (i + 1); j < itemsBench.length; j++) {
            var combined = combineItems(itemsBench[i][0], itemsBench[j][0]);
            var img = createImage(combined, "items", "smallIcon");
            const focus = combined[0];
            img.addEventListener("click", function() { highlight(focus); });
            if (!possible.includes(combined[0])) {
                possible.push(combined[0]);
                possibleItems.appendChild(img);
            }
        }
}

function highlight(focus) {

    // Parse itemsBench and highlight focus
    var nodes = possibleItems.childNodes;    
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.value == focus) {
            console.log("highlight " + focus)
            node.classList.toggle("highlight");
            return;
        }
    }
        
    // Parse possible combinations and highlight involved items
}

// Add item to bench
function addItem(item) {
    if (itemsBench.length < MAX_ITEMS)
        itemsBench.push(item);
        refreshPossibleItems();
        refreshBench();
}

// Remove item from bench
function removeItem(index) {
    itemsBench.splice(index, 1);
    refreshPossibleItems();
    refreshBench();
}

function createImage(item, repo, clas) {
    if (item == -1) return;

    var img = document.createElement("IMG");
    img.setAttribute("src", "./" + repo + "/" + item[2] + ".png");
    img.setAttribute("alt", item[1]);
    img.setAttribute("class", clas);
    img.setAttribute("value", item[0]);

    return img;
} 

function createItem(item, div) {
    if (item == -1) return;

    var img = document.createElement("IMG");
    img.setAttribute("src", "./items/" + item[2] + ".png");
    img.setAttribute("alt", item[1]);
    img.setAttribute("class", "icon");
    img.addEventListener("click", function() { 
        const const_item = item;
        addItem(const_item);
    });
    div.appendChild(img);

    return img;
}

// Fill Tier 1 pool
var tier1Items = [2, 3, 5, 7, 11, 13, 17, 19];
var itemPool = document.getElementById("pool");
for (var i = 0; i < tier1Items.length; i++) {
    createItem(getItem(tier1Items[i]), itemPool);
}