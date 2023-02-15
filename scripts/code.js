$( document ).ready(function() {
    $('#html_input').height($(window).height() - 145);
	$('#markdown_output').height($(window).height() - 145);
});

$( window ).resize(function() {
	$('#html_input').height($(window).height() - 145);
	$('#markdown_output').height($(window).height() - 145);
});

function fixText(text){
    //Remove tabs (it's HTML, so they don't affect the final render, but in Markdown, they do.)
    var res = text.trim().replace('\t','');
    return res;
}

function process_table(){
	// get the html table input
	var html = $('#html_input').val();
	console.log(html);
	
	// set the strings to hold the data
	var markdown_string = '';
	var table_header = '| ';
	var table_header_footer = '|';
	var table_rows = '';
	var table_header_found = false;
    var table_header_cell_count = 0;
    var prev_row_cell_count = 0;    //To allow only same number of cells per row
	
	// if there is a thead we append
	$(html).find('thead > tr > td').each(function() {
        table_header_cell_count++;
        table_header = table_header + fixText($(this).text()) + ' | ';
        table_header_footer = table_header_footer + ' --- |';
        table_header_found = true;
	});
	
	// loop all the rows
	$(html).find('tr').each(function() {
		// get the header if it was not present as thead
        if (!table_header_found) {
            $(this).find('th').each(function() {
                table_header_cell_count++;
                table_header = table_header + fixText($(this).text()) + ' | ';
                table_header_footer = table_header_footer + ' --- |';
                table_header_found = true;
            });
        }
		
		// get the cells if they are not in thead
		var table_row = '';
        var curr_row_cell_count = 0;
		$(this).find('td').not('thead > tr > td').each(function() {
                curr_row_cell_count++;
				table_row = table_row + fixText($(this).text()) + ' | ';
		});
        
        //Check that the number of cells match in all the rows
        if (prev_row_cell_count != 0 && curr_row_cell_count != prev_row_cell_count) {
            //Show error and exit forEach
            markdown_string = "ERROR: Your HTML table rows don't have the same number of cells. Colspan not supported.";
            return false;
        }
		
		// only add row if it has data
		if(curr_row_cell_count){
			table_rows += '| ' + table_row.trim() + '\n'
            prev_row_cell_count = curr_row_cell_count;
		}
	});	
	
    //Only do the rest of the processing if there hasn't been an error processing the rows
    if (markdown_string == '') {
        // if table header exists
        if(table_header_found){
            //Check if the number of cells in header is the same as in rows
            if (table_header_cell_count != prev_row_cell_count) {
                 $('#markdown_output').val("ERROR: The number of cells in your header doesn't match the number of cells in your rows.");
                return false;
            }
        }
        else {
            //It it's missing, add an empty header, since most of the Markdown processors can't render a table without a header
            for(var i=0; i<prev_row_cell_count; i++) {
                table_header = table_header + '|';
                table_header_footer = table_header_footer + ' --- |';
            }
        }
        
        //Append header at the beggining
        markdown_string += table_header.trim() + '\n';
        markdown_string += table_header_footer + '\n';
        
        //add all the rows
        markdown_string += table_rows;
    }

	// set the markdown output to the textarea
	$('#markdown_output').val(markdown_string);
}