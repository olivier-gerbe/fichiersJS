function valider(nodeid) {
	const valide_par =  $("*:has(>metadata[semantictag*='valide-par'])",UICom.structure.ui[nodeid].node)[0];
	const valide_parid = $(valide_par).attr("id");
	$(UICom.structure.ui[valide_parid].resource.text_node[LANGCODE]).text(USER.firstname+" "+USER.lastname);
	UICom.structure.ui[valide_parid].resource.save();
	submit(nodeid);
}

//# sourceURL=fonctions-liege.js