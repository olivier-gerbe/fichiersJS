
//=================================================
demanderEvaluationEnseignant = function (nodeid)
//=================================================
{
	g_execbatch = false; // usager a déjà un portfolio
	g_variables['uuid_sae'] = nodeid;
	var node = UICom.structure.ui[nodeid].node;
	//------------------------------------
	var date_eval = $("asmContext:has(>metadata[semantictag='date-demande-eval'])",node);
	if (date_eval.length>0)
		alertHTML('Une évaluation a déjà été demandé');
	else {
		//---------- uuid section évaluation ------
		var sect_eval= $("asmUnitStructure:has(>metadata[semantictag*='evaluation-enseignant'])",node);
		var uuid_eval = $(sect_eval).attr("id");
		g_variables['uuid_eval'] = uuid_eval;
		//---------- login etudiant -----------------
		g_variables['login_etudiant'] = USER.username;
		//---------- login enseignant -----------------
		var code_ens = $("asmContext:has(>metadata[semantictag*='code_ens'])",node);
		var codeensid = $(code_ens).attr("id");
		g_variables['login_ens'] =  cleanCode(UICom.structure.ui[codeensid].resource.getCode());
		//-------- on exécute le batch -------------------
		g_json = {};
		g_json['model_code'] = r_replaceVariable("##dossier-saes-modeles##.ajout-proxy-eval-enseignant");
		g_json['lines'] = [];
		getModelAndProcess(g_json.model_code);
		UIFactory.Node.reloadUnit();
		//-------------------------------------
	}
}

//=================================================
demanderFeedbackEnseignant = function (nodeid)
//=================================================
{
	g_execbatch = false; // usager a déjà un portfolio
	g_variables['uuid_sae'] = nodeid;
	var node = UICom.structure.ui[nodeid].node;
	//---------- uuid section feedback ------
	var sect_feedback= $("asmUnitStructure:has(>metadata[semantictag*='section-feedback'])",node);
	var sect_feedbackid = $(sect_feedback).attr("id");
	g_variables['sect_feedback'] = sect_feedbackid;
	//---------- login etudiant -------------------
	g_variables['login_etudiant'] = USER.username;
	//---------- login enseignant -----------------
	var code_ens = $("asmContext:has(>metadata[semantictag*='code_ens'])",node);
	var codeensid = $(code_ens).attr("id");
	g_variables['login_ens'] =  cleanCode(UICom.structure.ui[codeensid].resource.getCode());
	//-------- on exécute le batch ----------------
	g_json = {};
	g_json['model_code'] = r_replaceVariable("##dossier-saes-modeles##.ajout-proxy-feedback-enseignant");
	g_json['lines'] = [];
	getModelAndProcess(g_json.model_code);
	alertHTML('Feedback demandé');
	UIFactory.Node.reloadUnit();
	//-------------------------------------
}
