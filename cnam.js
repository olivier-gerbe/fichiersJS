

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
