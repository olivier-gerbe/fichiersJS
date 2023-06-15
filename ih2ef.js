function addDate(node) {
	const nodeid = $(node).parent().attr("id");
	let dateid = null;
	const date = $("*:has(>metadata[semantictag*='date-niveau-selected'])",$(UICom.structure.ui[nodeid].node));
	if (date==undefined || date.length==0) {
		const srce = replaceVariable("##dossier-etudiants-modeles##.composantes-actions");
		dateid = importBranch(nodeid,srce,"date-niveau-selected");
		UIFactory.Node.reloadUnit();
	} else
		dateid = $(date).attr("id");
	const options = {year: 'numeric', month: 'numeric'};
	const today = new Date();
	UICom.structure.ui[dateid].resource.text_node[LANGCODE].text(today.toLocaleString(undefined,options));
	UICom.structure.ui[dateid].resource.utc.text(today.getTime());
	UICom.structure.ui[dateid].resource.save();
}

function calcMin(d,n,i) { // d: date début, n: no niveau (0-3), i: periode (0-3)
	return  d + (n+1) * 3 * i * 2629800000;
}

function calcMax(d,n,i) { // d: date début, n: no niveau (0-3), i: periode (0-3)
	return  d + (n+1) * 3 * (i+1) * 2629800000;
}

function specificLoginFunction() {
	$("#connection-cas1").html("Connexion administateur")
	$("#connection-cas2").html("Connexion")
}
//# sourceURL=ih2ef.js
