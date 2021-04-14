
//=================================================
demanderEvaluationEnseignant = function (evalnodeid)
//=================================================
{
	g_execbatch = false; // usager a déjà un portfolio
	g_variables['uuid_eval'] = evalnodeid;
	var evalnode = UICom.structure.ui[evalnodeid].node;
	var date_eval = $("asmContext:has(metadata[semantictag='date-demande-eval'])",evalnode);
	if (date_eval.length>0)
		alertHTML('Déjà demandé');
	else {
		var code_ens = $("asmContext:has(metadata[semantictag*='code_ens'])",evalnode);
		var codeensid = $(code_ens).attr("id");
		g_variables['code_ens'] =  cleanCode(UICom.structure.ui[codeensid].resource.getCode());
		//---------------------------
		var parent = $(evalnode).parent();
		while ($("metadata",parent).attr('semantictag')!='page-action-sae')
			parent = $(parent).parent();
		g_variables['uuid_sae'] = $(parent).attr('id');
		//---------------------------
		var display = false;
		var report = replaceVariable("##dossier-saes-modeles##.report-csv-enseignant");
		execReport_BatchCSV(evalnodeid,'','',report,display);
	}
}
