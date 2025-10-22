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
		xml +="<subject>FORUM Karuta</subject>";
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
	let notification = "<ul>La question a été envoyée. The question has been sent.<ul> ";
	alertHTML(notification);
}

//==================================
function majCourriel(nodeid)
//==================================
{
	const courriel_node = $("asmContext:has(>metadata[semantictag*='courriel-participant'])", UICom.structure.ui[nodeid].node);
	const courriel_nodeid =  $(courriel_node).attr("id");
	$(UICom.structure.ui[courriel_nodeid].resource.text_node[LANGCODE]).text(USER.email);
	UICom.structure.ui[courriel_nodeid].resource.save();
}

//==================================
function envoyerQuestion(nodeid)
//==================================
{
	const today = new Date();
	//-------------------------------
	const parent = UICom.structure.ui[nodeid].node;
	const messtextnode = $("asmContext:has(>metadata[semantictag*='question-participant'])",parent);
	const messtextnodeid =  $(messtextnode).attr("id");
	const messtext = UICom.structure.ui[messtextnodeid].resource.text_node[LANGCODE].text();
	//-------------------------------
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" a posté une question  le "+today.toLocaleString()+"<br><br>";
	message += "<div style='padding:5px;border:1px solid #c6c2c1'>" + messtext + "</div>"
	message += "<div><a href='https://forum.eportfolium.fr'>Accédez au forum</a></div>"
	const courriels = $("asmContext:has(metadata[semantictag*='email-'])",g_portfolio_current);
	var emails = [];
	for (i=0;i<courriels.length;i++){
		const courrielid =  $(courriels[i]).attr("id");
		const email = UICom.structure.ui[courrielid].resource.text_node[LANGCODE].text()
		if (email.length>0 && email.indexOf(USER.email)<0)
			emails.push(email);
	}
	envoiEmails(message,emails) ;
	submit(nodeid);
	UIFactory.Node.reloadUnit();
}

//==================================
function envoyerReponse(nodeid)
//==================================
{
	const today = new Date();
	//-------------------------------
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" a répondu à votre question  le "+today.toLocaleString()+"<br><br>";
	message += "<div><a href='https://forum.eportfolium.fr'>Accédez au forum</a></div>"
	//-------------------------------
	//-------------------------------
	const parent = $(UICom.structure.ui[nodeid].node).parent().parent();
	const courriel_node = $("asmContext:has(>metadata[semantictag*='courriel-participant'])",parent);
	const courriel_nodeid =  $(courriel_node).attr("id");
	const courriel = UICom.structure.ui[courriel_nodeid].resource.text_node[LANGCODE].text();
	var emails = [];
	emails.push(courriel);
	envoiEmails(message,emails) ;
	submit(nodeid);
	UIFactory.Node.reloadUnit();
}

//# sourceURL=forum.js