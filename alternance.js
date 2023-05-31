
//================== UPPA-LEA.js

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


function setNomPrenomTuteur(nodeid) {
	var tuteur_select =  $("*:has(>metadata[semantictag*='tuteur-select'])",UICom.structure.ui[nodeid].node)[0];
	var tuteur_selectid = $(tuteur_select).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-tuteur'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-tuteur'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[tuteur_selectid].resource.label_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[tuteur_selectid].resource.save();
}

function setNomPrenomEnseigmant(nodeid) {
	var enseignant_select =  $("*:has(>metadata[semantictag*='enseignant-select'])",UICom.structure.ui[nodeid].node)[0];
	var enseignant_selectid = $(enseignant_select).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-enseignant'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-enseignant'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	const login = UICom.structure.ui[nomid].getCode();
	$(UICom.structure.ui[enseignant_selectid].resource.code_node).text(login);
	$(UICom.structure.ui[enseignant_selectid].resource.label_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[enseignant_selectid].resource.save();
}

function setTuteurEnseignant(nodeid) {
	setNomPrenomTuteur(nodeid);
//	setNomPrenomEnseigmant(nodeid);
}


function getSubstring(type,str){
	let result = "";
	if (type=='formation') {
		result = str.substring(str.indexOf("/")+1);
		result = result.substring(0,result.indexOf("/"));
	}
	return result;
}

function setFormationActuelle(node) {
	const nodeid = $(node).attr("id");
	const formationcode = $(UICom.structure.ui[nodeid].resource.code_node).text();
	const portfolio = UIFactory.Portfolio.search_bycode(replaceVariable("alternance-##accountlogin##"))
	const portfoliocode = $($("code",portfolio)[0]).text();
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/" + portfoliocode +"?resources=true",
		success : function(data) {
//			var images = $("asmContext:has(metadata[semantictag='welcome-main-image'])",data);
			const node = $("asmContext:has(metadata[semantictag*='formation-actuelle'])",data);
			const nodeid = $(node).attr('id');
			var resource = $("asmResource[xsi_type='Field']",node);
			$("text",resource).text(formationcode);
			var data = "<asmResource xsi_type='Field'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/resources/resource/" + nodeid,
				success : function(data) {
				},
				error : function(data) {
				}
			});
		}
	});
}


//==============================================================================================================


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