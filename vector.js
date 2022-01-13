
//=========================================================
//==================Specific Vector Functions==============
//=========================================================


function buildSaveVectorTest(nodeid) {
	const pageid = $("#page").attr('uuid');
//	const val = UICom.structure.ui[nodeid].resource.getValue();
	const val = 1;
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const today = new Date();
	const annee = today.getFullYear();
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		if (val!="")
			saveVector(enseignantid,g_portfolioid,USER.id,annee);
		else
			deleteVector(enseignantid,g_portfolioid,USER.id,annee);
		}
}

function buildSearchVectorTest(userid) {
	const search = searchVector('olivier@lili.me');
	const uuids = $("a2",search);
	let result = [];
	for (let i=0;i<uuids.length;i++){
		result.push($(uuids[i]).text());
	}
	return result;
}









