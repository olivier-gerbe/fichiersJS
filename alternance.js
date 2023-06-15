
//========================

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
	const tuteur_select =  $("*:has(>metadata[semantictag*='tuteur-select'])",UICom.structure.ui[nodeid].node)[0];
	const tuteur_selectid = $(tuteur_select).attr("id");
	const profil_tuteur_pro = $("*:has(>metadata[semantictag='profil-tuteur-pro'])",g_portfolio_current)[0];
	const profil_tuteur_proid = $(profil_tuteur_pro).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-tuteur'])",UICom.structure.ui[profil_tuteur_proid].node)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-tuteur'])",UICom.structure.ui[profil_tuteur_proid].node)[0];
	const nomid = $(nom).attr("id");
	const login = $("*:has(>metadata[semantictag*='login-tuteur'])",UICom.structure.ui[profil_tuteur_proid].node)[0];
	const loginid = $(login).attr("id");
	const logincode = UICom.structure.ui[loginid].resource.getView();
	$(UICom.structure.ui[tuteur_selectid].resource.code_node).text(logincode);
	$(UICom.structure.ui[tuteur_selectid].resource.label_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[tuteur_selectid].resource.save();
	//--------------------
	const tuteur2_select =  $("*:has(>metadata[semantictag*='tuteur2-select'])",UICom.structure.ui[nodeid].node)[0];
	const tuteur2_selectid = $(tuteur2_select).attr("id");
	const profil_tuteur_pro2 = $("*:has(>metadata[semantictag='profil-tuteur-pro2'])",g_portfolio_current)[0];
	if ($(profil_tuteur_pro2).length>0) {
		const profil_tuteur2_proid = $(profil_tuteur_pro2).attr("id");
		const prenom2 = $("*:has(>metadata[semantictag*='prenom-tuteur'])",UICom.structure.ui[profil_tuteur2_proid].node)[0];
		const prenom2id = $(prenom2).attr("id");
		const nom2 = $("*:has(>metadata[semantictag*='nom-famille-tuteur'])",UICom.structure.ui[profil_tuteur2_proid].node)[0];
		const nom2id = $(nom2).attr("id");
		const login2 = $("*:has(>metadata[semantictag*='login-tuteur'])",UICom.structure.ui[profil_tuteur_proid].node)[0];
		const login2id = $(login2).attr("id");
		const login2code = UICom.structure.ui[login2id].resource.getView();
		$(UICom.structure.ui[tuteur2_selectid].resource.code_node).text(login2code);
		$(UICom.structure.ui[tuteur2_selectid].resource.label_node[LANGCODE]).text(UICom.structure.ui[nom2id].resource.getView()+" "+UICom.structure.ui[prenom2id].resource.getView());
		UICom.structure.ui[tuteur2_selectid].resource.save();
	}
}

function setNomPrenomEnseigmant(nodeid) {
	var enseignant_select =  $("*:has(>metadata[semantictag*='enseignant-select'])",UICom.structure.ui[nodeid].node)[0];
	var enseignant_selectid = $(enseignant_select).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-enseignant'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-enseignant'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	const login = $("*:has(>metadata[semantictag*='login-enseignant'])",g_portfolio_current)[0];
	const loginid = $(login).attr("id");
	const logincode = UICom.structure.ui[loginid].resource.getView();
	$(UICom.structure.ui[enseignant_selectid].resource.code_node).text(logincode);
	$(UICom.structure.ui[enseignant_selectid].resource.label_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[enseignant_selectid].resource.save();
}

function setTuteurEnseignant(nodeid) {
	setNomPrenomTuteur(nodeid);
	setNomPrenomEnseigmant(nodeid);
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

function setNomPrenomTuteurFiche(nodeid) {
	const tuteur_select =  $("*:has(>metadata[semantictag*='fiche-tuteur'])",UICom.structure.ui[nodeid].node)[0];
	const tuteur_selectid = $(tuteur_select).attr("id");
	const profil_tuteur_pro = $("*:has(>metadata[semantictag='profil-tuteur-pro'])",g_portfolio_current)[0];
	const profil_tuteur_proid = $(profil_tuteur_pro).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-tuteur'])",UICom.structure.ui[profil_tuteur_proid].node)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-tuteur'])",UICom.structure.ui[profil_tuteur_proid].node)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[tuteur_selectid].resource.text_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[tuteur_selectid].resource.save();
}

function setNomPrenomEtudiantFiche(nodeid) {
	const etudiant_select =  $("*:has(>metadata[semantictag*='fiche-etudiant'])",UICom.structure.ui[nodeid].node)[0];
	const etudiant_selectid = $(etudiant_select).attr("id");
	const profil_etudiant = $("*:has(>metadata[semantictag='profil-etudiant'])",g_portfolio_current)[0];
	const profil_etudiantid = $(profil_etudiant).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",UICom.structure.ui[profil_etudiantid].node)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",UICom.structure.ui[profil_etudiantid].node)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[etudiant_selectid].resource.text_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[etudiant_selectid].resource.save();
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