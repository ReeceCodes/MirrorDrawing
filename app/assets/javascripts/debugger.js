
function CreateHUD(){
	var panel = document.createElement('div');
	var details = document.createElement('span');
	details.id = 'debugInfo';
	details.innerHTML = 'test info';
	
	panel.appendChild(details);
	
	panel.style.position = 'fixed';
	panel.style.top = '100px';
	panel.style.right = '50px';
	panel.style.overflow = 'scroll';
	panel.style['height'] = '100%';
	
	$('body').append(panel);
}

CreateHUD();

function PrintDebug(data, point){
	var details = document.getElementById('debugInfo');
	
	if (point){
		for (var prop in data) {
			details.innerHTML += '<br/>' + prop + ': ' + data[prop]+'; ';
		}
	}
	else{
		details.innerHTML += '<br/>' + data;
	}
	
}