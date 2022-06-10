//---- fonction pour modifier les codes des situations ----
function majVarCoopCode(code){
	if (code.indexOf("##coop-")==-1)
		code = code.replace("##","##coop-");
	return code;
}

//=============== EVALUATION ACTION =======================
function majDemEvalAction(nodeid) {
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node))[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function demanderEvaluationAction(nodeid) {
	const pageid = $("#page").attr('uuid');
	buildSaveVectorKAPC(nodeid,pageid,'action-evaluation');
}

function supprimerEvaluationAction(nodeid) {
	deleteVector(null,'action-evaluation',nodeid);
}

function soumettreEvaluationAction(nodeid) {
	var page = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent().parent().parent().parent()[0];
	var pageid = $(page).attr("id");
	buildSubmitVectorKAPC(nodeid,pageid,"action-evaluation-done");
}


//=============== FEEDBACK ACTION =======================
function demanderFeedbackAction(nodeid) {
	const pageid = $("#page").attr('uuid');
	buildSaveVectorKAPC(nodeid,pageid,'action-feedback');
}

function supprimerFeddbackAction(nodeid) {
	deleteVector(null,'action-feedback',nodeid);
}

function soumettreFeedbackAction(nodeid){
	var page = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent().parent()[0];
	var pageid = $(page).attr("id");
	buildSubmitVectorKAPC(nodeid,pageid,"action-feedback-done");
}
//# sourceURL=coop.js
