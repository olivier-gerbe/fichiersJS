
karutaStr['fr']['connection-cas2']="Connexion";


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
	const apprentinode = $("asmUnitStructure:has(>metadata[semantictag*='carte-intervenant-apprenti'])",g_portfolio_current);
	const prenomnode = $("asmContext:has(>metadata[semantictag*='prenom-apprenti'])",apprentinode);
	const prenomnodeid =  $(prenomnode).attr("id");
	const prenom = UICom.structure.ui[prenomnodeid].resource.text_node[LANGCODE].text();
	const nomnode = $("asmContext:has(>metadata[semantictag*='nom-famille-apprenti'])",apprentinode);
	const nomnodeid =  $(nomnode).attr("id");
	const nom = UICom.structure.ui[nomnodeid].resource.text_node[LANGCODE].text();
	//-------------------------------
	const node = UICom.structure.ui[nodeid].node;
	const messlabel = UICom.structure.ui[nodeid].label_node[LANGCODE].text();
	const messtextnode = $("asmContext:has(metadata[semantictag*='texte-commentaire'])",node);
	const messtextnodeid =  $(messtextnode).attr("id");
	const messtext = UICom.structure.ui[messtextnodeid].resource.text_node[LANGCODE].text();
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" a posté un message  le "+today.toLocaleString()+" dans le portfolio de "+prenom+" "+nom+"<br><br>";
	message += "<div style='padding:5px;font-size:120%'>" + messlabel + "</div><br>";
	message += "<div style='padding:5px;border:1px solid #c6c2c1'>" + messtext + "</div><br>";
	message += "<div><a href='https://croix-rouge.eportfolium.fr'>Accédez au LAN</a></div>";
	//-------------------------------
	let emails = new Array();
	//-------------------------------
	const manodes = $("asmUnitStructure:has(>metadata[semantictag*='carte-intervenant-ma'])",g_portfolio_current);
	for (i=0;i<manodes.length;i++){
		const actifnode = $("asmContext:has(>metadata[semantictag*='ma-actif'])",manodes[i]);
		const actifnodeid =  $(actifnode).attr("id");
		const actifcode = UICom.structure.ui[actifnodeid].resource.getCode();
		if (actifcode=='@boite-cocher1') {
			const courriel = $("asmContext:has(>metadata[semantictag*='email-'])",manodes[i]);
			const courrielid =  $(courriel).attr("id");
			const email = UICom.structure.ui[courrielid].resource.label_node[LANGCODE].text()
			if (email.length>0)
				emails.push(email);
		}
	}
	//-------------------------------
	const fornodes = $("asmUnitStructure:has(>metadata[semantictag*='carte-intervenant-formateur'])",g_portfolio_current);
	for (i=0;i<fornodes.length;i++){
		const actifnode = $("asmContext:has(>metadata[semantictag*='formateur-actif'])",fornodes[i]);
		const actifnodeid =  $(actifnode).attr("id");
		const actifcode = UICom.structure.ui[actifnodeid].resource.getCode();
		if (actifcode=='@boite-cocher1') {
			const courriel = $("asmContext:has(>metadata[semantictag*='email-'])",fornodes[i]);
			const courrielid =  $(courriel).attr("id");
			const email = UICom.structure.ui[courrielid].resource.label_node[LANGCODE].text()
			if (email.length>0)
				emails.push(email);
		}
	}
	/*
	const courriels = $("asmContext:has(metadata[semantictag*='email-'])",g_portfolio_current);
	for (i=0;i<courriels.length;i++){
		const courrielid =  $(courriels[i]).attr("id");
		const email = UICom.structure.ui[courrielid].resource.label_node[LANGCODE].text()
		if (email.length>0 && email.indexOf(USER.email)<0)
			emails.push(email);
	}
	*/
	// ------ suppression des doublons ----
	const emailsSansDoublons = emails.reduce((unique, email) => {
	    return unique.includes(email) ? unique : [...unique, email];
	}, []);
	//-------------------------------------
	envoiEmails(message,emailsSansDoublons) ;
	submit(nodeid);
	UIFactory.Node.reloadUnit();
}

//==================================
function afficherPortfolios(nodeid)
//==================================
{
	const login = cleanCode(UICom.structure.ui[nodeid].resource.code_node.text());
		$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users?username="+login,
		success : function(data) {
			const userid = $($("user",data)[0]).attr("id");
			const firstname = $($("firstname",data)[0]).text();
			const lastname = $($("lastname",data)[0]).text();
			UIFactory.Portfolio.getListPortfolios(userid,firstname,lastname);
		}
	});

}

//==================================
function getFormation(text)
//==================================
{
	return text.substring(text.lastIndexOf("_")+1);

}

//==================================
function underscore2slash(text)
//==================================
{
	return text.replaceAll("_","/");

}

//==================================
function setArchiveCode(code)
//==================================
{
	let newcode = replaceVariable(code);
	newcode = "zarchive/" + newcode.substring("portfolios-apprentis-croix-rouge".length+1);
	return newcode; 
}

//==================================
function envoiCourrielCohorte(cohorte)
//==================================
{
	let ok = true;
	const today = new Date();
	//-------------------------------
	const node = $("asmUnitStructure:has(>metadata[semantictag*='ss-fiche-liaison'])",g_portfolio_current);
	const nodeid = $(node).attr("id");
	const messlabel = UICom.structure.ui[nodeid].label_node[LANGCODE].text();
	const messtextnode = $("asmContext:has(metadata[semantictag*='texte-commentaire'])",node);
	const messtextnodeid =  $(messtextnode).attr("id");
	const messtext = UICom.structure.ui[messtextnodeid].resource.text_node[LANGCODE].text();
	let message = "";
	message += "Bonjour,<br><br>";
	message += USER.firstname + " " + USER.lastname +" a posté un message  le "+today.toLocaleString()+" <br><br>";
	message += "<div style='padding:5px;font-size:120%'>" + messlabel + "</div><br>";
	message += "<div style='padding:5px;border:1px solid #c6c2c1'>" + messtext + "</div><br>";
	message += "<div><a href='https://croix-rouge.eportfolium.fr'>Accédez au LAN</a></div>";
	let emails = new Array();
	const url1 = serverBCK_API+"/portfolios?active=1&search="+cohorte;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url1,
		success : function(data) {
			const trees = $("portfolio",data);
			for (let i=0; i<trees.length; i++){
				const portfolioid = $(trees[i]).attr("id");
				$.ajax({
					async: false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true",
					success : function(data) {
						//-------------------------------
						const apprentinode = $("asmUnitStructure:has(>metadata[semantictag*='carte-intervenant-apprenti'])",data);
						const courriel = $("asmContext:has(>metadata[semantictag*='email-'])",apprentinode);
						const email = $("code",$("asmResource[xsi_type='Item']",courriel)).text();
						if (email.length>0)
							emails.push(email);
						//-------------------------------
						const manodes = $("asmUnitStructure:has(>metadata[semantictag*='carte-intervenant-ma'])",data);
						for (let j=0;j<manodes.length;j++){
							const actifnode = $("asmContext:has(>metadata[semantictag*='ma-actif'])",manodes[j]);
							const actifcode = $("code",$("asmResource[xsi_type='Get_Resource']",actifnode)).text();
							if (actifcode=='@boite-cocher1') {
								const targetid = $("code",$("asmResource[xsi_type='Proxy']",manodes[j])).text();
								$.ajax({
									async : false,
									type : "GET",
									dataType : "xml",
									url : serverBCK_API+"/nodes/node/" + targetid + "?resources=true",
									success : function(data) {					
										const courriel = $("asmContext:has(>metadata[semantictag*='email-'])",data);
										const email = $("code",$("asmResource[xsi_type='Item']",courriel)).text();
										if (email.length>0)
											emails.push(email);
									}
								});
							}
						}
						//-------------------------------
						const fornodes = $("asmUnitStructure:has(>metadata[semantictag*='carte-intervenant-formateur'])",data);
						for (let k=0;k<fornodes.length;k++){
							const actifnode = $("asmContext:has(>metadata[semantictag*='formateur-actif'])",fornodes[k]);
							const actifcode = $("code",$("asmResource[xsi_type='Get_Resource']",actifnode)).text();
							if (actifcode=='@boite-cocher1') {
								const targetid = $("code",$("asmResource[xsi_type='Proxy']",fornodes[k])).text();
								$.ajax({
									async : false,
									type : "GET",
									dataType : "xml",
									url : serverBCK_API+"/nodes/node/" + targetid + "?resources=true",
									success : function(data) {					
										const courriel = $("asmContext:has(>metadata[semantictag*='email-'])",data);
										const email = $("code",$("asmResource[xsi_type='Item']",courriel)).text();
										if (email.length>0)
											emails.push(email);
									}
								});
							}
						}

					},
					error : function() {
						ok = false;
					}
				});
			}
		}
	});
	// ------ suppression des doublons ----
	const emailsSansDoublons = emails.reduce((unique, email) => {
 	   return unique.includes(email) ? unique : [...unique, email];
	}, []);
	//-------------------------------------
	envoiEmails(message,emailsSansDoublons);
	return ok;
}

function specificDisplayPortfolios(type){
	if (USER.other.indexOf("secretaire")>-1) {
		if (type==null)
			type = 'card';
		let nb_visibleportfolios = 0;
		let visibleportfolios = [];
		let no_visibleportfolio = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible && $(portfolios_list[i].code_node).text().indexOf('portfolio-lan')<0) {
				visibleportfolios.push(portfolios_list[i].node);
				no_visibleportfolio = i;
				nb_visibleportfolios++;
			}
		}
		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>1)
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false',type,visibleportfolios);
		else if (nb_visibleportfolios==1){
			display_main_page(portfolios_list[no_visibleportfolio].id);
		}
	} else if (USER.other!="etudiant")
		throw 'non etudiant';
}
//# sourceURL=croix-rouge.js



