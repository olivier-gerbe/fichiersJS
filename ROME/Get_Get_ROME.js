/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Get_Get_ROME"] = function( node,condition)
//==================================
{
	this.clause = "xsi_type='Get_Get_ROME'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.type = 'Get_Get_ROME';
	//--------------------
	if ($("lastmodified",$("asmResource["+this.clause+"]",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Get_Get_ROME']",node));
	//------- style -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("style",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("style");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.style_node = $("style",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.parentid = $(node).parent().attr("id");
	this.node = node;
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
	this.portfoliocode_node = $("portfoliocode",$("asmResource["+this.clause+"]",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource["+this.clause+"]",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource["+this.clause+"]",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
			}
		}
	}
	if (this.clause=="xsi_type='Get_Get_ROME'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Get_ROME
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.reloadpage = ($("metadata",node).attr('reloadpage')=='Y') ? true : false;
	this.display = {};
	this.displayValue = {};
	this.displayCode = {};
	this.multiple = "";
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("uuid",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("uuid");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.uuid_node = $("uuid",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.preview = ($("metadata",node).attr('preview')=='Y') ? true : false;
};

//==================================
UIFactory["Get_Get_ROME"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['portfoliocode'] = this.portfoliocode_node.text();
		result['label'] = this.label_node[langcode].text();
		result['type'] = this.type;
	}
	return result;
}

//==================================
UIFactory["Get_Get_ROME"].prototype.getType = function()
//==================================
{
	return this.type;
};

//==================================
UIFactory["Get_Get_ROME"].prototype.getCode = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayCode[dest]=true;
	}
	var code = $(this.code_node).text();
	return code;
};

//==================================
UIFactory["Get_Get_ROME"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest]=true;
	}
	var value = $(this.value_node).text();
	return value;
};

/// Display
//==================================
UIFactory["Get_Get_ROME"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = "default";
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	if (type=='default'){
		html += "<div class='"+cleanCode(code)+" view-div' style=\""+style+"\">";
		if (($(this.code_node).text()).indexOf("#")>-1 && ($(this.code_node).text()).indexOf("##")<0)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		html += "</div>";
	}
	if (type=='none'){
		if (($(this.code_node).text()).indexOf("#")>-1 && ($(this.code_node).text()).indexOf("##")<0)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		html = "<span class='"+ cleanCode(code) + "'>" + html + "</span>";
	}
	if (this.preview)
		html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\"previewPage('"+this.uuid_node.text()+"',100,'standard') \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
	//------------------if function js-----------------
	const result1 = execJS(this,'display-resource-before');
	if (typeof result1 == 'string')
		html = result1 + html;
	const result2 = execJS(this,'display-resource-after');
	if (typeof result2 == 'string')
		html = html + result2;
	//------------------------------------------
	return html;
};

//==================================
UIFactory["Get_Get_ROME"].prototype.displayView = function(dest,type,langcode)
//==================================
{
var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};



/// Editor
//==================================
UIFactory["Get_Get_ROME"].update = function(selected_item,itself,langcode,type)
//==================================
{
	try {
		if (execJS(itself,"update-resource-if")) {
			execJS(itself,'update-resource-before');
			//-----------------------
			var value = $(selected_item).attr('value');
			var code = $(selected_item).attr('code');
			var uuid = $(selected_item).attr('uuid');
			var style = $(selected_item).attr('style');
			$(UICom.structure.ui[itself.id].resource.value_node[0]).text(value);
			$(UICom.structure.ui[itself.id].resource.code_node[0]).text(code);
			$(UICom.structure.ui[itself.id].resource.uuid_node[0]).text(uuid);
			$(UICom.structure.ui[itself.id].resource.style_node[0]).text(style);
			for (var i=0; i<languages.length;i++){
				var label = $(selected_item).attr('label_'+languages[i]);
				$(UICom.structure.ui[itself.id].resource.label_node[i][0]).text(label);
			}
			$(UICom.structure.ui[itself.id].resource.lastmodified_node).text(new Date().getTime());
			itself.save();
			//-----------------------
			execJS(itself,'update-resource');
			execJS(itself,'update-resource-after');
		}
	}
	catch(e) {
		console.log(e);
		// do nothing
	}
};

//==================================
UIFactory["Get_Get_ROME"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (this.multiple!=""){
		multiple_tags = this.multiple.substring(this.multiple.indexOf('/')+1);
		queryattr_value = this.multiple.substring(0,this.multiple.indexOf('/'));
		type = 'multiple';
	}
	if (this.get_type!="import_comp" && queryattr_value!=undefined && queryattr_value!='') {
		queryattr_value = replaceVariable(queryattr_value);
		try {
			//------------------------------
			var srce_indx = queryattr_value.lastIndexOf('.');
			var srce = queryattr_value.substring(srce_indx+1);
			var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
			var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
			var semtag_parent_indx = queryattr_value.substring(0,semtag_indx).lastIndexOf('.');
			var semtag_parent = queryattr_value.substring(semtag_parent_indx+1,semtag_indx);
			if (semtag_parent.indexOf('#')==0)
				semtag_parent = semtag_parent.substring(1);
			var portfoliocode_end_indx = queryattr_value.indexOf('child')+queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent')+queryattr_value.indexOf('#')+queryattr_value.indexOf('itself')+3; //  if not present give -1
			var portfoliocode = replaceVariable(queryattr_value.substring(0,portfoliocode_end_indx));
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var code_parent = "";
			// ------- search for parent ----
			if (query.indexOf('itselfcode')>-1 || query.indexOf('itself')>-1) {
				code_parent = $($("code",$(this.node)[0])[0]).text();
				value_parent = $($("value",$(this.node)[0])[0]).text();
			} else if (query.indexOf('parent.parent.parent.parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parent.parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent()[0])[0]).text();
			} else if (query.indexOf('parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent()[0])[0]).text();
			} else {
				if (query.indexOf('child')>-1) {
					parent = this.node;
				}
				if (query.indexOf('sibling')>-1) {
					parent = $(this.node).parent();
				}
				if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent();
				} else	if (query.indexOf('parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent();
				} else if (query.indexOf('parent')>-1) {
					parent = $(this.node).parent().parent();
				}
				if (queryattr_value.indexOf('#')>0)
					code_parent = semtag_parent;
				else {
					//-----------
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
				}
			}
			//----------------------
			var self = this;
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				UIFactory["Get_Get_ROME"].parseROME(destid,type,langcode,g_Get_Resource_caches[queryattr_value],self,disabled,srce,portfoliocode);
			else {
				var url = serverBCK+"/rome/";
				if (code_parent!='')
						url+= semtag_parent+"/"+code_parent+"/"+semtag;
				else
					url+= semtag;
				$.ajax({
					type : "GET",
					dataType : "json",
					url : url,
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[queryattr_value] = data;
						UIFactory["Get_Get_ROME"].parseROME(destid,type,langcode,data,self,disabled,srce,portfoliocode);
					}
				});
			}
			//----------------------
		} catch(e) {
			alertHTML("1-"+e);
			// do nothing - error in the search attribute
		}
	}
};


//==================================
UIFactory["Get_Get_ROME"].prototype.save = function()
//==================================
{
	if (UICom.structure.ui[this.id].semantictag.indexOf("g-select-variable")>-1)
		updateVariable(this.node);
	if (this.clause=="xsi_type='Get_Get_ROME'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			this.refresh();
	}
	else {// Node - Get_Get_ROME {
		UICom.UpdateNode(this.node);
		UICom.structure.ui[this.id].refresh()
	}
	//---------------------
	if (this.reloadpage)
		UIFactory.Node.reloadUnit();
};

//==================================
UIFactory["Get_Get_ROME"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.displayValue) {
		$("#"+dest).html(this.getValue());
	};
	for (dest in this.displayCode) {
		$("#"+dest).html(this.getCode());
	};

};

//==================================
UIFactory["Get_Get_ROME"].addMultiple = function(parentid,targetid,multiple_tags,get_get_resource_semtag,fctjs)
//==================================
{
	if (fctjs==null)
		fctjs = "";
	else
		fctjs = decode(fctjs);
	var elts = multiple_tags.split(",");
	var part_code = elts[0];
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	if (get_get_resource_semtag==undefined || get_get_resource_semtag==null)
		get_get_resource_semtag = elts[1];
	var fct = elts[2];

	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Get_ROME.updateaddedpart;
	var param2 = get_get_resource_semtag;
	var param4 = false;
	var param5 = parentid;
	var param6 = fct;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4,param5,param6);
		if(fctjs!="")
			eval(fctjs);
	}
};


//==================================
UIFactory["Get_Get_ROME"].updateaddedpart = function(data,get_resource_semtag,selected_item,last,parentid,fct)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	if (value=="")
		value = $(selected_item).attr('portfoliocode');
	var code = $(selected_item).attr('code');
	if (fct=="+parentcode") {
		code += "$"+UICom.structure.ui[parentid].getCode();
	}
	var xml = "<asmResource xsi_type='Get_Get_ROME'>";
	xml += "<code>"+code+"</code>";
	xml += "<value>"+value+"</value>";
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		xml += "<label lang='"+languages[i]+"'>"+label+"</label>";
	}
	xml += "</asmResource>";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/"+partid,
		last : last,
		success : function(data) {
			var nodes = $("*:has(>metadata[semantictag*='"+get_resource_semtag+"'])",data);
			if (nodes.length==0)
				nodes = $( ":root",data ); //node itself
			var nodeid = $(nodes[0]).attr('id'); 
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			var tagname = $(nodes[0])[0].nodeName;
			if( "asmContext" == tagname) {
				const resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']", $(nodes[0])[0]);
				const xsi_type = $(resource).attr("xsi_type");
				xml = xml.replace("Get_Get_ROME",xsi_type);
			} else {
				xml = xml.replace("Get_Get_ROME","nodeRes");
				url_resource = serverBCK_API+"/nodes/node/" + nodeid + "/noderesource";
				
			}
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : xml,
				last : this.last,
				url : url_resource,
				success : function(data) {
					if (this.last) {
						$('#edit-window').modal('hide');
						UIFactory.Node.reloadUnit();
					}
				}
			});
		}
	});
}

//==================================
function get_get_multiple(parentid,targetid,title,query,partcode,get_get_resource_semtag)
//==================================
{
	// targetid not used with get_get_multiple
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_ROME.addMultiple('"+parentid+"','"+targetid+"','"+partcode+","+get_get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_ROME"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/"+partcode+","+get_get_resource_semtag;
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');

}

//==================================
UIFactory["Get_Get_ROME"].parseROME = function(destid,type,langcode,data,self,disabled,srce,portfoliocode) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//---------------------
	var langcode = LANGCODE;
	var display_code = false;
	//-----Node ordering-------------------------------------------------------
	var newTableau1 = data;
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
		//------------------------
		var inputs = "<div class='ROME' id='get_get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		var nodes = $("node",data);
		for ( var i = 0; i < newTableau1.length; ++i) {
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			var input = "";
			//------------------------------
			input += "<div> <input type='checkbox' portfoliocode='"+portfoliocode+"' name='multiple_"+self.id+"' value='' code='"+code+"' class='multiple-item";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+label+"\" ";
			}
			input += "> ";
			if (display_code)
				input += code + " ";
			input +="<span  class='"+code+"'>"+label+"</span></div>";
			var input_obj = $(input);
			$(inputs_obj).append(input_obj);
		}
		$("#"+destid).append(inputs_obj);
	}

}

//# sourceURL=Get_Get_ROME.js


