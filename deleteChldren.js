function deleteChildren(nodeid,semtagParent,semtagChildren){
	let parent = $(UICom.structure.ui[nodeid].node);
	if (semtagParent!=null)
		parent = $("*:has(>metadata[semantictag*='"+semtagParent+"'])",$(UICom.structure.ui[nodeid].node));
	const children = $("*:has(>metadata[semantictag*='"+semtagChildren+"'])",parent);
	
	for (let i=0;i<children.length;i++) {
		childid = $(children[i]).attr("id");
		UICom.DeleteNode(childid);
	}
}