function checkSession(handler) {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/checkSession',
		success: handler
	});
}

function navBarHandler(res) {
	if (res.username != undefined) {
		console.log('already loged in!');
		$(".topnav").find("ul").append(userIconHTML(res));
	} else {
		console.log(res.msg);
		// load login button
		$(".topnav").find("ul").append(`<li><a onclick="showModal();"><span class="glyphicon glyphicon-user"></span> Login</a></li>`);
		$("body").append("<div id='login-placeholder'></div>");
		$("#login-placeholder").load("./../Login/login.html");
	}
}

function logout () {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/logout',
		success: function(res){
			location.reload();
		}
	});
}

function userIconHTML(userInfo) {
	// load user icon and name
	return `<li class="dropdown">
		<a href="#" class="dropbtn">
			<span class="glyphicon glyphicon-user"></span> ${userInfo.username}
		</a>
		<div class="dropdown-content">
			<a href="http://localhost:8080/profile"> Profile</a>
			<a href="#" onclick="logout();"> Log out</a>
		</div>
	</li>`
}

function showModal() {
	document.getElementById('loginModal').style.display='block';
}

$(function() {
	checkSession(navBarHandler);
});

