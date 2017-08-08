$( document ).ready(function() {
    $('#html_input').height($(window).height() - 145);
	$('#markdown_output').height($(window).height() - 145);
});

$( window ).resize(function() {
	$('#html_input').height($(window).height() - 145);
	$('#markdown_output').height($(window).height() - 145);
});

function fixText(text){
    //Remove spaces and tabs (it's HTML, sothey don't affect, but in Markdown, they do.)
    var res = text.trim().replace('\t','');
    res = res.replace(/\s{2,}/g, ' ');
    return res;
}

function process_table(){
	// get the html table input
	var html = $('#html_input').val();
	console.log(html);
	
	// set the strings to hold the data
	var markdown_string = "";
	var table_header = "|";
	var table_header_footer = "|";
	var table_rows = "";
	var table_header_found = false;
	
	// if there is a thead we append
	$(html).find('thead > tr > td').each(function() {
		if(fixText($(this).text()) != ""){
			table_header = table_header + fixText($(this).text()) + "|";
			table_header_footer = table_header_footer + "--- |";
			table_header_found = true;
		}
	});
	
	// loop all the rows
	$(html).find('tr').each(function() {
		// get the header if present
		$(this).find('th').each(function() {
			if(fixText($(this).text()) != ""){
				table_header = table_header + fixText($(this).text()) + "|";
				table_header_footer = table_header_footer + "--- |";
				table_header_found = true;
			}
		});
		
		// get the cells if they are not in thead
		var table_row = "";
		$(this).find('td').not("thead > tr > td").each(function() {
			//console.log($(this).text());
			if(fixText($(this).text()) != ""){
				table_row = table_row + fixText($(this).text()) + "|";
			}
		});
		
		// only add row if its got data
		if(table_row != ""){
			table_rows += "|" + table_row + "\n"
		}
	});	
	
	// if table header exists
	if(table_header_found == true){
		markdown_string += table_header + "\n";
		markdown_string += table_header_footer + "\n";
	}
	
	// add all the rows
	markdown_string += table_rows;

	// set the markdown output to the textarea
	$('#markdown_output').val(markdown_string);
}