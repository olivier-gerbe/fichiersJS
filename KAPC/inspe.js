function majFormation(nodeid) {
	const formation = $("*:has(>metadata[semantictag*='formation-actuelle'])",g_portfolio_current)[0];
	const formationid = $(formation).attr("id");
	const formact =  $("*:has(>metadata[semantictag*='formation-actuelle'])",UICom.structure.ui[nodeid].node)[0];
	const formactid = $(formact).attr("id");
	$(UICom.structure.ui[formactid].resource.value_node).text(UICom.structure.ui[formationid].resource.getCode());
	UICom.structure.ui[formactid].resource.save();
}

function displayEvaluationSoumiseINSPE(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	const date_evaluation = new Date(parseInt(a5.date_eval));
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+ date_evaluation.toLocaleString()+"</td>";
	if (a8.indexOf("/")==0) // autre action
		a8 = a8.substring(a8.indexOf("/")+1);
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
//	html += "<td>"+a5.evaluation+"</td>";
//	html += "<td>"+a5.note+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function displayEvaluationINSPE(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
//	html += "<td>"+a5.evaluation+"</td>";
//	html += "<td>"+a5.note+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

//# sourceURL=inspe.js