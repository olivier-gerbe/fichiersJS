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

//=============== AUTO-EVALUATION GLOBALE  =======================
function ajouterAutoEvalGlobale(nodeid){
	var competence = $(UICom.structure.ui[nodeid].node).parent()[0];
	var competenceid = $(competence).attr("id");
	const code = UICom.structure.ui[competenceid].getCode();

	const databack = true;
	var callback = updateAutoEvalGlobale;
	//------------------------------
	const targetid = getNodeIdBySemtag("comps-auto-evals");
	const srce = "##coop-dossier-etudiants-modeles##.composants-etudiants";
	const semtag = "auto-evaluation-globale"
	//------------------------------
	importBranch(targetid,replaceVariable(srce),semtag,databack,callback,code);
}

//==================================
function updateAutoEvalGlobale(data,code)
//==================================
{
	var partid = data;
	var xml = "<asmResource xsi_type='nodeRes'>";
	xml += "<code>"+code+"</code>";
	xml += "<value></value>";
	xml += "<uuid></uuid>";
	for (var i=0; i<languages.length;i++){
		xml += "<label lang='"+languages[i]+"'></label>";
	}
	xml += "</asmResource>";
	$.ajax({
		async:false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/nodes/node/" + partid + "/noderesource",
		success : function(data) {
				UIFactory.Node.reloadUnit();
		}
	});
}

//==================================
function checkParentCode(nodeid,query,value)
//==================================
{
	let semtag_parent = query.substring(query.indexOf('.')+1);
	let node = UICom.structure.ui[nodeid].node;
	if (query.indexOf('sibling')>-1) {
		parent = $(node).parent();
	} else if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent();
	} else	if (query.indexOf('parent.parent')>-1) {
		parent = $(node).parent().parent().parent();
	} else if (query.indexOf('parent')>-1) {
		parent = $(node).parent().parent();
	}
	var child = $("metadata[semantictag*='"+semtag_parent+"']",parent).parent();
	var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
	if (child.length==0 && itself.length>0){
		code_parent = $($("code",itself)[0]).text();
		value_parent = $($("value",itself)[0]).text();
	} else {
		var nodetype = $(child).prop("nodeName"); // name of the xml tag
		if (nodetype=='asmContext') {
			code_parent = $($("code",child)[1]).text();
			value_parent = $($("value",child)[1]).text();
		 } else {
			code_parent = $($("code",child)[0]).text();
			value_parent = $($("value",child)[0]).text();
		}
	
	}
	if (code_parent.indexOf(value)>-1)
		return true;
	else
		return false;
}

//==================================
function reloadPage()
//==================================
{
	const pageid = $("#page").attr('uuid');
	displayPage(pageid);
}

//# sourceURL=coop.js
