

function setNodeCode (node,portfolioid) {
	var uuid = $(node).attr("id");
	var code = UICom.structure.ui[uuid].getCode();
	var nodes = $("*:has(metadata[semantictag*='ajoutable-parcours'])",node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		if (UICom.structure.ui[nodeid].semantictag.indexOf('ajoutable-parcours')>-1) {
			var nodecode =  UICom.structure.ui[nodeid].getCode();
			if (nodecode.indexOf("__")>-1) {
				var oldpartcode = nodecode.substring(nodecode.indexOf("__"));
				var newnodecode = nodecode.replace(oldpartcode,"__"+code);
				//-------------------
				var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
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
	}
	UIFactory.Node.reloadUnit;
}

