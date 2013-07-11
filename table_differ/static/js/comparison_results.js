var $container = $("#results-grid");
var $console = $("#example1console");
var $parent = $container.parent();

var comparison_results_data = null;

var cellRenderer = function (instance, td, row, col, prop, value, cellProperties) {

    if (comparison_results_data != null) {
        var item_data = comparison_results_data["cells"];
        var item_styles = comparison_results_data["cell_statuses"];

        try {
            td.className = item_styles[row][col];
            td.innerHTML = item_data[row][col];
        } catch(e) {
            td.className = "unexpected";
        }
    }
};

$container.handsontable({
    startRows: 0,
    startCols: 0,
    rowHeaders: true,
    colHeaders: true,
    minSpareRows: 0,
    contextMenu:
        {
            callback: function (key, options) {
              if (key === 'ignore') {
                setTimeout(function () {
                  //timeout is used to make sure the menu collapsed before alert is shown
                  alert("Will add code to ignore cell value");
                }, 100);
              } else if (key === 'use_actual') {
                setTimeout(function () {
                  //timeout is used to make sure the menu collapsed before alert is shown
                  alert("Will add code to expect actual value");
                }, 100);
              }
            },
            items: {
                "use_actual": {name: 'Set Expected to Actual'},
                "ignore": {name: 'Ignore Cell Differences'},
            }
        },
    cells: function (row, col, prop) {
        this.renderer = cellRenderer; //uses function directly
    },

});

var handsontable = $container.data('handsontable');


$(document).ready( function() {
	updateTableContents();
});

function updateTableContents() {

	$.ajax({
        url: "/results/data/" + comparison_id,
        dataType: 'json',
	    contentType: 'application/json',
	    type: 'GET',

	}).done(function(res, textStatus) {
		if (res.data) {
            comparison_results_data = res.data;
            handsontable.loadData(res.data["cells"]);
        }
	}).fail(function() {
		alert('failure :(');
	});
}