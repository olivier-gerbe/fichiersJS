function valider(nodeid){
	const validationid = $("*:has(>metadata[semantictag*=validation])",$(UICom.structure.ui[nodeid].node)).attr("id");
	$(UICom.structure.ui[validationid].resource.text_node[LANGCODE]).text('Validé');
	UICom.structure.ui[validationid].resource.save();
	submit(nodeid);
}