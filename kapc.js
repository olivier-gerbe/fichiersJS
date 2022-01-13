

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

function setPrenomNom(nodeid) {
	let prenom_nom =  $("*:has(>metadata[semantictag*='prenom_nom'])",UICom.structure.ui[nodeid]. node)[0];
	var prenom_nomid = $(prenom_nom).attr("id");
	let prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",g_portfolio_current)[0];
	let nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",g_portfolio_current)[0];
	UICom.structure.ui[prenom_nomid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[prenom_nomid].resource.save();
}