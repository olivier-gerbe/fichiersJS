

function getPortfolioCodeSubstring(type,str){
	let result = "";
	if (type=='formation') {
		result = str.substring(str.indexOf("/")+1);
		result = result.substring(0,result.indexOf("/"));
	} else if (type=='login') {
		result = str.substring(str.lastIndexOf("portfolio-")+10);
	} else if (type=='login-etudiant') {
		result = str.substring(str.lastIndexOf("portfolio-etudiant-")+19);
	} else if (type=='login-etu') {
		result = str.substring(str.lastIndexOf("-etu-")+5);
	} else if (type=='cohorte') {
		result = str.substring(str.lastIndexOf("/")+1);
		result = result.substring(0,result.indexOf("."));
	} 
	return result;
}

function getPortfolioCodeLogin(str){
	return getPortfolioCodeSubstring('login',str);
}
/*
function reparer(session) {
	// liste des portfolios de la session
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+session+".",
		success : function(data) {
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				let uuid = $(items[i]).attr('id');
				let ownerid = $(items[i]).attr('ownerid');
				let portfoliocode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
				let portfoliolabel = $("label[lang='"+languages[LANGCODE]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])[0]).txt();
				let userid = getPortfolioCodeLogin(portfoliocode);
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Erreur - Liste des portfolios de la seesion: "+textStatus);
		}
	});

	// portfolio dont l'étudiant est propriétaire
	// récupérer idetudiant, prenom, nom
	// si idetudiant, prenom, nom
		// partager all / public
		// partager designer dsg-cnam
		// partager etudiant / idetudiant
		// départager designer / etudiant
		// changer owner dsg-cnam
	// sinon
		//delete portfolio
}
*/
//# sourceURL=cnam.js