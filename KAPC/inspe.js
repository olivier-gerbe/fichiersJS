function majFormation(nodeid) {
	const formation = $("*:has(>metadata[semantictag*='formation-actuelle'])",g_portfolio_current)[0];
	const formationid = $(formation).attr("id");
	const formact =  $("*:has(>metadata[semantictag*='formation-actuelle'])",UICom.structure.ui[nodeid].node)[0];
	const formactid = $(formact).attr("id");
	$(UICom.structure.ui[formactid].resource.value_node).text(UICom.structure.ui[formationid].resource.getCode());
	UICom.structure.ui[formactid].resource.save();
}

//# sourceURL=inspe.js