


function testSiConsentement(data)
{
		let result = 0;
		const consentements = $("*:has(>metadata[semantictag*=fichier-consentement])",data);
		for (let i=0; i<consentements.length; i++){
			consentementid = $(consentements[i]).attr("id");
			if (UICom.structure.ui[consentementid].submitted==undefined)
				UICom.structure.ui[consentementid].setMetadata();
			if (UICom.structure.ui[consentementid].submitted=="Y")
				result++;
		}
		return result;
}


//==================================
function pageVueEtEnvoiCourriel(uuid,role,no)
//==================================
{
	if (g_userroles[0]==role) {
		const visited = $("asmContext:has(metadata[semantictag*='visited-date'])",UICom.structure.ui[uuid].node);
		const visitedid =  $(visited).attr("id");
		const today = new Date();
		UICom.structure.ui[visitedid].value_node.text(today.getTime());
		UICom.structure.ui[visitedid].resource.text_node[LANGCODE].text(today.toLocaleString());
		UICom.structure.ui[visitedid].save();
		UICom.structure.ui[visitedid].resource.save();
		//-------------------------------
		let message = "";
		message += "Bonjour,<br>";
		message += "##firstname## ##lastname## vient de visiter la page Entretien "+no+" à "+today.toLocaleString()+"<br>";
		const enseignant_email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='courriel-enseignant'])",g_portfolio_current)).text();
		sendEmailenvoiCourriel(message,enseignant_email);
	}
}


//==================================
function sendEmailenvoiCourriel(message,email) 
//==================================
{
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	const urlhtml = g_configVar['send-email-url']==""?g_configVar['send-email-image']:g_configVar['send-email-url']
	message = message.replace("##click-here##","<a href='"+url+"' style='"+g_configVar['send-email-url-style']+"'>"+urlhtml+"</a>");
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
}



//# sourceURL=alternance.js