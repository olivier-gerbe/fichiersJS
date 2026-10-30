
//==================================
function envoiEmails(message,emails) 
//==================================
{
	var elt = document.createElement("p");
	elt.textContent = message;
	message = elt.innerHTML;
	message = message.replace(/..\/..\/..\/..\/..\/../g, window.location.protocol+"//"+window.location.host);
	//------------------------------
	for (i=0;i<emails.length;i++){
		var xml ="<node>";
		xml +="<sender>"+$(USER.email_node).text()+"</sender>";
		xml +="<recipient>"+emails[i]+"</recipient>";
		xml +="<subject>"+USER.firstname+" "+USER.lastname+" a posté un message.</subject>";
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
			}
		});
	}
	let notification = "Un courriel a été envoyé à <ul> ";
	for (i=0;i<emails.length;i++){
		notification += "<li>" + emails[i] + "</li>";
	}	
	notification += "</ul>"
	alertHTML(notification);
}

//==================================
function envoiDemandeFeedback(nodeid)
//==================================
{
	const today = new Date();
	//-------------------------------
	let noeud = UICom.structure.ui[nodeid].node;
	let preuve_label = null;
	while ($(noeud).prop("nodeName")!="asmUnit") {
		let noeudid = $(noeud).attr("id");
		if (preuve_label==null && UICom.structure.ui[noeudid].semantictag.indexOf('ebp-preuve')>-1) {
			preuve_label = UICom.structure.ui[noeudid].label_node[LANGCODE].text();
		}
		noeud = $(noeud).parent();
	}
	const noeudid = $(noeud).attr("id");
	const page_label = UICom.structure.ui[noeudid].label_node[LANGCODE].text();
	//-------------------------------
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" vous a fait une demande de feedback le "+today.toLocaleString()+"<br><br>";
	message += "<div>La demande concerne la preuve "+preuve_label+" de la page "+page_label+"</div>"
	message += "<br><div><a href='https://logopedie.eportfolium.fr'>Accédez au site</a></div>"
	const courriels = $("asmContext:has(metadata[semantictag*='courriel-maitre-stage'])",g_portfolio_current);
	var emails = new Array();
	for (i=0;i<courriels.length;i++){
		const courrielid =  $(courriels[i]).attr("id");
		const email = UICom.structure.ui[courrielid].resource.text_node[LANGCODE].text()
		if (email.length>0 && email.indexOf(USER.email)<0)
			emails.push(email);
	}
	// ------ suppression des doublons ----
	const emailsSansDoublons = emails.reduce((unique, email) => {
	    return unique.includes(email) ? unique : [...unique, email];
	}, []);
	//-------------------------------------
	envoiEmails(message,emailsSansDoublons) ;
}

//==================================
function envoiAjoutFeedback(nodeid)
//==================================
{
	const today = new Date();
	let noeud = UICom.structure.ui[nodeid].node;
	let preuve_label = null;
	while ($(noeud).prop("nodeName")!="asmUnit") {
		let noeudid = $(noeud).attr("id");
		if (preuve_label==null && UICom.structure.ui[noeudid].semantictag.indexOf('ebp-preuve')>-1) {
			preuve_label = UICom.structure.ui[noeudid].label_node[LANGCODE].text();
		}
		noeud = $(noeud).parent();
	}
	const noeudid = $(noeud).attr("id");
	const page_label = UICom.structure.ui[noeudid].label_node[LANGCODE].text();
	//-------------------------------
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" vous a ajouté un feedback  le "+today.toLocaleString()+"<br><br>";
	message += "<div>La demande concerne la preuve "+preuve_label+" de la page "+page_label+"</div>"
	message += "<br><div><a href='https://logopedie.eportfolium.fr'>Accédez au site</a></div>"
	const courriels = $("asmContext:has(metadata[semantictag*='courriel-apprenant'])",g_portfolio_current);
	var emails = new Array();
	for (i=0;i<courriels.length;i++){
		const courrielid =  $(courriels[i]).attr("id");
		const email = UICom.structure.ui[courrielid].resource.text_node[LANGCODE].text()
		if (email.length>0 && email.indexOf(USER.email)<0)
			emails.push(email);
	}
	// ------ suppression des doublons ----
	const emailsSansDoublons = emails.reduce((unique, email) => {
	    return unique.includes(email) ? unique : [...unique, email];
	}, []);
	//-------------------------------------
	envoiEmails(message,emailsSansDoublons) ;
}

//==================================
function envoiAjoutDocument()
//==================================
{
	const today = new Date();
	//-------------------------------
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +", votre accompagnatrice, vous a ajouté un document le "+today.toLocaleString()+"<br><br>";
	message += "<br><div><a href='https://logopedie.eportfolium.fr'>Accédez au site</a></div>"
	const courriels = $("asmContext:has(metadata[semantictag*='courriel-apprenant'])",g_portfolio_current);
	var emails = new Array();
	for (i=0;i<courriels.length;i++){
		const courrielid =  $(courriels[i]).attr("id");
		const email = UICom.structure.ui[courrielid].resource.text_node[LANGCODE].text()
		if (email.length>0 && email.indexOf(USER.email)<0)
			emails.push(email);
	}
	// ------ suppression des doublons ----
	const emailsSansDoublons = emails.reduce((unique, email) => {
	    return unique.includes(email) ? unique : [...unique, email];
	}, []);
	//-------------------------------------
	envoiEmails(message,emailsSansDoublons) ;
}

//# sourceURL=logopedie.js