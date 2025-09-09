//==================================
function getNomPrenomMA(nodeid)
//==================================
{	
	const identifier = $("#button_0"+nodeid).html();
	const pcode = replaceVariable("##dossier-repertoires##.repertoire-maitres-apprentissage");
	const semtag = "ss-intervenant-ma|";
	var result = "AB";
	const url = serverBCK_API+"/nodes?portfoliocode="+pcode+"&semtag="+semtag;
	//--------------------------------
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			const nodes = $("node",data);
//			for (let i=0;i<nodes.length;i++){
//				const identifiantMA = $("",nodes[i]);
//			}
		}
	});
	$("#extra_"+nodeid).html(result);
}