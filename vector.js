//=========================================================
//==================API Vector Functions===================
//=========================================================

function saveVector(a1,a2,a3,a4,a5) {
	var xml = "<vector><a1>"+a1+"</a1><a2>"+a2+"</a2><a3>"+a3+"</a3><a4>"+a4+"</a4><a5>"+a5+"</a5></vector>";
	alert(xml);
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK_API+"/vector",
		data : xml,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
}

function deleteVector(a1,a2,a3,a4,a5) {
	alert(a1+a2+a3+a4+a5);
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK_API+"/vector?a1="+a1+"&a2="+a2+"&a3="+a3+"&a4="+a4+"&a5="+a5,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
}

function searchVector(a1,a2,a3,a4,a5) {
	let result = [];
	let query = "";
	if (a1!=null)
		query += "a1="+a1;
	if (a2!=null)
		if (query=="")
			query += "a2="+a2;
		else
			query += "&a2="+a2;
	if (a3!=null)
		if (query=="")
			query += "a3="+a3;
		else
			query += "&a3="+a3;
	if (a4!=null)
		if (query=="")
			query += "a4="+a4;
		else
			query += "&a4="+a4;
	if (a5!=null)
		if (query=="")
			query += "a5="+a5;
		else
			query += "&a5="+a5;
	$.ajax({
		async:false,
		type : "GET",
		contentType: "application/xml",
		url : serverBCK_API+"/vector?"+query,
		success : function(data) {
			result = data;
		},
		error : function(jqxhr,textStatus) {
			let xml = "<vectors><vector><a1>mimi@de</a1><a2>1</a2><a3>30b4fd03-33b1-4555-abac-eb6090ba7449</a3><a4>456</a4><a5>2021</a5></vector></vectors>";
			let parser = new DOMParser();
			result = parser.parseFromString(xml,"text/xml");
		}
	});
	return result;
}

//=========================================================
//==================Specific Vector Functions==============
//=========================================================

function buildSaveVectorKAPC(nodeid) {
	const saeid = $("#page").attr('uuid');
	const val = UICom.structure.ui[nodeid].resource.getValue();
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[saeid].node);
	const today = new Date();
	const annee = today.getFullYear();
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		if (val!="")
			saveVector(enseignantid,val,g_portfolioid,USER.id,annee);
		else
			deleteVector(enseignantid,val,g_portfolioid,USER.id,annee);
		}
}

function buildSearchVectorKAPC(enseignantid,val) {
	const search = searchVector(enseignantid,val);
	const uuids = $("a3",search);
	let result = [];
	for (let i=0;i<uuids.length;i++){
		result.push($(uuids[i]).text());
	}
	return result;
}

