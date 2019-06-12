/************************** GUI **********************/

function initGUI() {

	Controls = function() {
		this.shrink    = shrink;
		this.minLen    = minLen;
        this.branches  = branches;
        this.colors    = function() { switchColorMode(); }
        this.showClock = function() { switchClock(); }
    }
    
	ctrl  = new Controls();
    gui   = new dat.GUI();
    
	gui.add(ctrl, "shrink", 0.3, 0.7, 0.001)       .name("Shrink")     .onChange(function(value) { updateShrink(value) });
	gui.add(ctrl, "minLen", 0.1, clockRadius, 0.01).name("Min. Length").onChange(function(value) { updateMinLen(value) });
    gui.add(ctrl, "branches", 0, 3, 1)             .name("Branches")   .onChange(function(value) { updateBranches(value) });
    btnColorMode = gui.add(ctrl, "colors")         .name("Indiv. Color");
    btnShowClock = gui.add(ctrl, "showClock")      .name("Hide Clock");

}

function updateShrink(value) { 
	shrink = value;
	ctrl.shrink = value;
}

function updateMinLen(value) { 
	minLen = value;
	ctrl.minLen = value;
}

function updateBranches(value) {
	branches = value;
	ctrl.branches = value;
}

function switchColorMode() {
    colorMod = (colorMod + 1) % 2;
    let name;
    if      (colorMod == CM_NONE)   name = "No Color";
    else if (colorMod == CM_INDIV)  name = "Indiv. Color";
    //else if (colorMod == CM_SINGLE) name = "Single Color";
    btnColorMode.name(name);
}

function switchClock() {
    showClock = !showClock;
    btnShowClock.name((showClock) ? "Hide Clock" : "Show Clock");
}