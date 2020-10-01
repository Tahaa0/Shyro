function getUser(id,cb){
	$.ajax({
	  url: "/api/user/"+id,
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function indexUsers(cb){
	$.ajax({
	  url: "/api/user",
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function indexFunnels(cb){
	$.ajax({
	  url: "/api/funnel/",
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function getFunnel(id,cb){
	$.ajax({
	  url: "/api/funnel/"+id,
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function createFunnel(title,cb){
	$.ajax({
	  url: "/api/funnel/",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,'steps':'{}'},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function updateFunnel(id,title,steps,cb){
	$.ajax({
	  url: "/api/funnel/"+id,
	  type: "PUT",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,'steps':steps},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function deleteFunnel(id,cb){
	$.ajax({
	  url: "/api/funnel/"+id,
	  type: "DELETE",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function logout(cb){
	$.ajax({
	  url: "/api/auth/logout",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}
/*
function getLobby(id,cb){
	$.ajax({
	  url: "/api/lobby/data/"+id,
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function getGame(id,cb){
	$.ajax({
	  url: "/api/game/data/"+id,
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function indexLobbies(cb){
	$.ajax({
	  url: "/api/lobby/",
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function createLobby(title,boardSize,cb){
	$.ajax({
	  url: "/api/lobby/",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,'size':boardSize},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function logout(cb){
	$.ajax({
	  url: "/api/auth/logout",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function saveMap(title,map,cb){
	$.ajax({
	  url: "/api/editor/",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,map:map},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}


function indexMaps(cb){
	$.ajax({
	  url: "/api/editor/",
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function getMap(id,cb){
	$.ajax({
	  url: "/api/editor/"+id,
	  type: "GET",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}
*/