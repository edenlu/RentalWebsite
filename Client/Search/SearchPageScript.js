function search(sentence) {
	/*parse the sentence here*/
	let data = {
		sentence: sentence
	};
	
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/search',
		dataType: "json",
		data: data,
		success: function(msg){
			alert('wow' + msg);
		}
	});
}

function newResidenceUnitHtml(context) {
	let title = context.title;
	let price = context.price;
	let thumbnailSrc = context.thumbnailSrc;
	let postLink = context.postlink;
	
	let newElementHtml = `
	<li class="residence-unit">
		<a href="${context.postlink}" class="residence-unit-link">
			<div class="residence-unit-title">
				<label>${context.title}</label>
			</div>
			<div class="residence-unit-thumbnail">
				<img class="residence-unit-thumbnail-image" src="${context.thumbnailSrc}">
			</div>
			<div class="residence-unit-detail"></div>
		</a>
	</li>`;
	return newElementHtml;
}

function createResidenceUnit(context) {
	context = {
		title: "Hahaha",
		thumbnailSrc: "image1.png",
		postlink: "https://www.google.ca"
	};
	$(".residence-list").find("ul").append(newResidenceUnitHtml(context));
}

function cleanResidenceList() {
	$(".residence-list").find("ul").find("li").map(function(index, obj) {
		$(obj).animate({
			height: "0px"
		}, 200, function() {
			obj.remove();
		})
	});
	
	return new Promise((resolve, reject) => {
		if ($(".residence-list").find("ul").find("li").length == 0) {
			resolve("All elements removed");
		}
	})
}

/************************
*	Register events		*
************************/
$(function() {
	$("#searchButton").click(function() {
		createResidenceUnit();
	});
	
	$(".deleteAnimate").on('transitionend', function(e){
		$(e.target).remove();
	});
});