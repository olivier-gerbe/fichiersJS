//==================================
function selectPortfolio(code,role)
//==================================
{
	//https://medphar.eportfolium.fr/karuta-backend/rest/api/portfolios?active=1&search=portfolio-med-etudiant-
	//https://medphar.eportfolium.fr/karuta-backend/rest/api/rolerightsgroups/all/users?portfolio=613405e4-8738-47ee-a0f7-6dccc35be807
	let result = [];
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+code,
		success : function(data) {
			UIFactory["Portfolio"].parse(data);
			var items = $("portfolio",data);
			for ( let i = 0; i < items.length; i++) {
				const portfolioid = $(items[i]).attr('id');
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						var rrgs = $("rrg",data);
						for ( let j = 0; j < rrgs.length; j++) {
							const label =  $("label",rrgs[j]).text();
							const users =  $("user",rrgs[j]);
							for ( let k = 0; k < users.length; k++) {
								if (label.indexOf(role)>-1 && USER.id==$(users[k]).attr("id"))
									result.push(portfolioid);
							}
						}
					}
	 			});
			}
		}
	});
	return result;
}

//# sourceURL=selectPortfolio.js