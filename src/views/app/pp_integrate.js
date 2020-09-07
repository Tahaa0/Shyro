
window.onload = function(){
	var pathParts = window.location.pathname.split('/');
  console.log(pathParts);
	if(STEP_URLS.indexOf(pathParts[pathParts.length-1].trim()) != -1){
		console.log('NIB');
  }

}