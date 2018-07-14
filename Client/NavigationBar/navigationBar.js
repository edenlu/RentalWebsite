function checkSession(sentence) {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/checkSession',
		success: function(msg){
			console.log('already loged in! Your information: ' + JSON.stringify(msg));
			if (msg.username != undefined) {
				$(".topnav").find("ul").append(userIconHTML(msg));

			} else {
				// load login button
				$(".topnav").find("ul").append(`<li><a onclick="showModal();"><span class="glyphicon glyphicon-user"></span> Login</a></li>`);
				$("body").append("<div id='login-placeholder'></div>");
				$("#login-placeholder").load("./../Login/login.html");
			}
		}
	});
}

function logout(sentence) {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/logout',
		success: function(msg){
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
			<a href="#" onclick="logout();"> Log out</a>
		</div>
	</li>`
}

function showModal() {
	document.getElementById('loginModal').style.display='block';
}

$(function() {
	checkSession();
});

