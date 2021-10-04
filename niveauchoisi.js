function niveauchoisi(node) {
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!="");
}

function testPrevGGRCode(node,code) {
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!=code);
}

