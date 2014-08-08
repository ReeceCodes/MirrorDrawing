//my variables. probaly want to get some into a namgespace
//moved all canvas gets here so I didn't have to create new variables over and over when the same element is what I want.
var can = document.getElementById('can');
var mir = document.getElementById('mir');
var hid = document.getElementById('hid');

var t = [];
var t2 = [];
var x;
var y;
var moving = false;
var moving2 = false;
var points = [];
var points2 = [];
var prevpoint = -1;
var prevpoint2 = -1;
function point(x,y){
	this.x  = x;
	this.y = y;
	this.drawn = false;
	this.px = MD.PX;
	this.color = MD.COLOR;
	
}

var MD = MD || (MD = {});
MD.PX = 1;
MD.COLOR = 'black';
MD.DRAWTYPE = 'old';
MD.CW = 200;
MD.CH = 350;

//options

function SetPX(ddl){
	MD.PX = ddl.options[ddl.selectedIndex].value || 1; 
	}
	
function SetColor(ddl){
	MD.COLOR = ddl.options[ddl.selectedIndex].value || 'black'; 
	}
	
function SetType(ddl){
	MD.DRAWTYPE = ddl.options[ddl.selectedIndex].value || 'old'; 
}

function SetDimension(ddl, dimension){
	if (dimension == "W"){
		MD.CW = ddl.options[ddl.selectedIndex].value || 200;
		can.width = MD.CW;
		mir.width = MD.CW;
		hid.width = MD.CW * 2;
	}
	else{
		MD.CH = ddl.options[ddl.selectedIndex].value || 350;
		can.height = MD.CH;
		mir.height = MD.CH;
		hid.height = MD.CH;
	}
}
	
//add and disable events, create defaults where needed
function setup(body){
	can = can || document.getElementById('can');
	mir = mir || document.getElementById('mir');
	hid = hid || document.getElementById('hid');

	var linewidth = document.getElementById('LineWidth');
	var linecolor = document.getElementById('LineColor');
	var imglink = document.getElementById('IMGLink');
	var drawtype = document.getElementById('DrawType');
	var ddlHeight = document.getElementById('CanvasHeight');
	var ddlWidth = document.getElementById('CanvasWidth');
	
	//add options
	linewidth.addEventListener('change', function(){
		SetPX(linewidth);
	});
	
	linecolor.addEventListener('change', function(){
		SetColor(linecolor);
	});
	
	//broke the old/new so default to old
	//drawtype.addEventListener('change', function(){
	//	SetType(drawtype);
	//});
	
	imglink.addEventListener('click', function(){
		SaveLink();
	});
	
	ddlHeight.addEventListener('change', function(){
		SetDimension(ddlHeight, 'H');
	});
	
	ddlWidth.addEventListener('change', function() {
		SetDimension(ddlWidth, 'W');
	});
	
	//end options
	
	//add events to body to make sure it's not outside the canvas and still drawing, just has to stop events
	//if it's in the body and not in the canvas push one last point where it picked it up so it draws to the edge of the canvas and stop the moving.
	//doesn't work as well on touch but it's harder to get to the edge on there too
	body.addEventListener('touchmove', function(e){
		
		if (moving){
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY - can.offsetParent.offsetTop;
			
			if (x < 0 + can.offsetLeft || x >= can.width + can.offsetLeft || y < 0 + can.offsetTop || y >= can.height + can.offsetTop){
				var p = new point(x,y);
				points.push(p);
				
				notdrawing(false, null);
				return;
			}
			
			var p = new point(x,y);
			points.push(p);
		}
		
		if (moving2){
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY - mir.offsetParent.offsetTop;
			
			if (x < 0 + mir.offsetLeft || x >= mir.width + mir.offsetLeft || y < 0 + mir.offsetTop || y >= mir.height + mir.offsetTop){
				var p = new point(x,y);
				points2.push(p);
				
				notdrawingMirror(false,null);
				return;
			}
			
			var p = new point(x,y);
			points2.push(p);
		}
		
	}, false);
	
	body.addEventListener('mousemove',function(e){ 
	
		if (moving){
			x = (window.Event) ? e.pageX : event.clientX;
			y = (window.Event) ? e.pageY : event.clientY;
			
			x -= can.offsetParent.offsetLeft;
			y -= can.offsetParent.offsetTop;
			
			if (x < 0 + can.offsetLeft || x >= can.width + can.offsetLeft || y < 0 + can.offsetTop || y >= can.height + can.offsetTop){
				var p = new point(x,y);
				points.push(p);
				
				notdrawing(false,null);
				return;
			}
			
			var p = new point(x,y);
			points.push(p);
		}
		
		if (moving2){
			x = (window.Event) ? e.pageX : event.clientX;
			y = (window.Event) ? e.pageY : event.clientY;
			
			x -= mir.offsetParent.offsetLeft;
			y -= mir.offsetParent.offsetTop;
			
			if (x < 0 + mir.offsetLeft || x >= mir.width + mir.offsetLeft || y < 0 + mir.offsetTop || y >= mir.height + mir.offsetTop){
				var p = new point(x,y);
				points2.push(p);
				
				notdrawingMirror(false,null);
				return;
			}
			
			var p = new point(x,y);
			points2.push(p);
		}
	
	},false);
	
	//add touch events
	
	can.addEventListener('touchstart', function(e){
		e.preventDefault();
		
		can.style.cursor = 'crosshair';
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY - can.offsetParent.offsetTop;
		
		var p = new point(x,y);
		points.push(p);
		drawing();
	}, false);
	
	can.addEventListener('touchmove', function(e){
		e.preventDefault();
		if (moving){
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY - can.offsetParent.offsetTop;
			
			//if it's on the left/top/bottom stop, if it's on the right then move to other canvas
			if (x < 0 + can.offsetLeft || x >= can.width + can.offsetLeft || y < 0 + can.offsetTop || y >= can.height + can.offsetTop){
				notdrawing(false, null);
				return;
			}
			
			var p = new point(x,y);
			
			points.push(p);
		}
		
	}, false);
	
	can.addEventListener('touchend', function(e){
		e.preventDefault();
		notdrawing(false, null);
	},false);
	
	mir.addEventListener('touchstart', function(e){
		e.preventDefault();
		
		mir.style.cursor = 'crosshair';
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY - mir.offsetParent.offsetTop;
		
		var p = new point(x,y);
		points2.push(p);
		drawingMirror();
	}, false);
	
	mir.addEventListener('touchmove', function(e){
		e.preventDefault();
		if (moving2){
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY - mir.offsetParent.offsetTop;
			
			//if it's on the right/top/bottom stop, if it's on the left then move to other canvas
			if (x < 0 + mir.offsetLeft || x >= mir.width + mir.offsetLeft || y < 0 + mir.offsetTop || y >= mir.height + mir.offsetTop){
				notdrawingMirror(false,null);
				return;
			}
			
			var p = new point(x,y);
			
			points2.push(p);
		}
		
	}, false);
	
	mir.addEventListener('touchend', function(e){
		e.preventDefault();
		notdrawingMirror(false, null);
	},false);
	
	//end touch
	
	//add mouse events
	can.oncontextmenu = function(event) {
			event.preventDefault();
			event.stopPropagation();
			return false;
	}
	
	mir.oncontextmenu = function(event) {
			event.preventDefault();
			event.stopPropagation();
			return false;
	}
	
	can.addEventListener('mousedown', function(e){ 
		
		if (e.which==2){
				//ignore mousewheel click
				e.preventDefault();
				return;
		}
		
		x = (window.Event) ? e.pageX : event.clientX;
		y = (window.Event) ? e.pageY : event.clientY;
		
		x -= can.offsetParent.offsetLeft;
		y -= can.offsetParent.offsetTop;
		
		var p = new point(x,y);
		
		points.push(p);
		
		drawing(); 
	}, false);
	
	mir.addEventListener('mousedown', function(e){ 
		
		if (e.which==2){
				//ignore mousewheel click
				e.preventDefault();
				return;
		}
		
		x = (window.Event) ? e.pageX : event.clientX;
		y = (window.Event) ? e.pageY : event.clientY;
		
		x -= mir.offsetParent.offsetLeft;
		y -= mir.offsetParent.offsetTop;
		
		var p = new point(x,y);
		
		points2.push(p);
		
		drawingMirror(); 
	}, false);
	
	can.addEventListener('mousemove',function(e){ 
	
		if (moving){
			x = (window.Event) ? e.pageX : event.clientX;
			y = (window.Event) ? e.pageY : event.clientY;
			
			x -= can.offsetParent.offsetLeft;
			y -= can.offsetParent.offsetTop;
			
			//if it's on the left/top/bottom stop, if it's on the right then move to other canvas
			if (x < 0 + can.offsetLeft || x >= can.width + can.offsetLeft || y < 0 + can.offsetTop || y >= can.height + can.offsetTop){
				notdrawing(false,null);
				return;
			}
			
			var p = new point(x,y);
			
			points.push(p);
		}
	
	},false);
	
	mir.addEventListener('mousemove',function(e){ 
	
		if (moving2){
			x = (window.Event) ? e.pageX : event.clientX;
			y = (window.Event) ? e.pageY : event.clientY;
			
			x -= mir.offsetParent.offsetLeft;
			y -= mir.offsetParent.offsetTop;
			
			//if it's on the right/top/bottom stop, if it's on the left then move to other canvas
			if (x < 0 + mir.offsetLeft || x >= mir.width + mir.offsetLeft || y < 0 + mir.offsetTop || y >= mir.height + mir.offsetTop){
				notdrawingMirror(false,null);
				return;
			}
			
			var p = new point(x,y);
			
			points2.push(p);
		}
	
	},false);
	
	can.addEventListener('mouseup', function () { notdrawing(false,null); } , false);
	
	mir.addEventListener('mouseup', function (){ notdrawingMirror(false,null); }, false);
	
	//end mouse
	
	//hide save button by if the download attribute is available..bugged in Chrome even though it's supported...sadface.png
	
	if (typeof document.createElement('a').download != 'undefined'){
		//hide button so that the link can be used
		var btn = document.getElementById('btnSave');
		btn.style.display = 'none';
	}
	else{
	//hide link and textbox as it doesn't work
	imglink.style.display = 'none';
	
	var txt = document.getElementById('FileName');
	txt.style.display = 'none';
	
	}
	
	if (typeof PrintDebug == 'function'){
		PrintDebug("Can offset left: " + can.offsetLeft + "<br/>Can offset top:" + can.offsetTop + "<br/>Mir offset left: " + mir.offsetLeft + "<br/>Mir offset top: " + mir.offsetTop , false);
	}
}


//helpers
function drawing(){
	can.style.cursor = "crosshair";
	
	t = [];
	
	t.push(setInterval(Draw, 1));
	
	moving = true;
}

function drawingMirror(){
	mir.style.cursor = "crosshair";
	
	t2 = [];
	
	t2.push(setInterval(Draw2, 1));
	
	moving2 = true;
}

function notdrawing(startOtherCanvas, startp){
	can.style.cursor = "default";
	
	moving = false;
	
	if (startOtherCanvas){
		points2.push(startp);
		moving2 = true;
		mir.style.cursor = "crosshair";
		drawingMirror();
	}
	
	var p = new point(-1,-1);
		
	points.push(p);
}

function notdrawingMirror(startOtherCanvas, startp){
	mir.style.cursor = "default";
	
	moving2 = false;
	
	if (startOtherCanvas){
		points.push(startp);
		moving = true;
		can.style.cursor = "crosshair";
		drawing();
	}
	
	var p = new point(-1,-1);
		
	points2.push(p);
}

//drawing
function Draw(){
	if (points.length < 1){
		//for (var i = 0; i < t.length; i++){ //this made it store everything until the next click because it would clear the intervals until next drawing. just fun to watch
			//clearInterval(t[i]);
		//}
		return;
	}
	
	if (points[0].x == -1 && points[0].y == -1){
		prevpoint = -1; //reset the points so that the drawing knows to not connect the next point to the previous list.
		points.splice(0,1);
		return;
	}

	var ctx = can.getContext('2d'); //[];
	var mtx = mir.getContext('2d');
	
	if (typeof PrintDebug == 'function'){
		PrintDebug(points[0], true);
	}
	
	ctx.beginPath();
	
	if (MD.DRAWTYPE == 'old'){
		mtx.beginPath();
	}
	
	var lastpoint = prevpoint;
	
	points[0].drawn = true;
			
	prevpoint = points[0];
		
	if (lastpoint != -1){
		ctx.lineWidth = lastpoint.px;
		mtx.lineWidth = lastpoint.px;
		
		ctx.strokeStyle = lastpoint.color;
		mtx.strokeStyle = lastpoint.color;
		
		ctx.moveTo(points[0].x-can.offsetLeft+0.5, points[0].y-can.offsetTop);
		ctx.lineTo(lastpoint.x-can.offsetLeft+0.5, lastpoint.y-can.offsetTop);
		ctx.stroke();
		
		if (MD.DRAWTYPE == 'old'){
			mtx.moveTo(-1*points[0].x-4+mir.offsetLeft+0.5, points[0].y-mir.offsetTop);
			mtx.lineTo(-1*lastpoint.x-4+mir.offsetLeft+0.5, lastpoint.y-mir.offsetTop);
			mtx.stroke();
		}
		
	}
	
	if (MD.DRAWTYPE == 'old'){
		mtx.closePath();
	}
	ctx.closePath();
	
	if (MD.DRAWTYPE == 'new'){
		mtx.save();
		mtx.translate(can.width, 0);
		mtx.scale(-1,1);
		mtx.drawImage(can,0,0); //doing this I can't seem to get the half px needed to make the lines the same width on each side.  
		mtx.restore();
	}
	
	points.splice(0,1);

	var htx = hid.getContext('2d');
	
	//draw onto the hidden canvas
	htx.imageSmoothingEnabled = true;
	htx.drawImage(can,0,0);
	htx.drawImage(mir,mir.width, 0);
	
}

//same as draw but draws to mir then transfers to can instead
function Draw2(){
	if (points2.length < 1){
		//for (var i = 0; i < t.length; i++){ //this made it store everything until the next click because it would clear the intervals until next drawing. just fun to watch
			//clearInterval(t[i]);
		//}
		return;
	}
	
	if (points2[0].x == -1 && points2[0].y == -1){
		prevpoint2 = -1; //reset the points so that the drawing knows to not connect the next point to the previous list.
		points2.splice(0,1);
		return;
	}

	var ctx = can.getContext('2d'); //[];
	var mtx = mir.getContext('2d');
	
	mtx.beginPath();
	
	if (MD.DRAWTYPE == 'old'){
		ctx.beginPath();
	}
	
	var lastpoint2 = prevpoint2;
	
	points2[0].drawn = true;
			
	prevpoint2 = points2[0];
		
	if (lastpoint2 != -1){
		ctx.lineWidth = lastpoint2.px;
		mtx.lineWidth = lastpoint2.px;
		
		ctx.strokeStyle = lastpoint2.color;
		mtx.strokeStyle = lastpoint2.color;
		
		mtx.moveTo(points2[0].x-mir.offsetLeft+0.5, points2[0].y-mir.offsetTop);
		mtx.lineTo(lastpoint2.x-mir.offsetLeft+0.5, lastpoint2.y-mir.offsetTop);
		mtx.stroke();
		
		if (MD.DRAWTYPE == 'old'){
			ctx.moveTo(-1*points2[0].x-4+mir.offsetLeft+(mir.offsetLeft-can.offsetLeft)+0.5, points2[0].y-can.offsetTop);
			ctx.lineTo(-1*lastpoint2.x-4+mir.offsetLeft+(mir.offsetLeft-can.offsetLeft)+0.5, lastpoint2.y-can.offsetTop);
			ctx.stroke();
		}
		
	}
	
	if (MD.DRAWTYPE == 'old'){
		ctx.closePath();
	}
	mtx.closePath();
	
	if (MD.DRAWTYPE == 'new'){
		ctx.save();
		ctx.translate(can.width, 0);
		ctx.scale(-1,1);
		ctx.drawImage(can,0,0); //doing this I can't seem to get the half px needed to make the lines the same width on each side.  
		ctx.restore();
	}
	
	points2.splice(0,1);

	var htx = hid.getContext('2d');
	
	//draw onto the hidden canvas
	htx.imageSmoothingEnabled = true;
	htx.drawImage(can,0,0);
	htx.drawImage(mir,mir.width, 0);
	
	//notes, other canvas isn't hidden...could be but that will be the saved image later
	//TODO: fix touch events, fix select/highlight canvas which breaks drawing, fix smaller width pushes canvases to a stacked view which breaks drawing need to get the x to be relative, ideally get the mirror to draw with the same context just flipped
}

//standalone functions
function ClearCanvas(){
	
	var ctx = can.getContext('2d');
	var mtx = mir.getContext('2d');
	var htx = hid.getContext('2d');
	
	//clear writing canvas
	ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.restore();
	
	//clear mirror canvas
	mtx.save();
    mtx.setTransform(1, 0, 0, 1, 0, 0);
    mtx.clearRect(0, 0, mir.width, mir.height);
    mtx.restore();
	
	//clear bottom canvas
	htx.save();
    htx.setTransform(1, 0, 0, 1, 0, 0);
    htx.clearRect(0, 0, hid.width, hid.height);
    htx.restore();	
	
	var img = document.getElementById('img');
	img.src = '';
	img.style.display = 'none';
	
	var directions = document.getElementById('SaveInfo');
	directions.style.display = 'none';
}

function Save(){

	var image = hid.toDataURL();
	var img = document.getElementById('img');
	img.src = image;
	img.style.display = '';

	var directions = document.getElementById('SaveInfo');
	directions.style.display = '';
	
	//window.location.href = image.replace('image/png', 'image/octet-stream');
}

function SaveLink(){
	var image = hid.toDataURL();
	
	var filename = '';

	var txtFileName = document.getElementById('FileName');
	var imglink = document.getElementById('IMGLink');
		
	var img = document.getElementById('img');
	img.src = image;
	img.style.display = '';
	
	imglink.href = image;
	
	if (txtFileName.value == ""){
		filename = 'mirrorimage';
	}
	else {
		filename = txtFileName.value;
	}
	
	var directions = document.getElementById('SaveInfo');
	directions.style.display = '';
	
	imglink.download = filename + '.png';
}