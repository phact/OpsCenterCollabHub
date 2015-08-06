$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "js/list.csv",
		dataType: "text",
	success: function(data) {processData(data);}
	});
});

var templates

function replaceIPs(data){
//TODO	
	return data;
}

function replaceDCs(data){
//TODO
	return data;
}

function processData(data) {
	templates = data.split(",");	
	$('#template-checkbox').append('<fieldset id="template-checkbox" data-role="controlgroup" data-iconpos="right"><h3>Select Desired Dashboard Templates:</h3>');
	$.each(templates, function(i,template){
		if (template != "") {
			$('#template-checkbox').append('<input value="'+template+'" type="checkbox" name="checkbox-templates'+i+'" id="checkbox-templates'+i+'"><label for="checkbox-templates'+i+'">'+template+'</label>');
		}
	})

	$('#template-checkbox').append('</fieldset>');


	$("input[type='checkbox']").checkboxradio();
}

function getTemplates(){
	var fileURLs = $.map($("#template-checkbox :checked"),function(d,i){ return d.value}); 
	var zip = new JSZip();
	var count = 0;


	downloadFile(fileURLs[count], onDownloadComplete);


	function downloadFile(url, onSuccess) {

		$.ajax({
			type: "GET",
			url: url,
			dataType: "text",
			success: function(data) {
				data = replaceIPs(data);
				data = replaceDCs(data);
				onSuccess(data);
			}
		});

	}

	function onDownloadComplete(textData){
		if (count < fileURLs.length) {
			binaryData= btoa(textData)
			// add downloaded file to zip:
			var fileName = fileURLs[count].substring(fileURLs[count].lastIndexOf('/')+1);
			zip.file(fileName, binaryData, {base64: true});
			if (count < fileURLs.length -1){
				count++;
				downloadFile(fileURLs[count], onDownloadComplete);
			}
			else {
				// all files have been downloaded, create the zip
				var content = zip.generate();


				// then trigger the download link:        
				var zipName = 'OpsCenterTemplates.zip';
				var a = document.createElement('a'); 
				a.href = "data:application/zip;base64," + content;
				a.download = zipName;
				a.click();
			}
		}
	}

}
