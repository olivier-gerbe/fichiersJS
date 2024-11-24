/* =======================================================
	Copyright 2024 - ePortfolium - Licensed under the
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

var g_Get_ROMEV4_caches = {};

/// Define our type
//==================================
UIFactory["Get_ROMEV4"] = function(node,condition)
//==================================
{
	this.clause = "xsi_type='Get_ROMEV4'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_ROMEV4';
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("lastmodified",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='"+this.type+"']",node));
	//------- for log -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("user",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("user");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.user_node = $("user",$("asmResource[xsi_type='"+this.type+"']",node));
	//------- style -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("style",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("style");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.style_node = $("style",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
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
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		}
	}
	if (this.clause=="xsi_type='Get_ROMEV4'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_ROMEV4
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.reloadpage = ($("metadata",node).attr('reloadpage')=='Y') ? true : false;
	this.display = {};
	this.displayCode = {};
	this.displayValue = {};
	this.displayLabel = {};
	this.multiple = "";
	this.simple = "";
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("version",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("uuid",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("uuid");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.uuid_node = $("uuid",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	//--------------------
	this.preview = ($("metadata",node).attr('preview')=='Y') ? true : false;
	this.previewsharing = ($("metadata",node).attr('previewsharing')==undefined)? '': $("metadata",node).attr('previewsharing');

};

//==================================
UIFactory["Get_ROMEV4"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['style'] = this.style_node.text();
		result['label'] = this.label_node[langcode].text();
		result['uuid'] = this.uuid_node.text();
	}
	return result;
}

/// Display

//==================================
UIFactory["Get_ROMEV4"].prototype.getCode = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayCode[dest] = true;
	}
	return this.code_node.text();
};

//==================================
UIFactory["Get_ROMEV4"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest] = true;
	}
	return this.value_node.text();
};

//==================================
UIFactory["Get_ROMEV4"].prototype.getLabel = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = 'span';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null)
		this.displayLabel[dest]=type;
	//---------------------
	var html = "";
	var label = this.label_node[langcode].text();
	if (type=="div")
		html =   "<div>"+label+"</div>";
	else if (type=="span")
		html =   "<span>"+label+"</span>";
	else if (type=="none")
		html = label;
	return html;
};

//==================================
UIFactory["Get_ROMEV4"].prototype.getView = function(dest,type,langcode,indashboard)
//==================================
{
	//-------- if function js -------------
	if (UICom.structure.ui[this.id].js==undefined)
		UICom.structure.ui[this.id].setMetadata();
	if (UICom.structure.ui[this.id].js!="") {
		var fcts = UICom.structure.ui[this.id].js.split("|");
		for (let i=0;i<fcts.length;i++) {
			let elts = fcts[i].split("/");
			if (elts[0]=="display-resource-before") {
				fctjs = elts[1].split(";");
				for (let j=0;j<fctjs.length;j++) {
					eval(fctjs[j]+"(this.node,g_portfolioid)");
				}
			}
		}
	}
	//---------------------
	if (indashboard==null)
		indashboard = false;
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
	var text = this.text_node[langcode].text();
	var label = this.label_node[langcode].text();
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	//--------------------------------------------------
	if (type!="batchform") {
		if (indashboard)
			html += "<span class='"+cleanCode(code)+"' style='";
		else
			html += "<div class='"+cleanCode(code)+" view-div' style='";
		html += style;
		html += "'>";
		if (code.indexOf("#")>-1 && code.indexOf("##")<0) 
			html += "<span name='code'>" + cleanCode(code) + "</span> ";
		if (code.indexOf("*")>-1)
			html += "<span name='code'>" + cleanCode(code) + "</span> ";
		if (code.indexOf("%")<0) {
			if (label.indexOf("fileid-")>-1) {
				if (UICom.structure.ui[label.substring(7)]==undefined)
					$.ajax({
						async: false,
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/nodes/node/" + label.substring(7),
						success : function(data) {
							UICom.parseStructure(data,false);
						}
					});
				html += UICom.structure.ui[label.substring(7)].resource.getView();
			} else {
				html += "<span name='label'>" + label + "</span> ";
			}
		}
		if (code.indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		if (this.preview){
			let js = "previewPage('"+this.uuid_node.text()+"',100,'standard')";
			if (this.previewsharing!=""){
				options = this.previewsharing.split(",");
				if (options[3].indexOf(g_userroles[0])>-1){
					//-------------------------------------------sharerole,level,duration,role
					const previewURL = getPreviewSharedURL(this.uuid_node.text(),options[0],options[1],options[2],g_userroles[0])
					js = "previewPage('"+previewURL+"',100,'previewURL',null,true)";
				}
			}
			html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\" "+ js +" \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		if (indashboard)
			html += "</span>";
		else
			html += "</div>";
	} else {	// type=='batchform'
		html = label;
	}
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
UIFactory["Get_ROMEV4V4"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};


/// Editor

//==================================
UIFactory["Get_ROMEV4"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable,resettable)
//==================================
{
	var multiple_tags = "";
	if (cachable==undefined || cachable==null)
		cachable = true;
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (this.multiple!=""){
		multiple_tags = this.multiple.substring(this.multiple.indexOf('/')+1);
		queryattr_value = this.multiple.substring(0,this.multiple.indexOf('/'));
		type = 'multiple';
	}
	if (this.simple!=""){
		multiple_tags = this.simple.substring(this.simple.indexOf('/')+1);
		queryattr_value = this.simple.substring(0,this.simple.indexOf('/'));
		type = 'simple';
	}
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------------
		queryattr_value = replaceVariable(queryattr_value);
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		if (semtag.indexOf('+')>-1) {
			semtag2 = semtag.substring(semtag.indexOf('+')+1);
			semtag = semtag.substring(0,semtag.indexOf('+'));
		}
		var target = queryattr_value.substring(srce_indx+1); // label or text
		// ==============================================================================
		var self = this;
		if (cachable && g_Get_ROMEV4_caches[queryattr_value]!=undefined && g_Get_ROMEV4_caches[queryattr_value]!="")
			UIFactory["Get_ROMEV4"].parseROME(destid,type,langcode,g_Get_ROMEV4_caches[queryattr_value],self,disabled,srce,resettable,target,semtag,multiple_tags);
		else {
			$.ajax({
				type : "GET",
				dataType : "json",
				url : serverBCK+"/rome/"+semtag,
				success : function(data) {
					if (cachable)
						g_Get_ROMEV4_caches[queryattr_value] = data;
					UIFactory["Get_ROMEV4"].parseROME(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag,multiple_tags);
				}
			});
		}
	}
	//-------- if function js -------------
	if (UICom.structure.ui[this.id].js!="") {
		var fcts = UICom.structure.ui[this.id].js.split("|");
		for (let i=0;i<fcts.length;i++) {
			let elts = fcts[i].split("/");
			if (elts[0]=="edit-resource") {
				fctjs = elts[1].split(";");
				for (let j=0;j<fctjs.length;j++) {
					eval(fctjs[j]+"(this.node,g_portfolioid)");
				}
			}
		}
	}
	//---------------------
};

//==================================
UIFactory["Get_ROMEV4"].update = function(selected_item,itself,langcode,type)
//==================================
{
	try {
		if (execJS(itself,"update-resource-if")) {
			//-------- if function js -------------
			execJS(itself,"update-resource-before");
			//---------------------
			var value = $(selected_item).attr('value');
			var code = $(selected_item).attr('code');
			var uuid = $(selected_item).attr('uuid');
			var style = $(selected_item).attr('style');
			//---------------------
			if (UICom.structure.ui[itself.id].semantictag.indexOf("g-select-variable")>-1) {
				var variable_value = (value=="") ? code : value;
				g_variables[UICom.structure.ui[itself.id].getCode()] = cleanCode(variable_value,true);
			}
			//---------------------
			$(UICom.structure.ui[itself.id].resource.value_node[0]).text(value);
			$(UICom.structure.ui[itself.id].resource.code_node[0]).text(code);
			$(UICom.structure.ui[itself.id].resource.uuid_node[0]).text(uuid);
			for (var i=0; i<languages.length;i++){
				var label = $(selected_item).attr('label_'+languages[i]);
				$(UICom.structure.ui[itself.id].resource.label_node[i][0]).text(label);
			}
			itself.save();
			//-------- if function js -------------
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
UIFactory["Get_ROMEV4"].prototype.save = function()
//==================================
{
	//------------------------------
	var log = (UICom.structure.ui[this.id]!=undefined && UICom.structure.ui[this.id].logcode!=undefined && UICom.structure.ui[this.id].logcode!="");
	if (log)
		$(this.user_node).text(USER.firstname+" "+USER.lastname);
	//------------------------------
	$(this.lastmodified_node).text(new Date().getTime());
	//------------------------------
	if (this.clause=="xsi_type='Get_ROMEV4'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			if (this.blockparent!=null)
				this.blockparent.refresh();
			else
				this.refresh();
	}
	else {// Node - Get_ROMEV4 {
		UICom.UpdateNode(this.node);
		UICom.structure.ui[this.id].refresh()
	}
	//--------- log -------------
	if (log) {
		UICom.structure.ui[this.id].log();
	}
	//---------------------------
	if (this.reloadpage)
		UIFactory.Node.reloadUnit();
		
};

//==================================
UIFactory["Get_ROMEV4"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.displayCode) {
		$("#"+dest).html(this.getCode());
	};
	for (dest in this.displayValue) {
		$("#"+dest).html(this.getValue());
	};
	for (dest in this.displayLabel) {
		$("#"+dest).html(this.getLabel(null,this.displayLabel[dest]));
	};
};

//==================================================================================
//==================================================================================
//==================================================================================
//==================================================================================

//==================================
UIFactory["Get_ROMEV4"].parseROME = function(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag,multiple_tags) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	if (resettable==null)
		resettable = true;
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//---------------------
	var cachable = true;
	var langcode = LANGCODE;
	var semtag = 'rome';
	var display_code = true;
	var display_label = true;
	var self_code = $(self.code_node).text();
	//-----Node ordering-------------------------------------------------------
	var newTableau1 = data;
	//------------------------------------------------------------
	if (type=='select') {
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice'>";
		html += "<input id='input_"+self.id+"' type='text' class='btn btn-default select select-rome' code= '' value=''>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		var onupdate = "UIFactory.Get_ROMEV4.update(input,self)";
		autocomplete(document.getElementById("input_"+self.id), newTableau1,onupdate,self,langcode);
		//-------------------------------------------------
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//---------------------
		var code = "";
		var label = "";
		html = "<li style='width:100%' value='' code=''  label_fr=''>&nbsp;</li>";
		var select_item = $(html);
		$(select_item).click(function (ev){
			//--------------------------------
			var code = $(this).attr('code');
			var display_code = false;
			var display_label = true;
			//--------------------------------
			var html = "";
			if (display_code)
				html += code+" ";
			if (display_label)
				html += $(this).attr("label_fr");
			$("#input_"+self.id).attr('value',html);
			UIFactory["Get_ROMEV4"].update(this,self,langcode);
			//--------------------------------
		});
		$(select).append($(select_item));
		//---------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			//------------------------------
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			html = "<li></li>";
			var select_item = $(html);
			html = "<a  value='' code='"+code+"' class='sel"+code+"' label_fr=\""+label+"\" >";
			if (display_code)
				html += "<span class='li-code'>"+code+"</span>";
			if (display_label)
				html += "<span class='li-label'>"+label+"</span>";
			html += "</a>";			
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				//--------------------------------
				var code = $(this).attr('code');
				var display_code = false;
				var display_label = true;
				//--------------------------------
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += $(this).attr("label_fr");
				$("#input_"+self.id).attr('value',html);
				UIFactory["Get_ROMEV4"].update(this,self,langcode);
				//--------------------------------
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
			//-------------- update button -----
			if (code!="" && self_code==code) {
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += label;
				$("#button_"+self.id).html(html);
			}
		}
		//---------------------
		$(btn_group).append($(select));
	}
	if (type=='completion') {
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice'>";
		html += "<input id='input_"+self.id+"' type='text' class='btn btn-default select select-rome' code= '' value=''>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		var onupdate = "UIFactory.Get_ROMEV4.update(inp,self)";
		autocomplete(document.getElementById("input_"+self.id), newTableau1,onupdate,self,langcode);
		//===============
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//---------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			//------------------------------
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			html = "<li></li>";
			var select_item = $(html);
			html = "<a  value='' code='"+code+"' class='sel"+code+"' label_fr=\""+label+"\" >";
			if (display_code)
				html += "<span class='li-code'>"+code+"</span>";
			if (display_label)
				html += "<span class='li-label'>"+label+"</span>";
			html += "</a>";			
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				//--------------------------------
				var code = $(this).attr('code');
				var display_code = false;
				var display_label = true;
				//--------------------------------
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += $(this).attr("label_fr");
				$("#input_"+self.id).attr("value",html);
				UIFactory["Get_ROMEV4"].update(this,self,langcode);
				//--------------------------------
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
			//-------------- update button -----
			if (code!="" && self_code==code) {
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += label;
				$("#input_"+self.id).attr("value",html);
			}
		}
		//---------------------
		$(btn_group).append($(select));
	}
}

//# sourceURL=Get_ROMEV4.js
