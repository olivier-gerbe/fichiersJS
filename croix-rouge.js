

//==================================
function messageLu(nodeid)
//==================================
{
	if (USER.username!='root') {
		viewed = false;
		let itself = UICom.structure.ui[nodeid].node;
		// -----------------------------
		// search if already viewded by the USER
		const views = $("asmContext:has(metadata[semantictag*='view-by'])",itself);
		for (i=0;i<views.length;i++){
			const viewid =  $(views[i]).attr("id");
			const viewtext = $(UICom.structure.ui[viewid].resource.text_node[LANGCODE]).text();
			if (viewtext.indexOf(USER.firstname)>-1 && viewtext.indexOf(USER.lastname)>-1) {
				viewed = true;
				break;
			}
		}
		//-----------------------------
		if (!viewed) {
			//--------------------------
			// import et mise à jour de 'view-by'
			const srcecode = replaceVariable("##dossier-modeles-LAN##.composantes-generales")
			const viewid = importBranch(nodeid,srcecode,"view-by");
			UIFactory.Node.reloadUnit(nodeid,false);
			const today = new Date();
			let  viewtext =today.toLocaleString() + " par " + USER.firstname + " "+ USER.lastname;
			if (views.length==0) {
				viewtext = "Créé le " + viewtext;
				const xml = "<metadata-epm displayitselforg='default' displayview='compact' nds-othercss='display:none'/>";
				$.ajax({
					async : false,
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : serverBCK_API+"/nodes/node/" + viewid+"/metadataepm",
					success : function() {
					},
					error : function() {
					}
				});
				UICom.structure.ui[viewid].resource.text_node[LANGCODE].text(viewtext);
				UICom.structure.ui[viewid].save();
				UIFactory.Node.reloadUnit(nodeid);
			} else {
				viewtext =  "Vu le " + viewtext;
				UICom.structure.ui[viewid].resource.text_node[LANGCODE].text(viewtext);
				UICom.structure.ui[viewid].save();
			}
		}
	}
	return true;
}
//==================================
function testSiEnvoiCourrielCR(nodeid)
//==================================
{
	let result = true;
	//-------------------------------
	const parent = UICom.structure.ui[nodeid].node;
	const notified = $("asmContext:has(metadata[semantictag*='notified-on'])",parent);
	const notifiedid =  $(notified).attr("id");
	if (UICom.structure.ui[notifiedid].resource.text_node[LANGCODE].text()!='')
		result = false;	
	return result;
}

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
function envoiCourrielCR(nodeid)
//==================================
{
	const today = new Date();
	//-------------------------------
	const parent = UICom.structure.ui[nodeid].node;
	const messtextnode = $("asmContext:has(metadata[semantictag*='texte-commentaire'])",parent);
	const messtextnodeid =  $(messtextnode).attr("id");
	const messtext = UICom.structure.ui[messtextnodeid].resource.text_node[LANGCODE].text();
	//-------------------------------
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" a posté un message  le "+today.toLocaleString()+"<br><br>";
	message += "<div style='padding:5px;border:1px solid #c6c2c1'>" + messtext + "</div>"
	message += "<div><a href='https://croix-rouge.eportfolium.fr'>Accédez au portfolio</a></div>"
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

//# sourceURL=croix-rouge.js



