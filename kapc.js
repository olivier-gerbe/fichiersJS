

function majEvaluation(nodeid,sharetoemail) {
	var demande = $("*:has(>metadata[semantictag*='demande-eval'])",UICom.structure.ui[nodeid]. node)[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString() + " à " + sharetoemail;
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function testPrevGGRCodeNotEmpty(node) {
	// le GGR précédent doit avoir la métadonnée Recharger la page cochée
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!="");
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

/*function setPrenomNom(nodeid) {
	let prenom_nom =  $("*:has(>metadata[semantictag*='prenom_nom'])",UICom.structure.ui[nodeid]. node)[0];
	var prenom_nomid = $(prenom_nom).attr("id");
	let prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",g_portfolio_current)[0];
	let nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",g_portfolio_current)[0];
	UICom.structure.ui[prenom_nomid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[prenom_nomid].resource.save();
}
*/
//==============================================
function setPrenomNom(nodeid) {
	const prenom_nom =  $("*:has(>metadata[semantictag*='prenom_nom'])",UICom.structure.ui[nodeid].node)[0];
	const prenom_nomid = $(prenom_nom).attr("id");
	const prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[prenom_nomid].resource.text_node[LANGCODE]).text(UICom.structure.ui[prenomid].resource.getView()+" "+UICom.structure.ui[nomid].resource.getView());
	UICom.structure.ui[prenom_nomid].resource.save();
}

//mise à jour du code et du libellé dela compétence dans la section 'mes compétences'
function setCompetenceCodeLabel(nodeid){
	let js = replaceVariable("setNodeCodeLabel(##currentnode##,##lastimported##)",UICom.structure.ui[nodeid].node);
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
	$("td.colsvides").attr('colspan',colspan);

}

function specificDisplayPortfolios(){
	if (USER.other!="etudiant")
		throw 'non etudiant';
	else {
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible || portfolios_list[i].ownerid==USER.id) {
				nb_visibleportfolios++;
//				visibleid = portfolios_list[i].id;
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

function buildSaveVectorKAPC(nodeid,uuid,type) {
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[uuid].node);
	if (enseignants.length==0)
		alert("Il n'y a pas d'enseignant assocé.");
	const today = new Date();
	const annee = today.getFullYear();
	const selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();

	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		saveVector(enseignantid,type,nodeid,uuid,g_portfolioid,USER.id,annee,selfcode);
	}
}

function buildSubmitVectorKAPC(nodeid,uuid,type) {
	const today = new Date();
	const annee = today.getFullYear();
	const selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	const portfolioidnodes = $(".portfolioid",document);
	const tab = $(portfolioidnodes).map(function() {return $(this).text();}).get();
	let portfolioid ="";
	for (let i=0;i<tab.length;i++){
		let uuids = tab[i].split("_");
		if (uuids[0]==nodeid)
			portfolioid = uuids[1];
	}
	saveVector(USER.username,type,nodeid,uuid,portfolioid,USER.id,annee,selfcode);
}

function searchVectorKAPC(enseignantid,type1,type2) {
	const search1 = $("vector",searchVector(enseignantid,type1));
	let tableau = [];
	// on ajoute tous les uuids qui ont type1
	for (let i=0;i<search1.length;i++){
		let portfolioid = $("a5",search1[i]).text();
		let nodeid = $("a3",search1[i]).text();
		tableau.push(portfolioid+"_"+nodeid);
	}
	if (type2!=null && type2!=""){
		// on retire tous les uuids qui ont type2 et le même nodeid
		const search2 = $("vector",searchVector(enseignantid,type2));
		for (let i=0;i<search2.length;i++){
			let portfolioid = $("a5",search2[i]).text();
			let nodeid = $("a3",search2[i]).text();
			const indx = tableau.indexOf(portfolioid+"_"+nodeid);
			if (indx>-1)
				tableau.splice(indx,1);
		}
	}
	let result =  [];
	for (let i=0;i<tableau.length;i++){ // copie dans result en éliminant les doublons
		if (result.indexOf(tableau[i][0])<0)
			result.push(tableau[i].substring(0,tableau[i].indexOf("_")));
	}
	return result;
}

function numberVectorKAPC(enseignantid,type1,type2) {
	let tab = searchVectorKAPC(enseignantid,type1,type2);
	return tab.length;
}

//=============== EVALUATION =======================
function demanderEvaluation(nodeid) {
	const uuid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[uuid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	const val = UICom.structure.ui[nodeid].resource.getValue();
	if (val=='1')
		buildSaveVectorKAPC(uuid,uuid,type+'-evaluation');
	else
		deleteVector(null,type+'-evaluation',uuid);
}

function soumettreEvaluation(nodeid){
	const uuid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[uuid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	buildSubmitVectorKAPC(uuid,uuid,type+"-evaluation-done");
}

//=============== FEEDBACK ========================
function demanderFeedback(nodeid){
	const uuid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[uuid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	buildSaveVectorKAPC(nodeid,uuid,type+"-feedback");
}

function supprimerFeedback(nodeid){
	const uuid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[uuid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	deleteVector(null,type+"-feedback",nodeid);
}

function soumettreFeedback(nodeid){
	const uuid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[uuid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	buildSubmitVectorKAPC(nodeid,uuid,type+"-feedback-done");
}

