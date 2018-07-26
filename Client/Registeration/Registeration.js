function register() {
	/*parse the sentence here*/

    let username = $("input[name=username]").val();
    let password = $("input[name=password]").val();
	let email = $("input[name=email]").val();

    let data = {
        "username": username,
        "password": password,
		"email":email
    };

	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/register',
		dataType: "json",
		data: data,
		success: function(msg){
			console.log(msg)
			if (msg.error) {
				$('#warning').show();
				$('#warning').find('label').text(msg.error);
			} else {
				// refresh page
				if (typeof msg.redirect == 'string')
					window.location = msg.redirect
			}
		}
	});
}
$(function() {
	$("#nav-placeholder").load("./../NavigationBar/navigationBar.html");
	
})