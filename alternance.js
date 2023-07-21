/* ====================================================
 			ALTERNANCE - PAU
   ==================================================== */

//---------------------- TESTS ------------------------------

//==================================
function testSiConsentement(data)
//==================================
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
function testSiEnseignant() {
//==================================
	let result = false;
	const enseignant_livret = $("*:has(>metadata[semantictag*='enseignant-livret'])",g_portfolio_current)[0];
	if (enseignant_livret!=undefined)
		result =  (UICom.structure.ui[$(enseignant_livret).attr("id")].resource.getCode().length>0);
	return result;
}


//---------------------- MISES A JOUR ------------------------------

//==================================
function setInfos1(nodeid){
//==================================
	setItemElts(nodeid,"etudiant-livret","etudiant-select");
	setItemElts(nodeid,"enseignant-livret","enseignant-select");
	setItemElts(nodeid,"tuteur-livret","tuteur-select");
	setMatriculeEtudiant(nodeid);
	setCourrielEtudiant(nodeid);
	setPageUUID(nodeid);
	setPortfolioUUID(nodeid);
}



//==================================
function setFormationActuelle(node) {
//==================================
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

//==================================
function setInfosFiche1(nodeid){
//==================================
	setItemElts(nodeid,"etudiant-livret","etudiant-select");
	setItemElts(nodeid,"tuteur-livret","tuteur-select");
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
		message += "##firstname## ##lastname## a pris connaissance de la page Entretien "+no+" à "+today.toLocaleString()+"<br>";
		const enseignant_email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='courriel-enseignant'])",g_portfolio_current)).text();
		envoiCourriel(message,enseignant_email);
	}
}

//==================================
function aviserEtudiantEntretien() {
//==================================
	const subject = g_variables["compte-rendu-object"];
	const body = g_variables["compte-rendu-body"];
	const pageid = $("#page").attr('uuid');
	const etudiant = getItemUserInfos(pageid,'etudiant-select');
	sendNotification(subject,body,etudiant.email);
}

//==================================
function envoiCourrielListe(liste,subjecttag,bodytag){
//==================================
	const pageid = $("#page").attr('uuid');
	subject = getText(subjecttag,'Field','text',UICom.structure.ui[pageid].node,LANGCODE);
	body = getText(bodytag,'TextField','text',UICom.structure.ui[pageid].node,LANGCODE);
	for (let i=0; i<liste.length;i++){
		sendNotification(subject,body,liste[i]);
	}
}

//============================== ÉVALUATIONS ==========================

//==================================
function buildSaveEvaluationVector1(nodeid,pageid,type,role,whoeval,whodelete) {
//==================================
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'));
	const whodeletetag = (whodelete=='all') ? "" : role;
	const whodeletes = $("asmContext:has(metadata[semantictag*='"+whodeletetag+"-select'])",UICom.structure.ui[pageid].node);
	const whoevaltag = (whoeval=='all') ? "" : role;
	const whoevals = $("asmContext:has(metadata[semantictag*='"+whoevaltag+"-select'])",UICom.structure.ui[pageid].node);
	const etudiant = getItemUserInfos(pageid,'etudiant-select');
	const formation = "?";
	const cohorte = "?";
//-------------
	const evalid = (type.indexOf("competence")>-1)? nodeid:pageid;
	const demElt = $("asmUnitStructure:has(>metadata[semantictag='evaluation-"+role+"'])",UICom.structure.ui[evalid].node)[0];
	const note = $($("value",$("asmContext:has(metadata[semantictag='note-globale'])",demElt))[1]).text();
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",demElt))[1]).text();
	const comid =$("asmContext:has(metadata[semantictag='evaluation-commentaires'])",demElt).attr("id");
	const commentaires = (comid==undefined) ? "" : $($("text[lang='"+LANG+"']",UICom.structure.ui[comid].resource)).text();
	let date_dem_eval = $("value",$("asmContext:has(metadata[semantictag='date-dem-eval'])",demElt)).text();
	if (date_dem_eval==null || date_dem_eval=='')
		date_dem_eval = new Date().getTime();
	//---------------
	const previewURL = getPreviewSharedURL(pageid,role);
	let a5 = JSON.stringify(new KAPCevaluation(previewURL,date_dem_eval,"",actioncode,actionlabel,etudiant.matricule,note,evaluation,commentaires,""));
	//----------------------
	let candelete = "";
	for (let i=0;i<whodeletes.length;i++){
		const selectid = $("code",whodeletes[i]).text();
		candelete += (i==0) ? selectid:","+selectid;
		}
	for (let i=0;i<whoevals.length;i++){
		const selectid = $("code",whoevals[i]).text();
		const selectemail = $("value",whoevals[i]).text();
		saveVector(selectid,type,nodeid,pageid,a5,etudiant.name,formation,cohorte,"","",candelete);
		//----envoi courriel à l'enseignant -----
		if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
			const location = window.location.toString();
			const url = location.substring(0,location.indexOf("karuta.htm")) + "public.htm?i="+previewURL;
			const object = g_variables["demande-evaluation-object"];
			const body = g_variables["demande-evaluation-body"];
			sendNotification(object,body,selectemail);
		}
	}
}


//==================================
function buildSubmitEvaluationVector1(nodeid,pageid,type,role) {
//==================================
	if (role==null)
		role='enseignant';
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	const etudiant = getItemUserInfos(pageid,'etudiant-select');
	const today = new Date().getTime();
	const previewURL = getPreviewSharedURL(pageid,role);
	const formation = "?";
	const cohorte = "?";
	//-------------
	const evalid = (type.indexOf("competence")>-1)? nodeid:pageid;
	const demElt = $("asmUnitStructure:has(>metadata[semantictag='evaluation-"+role+"'])",UICom.structure.ui[evalid].node)[0];
	const visaElt = $("asmUnitStructure:has(>metadata[semantictag='visa-"+role+"'])",UICom.structure.ui[evalid].node)[0];
	const note = $($("value",$("asmContext:has(metadata[semantictag='note-globale'])",demElt))[1]).text();
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",demElt))[1]).text();
	let commentaires = getResourceVectorView('evaluation-commentaires',visaElt);
	//-------------
	if (role=='tuteur' && $("asmContext:has(metadata[semantictag='points-forts'])",demElt).length>0) {
		commentaires = getResourceVectorView('evaluation-commentaires',demElt);
		const pf = getResourceVectorView('points-forts',demElt);
		const axes = getResourceVectorView('axes-ameliorations',demElt);
		const objs = getResourceVectorView('objectifs-suivre',demElt);
		commentaires += "|"+pf+"|"+axes+"|"+objs;
	}
	//-------------
	let date_dem_eval = $("value",$("asmContext:has(metadata[semantictag='date-dem-eval'])",demElt)).text();
	if (date_dem_eval==null || date_dem_eval=='')
		date_dem_eval = new Date().getTime();
	//-------------
	const a5 = JSON.stringify(new KAPCevaluation(previewURL,date_dem_eval,today,actioncode,actionlabel,etudiant.matricule,note,evaluation,commentaires,etudiant.email));
	saveVector(USER.username,type,nodeid,pageid,a5,etudiant.name,formation,cohorte,"","");
	//----envoi courriel à l'étudiant -----
	if (g_variables['sendemail']=='true') {
		const object = g_variables["evaluation-faite-object"];
		const body = g_variables["evaluation-faite-body"];
		sendNotification(object,body,etudiant.email);
	}
}

//==================================
function demanderEvaluation1(nodeid,role,whoeval,whodelete) { // par l'étudiant
//==================================
	let pageid = $("#page").attr('uuid');
	const flagid = $("*:has(>metadata[semantictag='flag-"+role+"'])",UICom.structure.ui[pageid].node).attr("id");
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	let js = "buildSaveEvaluationVector1('"+nodeid+"','"+pageid+"','"+type+"-evaluation','"+role+"','"+whoeval+"','"+whodelete+"');majDemEvalSAE('"+nodeid+"')";
	if (role!=null) {
		js += ";submit('"+flagid+"')";
	}
	const text = "Attention vous ne pourrez plus faire de modifications sur cette page. Voulez-vous continuer?";
	const section_etudiant_soumission_id = $("*:has(>metadata[semantictag='section-etudiant-soumission'])",UICom.structure.ui[pageid].node).attr("id");
	confirmSubmit(section_etudiant_soumission_id,false,js,text);
}

//==================================
function modifierEvaluation1(nodeid,role) { 
//==================================
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+'-evaluation',null,pageid);
	buildSaveEvaluationVector1(pageid,pageid,type+'-evaluation',role);
}

//==================================
function confirmSoumettreEvaluation1(nodeid,role){
//==================================
	const flagid = $("*:has(>metadata[semantictag='flag-"+role+"'])",UICom.structure.ui[nodeid].node).attr("id");
	let js = "soumettreEvaluation1('"+nodeid+"','"+role+"');majDateEvaluation('"+nodeid+"')";
	if (role!=null) {
		js += ";submit('"+flagid+"')";
	}
	confirmSubmit(nodeid,true,js);
}

//==================================
function soumettreEvaluation1(nodeid,role){
//==================================
	let pageid = nodeid;
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+'-evaluation',null,pageid);
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitEvaluationVector1(nodeid,pageid,type+"-evaluation-done",role);
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}

//==================================
function confirmSoumettreEvaluationTuteur1(nodeid,role){
//==================================
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	const flagid = $("*:has(>metadata[semantictag='flag-"+role+"'])",UICom.structure.ui[pageid].node).attr("id");
	let js = "soumettreEvaluationTuteur1('"+nodeid+"','"+role+"')";
	if (role!=null) {
		js += ";submit('"+flagid+"')";
	}
	confirmSubmit(nodeid,true,js);
}

//==================================
function soumettreEvaluationTuteur1(nodeid,role){
//==================================
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(USER.username,type+'-evaluation',null,pageid);
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitEvaluationVector1(nodeid,pageid,type+"-evaluation-done",role);
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}

//================== DISPLAY EVALUATIONS ================================================

//==================================
function displayEvaluationsSoumises1(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
//==================================
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	const date_evaluation = new Date(parseInt(a5.date_eval));
	const evals = a5.commentaires.split("|");
	const commentaires = evals[0];
	const pf = evals[1];
	const axes = evals[2];
	const objs = evals[3];
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+ date_evaluation.toLocaleString()+"</td>";
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	if (evals.length>3) {
		html += "<td>";
		const pf = evals[1];
		const axes = evals[2];
		const objs = evals[3];
		html += "<b>Points forts</b></br>"+pf+"</br>";
		html += "<b>Axes d'amélioration</b></br>"+axes+"</br>";
		html += "<b>Objectifs à suivre</b></br>"+objs+"</br>";
		html += "<b>Commentaires</b></br>"+commentaires;
		html += "</td>";
	} else {
		html += "<td>"+a5.commentaires+"</td>";
	}
	html += "</tr>";
	$("#"+destid).append(html);
}

//==================================
function displayEvaluationsEvaluer1(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
//==================================
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	const date_evaluation = new Date(parseInt(a5.date_eval));
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "</tr>";
	$("#"+destid).append(html);
}


//==================================================================

//==================================
function actualiserProfil(nodeid) {
//==================================
	const portfolio = UIFactory.Portfolio.search_bycode('.portfolio-etu-'+USER.username);
	const portfoliocode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",portfolio)[0]).text();
	updateNodeText(portfoliocode,"profil-linkdin","profil-linkdin",UICom.structure.ui[nodeid].node);
	//------------
	UIFactory.Node.reloadUnit();
}




//# sourceURL=alternance.js