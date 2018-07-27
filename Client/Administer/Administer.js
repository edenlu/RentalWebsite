function checkSession(handler) {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/checkSession',
		success: handler
	});
}

function initializePage(res) {
    if (!res.username) {
        // case not login yet
        $('.administerContent').empty();
        $('.administerContent').append('<label style="font-size: 20px;">Requires Login to view profile</label>')
    } else if (!res.isAdmin) {
        // case not login yet
        $('.administerContent').empty();
        $('.administerContent').append('<label style="font-size: 20px;">You are not Administer</label>')
    }
}

function freezeAccount() {
    let freezeAccount = $('#freezeAccount').val();
    if (!freezeAccount) {
        return;
    }

    $.ajax({
		type: 'POST',
		url: 'http://localhost:8080/freezeAccount',
		dataType: "json",
		data: {freezeAccount: freezeAccount},
        success: function(res) {
            location.reload();
        }
    });
}

function executeQuery() {
    let sql = $('#sqlquery').val()
    let data = {
        sql: sql
    };

    $.ajax({
		type: 'POST',
		url: 'http://localhost:8080/admin',
		dataType: "json",
		data: data,
        success: generateTableFromQuery
    });
}

function generateTableFromQuery(result) {
    console.log(result);
    $('#result').empty();
    if (result.errno) {
        $('#result').append(`<thead><tr><th>Error in SQL: ${result.code}</th></tr></thead>`);
    } else if (result.length === 0) {
        $('#result').append('<thead><tr><th>No result found!</th></tr></thead>');
    } else {
        // Append header to table
        let headers = Object.keys(result[0]);
        let headersHtml = headers.map(header => `<th>${header}</th>`).join();
        $('#result').append(`<thead><tr>${headersHtml}</tr></thead>`);

        // Append body to table
        let bodyHtml = result.map(tuple => {
            let newbodyRow = Object.keys(tuple).map(key => `<td>${tuple[key]}</td>`).join();
            return `<tr>${newbodyRow}</tr>`;
        }).join();
        $('#result').append(`<tbody>${bodyHtml}</tbody>`);
    }
}

function optionButtonClick(buttonId) {
    $('#sqlquery').val('');
    $('#sqlquery').val(sqlQueries[buttonId]);
}

$(function() {
    // load navigation bar
    $("#nav-placeholder").load("./../NavigationBar/navigationBar.html");
    checkSession(initializePage);

    // Register exectute query button event
    $('button.execute').click(executeQuery)

    // Register all other button event
    $("#sqloptions button").click(function() {
        optionButtonClick(this.id);
    });
});

var sqlQueries = {}
sqlQueries['reply_all_post'] = `
select a.aid, a.username
from account a
where NOT EXISTS
(select p.pid from post p
where NOT EXISTS
(select * from comment c where c.pid=p.pid and c.aid=a.aid));`;

sqlQueries['post_below_average'] = `
select p.pid, p.postTitle, r1.price
from post p, rentoutpost r1
where p.pid = r1.pid and r1.price < (select avg(r2.price)
                                    from rentoutpost r2)`;

sqlQueries['average_price'] = `
select avg(r2.price) as averagePrice
from rentoutpost r2`;