function changeVisibility(nodeid,path,value){
	//-----------
	const node = UICom.structure.ui[nodeid].node;
	var parent = null;
	//-----------
	if (path.indexOf('child')>-1) {
		parent = node;
	}
	if (path.indexOf('sibling')>-1) {
		parent = $(node).parent();
	} else if (path.indexOf('parent.parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent().parent();
	} else if (path.indexOf('parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent();
	} else if (path.indexOf('parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent();
	} else	if (path.indexOf('parent.parent')>-1) {
		parent = $(node).parent().parent().parent();
	} else if (path.indexOf('parent')>-1) {
		parent = $(node).parent().parent();
	}
	const semtag = path.substring(path.lastIndexOf(".")+1);
	//-----------
	const child = $("metadata[semantictag*='"+semtag+"']",parent).parent();
	const targetid = $(child).attr("id");
	UIFactory.Node.updateMetadataWadAttribute(targetid,'display',value);
	UIFactory.Node.reloadUnit();
}

//# sourceURL=make-visible.js