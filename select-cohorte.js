function getCohorte(type) {
	const today = new Date();
	const curyear = parseInt(today.getFullYear());
	const searchvalue = "-20"
	var tableau = new Array();
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+searchvalue,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			var items = $("portfolio",data);
			var value = "";
			var condition = "";
			var portfolioid = "";

			//----------------------------------
			for ( let j = 0; j < items.length; j++) {
				const code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[j])).text();
				const cohorte = (code.substring(code.lastIndexOf("/")+1)).substring(0,code.indexOf("."));
				const lastyear = parseInt(cohorte.substring((cohorte.indexOf("-")+1)));
				if (type=='courante' && lastyear>=curyear) {
					tableau[tableau.length] = $(items[j]).attr('id');
				}
				if (type=='anciennes' && lastyear<curyear) {
					tableau[tableau.length] = $(items[j]).attr('id');
				}
			}
		}
	});
	return tableau;
}


//# sourceURL=select-cohorte.js