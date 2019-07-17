var possibleItems = document.getElementById("possibleItems");
var myPool = document.getElementById("myPool");

const MAX_ITEMS = 8;
var itemsBench  = [];

// Fill Tier 1 pool
var tier1Items = [2, 3, 5, 7, 11, 13, 17, 19];
var itemPool = document.getElementById("pool");
for (var i = 0; i < tier1Items.length; i++) {
    createItem(getItem(tier1Items[i]), itemPool);
}

function refreshBench() {
    // Reset
    while (myPool.firstChild)
        myPool.removeChild(myPool.firstChild);
    // Fill
    for (var i = 0; i < itemsBench.length; i++) {
        var img = createImage(itemsBench[i], "items", "icon");
        const index = i;
        img.addEventListener("click", function() { removeTier1Item(index); });
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
            img.addEventListener("mouseover", function() { highlight(focus); });
            img.addEventListener("mouseout", function() { highlight(focus); });
            img.addEventListener("click", function() { removeTier2Item(focus); });
            if (!possible.includes(combined[0])) {
                possible.push(combined[0]);
                possibleItems.appendChild(img);
            }
        }
}

function highlight(focus) {

    // Highlight focus
    var nodes = possibleItems.childNodes;    
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.getAttribute("value") == focus) {
            node.classList.toggle("highlight");
            break;
        }
    }
        
    // Parse itemsBench and highlight components
    nodes = myPool.childNodes;
    for (var i = 0; i < itemsBench.length; i++)
        if ((focus % itemsBench[i][0]) == 0)
            nodes[i].classList.toggle("highlight");

}

// Add item to bench
function addItem(item) {
    if (itemsBench.length < MAX_ITEMS)
        itemsBench.push(item);
        refreshPossibleItems();
        refreshBench();
}

// Remove item from bench
function removeTier1Item(index) {
    if ((index < 0) || (index >= itemsBench.length)) return;
    if (isTier1(itemsBench[index]))
        itemsBench.splice(index, 1);
    refreshPossibleItems();
    refreshBench();
}

// Remove combined item and components from bench
function removeTier2Item(id) {
    if (!tier1Items.includes(id))
        for (var i = 0; i < tier1Items.length; i++) {
            var div = tier1Items[i];
            if ((id % div) == 0) {
                removeTier1Item(itemIndex(div));
                removeTier1Item(itemIndex(id / div));
                return;
            }
        }
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

function itemIndex(id) {
    for (var i = 0; i < itemsBench.length; i++)
        if (itemsBench[i][0] == id)
            return i;
    return -1;
}
function isTier1(item) { return tier1Items.includes(item[0]); }