//=========================================================
//==================API Vector Functions===================
//=========================================================

function saveVector(key,dim,val) {
	var xml = "";
	xml += "<vector>";
	xml += "	<key>"+key+"</key>";
	xml += "	<dim>"+dim+"</dim>";
	xml += "	<val>"+val+"</val>";
	xml += "</vector>";
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

function deleteVector(key,dim) {
	alert(key+"/"+dim);
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK_API+"/vector?key="+key+"&dim="+dim,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
}

function searchVector(operator,search_vector) {
	// search_vector
	// <vectors><vector><dim>...</dim><val>...</val></vector>[<vector><dim>...</dim><val>...</val></vector> <vectors>]
	// return
	// <keys><key id='...'/>[<key id='...'/>]</keys>
	var query = "";
	query +="<query><operator>"+operator+"</operator><search_vectors>"+search_vector+"</search_vectors></query>";
	alert(query);
	var result = [];
	$.ajax({
		async:false,
		type : "GET",
		contentType: "application/xml",
		data : query,
		dataType : "xml",
		url : serverBCK_API+"/vector",
		success : function(data) {
			var keys =  $("key",data);
			for (var i=0; i<keys.length; i++)
				result[i] = $(keys[i]).attr("id");
		},
		error : function(jqxhr,textStatus) {
			result = ['30b4fd03-33b1-4555-abac-eb6090ba7449'];
		}
	});
	return result;
}

//=========================================================
//==================Specific Vector Functions==============
//=========================================================

function buildSearchVectorGrenoble(dims,vals) {
	// search_vector
	// <vectors><vector><dim>...</dim><val>...</val></vector>[<vector><dim>...</dim><val>...</val></vector> <vectors>]
	var search_vector = "";
	for (var i=0; i<dims.length; i++) {
		if (dims[i]!="" && vals[i]!="") {
			var val = (vals[i]=="1") ? "2" : "1";
			search_vector += "<vector><dim>"+dims[i]+"</dim><val>"+val+"</val></vector>";
		}
	}
	return searchVector("OR",search_vector);
}

function buildSaveVectorGrenoble(node,key) {
	var parentid = $($(node).parent()).attr("id");
	var dim = UICom.structure["ui"][parentid].getCode();
	var val = UICom.structure["ui"][node.id].resource.getValue();
	if (val!="")
		saveVector(key,dim,val);
	else
		deleteVector(key,dim);
}

function buildDeleteVectorGrenoble(node,key) {
	var nodeid = $(node).attr("id");
	var dim = UICom.structure["ui"][nodeid].getCode();
	deleteVector(key,dim);
}