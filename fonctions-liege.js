function valider(nodeid) {
	const valide_par =  $("*:has(>metadata[semantictag*='valide-par'])",UICom.structure.ui[nodeid].node)[0];
	const valide_parid = $(valide_par).attr("id");
	$(UICom.structure.ui[valide_parid].resource.text_node[LANGCODE]).text(USER.firstname+" "+USER.lastname);
	UICom.structure.ui[valide_parid].resource.save();
	submit(nodeid);
}

function existChild(nodeid,semtag) {
	let exist = false;
	const child =  $("*:has(>metadata[semantictag*='"+semtag+"'])",UICom.structure.ui[nodeid].node);
	if (child.length>0)
		exist = true;
	return exist;
}

function majLibelleFicheEval(nodeid,str) {
	const label = UICom.structure.ui[nodeid].getLabel(null,'none');
	$(UICom.structure.ui[nodeid].label_node[LANGCODE]).text(label + " " + str);
	UICom.structure.ui[nodeid].save();
}

//# sourceURL=fonctions-liege.js