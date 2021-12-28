

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

//=========================================================
//==================Specific Vector Functions==============
//=========================================================

function buildSaveVectorKAPC(nodeid) {
	const saeid = $("#page").attr('uuid');
	const val = UICom.structure.ui[nodeid].resource.getValue();
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[saeid].node);
	const today = new Date();
	const annee = today.getFullYear();
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		if (val!="")
			saveVector(enseignantid,val,g_portfolioid,USER.id,annee);
		else
			deleteVector(enseignantid,val,g_portfolioid,USER.id,annee);
		}
}

function buildSearchVectorKAPC(enseignantid,val) {
	const search = searchVector(enseignantid,val);
	const uuids = $("a3",search);
	let result = [];
	for (let i=0;i<uuids.length;i++){
		result.push($(uuids[i]).text());
	}
	return result;
}