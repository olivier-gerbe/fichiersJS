//---- fonction pour modifier les codes des situations ----
function majVarCoopCode(code){
	if (code.indexOf("##coop-")==-1)
		code = code.replace("##","##coop-");
	return code;
}

//=============== EVALUATION ACTION =======================
function majDemEvalAction(nodeid) {
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node))[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function demanderEvaluationAction(nodeid) {
	const pageid = $("#page").attr('uuid');
	const sendEmail = true;
	buildSaveVectorKAPC(nodeid,pageid,'action-evaluation',sendEmail);
}

function supprimerEvaluationAction(nodeid) {
	deleteVector(null,'action-evaluation',nodeid);
}

function soumettreEvaluationAction(nodeid) {
	var page = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent().parent().parent().parent()[0];
	var pageid = $(page).attr("id");
	buildSubmitVectorKAPC(nodeid,pageid,"action-evaluation-done");
}


//=============== FEEDBACK ACTION =======================
function demanderFeedbackAction(nodeid) {
	const pageid = $("#page").attr('uuid');
	buildSaveVectorKAPC(nodeid,pageid,'action-feedback');
}

function supprimerFeddbackAction(nodeid) {
	deleteVector(null,'action-feedback',nodeid);
}

function soumettreFeedbackAction(nodeid){
	var page = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent().parent()[0];
	var pageid = $(page).attr("id");
	buildSubmitVectorKAPC(nodeid,pageid,"action-feedback-done");
}

//=============== AUTO-EVALUATION GLOBALE  =======================
function ajouterAutoEvalGlobale(nodeid){
	var competence = $(UICom.structure.ui[nodeid].node).parent()[0];
	var competenceid = $(competence).attr("id");
	const code = UICom.structure.ui[competenceid].getCode();

	const databack = true;
	var callback = updateAutoEvalGlobale;
	//------------------------------
	const targetid = getNodeIdBySemtag("comps-auto-evals");
	const srce = "##coop-dossier-etudiants-modeles##.composants-etudiants";
	const semtag = "auto-evaluation-globale"
	//------------------------------
	importBranch(targetid,replaceVariable(srce),semtag,databack,callback,code);
}

//==================================
function updateAutoEvalGlobale(data,code)
//==================================
{
	var partid = data;
	var xml = "<asmResource xsi_type='nodeRes'>";
	xml += "<code>"+code+"</code>";
	xml += "<value></value>";
	xml += "<uuid></uuid>";
	for (var i=0; i<languages.length;i++){
		xml += "<label lang='"+languages[i]+"'></label>";
	}
	xml += "</asmResource>";
	$.ajax({
		async:false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/nodes/node/" + partid + "/noderesource",
		success : function(data) {
				UIFactory.Node.reloadUnit();
		}
	});
}

//==================================
function checkParentCode(nodeid,query,value) // recherche si le code du parent contient value
//==================================
{
	let semtag_parent = query.substring(query.indexOf('.')+1);
	let node = UICom.structure.ui[nodeid].node;
	if (query.indexOf('sibling')>-1) {
		parent = $(node).parent();
	} else if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent();
	} else	if (query.indexOf('parent.parent')>-1) {
		parent = $(node).parent().parent().parent();
	} else if (query.indexOf('parent')>-1) {
		parent = $(node).parent().parent();
	}
	var child = $("metadata[semantictag*='"+semtag_parent+"']",parent).parent();
	var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
	if (child.length==0 && itself.length>0){
		code_parent = $($("code",itself)[0]).text();
		value_parent = $($("value",itself)[0]).text();
	} else {
		var nodetype = $(child).prop("nodeName"); // name of the xml tag
		if (nodetype=='asmContext') {
			code_parent = $($("code",child)[1]).text();
			value_parent = $($("value",child)[1]).text();
		 } else {
			code_parent = $($("code",child)[0]).text();
			value_parent = $($("value",child)[0]).text();
		}
	
	}
	if (code_parent.indexOf(value)>-1)
		return true;
	else
		return false;
}

//==================================
function reloadPage()
//==================================
{
	const pageid = $("#page").attr('uuid');
	displayPage(pageid);
}

//==================================
function sendNotification(subject,body,email) {
//==================================
	var message = "";
	var html = "<div id='config-send-email-logo' style='display:none'>" + g_configVar['send-email-logo'] +"</div>";
	body.append(html);
	var img = document.querySelector('#config-send-email-logo');
	var imgB64 = getDataUrl(img)//	$("#image-window-body").html("");
	var logo = "<img width='"+img.style.width+"' height='"+img.style.height+"' src=\""+imgB64+"\">";
	img.remove();
	message = logo + "<br>" + body;
	message = body;
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	//------------------------------
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+subject+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="<recipient_cc></recipient_cc><recipient_bcc></recipient_bcc>";
	xml +="</node>";
	$.ajax({
		contentType: "application/xml",
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverBCK+"/mail",
		data: xml,
		success : function(data) {
			$('#edit-window').modal('hide');
			alertHTML(karutaStr[LANG]['email-sent']);
		}
	});
}


//==================================
function majcodes(uuid) {
//==================================
	var code = UICom.structure.ui[uuid].getCode();
	var compnodes = $("*:has(>metadata[semantictag*='page-competence-personnalisee'])",UICom.structure.ui[uuid].node);
	for (var i=0;i<compnodes.length;i++) {
		const compnodeid = $(compnodes[i]).attr("id");
		var resource = $("asmResource[xsi_type='nodeRes']",compnodes[i])[0];
		var newnodecode = code+"-C";
		if (i<9)
			newnodecode += "0";
		newnodecode += i+1;
		$("code",resource).text(newnodecode);
		var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/nodes/node/" + compnodeid + "/noderesource",
			success : function(data) {
			},
			error : function(data) {
			}
		});
		//-------------------
		var nodes = $("*:has(>metadata[semantictag*='section-niveau-developpement'])",UICom.structure.ui[compnodeid].node);
		for (var j=0;j<nodes.length;j++) {
			const nodeid = $(nodes[j]).attr("id");
			var resource = $("asmResource[xsi_type='nodeRes']",nodes[j])[0];
			var nodecode = newnodecode+"*N";
			if (j<9)
				nodecode += "0";
			nodecode += j+1;
			$("code",resource).text(nodecode);
			var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
				success : function(data) {
				},
				error : function(data) {
				}
			});
			//-------------------
			
		}
		//-------------------
		var nodes = $("*:has(>metadata[semantictag*='section-apprentissage-critique-competence-personnalisee'])",UICom.structure.ui[compnodeid].node);
		for (var j=0;j<nodes.length;j++) {
			const nodeid = $(nodes[j]).attr("id");
			var resource = $("asmResource[xsi_type='nodeRes']",nodes[j])[0];
			var nodecode = newnodecode+"*A";
			if (j<9)
				nodecode += "0";
			nodecode += j+1;
			$("code",resource).text(nodecode);
			var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
				success : function(data) {
				},
				error : function(data) {
				}
			});
			//-------------------
			
		}
		//-------------------------------------------------------------------------

	}
	//-------------------------------------------------------------------------
	if (UICom.structure.ui[uuid].asmtype=='asmStructure')
		UIFactory.Node.reloadStruct();
	else
		UIFactory.Node.reloadUnit();
}

//==================================
function creerAutoEvaluationGlobale() {
//==================================
	const autosection = $("*:has(>metadata[semantictag*='comps-auto-evals'])",g_portfolio_current)[0];
	const autosectionid = $(autosection).attr("id");
	let autocodes = [];
	const autonodes = $("*:has(>metadata[semantictag*='auto-evaluation-globale'])",g_portfolio_current);
	for (var i=0;i<autonodes.length;i++) {
		const resource = $("asmResource[xsi_type='nodeRes']",autonodes[i])[0];
		autocodes[i] = $("code",resource).text();
	}
	for (var i=0;i<g_variables['competence-code'].length;i++) {
		const code = g_variables['competence-code'][i];
		if (autocodes.indexOf(code)<0) {
			// création autoévaluation
			const srcecode = replaceVariable("##coop-dossier-etudiants-modeles##.composants-etudiants");
			const autoevalid = importBranch(autosectionid,srcecode,"auto-evaluation-globale");
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes/node/"+autoevalid,
				success : function(data) {
					const resource = $("asmResource[xsi_type='nodeRes']",data)[0];
					$("code",resource).text(code);
					var xml = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
					var strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
					$.ajax({
						async : false,
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : strippeddata,
						url : serverBCK_API+"/nodes/node/" + autoevalid + "/noderesource",
						success : function(data) {
						},
						error : function(data) {
						}
					});
				}
			});
		}
	}
}


//# sourceURL=coop.js
