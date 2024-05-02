function getCohorte(type,portfoliocode) {  // type = courantes|anciennes - portfoliocode: partie du code
	const today = new Date();
	const curyear = parseInt(today.getFullYear());
	const curmonth = parseInt(today.getMonth());
	const curday = parseInt(today.getDay());
	const searchvalue = "-20";
	//----- 24 septembre ------
	const month = 9;
	const day = 24;
	//-------------------------
	var tableau = new Array();
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+searchvalue,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			var items = $("portfolio",data);
			//----------------------------------
			for ( let j = 0; j < items.length; j++) {
				const code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[j])).text();
				const cohorte = (code.substring(code.lastIndexOf("/")+1)).substring(0,code.indexOf("."));
				const lastyear = parseInt(cohorte.substring((cohorte.indexOf("-")+1)));
				if (code.indexOf(portfoliocode)>-1) {
					if (type=='courantes' && (lastyear>curyear || (lastyear==curyear && curmonth<=month)  || (lastyear==curyear && curmonth==month && curday<=day))) {
						tableau[tableau.length] = $(items[j]).attr('id');
					}
					if (type=='anciennes' && (lastyear<curyear || (lastyear==curyear && curmonth>month) || (lastyear==curyear && curmonth==month && curday>day))) {
						tableau[tableau.length] = $(items[j]).attr('id');
					}
				}
			}
		}
	});
	return tableau;
}


//# sourceURL=select-cohorte.js