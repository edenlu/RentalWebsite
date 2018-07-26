function sendCommentRequest() {
    let commentContent = $("#comment").val();
    let postUrl = window.location.href;
    let data = {
        commentContent: commentContent,
    };
    $.ajax({
        type: "POST",
        url: postUrl,
        dataType: "json",
        data: data,
        success: function(msg) {
            if (msg.error) {
                $("#warning").show();
                $("#warning").find("label").text(msg.error);
            } else {
                location.reload();
            }
        }
    });
}

function createComment() {
    if ($("#comment").val() == "") {
        $("#warning").show();
        $("#warning").find("label").text("Comment must not be empty");
    } else {
        sendCommentRequest();
    }
}

$(function() {
  // load navigation bar
    $("#nav-placeholder").load("./../NavigationBar/navigationBar.html");
    $("#replyBtn").click(function() {
        createComment();
    });
});
