$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "js/list.csv",
		dataType: "text",
	success: function(data) {processData(data);}
	});
	
	$("#opsc_ip").textinput("disable")	
	$("#node_topology").textinput("disable")	
	$("#cluster_config").textinput("disable")	
	$("#node_label").css("color","lightgray")
	$("#opsc_ip_label").css("color","lightgray")
	$("#config_label").css("color","lightgray")


	$('#opsc_ip').on('change', function(){

		$('#opsc_url')[0].href= "http://"+$("#opsc_ip").val() +":8888/cluster-configs"
		$('#opsc_url').text("here")
			$("#cluster_config").textinput("enable")	
			$("#config_label").css("color","black")

	})

	$('#cluster_config').on('change', function(){

		$('#opsc_url_2')[0].href= "http://"+$("#opsc_ip").val() +":8888/"+Object.keys(JSON.parse($("#cluster_config").val()))[0]+"/nodes"
		$('#opsc_url_2').text("here")
			$("#node_topology").textinput("enable")
			$("#node_label").css("color","black")

	})


	$('#top-radio').on('change', function(){      
		if ( $("#top-radio :checked")[0].value== "Each Node"){
			$("#opsc_ip").textinput("enable")	
			$("#opsc_ip_label").css("color","black")
			if ($("#opsc_ip").val()!=""){
			$("#node_topology").textinput("enable")
			$("#node_label").css("color","black")
			$("#cluster_config").textinput("enable")	
			$("#config_label").css("color","black")
			}
		}else {
			$("#opsc_ip").textinput("disable")	
			$("#node_topology").textinput("disable")
			$("#node_label").css("color","lightgray")
			$("#opsc_ip_label").css("color","lightgray")
			$("#config_label").css("color","lightgray")
			$("#cluster_config").textinput("disable")	
		 }
	});    


});


function flipTextInput(){
	if ($("#node_topology").is(":disabled")) { 
		$("#node_topology").textinput("enable") 
	} else { 
		$("#node_topology").textinput("disable") 
	}
}



function replaceIPs(data){
  var nodes = $("#node_topology")[0].value
		data_obj = JSON.parse(data)

		$.each(data_obj.preset_data, function(i,pd){
			if ($("#top-radio :checked")[0].value== "Each Node" ){ 
				if (nodes){
					var ip_list = $.map(JSON.parse(nodes), function(d,i){ return d.node_ip})
					var line = data_obj.preset_data[i]
					data_obj.preset_data[i].data[0].ip = ip_list[i]
				} else{
				}
			}else if ($("#top-radio :checked")[0].value== "Cluster Wide"){
				data_obj.preset_data[i].data[0].ip = "__cluster__" 
			}else if ($("#top-radio :checked")[0].value== "All"){
				data_obj.preset_data[i].data[0].ip = "__all__"
			}
		})
	data = JSON.stringify(data_obj)
	return data;
}

function replaceDCs(data){
	//TODO
	var nodes = $("#node_topology")[0].value
	  if (nodes){
	$.map(JSON.parse($("#node_topology")[0].value), function(d,i){ return d.dc})
	}

	return data;
}

function processData(data) {
	templates = data.split(",");
	$('#template-checkbox').append('<fieldset id="template-checkbox" data-role="controlgroup" data-iconpos="right"><h3>Select Desired Dashboard Templates:</h3>');

	$.each(templates, function(i,template){
		if (template != "") {
			
			value = template.split(":")[0]
			text = template.split(":")[1].replace("\"","").replace("\"","")

			$('#template-checkbox').append('<input value="'+value+'" type="checkbox" name="checkbox-templates'+i+'" id="checkbox-templates'+i+'"><label for="checkbox-templates'+i+'">'+text+'</label>');
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
			url: "../"+url,
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
