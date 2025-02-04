function supprimerSieSoumise(nodeid,pageid) { // par l'enseignant dans le tableau de bord
	const js = "const semtag = loadNodeAndGetSemtag('"+pageid+"');const type = getType(semtag);deleteVector(null,type+'-evaluation-done','"+nodeid+"');UIFactory.Node.reloadUnit();"

	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\""+js+";$('#delete-window').modal('hide')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

function majFormation(nodeid) {
	const formation = $("*:has(>metadata[semantictag*='formation-element'])",g_portfolio_current)[0];
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
	html += "<td><i data-toggle='tooltip' data-title='Supprimer du tableau de bord' class='fas fa-trash-alt' onclick=\"supprimerSieSoumise('"+a3+"','"+a4+"')\"></i></td>";
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

function resetDemandeEvaluation(nodeid){
	//---------------------------
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	//---------------------------
	let privateValues = [];
	const privates =  $("*:has(>metadata-wad[private])",UICom.structure.ui[nodeid].node);
	for (let i=0; i<privates.length;i++){
		const privateid = $(privates[i]).attr("id");
		privateValues[i] = $(UICom.structure.ui[privateid].metadatawad).attr('private');
	}
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+"-evaluation",null,pageid);
	resetDemEval(nodeid);
	//---------------------------
	for (let i=0; i<privates.length;i++){
		const privateid = $(privates[i]).attr("id");
		if (UICom.structure.ui[privateid].writenode) {
//			UIFactory.Node.updateMetadataWadAttribute(privateid,'private','Y');
			var action = (privateValues[i]=='N')?'show':'hide';
			//----
			$.ajax({
				async : false,
				type : "POST",
				contentType: "application/xml",
				dataType : "text",
				url : serverBCK_API+"/nodes/node/" + privateid +"/action/"+action
			});
		}
	}
	//---------------------------
	UIFactory.Node.reloadUnit();
}

//# sourceURL=inspe.js