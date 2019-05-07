var entries = [
{	title: "DFT Paint",
	dir: "./projects/FourierPaint/",
	thumbnail: "thumbnail.jpg",
	description: "Convert a path into epicycles using Discrete Fourier Transform",
	demo: "paint.html",
	source: "https://github.com/DomKiki/DFT-Paint" },
{ 
	title: "Langton's Ant",
	dir: "./projects/LangtonAnt/",
	thumbnail: "thumbnail.png",
	gif: "thumbnail.gif",
	description: "Play with the settings and discover amazing patterns of Langton's Ant",
	demo: "langton.html",
	source: "https://github.com/DomKiki/Langton-Ant"},
{	title: "Tesseract",
	dir: "./projects/Tesseract/",
	thumbnail: "thumbnail.png",
	gif: "thumbnail.gif",
	description: "Explore the 4th dimension by rotating a hypercube",
	demo: "tesseract.html",
	source: "https://github.com/DomKiki/Tesseract" }];

for (var entry of entries)
	createProject(entry);

function createProject(entry) {
	
	var root = document.getElementById("projects");
	
	var project = document.createElement('DIV');
	project.className = "project";
	
	var header = document.createElement('DIV');
	header.className = "project-header";
	
	var thumbnail = document.createElement('DIV');
	thumbnail.className = "project-thumbnail";
	thumbnail.style     = "background-image: url('" + entry.dir + entry.thumbnail + "')";
	if (entry.hasOwnProperty('gif')) {
		thumbnail.addEventListener("mouseover", function() { this.style = "background-image: url('" + entry.dir + entry.gif       + "')"; });
		thumbnail.addEventListener("mouseout",  function() { this.style = "background-image: url('" + entry.dir + entry.thumbnail + "')"; });
	}
	
	var h3 = document.createElement('H3');
	h3.innerHTML = entry.title;
	
	var description = document.createElement('DIV');
	description.className = "project-description";
	
	var descriptionP = document.createElement('P');
	descriptionP.innerHTML = entry.description;
	
	var buttons = document.createElement('DIV');
	buttons.className = "buttons";
	
	var demo = document.createElement('A');
	demo.href = entry.dir + entry.demo;
	demo.innerHTML = "Demo";
	
	var source = document.createElement('A');
	source.className = "small";
	source.href = entry.source;
	source.innerHTML = "Source";
	
	// Russian dolls
	
	header.appendChild(thumbnail);
	header.appendChild(h3);
	project.appendChild(header);
	
	description.appendChild(descriptionP);
	project.appendChild(description);
	
	buttons.appendChild(demo);
	buttons.appendChild(source);
	project.appendChild(buttons);
	
	root.appendChild(project);
	
}