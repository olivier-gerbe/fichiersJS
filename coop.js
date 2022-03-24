//---- fonction pour modifier les codes des situations ----
function majVarCoopCode(code){
	if (code.indexOf("##coop-")==-1)
		code = code.replace("##","##coop-");
	return code;
}
