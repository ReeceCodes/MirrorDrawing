
var t = [];
var x;
var y;
var moving = false;
var points = [];
var prevpoint = -1;
function point(x,y){
	this.x  = x;
	this.y = y;
	this.drawn = false;
	this.px = MD.PX;
}

var MD = MD || (MD = {});
MD.PX = 1;

function SetPX(ddl){
	//not actually made yet
	MD.PX = 1 || ddl.options[ddl.selectedIndex].value; 
	}

function setup(){
	var can = document.getElementById('can');
	var mir = document.getElementById('mir');
	
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
		
		if (e.which==3){
				//ignore right click
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
	
	can.addEventListener('mousemove',function(e){ 
	
		if (moving){
			x = (window.Event) ? e.pageX : event.clientX;
			y = (window.Event) ? e.pageY : event.clientY;
			
			x -= can.offsetParent.offsetLeft;
			y -= can.offsetParent.offsetTop;
			
			//supposed to stop drawing when you exit canvas and might stop writing points but it doesn't close the path. likely something when moving the mouse
			//and highlighting and etc etc that it just skips the events
			if (x < 0 + can.offsetLeft || x >= can.width + can.offsetLeft || y < 0 + can.offsetTop || y >= can.height + can.offsetTop){
				notdrawing();
				return;
			}
			
			
			var p = new point(x,y);
			
			points.push(p);
		}
	
	},false);
	
	can.addEventListener('mouseup', notdrawing, false);
}

function drawing(){
	var can = document.getElementById('can');
	var mir = document.getElementById('mir');
	can.style.cursor = "crosshair";
	
	t = [];
	
	t.push(setInterval(Draw, 1));
	
	moving = true;
}

function notdrawing(){
	var can = document.getElementById('can');
	can.style.cursor = "default";
	
	moving = false;
	
	var p = new point(-1,-1);
		
	points.push(p);
}

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
	
	var can = document.getElementById('can');
	var mir = document.getElementById('mir');
		
	var ctx = can.getContext('2d'); //[];
	var mtx = mir.getContext('2d');
	
	ctx.beginPath();
	mtx.beginPath();
	
	var lastpoint = prevpoint;
	
	points[0].drawn = true;
			
	prevpoint = points[0];
			
	//ctx.beginPath();
	//mtx.beginPath();
	
	//minus 2 from the mirror x because of the border or margin or padding...idk why but 2 seems to be closest but not perfect
	
	//ctx.arc(points[0].x - can.offsetLeft,points[0].y - can.offsetTop,0.5,0,2*Math.PI,false);
	//ctx.fill();
	//mtx.arc(-1*points[0].x + mir.offsetLeft-2,points[0].y - mir.offsetTop,0.5,0,2*Math.PI,false);
	//mtx.fill();
	
	//mtx.closePath();
	//ctx.closePath();
	
	if (lastpoint != -1){
		ctx.lineWidth = lastpoint.px;
		mtx.lineWidth = lastpoint.px;
		
		ctx.moveTo(points[0].x-can.offsetLeft+0.5, points[0].y-can.offsetTop);
		ctx.lineTo(lastpoint.x-can.offsetLeft+0.5, lastpoint.y-can.offsetTop);
		ctx.stroke();
		
		mtx.moveTo(-1*points[0].x-4+mir.offsetLeft+0.5, points[0].y-mir.offsetTop);
		mtx.lineTo(-1*lastpoint.x-4+mir.offsetLeft+0.5, lastpoint.y-mir.offsetTop);
		mtx.stroke();
		
	//	ctx.lineTo(lastpoint.x-can.offsetLeft, lastpoint.y-can.offsetTop);
	//	ctx.stroke();
	//	mtx.lineTo(-1*lastpoint.x+mir.offsetLeft-2, lastpoint.y-mir.offsetTop);
	//	mtx.stroke();
	}
	
	mtx.closePath();
	ctx.closePath();
	
	points.splice(0,1);
	
	var hid = document.getElementById('hid');
	var htx = hid.getContext('2d');
	
	//draw onto the hidden canvas, doesn't account for padding or anything.
	htx.drawImage(can,0,0);
	htx.drawImage(mir,mir.width, 0);
	
	
}
