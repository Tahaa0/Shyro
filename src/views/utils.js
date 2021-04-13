$('.item').click(function(){
	window.location = $(this).attr('href');
});

$('#profile').click(function(){
	window.location = '/account';
})

$('#logout').click(function(){
	logout(function(err,data){
		if(!err) {
			localStorage.removeItem("token");
			window.location = '/';
		}else{
			alert(err);
		}
	});
})

function durationText(date){
		var now = new Date();
		var milliseconds = now-date;
		console.log(milliseconds);
		if(milliseconds < 60*1000){ //less than 1 minute
			return "Just updated."
		}
		var minutes = parseInt(milliseconds/(60*1000));
		if(milliseconds < 60*60*1000){ //less than 1 hour
			return "Updated "+minutes+" minutes ago."
		}
		var hours = parseInt(minutes/60);
		var s_hours = "s";
		if(hours == 1) s_hours = "";

		if(milliseconds < 24*60*60*1000){ //less than 1 day
			return "Updated "+hours+" hour"+s_hours+" ago."
		}

		return "Last updated "+date.toLocaleDateString()+".";
	}

	function durationTextSupport(date){
		var now = new Date();
		var milliseconds = now-date;
		console.log(milliseconds);
		if(milliseconds < 60*1000){ //less than 1 minute
			return "Just created"
		}
		var minutes = parseInt(milliseconds/(60*1000));
		if(milliseconds < 60*60*1000){ //less than 1 hour
			return +minutes+" minutes ago"
		}
		var hours = parseInt(minutes/60);
		var s_hours = "s";
		if(hours == 1) s_hours = "";

		if(milliseconds < 24*60*60*1000){ //less than 1 day
			return hours+" hour"+s_hours+" ago"
		}

		return date.toLocaleDateString()+"";
	}

getProfile(function(err,data){
	if(!err) {
		$('#sidebar_user .user_fullname').html(data.user_.username);
		$('#sidebar_user .user_membership').html(data.user_.membershipTitle);
		$('.full_name').html(data.user_.firstName+" "+data.user_.lastName);
	}else{
		alert(err);
	}
});


$('#sidebar_user').click(function(){
	$(this).toggleClass('active');
	if($(this).hasClass('active')){
		$(this).find('.user_arrow').html('<i class="fas fa-chevron-up"></i>');
		$('#sidebar_userdrop').slideDown(300);
	}else{
		$(this).find('.user_arrow').html('<i class="fas fa-chevron-down"></i>');
		$('#sidebar_userdrop').slideUp(300);
	}

});
//MARKETPLACE
function createTemplate(title,price,guarantee,template_link,description,features,faq,main_img,bottom_imgs,cb){
	$.ajax({
	  url: "/api/template/",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,price:price,guarantee:guarantee,template_link:template_link,description:description,'features':features,'faq':faq,main_img:main_img,bottom_imgs:bottom_imgs},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function updateTemplate(id,title,price,guarantee,template_link,description,features,faq,main_img,bottom_imgs,cb){
	$.ajax({
	  url: "/api/template/"+id,
	  type: "PUT",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,price:price,guarantee:guarantee,template_link:template_link,description:description,'features':features,'faq':faq,main_img:main_img,bottom_imgs:bottom_imgs},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function indexOwnTemplates(cb){
	$.ajax({
	  url: "/api/template/own",
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

function indexTemplates(cb){
	$.ajax({
	  url: "/api/template",
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

function getTemplate(id,cb){
	$.ajax({
	  url: "/api/template/"+id,
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
//TICKET

function replyTicket(id,message,cb){
	$.ajax({
	  url: "/api/ticket/reply",
	  type: "PUT",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {id:id,message:message},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function closeTicket(id,cb){
	$.ajax({
	  url: "/api/ticket/close",
	  type: "PUT",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {id:id},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	    cb(null,data);
	  }
	});
}

function indexTickets(cb){
	$.ajax({
	  url: "/api/ticket",
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


function createTicket(title,priority,department,message,cb){
	$.ajax({
	  url: "/api/ticket/",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,'priority':priority,'department':department,'message':message},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

//MY ACCOUNT
function startFreeTrial(cb){
	$.ajax({
	  url: "/api/user/startfreetrial",
	  type: "POST",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function updateProfile(username,firstName,lastName,cb){
	$.ajax({
	  url: "/api/user/profile",
	  type: "PUT",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'username':username,'firstName':firstName,'lastName':lastName},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function getProfile(cb){
	$.ajax({
	  url: "/api/user/profile",
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

//

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

function getSales(id,cb){
	$.ajax({
	  url: "/api/funnel/sales/"+id,
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
	  data: {'title':title,'steps':'[]'},
	  error: function(err) {
	    cb(err,{});
	  },
	  success: function(data,status,xhr) {
	  	cb(null,data);
	  }
	});
}

function updateFunnel(id,title,steps,apps,cb){
	$.ajax({
	  url: "/api/funnel/"+id,
	  type: "PUT",
	  headers: { Authorization: "Bearer "+localStorage.getItem("token") },
	  data: {'title':title,'steps':steps,'apps':apps},
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