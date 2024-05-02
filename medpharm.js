//=================================================
function majMetadata(nodeid,attribute,text) 
//=================================================
{
	var metadata = $("metadata",UICom.structure.ui[nodeid].node);
	$(metadata).attr(attribute,text);
	var xml = xml2string(metadata[0]);
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/nodes/node/" + nodeid+"/metadata",
	});
}

//=================================================
function majmetadatawad(nodeid,attribute,text)
//=================================================
{
	if (attribute=="menuroles")
		text = text.replaceAll("<br/>","").replaceAll("<br>","").replaceAll("&amp;","&");
	var metadatawad = $("metadata-wad",UICom.structure.ui[nodeid].node);
	$(metadatawad).attr(attribute,text);
	var xml = xml2string(metadatawad[0]);
	if (attribute=="menuroles")
		xml = xml.replaceAll("&amp;","&");
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/nodes/node/" + nodeid+"/metadatawad",
	});
}

//=================================================
function majmetadataepm(nodeid,attribute,text)
//=================================================
{
	var metadataepm = $("metadata-epm",UICom.structure.ui[nodeid].node);
	$(metadataepm).attr(attribute,text);
	var xml = xml2string(metadataepm[0]);
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/nodes/node/" + nodeid+"/metadataepm",
	});
}

//=================================================
function majdroits(nodeid,role,rd,wr,dl,sb)
//=================================================
{
	let xml = "<node><role name='"+role+"'><right RD='"+rd+"' WR='"+wr+"' DL='"+dl+"' SB='"+sb+"'></right></role></node>"
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/nodes/node/" + nodeid +"/rights",
	});
}
//=================================================
function updateActeProfessionnel(nodeid) {
//=================================================
//	majdroits(nodeid,"etudiant","Y","Y","Y","N");
//	majdroits(nodeid,"maitre-stage","Y","N","N","Y");
	majmetadatawad(nodeid,"submitroles","maitre-stage");
	majmetadatawad(nodeid,"unsubmitroles","maitre-stage");
	majmetadatawad(nodeid,"textssubmit","Valider@fr;Réinitialiser@fr;Validé le @fr;Non validé@fr");
	majmetadatawad(nodeid,"submitall","Y");
	majmetadatawad(nodeid,"editnoderoles","etudiant");
	majmetadatawad(nodeid,"nodenopencil","Y");
	majmetadatawad(nodeid,"shareroles","etudiant,maitre-stage,qrcode,2,unlimited,Partager@fr,,,testNotSubmitted");
	majmetadatawad(nodeid,"menuroles","&lt;menus&gt;&lt;menu del=&quot;y&quot;&gt;&lt;menulabel&gt;&lt;/menulabel&gt;&lt;item del=&quot;y&quot;&gt;&lt;itemlabel&gt;Valider@fr&lt;/itemlabel&gt;&lt;roles&gt;maitre-stage&lt;/roles&gt;&lt;condition&gt;testNotSubmitted(##currentnode##)&lt;/condition&gt;&lt;function del=&quot;y&quot;&gt;&lt;js&gt;valider(##currentnode##)&lt;/js&gt;&lt;/function&gt;&lt;/item&gt;&lt;/menu&gt;&lt;/menus&gt;");
}

//# sourceURL=medpharm.js


