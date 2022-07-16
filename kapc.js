// === version 1.2.2 2022/06/17 ===
// 1.2.2 Ajout évaluation péridode

//=============== TEST SI EVALUATION DEMANDEE ==================
function testSiEvalDemandee(nodeid)
{
	const demandeid = $("*:has(>metadata[semantictag*=demande-evaluation])",$(UICom.structure.ui[nodeid].node)).attr("id");
	const val = UICom.structure.ui[demandeid].resource.getValue();
	if (val=='1') {
		alert("Impossible car vous avez demandé une évaluation à votre enseignant");
		$("#wait-window").modal('hide');
		return false;
	} else {
		return true;
	}
}

//=============== TEST SI AFFICHAGE ==================
function testSiAfficherDemandeEvaluation()
{
	const pageid = $("#page").attr('uuid');
	const deadlineid = $("*:has(>metadata[semantictag*=deadline])",$(UICom.structure.ui[pageid].node)).attr("id");
	const today = new Date().getTime();
	const utc = UICom.structure.ui[deadlineid].resource.getAttributes()['utc'];
	if (utc<today || USER.admin || g_userroles[0]=='designer' ) {
		return true;
	} else {
		return false;
	}
}


function majEvaluation(nodeid,sharetoemail) {
	var demande = $("*:has(>metadata[semantictag*='demande-eval'])",UICom.structure.ui[nodeid].node)[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString() + " à " + sharetoemail;
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function confirmsoumettreAutres(nodeid,semtag) {
	document.getElementById('delete-window-body').innerHTML = "L'envoi supprime les droits d'édition de tous les éléments de la page. Cette action est irréversible.<br> Voulez-vous continuer ?";
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"$('#delete-window').modal('hide');soumettreAutres('"+nodeid+"','"+semtag+"')\">Envoyer</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

function soumettreAutres(nodeid,semtag) {
	submit(nodeid);
	const pageid = $("#page").attr('uuid');
	var autres = $("*:has(>metadata[semantictag*='"+semtag+"'])",UICom.structure.ui[pageid].node);
	for (var i=0;i<autres.length;i++){
		submit($(autres).attr("id"));
	}
}


function testPrevGGRCodeNotEmpty(node) {
	// le GGR précédent doit avoir la métadonnée Recharger la page cochée
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!="");
}

function testEnseignantCodeNotEmpty(uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[uuid].node);
	return (enseignants.length>0);
}

function envoiErreurSiPasEnseignants() {
	var uuid = $("#page").attr('uuid');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[uuid].node);
	if (enseignants.length==0) {
		alert("Il n'y a pas d'enseignant ou d'évaluateur associé.");
		$("#edit-window").modal('hide');
		throw "Il n'y a pas d'enseignant associé.";
	}
}

function niveauchoisi(node) {
	// retourne vrai si le Get_Get_Resource précédent le noeud n'est pas vide, faux sinon
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!="");
}

function setVariable_code (node)
{
	let variable = $("code",$("asmResource[xsi_type='nodeRes']",$(node))).text();
	let code = $("code",$("asmResource[xsi_type='Get_Resource']",$(node))).text();
	g_variables[variable+"_code"] = code;
}

//==============================================
function setPrenomNom(nodeid) {
	var prenom_nom =  $("*:has(>metadata[semantictag*='prenom_nom'])",UICom.structure.ui[nodeid].node)[0];
	var prenom_nomid = $(prenom_nom).attr("id");
	if (prenom_nom==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		prenom_nomid = importBranch(nodeid,srcecode,"prenom_nom");
		UIFactory.Node.upNode(prenom_nomid,false);
		UIFactory.Node.upNode(prenom_nomid,false);
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[prenom_nomid].resource.text_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[prenom_nomid].resource.save();
}

function setMatricule(nodeid) {
	var etudiant_matricule =  $("*:has(>metadata[semantictag*='etudiant-matricule'])",UICom.structure.ui[nodeid].node)[0];
	var etudiant_matriculeid = $(etudiant_matricule).attr("id");
	if (etudiant_matricule==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		etudiant_matriculeid = importBranch(nodeid,srcecode,"etudiant-matricule");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const matricule = $("*:has(>metadata[semantictag*='matricule-etudiant'])",g_portfolio_current)[0];
	const matriculeid = $(matricule).attr("id");
	$(UICom.structure.ui[etudiant_matriculeid].resource.text_node[LANGCODE]).text(UICom.structure.ui[matriculeid].resource.getView());
	UICom.structure.ui[etudiant_matriculeid].resource.save();
}

//==============================================

function ajouterPartage(nodeid) {
	var node = UICom.structure.ui[nodeid].node
	var metadatawad = $("metadata-wad",node)[0];
	var text = "etudiant,pair,?,2,336,Demander une évaluation à un pair@fr;etudiant,tuteur,?,3,336,Demander une évaluation à un tuteur@fr";
	$(metadatawad).attr("shareroles",text);
	var xml = xml2string(metadatawad[0]);
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		nodeid : nodeid,
		url : serverBCK_API+"/nodes/node/" + nodeid+"/metadatawad",
		success : function(data) {
		},
		error : function(data) {
			console.log("ERROR update metadatawad("+this.nodeid+") -  attribute="+attribute+" value="+text);
		}
	});
}


//mise à jour du code et du libellé dela compétence dans la section 'mes compétences'
function setCompetenceCodeLabel(nodeid){
	let js = replaceVariable("setNodeCodeLabel(##currentnode##,##lastimported##)",UICom.structure.ui[nodeid]);
	eval(js);
}

function demandeEnregistree(nodeid){
	alert('Demande enregistrée')
}


function majDemEvalSAE(nodeid) {
	const val = UICom.structure.ui[nodeid].resource.getValue();
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node).parent())[0];
	var demandeid = $(demande).attr("id");
	var text = "";
	if (val==1)
		text = " " + new Date().toLocaleString();
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function majDate(nodeid,datesemtag) {
	var date = $("*:has(>metadata[semantictag*='"+datesemtag+"'])",$(UICom.structure.ui[nodeid].node).parent())[0];
	var dateid = $(date).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[dateid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[dateid].resource.save();
}

function majDateEvaluation(nodeid) {
	let evalens = $("*:has(>metadata[semantictag*=evaluation-enseignant])",$(UICom.structure.ui[nodeid].node));
	var date = $("*:has(>metadata[semantictag*=date-evaluation])",evalens)[0];
	var dateid = $(date).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[dateid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[dateid].resource.save();
}

function cacherColonnesVides(){
	var colspan = 7;
	if (g_variables['auto-eval']==undefined || g_variables['auto-eval'].length==0){
		$("td.auto-eval").hide();
		colspan--;
	}
	if (g_variables['eval-pair']==undefined || g_variables['eval-pair'].length==0){
		$("td.eval-pair").hide();
		colspan--;
	}
	if (g_variables['eval-tuteur']==undefined || g_variables['eval-tuteur'].length==0) {
		$("td.eval-tuteur").hide();
		colspan--;
	}
	if (g_variables['note']==undefined || g_variables['note'].length==0) {
		$("td.note").css('visibility','hidden');
	}
	$("td.colsvides").attr('colspan',colspan);

}


//==================================
function sendNotification(subject,body,email) {
//==================================
	var message = "";
//	var img = document.querySelector('#config-send-email-logo');
//	var imgB64 = getDataUrl(img)//	$("#image-window-body").html("");
//	var logo = "<img width='"+img.style.width+"' height='"+img.style.height+"' src=\""+imgB64+"\">";
//	message = logo + "<br>" + body;
	message = body;
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	//------------------------------
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+subject+"</subject>";
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


function supprimerCompetenceMonBilan(uuid){
	var retour = false;
	if (confirm('ATTENTION. Cela va supprimer la compétence dans Mon bilan. Voulez-vous continuer?')) {
		retour = true;
		const code = UICom.structure.ui[uuid].getCode();
		const target = getTarget (UICom.structure.ui[uuid].node,'mes-competences');
		if (target.length>0) {
			targetid = $(target[0]).attr("id");
			const compnode = $("*:has(>metadata[semantictag*=page-competence-specification])",UICom.structure.ui[targetid].node);
			for (let i=0;i<compnode.length;i++){
				const nodeid = $(compnode[i]).attr("id");
				const nodecode = UICom.structure.ui[nodeid].getCode();
				if (nodecode==code)
					UIFactory.Node.remove(nodeid);
			}
			UIFactory.Node.reloadStruct();
		}
	} else {
		$('#delete-window').modal('hide');
		$('#wait-window').modal('hide');
	}
	return retour;
}

function supprimerFormationMonBilan(uuid){
	var retour = false;
	if (confirm('ATTENTION. Cela va supprimer la formation et les compétences dans Mes bilans par compétence. Voulez-vous continuer?')) {
		retour = true;
		const code = UICom.structure.ui[uuid].getCode();
		const target = getTarget (UICom.structure.ui[uuid].node,'mes-competences');
		if (target.length>0) {
			targetid = $(target[0]).attr("id");
			const compnode = $("*:has(>metadata[semantictag*=bilan-competences-FORMATION])",UICom.structure.ui[targetid].node);
			for (let i=0;i<compnode.length;i++){
				const nodeid = $(compnode[i]).attr("id");
				const nodecode = UICom.structure.ui[nodeid].getCode();
				if (nodecode==code)
					UIFactory.Node.remove(nodeid);
			}
			UIFactory.Node.reloadStruct();
		}
	} else {
		$('#delete-window').modal('hide');
		$('#wait-window').modal('hide');
	}
	return retour;
}

function removeBackdropAndRelaod()
{
	$("#temp-window").remove();
	$('#confirmbackdrop').remove();
	fill_main_page();
}

//==================================================================
//================= SPECIFIC FUNCTIONS =============================
//==================================================================

function specificEnterDisplayPortfolio()
{
	const fc = $("*:has(>metadata[semantictag*=fichier-consentement])",g_portfolio_current).not(":has(>metadata-wad[submitted=Y])");
	if (fc.length!=0 && g_userroles[0]!='designer') {
		const nop = UICom.structure.ui[$(fc).attr("id")].getView();
		var html = "";
		html += "\n<!-- ==================== box ==================== -->";
		html += "\n<div id='temp-window'>";
		html += "\n		<div class='modal-content'>";
		html += "\n			<div style='padding:10px;height:50px;font-size:120%;background-color:#E4E3E3'>Vous devez accepter les conditions d'utilisation pour accéder à votre portfolio.</div>";
		html += "\n			<div id='temp-window-body' style='padding:10px'>";
		html += "\n			</div>";
		html += "\n		</div>";
		html += "\n</div>";
		html += "\n<!-- ============================================== -->";
		var tempwindow = document.createElement("DIV");
		tempwindow.setAttribute("class", "preview-window");
		tempwindow.innerHTML = html;
		$('body').append(tempwindow);
		UICom.structure.ui[$(fc).attr("id")].displayAsmContext('temp-window-body',null,LANGCODE,true);
		var confirmbackdrop = document.createElement("DIV");
		confirmbackdrop.setAttribute("id", "confirmbackdrop");
		confirmbackdrop.setAttribute("class", "preview-backdrop");
		$('body').append(confirmbackdrop);
		$("#temp-window").show();
	}
}


function specificDisplayPortfolios(){
	if (USER.other!="etudiant")
		throw 'non etudiant';
	else {
		let autoload = "";
		let nb_visibleportfolios = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible || portfolios_list[i].ownerid==USER.id) {
				nb_visibleportfolios++;
			}
			if (portfolios_list[i].autoload) {
				autoload = portfolios_list[i].id;
			}
		}
		// -- if there is no autoload portfolio, we search if any has the role set in USER.other ---
		if (autoload=="") {
			for (var i=0;i<portfolios_list.length;i++){
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolios_list[i].id,
					success : function(data) {
						if ($("rrg:has('user[id="+USER.id+"]'):has('label:contains(etudia)')",data).length>0)
							autoload = portfolios_list[i].id;
					}
				});
			}
		}
		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>0 || autoload!="" )
			if (nb_visibleportfolios>9 && portfoliosnotinfolders.length>9)
				UIFactory.PortfolioFolder.displayPortfolios('project-portfolios','false','list',portfoliosnotinfolders);
			else if (nb_visibleportfolios>1 && autoload=="")
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			else if (autoload!="") {
				display_main_page(autoload);
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			}
			else {  // nb_visibleportfolios == 1
				display_main_page(visibleid);
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			}
		else if (portfolios_list.length==1) {
			display_main_page(portfolios_list[0].id);
			UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
		}
	}
}


//=========================================================
//==================Specific Vector Functions==============
//=========================================================

function OLDbuildSaveVectorKAPC(nodeid,pageid,type) {
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const today = new Date().getTime();

	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		if (type=='competence-evaluation')
			pageid = nodeid;
		saveVector(enseignantid,type,nodeid,pageid,g_portfolioid,USER.username,today);
//		UIFactory.Portfolio.sharePortfolio(g_portfolioid,"enseignant",enseignantid);
	}
}

function buildSaveVectorKAPC(nodeid,pageid,type,email) {
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const note = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='note-globale'])",UICom.structure.ui[pageid].node)).text();
	const evaluation = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",UICom.structure.ui[pageid].node)).text();
	let date_dem_eval = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[pageid].node)).text();
	if (date_dem_eval==null || date_dem_eval=='')
		date_dem_eval = new Date().getTime();
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		if (type=='competence-evaluation')
			pageid = nodeid;
		saveVector(enseignantid,type,nodeid,pageid,g_portfolioid,etudiant,date_dem_eval,action,note,evaluation,enseignantid);
		if (email) {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande pour son eportfolio.";
			sendNotification(object,body,enseignantemail);
		}
//		UIFactory.Portfolio.sharePortfolio(g_portfolioid,"enseignant",enseignantid);
	}
}


//=============== EVALUATION COMPETENCE =======================
function demanderEvaluationCompetence(evalid) {
	const pageid = $("#page").attr('uuid');
	var type = "competence";
	const demandeid = $("*:has(>metadata[semantictag*=demande-evaluation])",$(UICom.structure.ui[evalid].node)).attr("id");
	const val = UICom.structure.ui[demandeid].resource.getValue();
	if (val=='1') {
		buildSaveVectorKAPC(evalid,pageid,type+'-evaluation');
	} else {
		deleteVector(null,type+'-evaluation',evalid);
	}
}

function soumettreEvaluationCompetence(evalid){
	const type='competence';
	if ($("vector",searchVector(null,type+"-evaluation-done",evalid)).length==0) {
		buildSubmitVectorKAPC(evalid,evalid,type+"-evaluation-done");
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}

//=============== EVALUATION SAE STAGE ACTION PERIODE =======================
function demanderEvaluation(nodeid,parentid,email) {
	let pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	const val = UICom.structure.ui[nodeid].resource.getValue();
	if (val=='1') {
		if (parentid!=null)
			nodeid = parentid;
		else
			nodeid = pageid;
		buildSaveVectorKAPC(nodeid,pageid,type+'-evaluation',email);
	} else {
		if (parentid!=null)
			pageid = parentid;
		deleteVector(null,type+'-evaluation',pageid);
	}
}

function modifierEvaluation(nodeid,parentid) {
	let pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	const val = UICom.structure.ui[nodeid].resource.getValue();
	if (parentid!=null)
		nodeid = parentid;
	else
		nodeid = pageid;
	deleteVector(null,type+'-evaluation',pageid);
	buildSaveVectorKAPC(nodeid,pageid,type+'-evaluation');
}

function OLDdemanderEvaluation(nodeid,parentid) {
	let pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	const val = UICom.structure.ui[nodeid].resource.getValue();
	if (val=='1') {
		if (parentid!=null)
			nodeid = parentid;
		else
			nodeid = pageid;
		buildSaveVectorKAPC(nodeid,pageid,type+'-evaluation');
	} else {
		if (parentid!=null)
			pageid = parentid;
		deleteVector(null,type+'-evaluation',pageid);
	}
}

function soumettreEvaluation2(nodeid){
	soumettreEvaluation(nodeid);
}

function OLDsoumettreEvaluation(nodeid){
	let pageid = nodeid;
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	else if (semtag.indexOf('competence')>-1) {
		type='competence';
		pageid = $("#page").attr('uuid');
	}
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitVectorKAPC(nodeid,pageid,type+"-evaluation-done");
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}

function soumettreEvaluation(nodeid){
	let pageid = nodeid;
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	else if (semtag.indexOf('competence')>-1) {
		type='competence';
		pageid = $("#page").attr('uuid');
	}
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitVectorKAPC(nodeid,pageid,type+"-evaluation-done");
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}
function supprimerEvaluation(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+"-evaluation",nodeid);
}

function resetEvaluation(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+"-evaluation-done",nodeid);
}

//=============== FEEDBACK ========================
function demanderFeedback(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	buildSaveVectorKAPC(nodeid,pageid,type+"-feedback");
}

function supprimerFeedback(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+"-feedback",nodeid);
}

function soumettreFeedback(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	buildSubmitVectorKAPC(nodeid,pageid,type+"-feedback-done");
}

//====================================================

function OLDbuildSubmitVectorKAPC(nodeid,pageid,type) {
	const today = new Date().getTime();
	const portfolioidnodes = $(".portfolioid",document);
	const tab = $(portfolioidnodes).map(function() {return $(this).text();}).get();
	let portfolioid ="";
	for (let i=0;i<tab.length;i++){
		let pageids = tab[i].split("_");
		if (pageids[0]==nodeid)
			portfolioid = pageids[1];
	}
	saveVector(USER.username,type,nodeid,pageid,portfolioid,USER.username,today);
}

function buildSubmitVectorKAPC(nodeid,pageid,type) {
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const note = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='note-globale'])",UICom.structure.ui[pageid].node)).text();
	const evaluation = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",UICom.structure.ui[pageid].node)).text();
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	saveVector(USER.username,type,nodeid,pageid,null,etudiant,matricule,action,note,evaluation,USER.username);
	deleteVector(null,null,pageid)
}

function searchVectorEvalFB(enseignantid,type1,type2,date1,date2,enseignant2id) {
	let search1 = $("vector",searchVector(enseignantid,type1));
	if(enseignant2id!=null)
		search1 = $("vector",searchVector(enseignantid,type1,null,null,null,enseignant2id));
	let tableau = [];
	// on ajoute tous les uuids qui ont type1
	for (let i=0;i<search1.length;i++){
		let nodeid = $("a3",search1[i]).text();
		let pageid = $("a4",search1[i]).text();
		let portfolioid = $("a5",search1[i]).text();
		if (date1!=null || date2!=null) {
			let date = $("a7",search1[i]).text();
			if (date1!=null && date2!=null && date1<date && date<date2+86400000) {
					if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
						tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
			} else if (date1!=null && date2==null && date1<date) {
					if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
						tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
			} else if (date1==null && date2!=null && date<date2+86400000) {
				if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
					tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
			} 
		} else if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
			tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
	}
	if (type2!=null && type2!=""){
		// on retire tous les uuids qui ont type2 et le même nodeid
		const search2 = $("vector",searchVector(enseignantid,type2));
		for (let i=0;i<search2.length;i++){
			let nodeid = $("a3",search2[i]).text();
			let pageid = $("a4",search2[i]).text();
			let portfolioid = $("a5",search2[i]).text();
			const indx = tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid);
			if (indx>-1)
				tableau.splice(indx,1);
		}
	}
	return tableau;
}

function searchVectorKAPC(enseignantid,type1,type2,date1,date2) {
	let tableau = searchVectorEvalFB(enseignantid,type1,type2,date1,date2);
	let result = [];
	for (let i=0;i<tableau.length;i++){
		const elts = tableau[i].split("/");
		if (result.indexOf(elts[2])<0)
		result.push(elts[2]);
	}
	return result;
}

function searchVectorActionKAPC(enseignantid,type1,type2,date1,date2,portfolioid) {
	let tableau = searchVectorEvalFB(enseignantid,type1,type2,date1,date2);
	let result = [];
	for (let i=0;i<tableau.length;i++){
		const elts = tableau[i].split("/");
		if (result.indexOf(elts[1])<0 && elts[2]==portfolioid)
		result.push(elts[1]);
	}
	return result;
}

function OLDnumberVectorKAPC(enseignantid,type1,type2,date1,date2) {
	let tab1 = searchVectorEvalFB(enseignantid,type1,type2,date1,date2);
	let tab2 = [];
	let tab3 = [];
	for (let i=0;i<tab1.length;i++) {
		const elts = tab1[i].split("/");
		let pageid = elts[1];
		const search = $("vector",searchVector(null,type2,pageid));
		if (search.length==0)
			tab2.push(tab1[i]);
	}
	if (type1.indexOf('feedback')>-1) { // on vérifie que la page n'est pas soumise'
		for (let i=0;i<tab2.length;i++){
			const elts = tab2[i].split("/");
			let nodeid = elts[0];
			let pageid = elts[1];
			const search1 = $("vector",searchVector(null,type2,nodeid));
			const search2 = $("vector",searchVector(null,type2.replace('feedback','evaluation'),pageid));
			if (search1.length==0 && search2.length==0)
				tab3.push(tab2[i]);
		}
	}
	return (type1.indexOf('feedback')>-1)? tab3.length:tab2.length;
}

function numberVectorKAPC(enseignantid,type,date1,date2) {
	return searchVectorKAPC(enseignantid,type,date1,date2).length;
}

function searchVectorKAPC(enseignantid,type,date1,date2) {
	let search = $("vector",searchVector(enseignantid,type));
	if (date1!=null && date2!=null) {
		for (let i=0;i<search.length;i++) {
			const date = $(search[i]).attr('date');
			if (date<date1 || date>date2)
				search.splice(i,1);
		}
	}
	return search;
}

//------------------ TEST -------------

//==================================
function saveVector2(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,d,w,r)
//==================================
{
	var xml = "<vectors>";
	xml += "<rights w='"+w+"' d='"+d+"' r='"+r+"'/>";
	xml += "<vector><a1>"+((a1==undefined)?"":a1)+"</a1><a2>"+((a2==undefined)?"":a2)+"</a2><a3>"+((a3==undefined)?"":a3)+"</a3><a4>"+((a4==undefined)?"":a4)+"</a4><a5>"+((a5==undefined)?"":a5)+"</a5><a6>"+((a6==undefined)?"":a6)+"</a6><a7>"+((a7==undefined)?"":a7)+"</a7><a8>"+((a8==undefined)?"":a8)+"</a8><a9>"+((a9==undefined)?"":a9)+"</a9><a10>"+((a10==undefined)?"":a10)+"</a10>";
	xml += "</vector></vectors>"
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK+"/vector",
		data : xml,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
}

function testVector_save(a1,a2,d) {
	const pageid = $("#page").attr('uuid');
	const pagelabel = UICom.structure.ui[pageid].getLabel(null,'none');
	saveVector2(a1,a2,pageid,pagelabel,null,null,null,null,null,null,null,d);
}

function testVector_delete(a1,a2,a3,d) {
	deleteVector(a1,a2,a3);
	saveVector2(a1,a2+'-done',a3,null,null,null,null,null,null,null,null,d);
}

function displayVector(destid,date,a1,a2,a4,a8,a6,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+date+"</td>";
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a4+"',100,'standard',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a10+"</td>";
	html += "<td>"+a9+"</td>";
	html += "<span class='button' onclick=\"soumettreEvaluation3('"+a1+"','"+a2+"','"+a4+"','"+a1+"')\" data-title='Finaliser' data-toggle='tooltip' data-placement='bottom' ></span>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function numberOf(a1,a2) {
	const nb = searchVector(a1,a2);
	return nb;
}








//# sourceURL=kapc.js

