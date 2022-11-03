// coop.js - version 14/10/22

//---- fonction pour modifier les codes des situations ----
function majVarCoopCode(code){
	if (code.indexOf("##coop-")==-1)
		code = code.replace("##","##coop-");
	return code;
}

//---- fonction pour mettre un code unique ----
function setNodeCodewDate(nodeid) {
	const code = new Date().getTime()+"@";
	$(UICom.structure.ui[nodeid].code_node).text(code);
	UICom.structure.ui[nodeid].save();
}

function getPreviewSharedURL(uuid) {
	const email = "";
	const role = 'evaluateur';
	const showtorole = 'evaluateur';
	const sharerole = 'etudiant';
	const level = '2';
	const duration = '500';
	const urlS = serverBCK+'/direct?uuid='+uuid+'&role='+role+'&showtorole='+showtorole+'&l='+level+'&d='+duration+'&sharerole='+sharerole+'&type=showtorole';
	let url = "";
	$.ajax({
		async:false,
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		success : function (data){
			url = data;
		}

	});
	return url;
}

//=============== EVALUATION ACTION =======================
function buildSaveEvaluationVectorCOOP(nodeid,pageid,type) {
	//------------
	const action = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent();
	const actionid = $(action).attr("id");
	const situation_action_label = UICom.structure.ui[pageid].getLabel(null,'none') + "/" + UICom.structure.ui[actionid].getLabel(null,'none')
	//------------
	const ac = $(action).parent();
	const acid = $(ac).attr("id");
	const ac_label = UICom.structure.ui[acid].getLabel(null,'none');
	//------------
	const comp = $(ac).parent().parent();
	const compid = $(comp).attr("id");
	const comp_label = UICom.structure.ui[compid].getLabel(null,'none');
	//------------
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const evalid = nodeid;
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='niveau-expert'])",UICom.structure.ui[evalid].node))[1]).text();
	const previewURL = getPreviewSharedURL(pageid);
	deleteVector(null,null,nodeid);
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		const candelete = enseignantid;
		saveVector(enseignantid,type,nodeid,pageid,previewURL,etudiant,comp_label,ac_label,situation_action_label,evaluation,candelete);
		//----envoi courriel à l'enseigant -----
		if (g_variables['sendemail'] && g_variables['sendemail']=='true') {
			const object = "Demande étudiante - Évaluation";
			const body = " ##firstname## ##lastname## vous a fait une demande d'évaluation.";
			sendNotification(object,body,enseignantemail);
		}("1")
	}
}

function buildSubmitEvaluationVectorCOOP(nodeid,pageid,type) {
	//------------
	const action = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent();
	const actionid = $(action).attr("id");
	const situation_action_label = UICom.structure.ui[pageid].getLabel(null,'none') + "/" + UICom.structure.ui[actionid].getLabel(null,'none')
	//------------
	const ac = $(action).parent();
	const acid = $(ac).attr("id");
	const ac_label = UICom.structure.ui[acid].getLabel(null,'none');
	//------------
	const comp = $(ac).parent().parent();
	const compid = $(comp).attr("id");
	const comp_label = UICom.structure.ui[compid].getLabel(null,'none');
	//------------
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const etudiant_courriel = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-courriel'])",UICom.structure.ui[pageid].node)).text();
	//------------
	const evalid = nodeid;
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='niveau-expert'])",UICom.structure.ui[evalid].node))[1]).text();
	//------------
	const previewURL = getPreviewSharedURL(pageid);
	const today = new Date();
	//------------
	saveVector(USER.username,type,nodeid,pageid,previewURL,etudiant,comp_label,ac_label,situation_action_label,evaluation+"|"+today.toLocaleString());
	//----envoi courriel à l'étudiant -----
	if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
		const object = "Évaluation";
		const body = action + "a été évalué(e).";
		sendNotification(object,body,etudiant_courriel);
	}
}

function displayEvaluationCOOP(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+date.substring(0,date.length-8)+"</td>";
	const situation_action = a9.split("/");
	html += "<td>"+ situation_action[0]+"</td>";
	html += "<td>"+a7+" / "+a8+"</td>";
	html += "<td>"+situation_action[1]+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	if (a10.indexOf("|")<0)
		html += "<td>"+a10+"</td>";
	else {
		const eval = a10.substring(0,a10.indexOf("|"));
		const date_eval = new Date(parseInt(a10.substring(0,a10.indexOf("|")+1))).toLocaleString();
		html += "<td>"+ eval + "<br>" + date_eval + "</td>";
	}
	html += "</tr>";
	$("#"+destid).append(html);
}

function displayEvaluationSoumiseCOOP(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	const date_demande = new Date(parseInt(a7));
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+ date +"</td>";
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a4+"',100,'standard',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a10+"</td>";
//	html += "<td>"+a9+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function majDemEvalAction(nodeid) {
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node))[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function demanderEvaluationAction(nodeid) {
//	const action = $(UICom.structure.ui[nodeid].node).parent().parent().parent().parent();
//	const actionid = $(action).attr("id");
	const pageid = $("#page").attr('uuid');
	buildSaveEvaluationVectorCOOP(nodeid,pageid,"action-evaluation");
//	const js = "buildSaveEvaluationVectorCOOP('"+nodeid+"','"+pageid+"','"+type+"-evaluation')";
//	const text = "Attention vous ne pourrez plus faire de modifications sur cette action. Voulez-vous continuer?";
//	confirmSubmit(actionid,false,js,text);
}

function modifierEvaluationAction(nodeid) { // par l'enseignant
	//-------------------
	const demande = $(UICom.structure.ui[nodeid].node).parent(); // evaluation-expert-v1
	const demandeid = $(demande).attr("id");
	//-------------------
	let parent = $(UICom.structure.ui[nodeid].node).parent(); 
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	//-------------------
	deleteVector(null,'action-evaluation',demandeid);
	buildSaveEvaluationVectorCOOP(demandeid,pageid,'action-evaluation');
}

function supprimerEvaluationAction(nodeid) {
	deleteVector(null,'action-evaluation',nodeid);
}

function soumettreEvaluationAction(nodeid) {
	//-------------------
	let parent = $(UICom.structure.ui[nodeid].node).parent(); 
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	//-------------------
	deleteVector(null,'action-evaluation',nodeid);
	buildSubmitEvaluationVectorCOOP(nodeid,pageid,"action-evaluation-done");
}


//=============== FEEDBACK ACTION =======================

function buildSaveFeedbackVectorCOOP(nodeid,pageid,type,sendemail) {
	const parent = $(UICom.structure.ui[nodeid].node).parent().parent();
	const parentid = $(parent).attr("id");
	const action = UICom.structure.ui[pageid].getLabel(null,'none') + "/" + UICom.structure.ui[parentid].getLabel(null,'none')
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const question = UICom.structure.ui[nodeid].getLabel(null,'none');
	const commentaires = UICom.structure.ui[nodeid].resource.getView();
	const previewURL = getPreviewSharedURL(pageid);
	let date_demande= new Date().getTime();
	const search = $("vector",searchVector(null,type,nodeid));
	if (search.length>0 && g_userroles[0]!='etudiant')
		date_demande = $("a7",search[0]).text();
	deleteVector(null,null,nodeid);
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		saveVector(enseignantid,type,nodeid,pageid,previewURL,etudiant,date_demande,action,question,commentaires,enseignantid);
		//----envoi courriel à l'enseigant -----
		if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
			const object = "Demande étudiante - Feedback";
			const body = " ##firstname## ##lastname## vous a fait une demande de feedback.";
			sendNotification(object,body,enseignantemail);
		}
	}
}

function buildSubmitFeebackVectorCOOP(nodeid,pageid,type) {
	const parent = $(UICom.structure.ui[nodeid].node).parent().parent();
	const parentid = $(parent).attr("id");
	const action = UICom.structure.ui[pageid].getLabel(null,'none') + "/" + UICom.structure.ui[parentid].getLabel(null,'none')
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const etudiant_courriel = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-courriel'])",UICom.structure.ui[pageid].node)).text();
	const question = UICom.structure.ui[nodeid].getLabel(null,'none');
	const commentaires = UICom.structure.ui[nodeid].resource.getView();
	const previewURL = getPreviewSharedURL(pageid);
	let date_demande= new Date().getTime();
	const search = $("vector",searchVector(null,type,nodeid));
	if (search.length>0 && g_userroles[0]!='etudiant')
		date_demande = $("a7",search[0]).text();
	deleteVector(null,null,nodeid);
	saveVector(USER.username,type,nodeid,pageid,previewURL,etudiant,date_demande,action,question,commentaires,USER.username);
	//----envoi courriel à l'étudiant -----
	if (g_variables['sendemail'] && g_variables['sendemail']=='true') {
		const object = "Feedback";
		const body = USER.firstname +" "+ USER.lastname+ " a répondu à votre question.";
		sendNotification(object,body,etudiant_courriel);
	}
}

function displayFeedbackCOOP(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	const date_demande = new Date(parseInt(a7));
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+a9+"</td>";
	html += "<td>"+a10+"</td>";
//	html += "<td><span class='button' onclick=\"soumettreFeedback('"+a3+"','"+a4+"','"+a2+"','"+g_variables['sendemail']+"')\" data-title='Envoyer' data-toggle='tooltip' data-placement='bottom' ><i class='fa fa-paper-plane' aria-hidden='true'></i></span></td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function demanderFeedbackAction(nodeid) {
	const pageid = $("#page").attr('uuid');
	buildSaveFeedbackVectorCOOP(nodeid,pageid,'action-feedback');
}

function supprimerFeedbackAction(nodeid) {
	deleteVector(null,'action-feedback',nodeid);
}

function modifierFeedbackAction(nodeid) { // par l'enseignant
	//---------------------------
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	buildSaveFeedbackVectorCOOP(nodeid,pageid,'action-feedback');
}

function soumettreFeedbackAction(nodeid){
	let parent = $(UICom.structure.ui[nodeid].node).parent(); 
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	buildSubmitFeebackVectorCOOP(nodeid,pageid,"action-feedback-done");
}

function enregistrerDemFeedbackAction () {
	alert('Demande enregistrée');
	eval("demanderFeedbackAction("+replaceVariable('##lastimported##')+")");
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
	var html = "<div style='display:none'>" + g_configVar['send-email-logo'] +"</div>";
	$("body").append(html);
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

function sendNotification2(subject,body,email) {
	var message = "";
//	var img = document.querySelector('#config-send-email-logo');
//	var imgB64 = getDataUrl(img)//	$("#image-window-body").html("");
//	var logo = "<img width='"+img.style.width+"' height='"+img.style.height+"' src=\""+imgB64+"\">";
//	message = logo + "<br>" + body;
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

//==================================
function dupliquerAutoEvaluationGlobale(nodeid) {
//==================================
	const code = UICom.structure.ui[nodeid].getCode();
	const autosection = $("*:has(>metadata[semantictag*='comps-auto-evals'])",g_portfolio_current)[0];
	const autosectionid = $(autosection).attr("id");
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

//==================================
function testSiPremiereAutoEvaluationGlobaleSubmitted(nodeid) {
//==================================
	const code = UICom.structure.ui[nodeid].getCode();
	const autonodes = $("*:has(>metadata[semantictag*='auto-evaluation-globale'])",g_portfolio_current);
	let autocodeids = [];
	for (var i=0;i<autonodes.length;i++) {
		const resource = $("asmResource[xsi_type='nodeRes']",autonodes[i])[0];
		const resourceid = $(autonodes[i]).attr("id");
		if ($("code",resource).text()==code)
			autocodeids[autocodeids.length] = resourceid;
	}
	if (testSubmitted(autocodeids[0]) && nodeid==autocodeids[0])
		return true;
	else
		return false;
}

//=========================================================
//==================Specific Vector Functions==============
//=========================================================

function numberVectorCOOP(enseignantid,type,date1,date2) {
	return searchVectorCOOP(enseignantid,type,date1,date2).length;
}

function searchVectorCOOP(enseignantid,type,date1,date2) {
	enseignantid = replaceVariable(enseignantid);
	let search = $("vector",searchVector(enseignantid,type));
	if (date1!=null && date2!=null) {
		for (let i=0;i<search.length;i++) {
			const date = $(search[i]).attr('date');
			if (date<date1 || date>date2)
				search.splice(i,1);
		}
	}
	return search;
}

//======================================================================================
//============= Mise à jour SAE/STAGE/ACTION/Compétence=================================
//======================================================================================

function setInformation(nodeid) {
	setPrenomNom(nodeid);
//	setMatricule(nodeid);
	setCourriel(nodeid);
	setPageUUID(nodeid);
}

function setPrenomNom(nodeid) {
	var prenom_nom =  $("*:has(>metadata[semantictag*='prenom_nom'])",UICom.structure.ui[nodeid].node)[0];
	var prenom_nomid = $(prenom_nom).attr("id");
	if (prenom_nom==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		prenom_nomid = importBranch(nodeid,srcecode,"prenom_nom");
		UIFactory.Node.upNode(prenom_nomid,false);
		UIFactory.Node.upNode(prenom_nomid,false);
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[prenom_nomid].resource.text_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[prenom_nomid].resource.save();
}

function setMatricule(nodeid) {
	var etudiant_matricule =  $("*:has(>metadata[semantictag*='etudiant-matricule'])",UICom.structure.ui[nodeid].node)[0];
	var etudiant_matriculeid = $(etudiant_matricule).attr("id");
	if (etudiant_matricule==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		etudiant_matriculeid = importBranch(nodeid,srcecode,"etudiant-matricule");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const matricule = $("*:has(>metadata[semantictag*='matricule-etudiant'])",g_portfolio_current)[0];
	const matriculeid = $(matricule).attr("id");
	$(UICom.structure.ui[etudiant_matriculeid].resource.text_node[LANGCODE]).text(UICom.structure.ui[matriculeid].resource.getView());
	UICom.structure.ui[etudiant_matriculeid].resource.save();
}

function setCourriel(nodeid) {
	var etudiant_courriel =  $("*:has(>metadata[semantictag*='etudiant-courriel'])",UICom.structure.ui[nodeid].node)[0];
	var etudiant_courrielid = $(etudiant_courriel).attr("id");
	if (etudiant_courriel==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		etudiant_courrielid = importBranch(nodeid,srcecode,"etudiant-courriel");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const courriel = $("*:has(>metadata[semantictag*='adresse-mail'])",g_portfolio_current)[0];
	const courrielid = $(courriel).attr("id");
	$(UICom.structure.ui[etudiant_courrielid].resource.text_node[LANGCODE]).text(UICom.structure.ui[courrielid].resource.getView());
	UICom.structure.ui[etudiant_courrielid].resource.save();
}

function setPageUUID(nodeid) {
	var pageUUID = $($("*:has(>metadata[semantictag*='page-uuid'])",UICom.structure.ui[nodeid].node)[0]).attr("id");
	if (pageUUID==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		pageUUID = importBranch(nodeid,srcecode,"page-uuid");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	$(UICom.structure.ui[pageUUID].resource.text_node[LANGCODE]).text(nodeid);
	UICom.structure.ui[pageUUID].resource.save();
}

//# sourceURL=coop.js
