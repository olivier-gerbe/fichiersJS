function addDate(node) {
	const nodeid = $(node).parent().attr("id");
	let dateid = null;
	const date = $("*:has(>metadata[semantictag*='date-niveau-selected'])",$(UICom.structure.ui[nodeid].node));
	if (date==undefined || date.length==0) {
		const srce = replaceVariable("##dossier-etudiants-modeles##.composantes-actions");
		dateid = importBranch(nodeid,srce,"date-niveau-selected");
		UIFactory.Node.reloadUnit();
	} else
		dateid = $(date).attr("id");
	const options = {year: 'numeric', month: 'numeric'};
	const today = new Date();
	UICom.structure.ui[dateid].resource.text_node[LANGCODE].text(today.toLocaleString(undefined,options));
	UICom.structure.ui[dateid].resource.utc.text(today.getTime());
	UICom.structure.ui[dateid].resource.save();
}


function specificLoginFunction() {
	$("#connection-cas1").html("Connexion superviseur")
	$("#connection-cas2").html("Connexion")
}


//==================================
function sendImageEmail(contentid,email,langcode) {
//==================================
	var htmlnode = document.getElementById("dashboard_"+contentid);
	var htmlcanvas = "<canvas id='canvas' width='400' height='400'></canvas>"
	html2canvas(htmlnode).then(function(canvas) {
		var src_img = canvas.toDataURL();
		var message ="##firstname## ##lastname## désire partager avec vous le tableau ci-dessous.<br>"
		var img = "<img width=\"800px\" src=\""+src_img+"\">";
		message = message + img + "<br>";
		message = message.replace("##firstname##",USER.firstname);
		message = message.replace("##lastname##",USER.lastname);
		var elt = document.createElement("p");
		elt.textContent = message;
		message = elt.innerHTML;
		message = message.replace(/..\/..\/..\/..\/..\/../g, window.location.protocol+"//"+window.location.host);

		//------------------------------
		var xml ="<node>";
		xml +="<sender>"+$(USER.email_node).text()+"</sender>";
		xml +="<recipient>"+email+"</recipient>";
		xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+karutaStr[LANG]['want-sharing']+"</subject>";
		xml +="<message>"+message+"</message>";
		xml +="<recipient_cc></recipient_cc><recipient_bcc></recipient_bcc>";
		xml +="</node>";
		$.ajax({
			contentType: "application/xml",
			type : "POST",
			dataType : "xml",
			url : "../../../"+serverBCK+"/mail",
			data: xml,
			success : function(data) {
				$('#edit-window').modal('hide');
				alertHTML(karutaStr[LANG]['email-sent']);
			}
		});
	});

}


//==================================
function getSendImageEmailAddress(reportSemtag,langcode)
//==================================
{
	const pageid = $("#page").attr('uuid');
	const reportid = $("*:has(>metadata[semantictag*="+reportSemtag+"])",$(UICom.structure.ui[pageid].node)).attr("id");
	var emailsarray = [];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#edit-window-footer").html("");
	fillEditBoxBody();
	$("#edit-window-title").html(karutaStr[LANG]['share-URL']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
			const email = $("#email").val();
			sendImageEmail(reportid,email,langcode) 
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));
	var html = "<div style='display:none'>" + g_configVar['send-email-logo'] +"</div>";
	html += "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['email']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input autocomplete='off' id='email' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$("#edit-window").modal('show');
}


//# sourceURL=ih2ef.js
