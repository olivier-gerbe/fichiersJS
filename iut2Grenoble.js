
//=================================================
demanderEvaluation = function (evalnodeid)
//=================================================
{
	g_execbatch = false; // usager a déjà un portfolio
	g_variables['uuid_eval'] = evalnodeid;
	var evalnode = UICom.structure.ui[evalnodeid].node;
	var date_eval = $("asmContext:has(metadata[semantictag='date-demande-eval'])",evalnode);
	if (date_eval.length>0)
		alertHTML('Déjà demandé');
	else {
	var parent = $(evalnode).parent();
	while ($("metadata",parent).attr('semantictag')!='sae-unit')
		parent = $(parent).parent();
	g_variables['codesae'] = $($("code",parent)[0]).text();
	var display = false;
	execReport_BatchCSV(evalnodeid,'','KAPC-OG.report-csv',display);
	}
}