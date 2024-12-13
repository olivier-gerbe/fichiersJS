
function displayForPrintNode(uuid) {
	//---------------------
	/*var previewbackdrop = document.createElement("DIV");
	previewbackdrop.setAttribute("class", "preview-backdrop");
	previewbackdrop.setAttribute("id", "previewbackdrop-"+uuid);
	$('body').append(previewbackdrop);
	//-----------------------------
	var previewwindow = document.createElement("DIV");
	previewwindow.setAttribute("id", "preview-"+uuid);
	previewwindow.setAttribute("class", "preview-window");
	previewwindow.setAttribute("preview-uuid", uuid);
	previewwindow.setAttribute("preview-edit", false);
	previewwindow.innerHTML =  previewBox(uuid);
	$('body').append(previewwindow);
	$("#preview-"+uuid).hide();
	$("#preview-window-body-"+uuid).html("");
	*/
	const win = window.open("","_blank");
	const printdiv = win.document.createElement("DIV");
	printdiv.setAttribute("id", "printing-window");
	win.document.body.append(printdiv);
	$(win.document.body).append("Hello")
	//-----------------------------
	UICom.structure.ui[uuid].displayPrintingNode('standard',UICom.structure.tree[uuid],win.document.body,500,LANGCODE,false);
	//-----------------------------	
	win.focus();
}


//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].prototype.displayPrintingNode = function(type,root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock,refresh)
//==============================================================================
//==============================================================================
//==============================================================================
{
	if (refresh==null)
		refresh = false;
	var uuid = this.id;
	var alreadyDisplayed = false;
	//---------------------------------------
	if (this.visible && this.langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && testIfDisplay(uuid)) {
		var node = UICom.structure.ui[uuid];
		var structure_node =   node.resource==null 
							|| node.resource.type!='Proxy' 
							|| (node.resource.type=='Proxy' && this.writenode && this.editresroles.containsArrayElt(g_userroles)) 
							|| (g_userroles[0]=='designer' || USER.admin);
		if (structure_node) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)  // in designer mode depending the role played the node may be not readable
				readnode = (g_userroles[0]=='designer' 
							|| this.seenoderoles.indexOf(USER.username_node.text())>-1 || this.seenoderoles.indexOf(g_userroles[0])>-1 || (this.showtoroles.indexOf(g_userroles[0])>-1 && !this.privatevalue) || (this.showtoroles.indexOf(USER.username_node.text())>-1 && !this.privatevalue) || this.seenoderoles.indexOf('all')>-1)? true : false;
			//----------------------------------------------
//			if( this.depth < 0 || !readnode) return;
			let newdest =  null;
			//============================== ASMCONTEXT =============================
			if (this.nodetype == "asmContext" || (this.structured_resource != null && type!='raw' && this.semantictag!='EuropassL')){
				eltDisplayed(uuid);
				alreadyDisplayed = true;
				newdest = this.displayPrintAsmContext(dest,type,langcode,edit,refresh,depth);
			}
			//============================== NODE ===================================
			else { // other than asmContext
				eltDisplayed(uuid);
				newdest = this.displayPrintAsmNode(dest,type,langcode,edit,refresh,depth);
			}
			// ===========================================================================
			// ================================= For each child ==========================
			// ===========================================================================
			var backgroundParent = UIFactory.Node.getMetadataEpm(this.metadataepm,'node-background-color',false);
			//------------ EuropassL -----------------
			if (this.semantictag=="EuropassL"){
				alreadyDisplayed = true;
				if( node.structured_resource != null )
				{
					node.structured_resource.displayView('content-'+uuid,langcode,'detail',uuid,this.menu);
				}
			}
			//------------ Bubble Map -----------------
			if (this.semantictag.indexOf('bubble_level1')>-1) {
				alreadyDisplayed = true;
				if  (this.seeqrcoderoles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') {
					var map_info = UIFactory.Bubble.getLinkQRcode(uuid);
					$('#map-info_'+uuid).html(map_info);
					$('body').append(qrCodeBox());
					UIFactory.Bubble.getPublicURL(uuid,g_userroles[0]);
				}
			}
			//------------ Tabs SubSection -----------------
/*			if (this.semantictag.indexOf("tabs-section")>-1){
				alreadyDisplayed = true;
				let html_tabs = "<ul class='tabs-headers nav nav-tabs' role='tablist'>";
				let html_panels = "<div class='tabs-contents tab-content'>";
				for( let i=0; i<root.children.length; ++i ) {
					let childnode = UICom.structure.ui[root.children[i]];
					let childlabel = childnode.getLabel();
					var style = childnode.getLabelStyle();
					html_tabs += "<li class='nav-item'><a class='nav-link' style='"+style+"' href='#display-"+uuid+"-"+i+"' onclick=\"localStorage.setItem('#display-"+uuid+"','-"+i+"')\" role='tab' data-toggle='tab'>"+childlabel+"</a></li>";
					html_panels += "<div role='tabpanel' class='tab-pane' id='display-"+uuid+"-"+i+"'></div>";
				}
				html_tabs += "</ul>";
				html_panels +="</div>";
				$("#content-"+uuid).append (html_tabs);
				$("#content-"+uuid).append (html_panels);
				if (localStorage.getItem('#display-'+uuid)!=undefined){
					$("a[href=\"#display-"+uuid+localStorage.getItem('#display-'+uuid)+"\"]").click();
				} else {
					$("a[href='#display-"+uuid+"-0']").click();
					localStorage.setItem('#display-'+uuid,'-0');
				}
				for( let i=0; i<root.children.length; ++i ) {
					// Recurse
					let child = UICom.structure.tree[root.children[i]];
					let childnode = UICom.structure.ui[root.children[i]];
					let original_edit = edit;
					if (this.submitted=='Y' && this.submitall=='Y')
						edit = false;
					childnode.displayNode(type,child, 'display-'+uuid+'-'+i, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
					edit = original_edit;
				}

			} */
			//------------ Default  -----------------
			if (!alreadyDisplayed) {
				for( var i=0; i<root.children.length; ++i ) {
					// Recurse
					let child = UICom.structure.tree[root.children[i]];
					let childnode = UICom.structure.ui[root.children[i]];
					let original_edit = edit;
					if (this.submitted=='Y' && this.submitall=='Y')
						edit = false;
					childnode.displayPrintingNode(type,child,newdest, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
					edit = original_edit;
				}
			}
			//-------------------------------------------------------
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
			$(".pickcolor").colorpicker();
			//----------------------------
		}
	} //---- end of visible
};


//==================================================
UIFactory["Node"].prototype.displayPrintAsmContext = function (dest,type,langcode,edit,refresh)
//==================================================

{
	if (type==null)
		type = 'standard';
	var uuid = this.id;
	//---------if designer is playing roles we set rights-----------------------------
	if (g_designerrole) {
		this.writenode = (this.editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode)
			this.writenode = (this.editresroles.containsArrayElt(g_userroles))? true : false;
	}
	if (g_userroles[0]=='designer') {
		this.writenode = (this.editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode)
			this.writenode = (this.editresroles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode)
			this.writenode = (g_userroles[0]=='designer')? true : false;
	}
if (execJS(this,"display-if")) {
		//---------------- DISPLAY HTML -------------------------------
		var html = "";
		var displayview = "";
		var resourcetype = this.resource_type;
		if (this.displayview!='' & type!='raw') {
			var newtype = this.displayview;
			html = displayHTML[type+"-resource-"+newtype];
			displayview = type+"-resource-"+newtype;
			if (html==undefined) {
				html = displayHTML[type+"-resource-"+resourcetype+"-"+newtype];
				displayview = type+"-resource-"+resourcetype+"-"+newtype;
			}
			if (html==undefined) {
				alert("error: "+newtype+" does not exist");
				html = displayHTML[type+"-resource-default"];
				displayview = type+"-resource-default";
			}
		}
		else
			if (type=='raw') {
				html = displayHTML["raw-resource-default"];
				displayview = "raw-resource-default";
			} else {
				html = displayHTML[type+"-resource-default"];
				displayview = type+"-resource-default";
			}
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#resourcetype#/g,this.resource_type).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg);
		if (this.privatevalue)
		 html = html.replace(/#priv#/g,'private');
		//-------------------- display ----------------------
		$(dest).append (html);
		//-------------------- STYLES ---------------------------------------
		var style = "";
		//-------------------- node style -------------------
		style = replaceVariable(this.getNodeStyle(uuid));
		$("#node_"+uuid).attr("style",style);
		//-------------------- label style -------------------
		style = replaceVariable(this.getLabelStyle(uuid));
		$("*[name='res-lbl-div']","#node_"+uuid).attr("style",style);
		//-------------------- resource style -------------------
		style = replaceVariable(this.getContentStyle());
		$("*[name='res-div']","#node_"+uuid).attr("style",style);
		//---------------- display resource ---------------------------------
		if (this.edit && this.inline && this.writenode && this.editable_in_line)
			this.resource.displayEditor("resource_"+uuid,null,langcode,false,this.inline);
		else if (this.structured_resource != null && type!='raw') {
			this.structured_resource.displayView("resource_"+uuid,null,langcode);
		}
		else
			this.resource.displayView("resource_"+uuid);
		//---------------- display label ---------------------------------
		$("#label_node_"+uuid).html(this.getView('label_node_'+uuid));
		//----------- Buttons & Menus -----------
		const menus_color = this.getMenuStyle();
		if(edit) {
			var buttons = "";
			if (this.xsi_type.indexOf("Block")>-1) {
				buttons += this.structured_resource.getButtons();
			}
			buttons += this.getButtons();
			//------------- print button -------------------
			if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				buttons += "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			}
			if (buttons!="")
				buttons = "<div class='btn-group'>"+buttons+"</div><!-- class='btn-group' -->"
			$("#buttons-"+uuid).html(buttons);
	
			if (this.menu)
				this.displayMenus("#menus-"+uuid,langcode);
		} else {
			//------------- print button -------------------
			if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || this.printroles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				var buttons = "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
				$("#buttons-"+uuid).html(buttons);
			}
		}
		//----------------delete control on proxy parent ------------
		if (edit && proxies_delete[uuid]!=undefined && proxies_delete[uuid].containsArrayElt(g_userroles)) {
			var html = deleteButton(proxies_nodeid[uuid],"asmContext",undefined,undefined,"UIFactory.Node.reloadUnit","null","null","this");
			$("#buttons-"+uuid).html(html);
		}
		//------------- print button -------------------
		if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || this.printroles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				html += "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"javascript:printSection('#node_"+this.id+"')\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		//----------------------- if compact view -----------------------------
		if (displayview=='standard-resource-compact')
			showHideCompactEditElts(uuid);
		//----------------- hide lbl-div if empty ------------------------------------
		if (this.getLabel(null,'none',langcode)=="" && this.getButtons(langcode)=="" && this.getMenus(langcode)=="")
			if (this.displayview=='xwide' || this.displayview.indexOf("/12")>-1)
				$("div[name='res-lbl-div']","#node_"+uuid).hide();
		//----------- Comments -----------
		if (this.edit && this.inline && this.writenode && (
				g_userroles[0]=='designer'
				|| this.commentnoderoles.indexOf(g_userroles[0])>-1 
				|| this.commentnoderoles.indexOf($(USER.username_node).text())>-1
				))
			UIFactory.Node.displayCommentsEditor('comments_'+uuid,UICom.structure.ui[uuid]);
		else
			UIFactory.Node.displayComments('comments_'+uuid,UICom.structure.ui[uuid]);
		//--------------------Metadata Info------------------------------------------
		if (g_userroles[0]=='designer' || USER.admin) {  
			this.displayMetainfo("metainfo_"+uuid);
			this.displayMetaEpmInfo("cssinfo_"+uuid);
		}
		//-------------------------------------------------
	}

}


//==================================================
UIFactory["Node"].prototype.displayPrintAsmNode = function(dest,type,langcode,edit,refresh,depth)
//==================================================
{
	var nodetype = this.asmtype;
	var uuid = this.id;
	var html = "";

	if (nodetype=='asmUnitStructure')
		this.depth=100;	
	var displayview = "";
	//---------------- DISPLAY ------------------------------- // .replace("#content-orgclass#","row row-cols-2");
	if (this.depth!=1 && this.depth<10 && nodetype=='asmStructure') {
		if (this.displayview!='' & type!='raw')
			displayview = type+"-node-"+this.displayview;
		else
			displayview = type+"-struct-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg)
		html = html.replace(/#content-orgclass#/g,this.displaychildorg)
		$("#"+dest).append (html);
		$("#label_node_"+uuid).click(function() {displayPage(uuid,1,type,langcode,g_edit)});
	} else if (this.depth!=1 && this.depth<10 && nodetype=='asmUnit') {
		if (this.displayview!='' & type!='raw')
			displayview = type+"-node-"+this.displayview;
		else
			displayview = type+"-struct-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg)
		html = html.replace(/#content-orgclass#/g,this.displaychildorg)
		$(dest).append (html);
		$("#label_node_"+uuid).click(function() {displayPage(uuid,100,type,langcode,g_edit)});
	} else {
		if (this.displayview!='' & type!='raw')
				displayview = type+"-node-"+this.displayview;
		else
			if (type=='raw')
				displayview = "raw-node-default";
			else
				displayview = type+"-node-default";
		try {
			html = displayHTML[displayview];
			if (html==undefined || html==""){
				alert("error: "+this.displayview+" does not exist");
				displayview = type+"-node-default";
				html = displayHTML[displayview];
			}
		}
		catch (err) {
			alert("error: "+this.displayview+" does not exist");
			displayview = type+"-node-default";
			html = displayHTML[displayview];
		}
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg)
		html = html.replace(/#content-orgclass#/g,this.displaychildorg)
		if (this.privatevalue)
		 html = html.replace(/#priv#/g,'private');
		if (nodetype=='asmUnit' || nodetype=='asmStructure')
			html = html.replace(/#first#/g,"first-node");
		
		const htmlobj = $(html);
		$(dest).append (html);
	}
	//-------------------- node style -------------------
	var style = "";
	if (this.depth>0 && type!='raw') {
		style = replaceVariable(this.getNodeStyle(uuid));
		$("#node_"+uuid).attr("style",style);
	}
	const menus_color = this.getMenuStyle();
	//-------------------- label style -------------------
	if (this.depth>1) {
		style = UIFactory.Node.getLabelStyle(uuid);
	} else {
		style = UIFactory.Node.getInParentLabelStyle(uuid);
	}
	style = replaceVariable(style);
	if (type!='raw')
		$("div[name='lbl-div']","#node_"+uuid).attr("style",style);
	//-------------------- content style -------------------
	if (type!='model' && type!='raw') {
		style = replaceVariable(this.getContentStyle(uuid));
		$("div[name='cnt-div']","#node_"+uuid).attr("style",style);
	}
	//-------------------- collapsible -------------------
	if (this.collapsible=='Y') {
		$("#collapsible_"+uuid).show();
		$("#collapsible_"+uuid).html("<span id='toggleContent_"+uuid+"' class='button' style='"+menus_color+"'></span>");
		$("#collapsible_"+uuid).attr("onclick","javascript:toggleContent('"+uuid+"')");
		if (this.collapsed=='Y') {
			$("#toggleContent_"+uuid).attr("class","fas fa-plus");
			$("#content-"+uuid).hide();
		}
		else {
			$("#toggleContent_"+uuid).attr("class","fas fa-minus");
			$("#content-"+uuid).show();
		}
	} else
		$("#collapsible_"+uuid).hide();
	//-------------- label --------------------------
	var gotView = false;
	var label_html = ""
	if (this.semantictag.indexOf("bubble_level1")>-1){
		label_html += " "+UICom.structure.ui[uuid].getBubbleView('std_node_'+uuid);
		gotView = true;
	}
	if (!gotView)
		label_html += " "+ this.getView('std_node_'+uuid);
	$("#label_node_"+uuid).html(label_html);
	//--------- chckbox comment in report/batch--------------
	var html_chckbox = "<span class='chkbox-comments x"+this.semantictag+" '>&nbsp;<input ";
	if (this.semantictag.indexOf('comments')>-1)
		html_chckbox += "checked=true";
	html_chckbox += " type='checkbox' onchange=\"UIFactory.Node.toggleComment('"+uuid+"',this)\">&nbsp;"+karutaStr[LANG]['report-elt-disabled']+"<span>";
	$("div[class='title']","#label_node_"+uuid).append(html_chckbox);
	//-------------- buttons & menus --------------------------
	if (edit) {
		if (this.semantictag.indexOf("bubble_level1")>-1)
			this.menu = false;
		var buttons = this.getButtons(null,null,null,null,depth);  //getButtons = function(dest,type,langcode,inline,depth,edit,menu,inblock)
		if (nodetype == "BatchForm") {
			buttons += node.structured_resource.getButtons();
		}
		//------------- print button -------------------
		if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || this.printroles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				buttons += "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		if (buttons!="")
			buttons = "<div class='btn-group'>"+buttons+"</div><!-- class='btn-group' -->"
		$("#buttons-"+uuid).html(buttons);
		//-------------- menus ---------------
		if (this.menu || USER.admin || g_userroles[0]=='administrator')
			this.displayMenus("#menus-"+uuid,langcode);
	} else {
		//------------- print button -------------------
		if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1|| this.printroles.indexOf("all")>-1  || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
			var buttons = "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			$("#buttons-"+uuid).html(buttons);
		}
	}
	//----------------delete control on proxy parent ------------
	if (edit && proxies_delete[uuid]!=undefined && proxies_delete[uuid].containsArrayElt(g_userroles)) {
		var html = deleteButton(proxies_nodeid[uuid],"asmContext",undefined,undefined,"UIFactory.Node.reloadUnit","null","null","this");
		$("#buttons-"+uuid).html(html);
	}
	//----------- Comments -----------
	if (this.depth>0) {
		if (this.edit && this.inline && this.writenode)
			UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure.ui[uuid]);
		else
			UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure.ui[uuid]);
	}
	//--------------------Metadata Info------------------------------------------
	if (g_userroles[0]=='designer' || USER.admin) {  
		this.displayMetainfo("metainfo_"+uuid);
		this.displayMetaEpmInfo("cssinfo_"+uuid);
	}
	//----------------- hide lbl-div if empty ------------------------------------
	if (this.getLabel(null,'none',langcode)=="" && this.getButtons()=="" && this.getMenus(langcode)=="")
		$("div[name='lbl-div']","#node_"+uuid).hide()
	return htmlobj;
}

//# sourceURL=print.js


