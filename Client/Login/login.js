function login() {
	/*parse the sentence here*/
    let username = $("input[name=username]").val();
    let password = $("input[name=password]").val();
    let data = {
        "username": username,
        "password": password
    };
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/login',
		dataType: "json",
		data: data,
		success: function(msg){
            // reset the form
            $('.modal-content').trigger("reset");
            // refresh page
            location.reload();
		}
	});
}

function hideModal() {
	document.getElementById('loginModal').style.display='none';
}

$(function() {
    // Register event to close login form when click outside of modal
	var modal = document.getElementById('loginModal');
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
});