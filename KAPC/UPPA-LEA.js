
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
	setNomPrenomEnseigmant(nodeid);
}

//# sourceURL=UPPA-LEA.js