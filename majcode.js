

function majcode (node,portfolioid) {
	var uuid = $(node).attr("id");
	var code = UICom.structure.ui[uuid].getCode();
	var nodes = $("*:has(>metadata[semantictag*='majcode'])",node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		if (UICom.structure.ui[nodeid].semantictag.indexOf('majcode')>-1) {
			var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
			var nodecode =  UICom.structure.ui[nodeid].getCode();
			var newnodecode = nodecode;
			if (nodecode.indexOf("*")>-1) {
				var oldpartcode = nodecode.substring(nodecode.indexOf("*"));
				newnodecode = code+oldpartcode;
			}
			$("code",resource).text(newnodecode);
			var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
				success : function(data) {
				},
				error : function(data) {
				}
			});
			//-------------------
		}
	}
	if (UICom.structure.ui[uuid].asmtype=='asmStructure')
		UIFactory.Node.reloadStruct();
	else
		UIFactory.Node.reloadUnit();
}

