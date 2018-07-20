var originalData = [];

function checkSession(handler) {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/checkSession',
		success: handler
	});
}

function profileHandler(res) {
    console.log(JSON.stringify(res))
    if (res.username) {
        addEditableElement("username", res.username);
    }
    if (res.email) {
        addEditableElement("email", res.email);
    }
    if (res.friendCode) {
        addEditableElement("friendCode", res.friendCode);
    }
}

function requestProfileChange(attibuteKey, attribtueValue, handler) {
    let data = {
        "key": attibuteKey,
        "value": attribtueValue
    };

	$.ajax({
        type: 'POST',
        dataType: "json",
		data: data,
        url: 'http://localhost:8080/changeProfile',
        success: handler
	});
}

function uploadProfileIcon(fileFormData) {
	$.ajax({
        type: 'POST',
        data: fileFormData,
        processData: false,
        url: 'http://localhost:8080/uploadImage'
	});
}

function toggleControl(clickEdit) {
    if (clickEdit) {
        $(saveButton).show();
        $(cancelButton).show();
        $(editButton).hide();
    } else {
        $(editButton).show();
        $(saveButton).hide();
        $(cancelButton).hide();
    }
}

function addEditableElement(attribtueKey, attribtueValue) {
    let newHtml = 
    `
    <div id="${attribtueKey}" class="attribute">
        <label id="label">${attribtueKey.charAt(0).toUpperCase() + attribtueKey.slice(1)}:</label>
        <div class="control">
                <button type="button" class="btn btn-primary edit">Edit</button>
                <button type="button" class="btn btn-success save">Save</button>
                <button type="button" class="btn btn-danger cancel">Cancel</button>
        </div>
        <div class="content">${attribtueValue}</div>
    </div>
    `;
    $(".profile .infoList").append(newHtml).each(function() {
        registerAttributeElement(attribtueKey, attribtueValue);
    });

}

function registerAttributeElement(attribtueKey, attribtueValue) {
    let attrLabel = `#${attribtueKey} .content`;
    let editButton = `#${attribtueKey} .control .edit`;
    let saveButton = `#${attribtueKey} .control .save`;
    let cancelButton = `#${attribtueKey} .control .cancel`;

    originalData[attribtueKey] = attribtueValue;

    function toggleControl(clickEdit) {
        if (clickEdit) {
            $(saveButton).show();
            $(cancelButton).show();
            $(editButton).hide();
        } else {
            $(editButton).show();
            $(saveButton).hide();
            $(cancelButton).hide();
        }
    }

    toggleControl(false);

    $(editButton).click(function() {
        console.log("Edit");
        console.log(attrLabel);
        $(attrLabel).prop('contenteditable', true).toggleClass('editable');
        $(attrLabel).focus();

        // show the corresponding element
        toggleControl(true);
    });

    $(saveButton).click(function() {
        console.log("Save");

        let key = attribtueKey;
        let value = $(attrLabel).text();
        requestProfileChange(key, value, function() {
            console.log("haha")
            location.reload();
        });

        $(attrLabel).prop('contenteditable', false).toggleClass('editable');

        // show the corresponding element
        toggleControl(false);
    });

    $(cancelButton).click(function() {
        console.log("Cancel");

        $(attrLabel).text(originalData[attribtueKey]);
        $(attrLabel).prop('contenteditable', false).toggleClass('editable');

        // show the corresponding element
        toggleControl(false);
    });
}

$(function() {
	// load navigation bar
	$("#nav-placeholder").load("./../NavigationBar/navigationBar.html");
    checkSession(profileHandler);
    
    $(".upload").click(function() {
        // get data form file input
        let king = 123;
        var blobFile = document.getElementById('filechooser').files[0];
        var formData = new FormData();
        formData.append("userIcon", blobFile)
        uploadProfileIcon(formData);
    });
});