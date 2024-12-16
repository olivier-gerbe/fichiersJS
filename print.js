function displayForPrintNode(uuid) {
	$('#wait-window').modal('show');
	setTimeout(execdisplay(uuid),1000);
	
}

function execdisplay(uuid) {
	alert('La construction de la vue peut prendre plusieurs minutes. Patience...');
	displayPage(uuid,100,'standard','0',false,true);
	$('#wait-window').modal('hide');
}

function dXisplayForPrintNode(uuid) {
	//---------------------
	var printbackdrop = document.createElement("DIV");
	printbackdrop.setAttribute("class", "preview-backdrop");
	printbackdrop.setAttribute("id", "printbackdrop-"+uuid);
	$('body').append(printbackdrop);
	//-----------------------------
	var printwindow = document.createElement("DIV");
	printwindow.setAttribute("id", "print-"+uuid);
	printwindow.setAttribute("class", "preview-window print-portfolio-window");
	printwindow.setAttribute("print-uuid", uuid);
	printwindow.setAttribute("print-edit", false);
	printwindow.innerHTML = printBox(uuid);
	$('body').append(printwindow);
	//$("#print-window-"+uuid).hide();
	$("#print-window-body-"+uuid).html("");
	
	let header ="";
	header += "<button class='btn add-button' style='float:right' onclick=\"printPage('print-window-body-"+uuid+"')\">"+karutaStr[LANG]['button-print']+"</button>";
	header += "<button class='btn add-button' style='float:right' onclick=\"$('#print-"+uuid+"').remove();$('#printbackdrop-"+uuid+"').remove();\">"+karutaStr[LANG]['Close']+"</button>";
	$("#print-window-header-"+uuid).html(header);

	//-----------------------------
	UICom.structure.ui[uuid].displayPrintingNode('standard',UICom.structure.tree[uuid],"print-window-body-"+uuid,500,LANGCODE,false);
	//-----------------------------	
	$("#print-window-"+uuid).show();
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
	this.setMetadata(dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock);
	//---------------------------------------
	if (this.visible && this.langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && testIfDisplay(uuid)) {
		var node = UICom.structure.ui[uuid];
		var structure_node =   node.resource==null 
							|| node.resource.type!='Proxy' 
							|| (node.resource.type=='Proxy' && this.writenode && this.editresroles.containsArrayElt(g_userroles)) 
							|| (g_userroles[0]=='designer' || USER.admin);
		if (structure_node) {
			if (g_designerrole)  // in designer mode depending the role played the node may be not readable
				readnode = (g_userroles[0]=='designer' 
							|| this.seenoderoles.indexOf(USER.username_node.text())>-1 || this.seenoderoles.indexOf(g_userroles[0])>-1 || (this.showtoroles.indexOf(g_userroles[0])>-1 && !this.privatevalue) || (this.showtoroles.indexOf(USER.username_node.text())>-1 && !this.privatevalue) || this.seenoderoles.indexOf('all')>-1)? true : false;
			if( this.depth < 0 || !readnode) return;
			//============================== ASMCONTEXT =============================
			if (this.nodetype == "asmContext" || (this.structured_resource != null && type!='raw' && this.semantictag!='EuropassL')){
				alreadyDisplayed = true;
				this.displayPrintAsmContext(dest,type,langcode,edit,refresh,depth);
			}
			//============================== NODE ===================================
			else { // other than asmContext
				this.displayPrintAsmNode(dest,type,langcode,edit,refresh,depth);
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
			if (this.semantictag.indexOf("tabs-section")>-1){
				alreadyDisplayed = true;
//				$("#"+dest).append ("<div id='print_content-"+uuid+"'/>");
				for( let i=0; i<root.children.length; ++i ) {
					// Recurse
					let child = UICom.structure.tree[root.children[i]];
					let childnode = UICom.structure.ui[root.children[i]];
					childnode.displayPrintingNode(type,child,'print_content-'+uuid, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
				}
			}
			//------------ Default  -----------------
			if (!alreadyDisplayed) {
				for( var i=0; i<root.children.length; ++i ) {
					// Recurse
					let child = UICom.structure.tree[root.children[i]];
					let childnode = UICom.structure.ui[root.children[i]];
					childnode.displayPrintingNode(type,child,'print_content-'+uuid, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
				}
			}
			//-------------------------------------------------------
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
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
		html = html.replace(/label_node_/g,'label_print_node_').replace(/resource_/g,'print_resource_').replace(/comments_/g,'print_comments_');
		if (this.privatevalue)
		 html = html.replace(/#priv#/g,'private');
		//-------------------- display ----------------------
		$("#"+dest).append (html);
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
		if (this.structured_resource != null && type!='raw')
			this.structured_resource.displayView("print_resource_"+uuid,null,langcode);
		else
			this.resource.displayView("print_resource_"+uuid);
		//---------------- display label ---------------------------------
		$("#label_print_node_"+uuid).html(this.getView('label_node_'+uuid));
		//----------------------- if compact view -----------------------------
		if (displayview=='standard-resource-compact')
			showHideCompactEditElts(uuid);
		//----------------- hide lbl-div if empty ------------------------------------
		if (this.getLabel(null,'none',langcode)=="" && this.getButtons(langcode)=="" && this.getMenus(langcode)=="")
			if (this.displayview=='xwide' || this.displayview.indexOf("/12")>-1)
				$("div[name='res-lbl-div']","#node_"+uuid).hide();
		//----------- Comments -----------
		UIFactory.Node.displayComments('print_comments_'+uuid,UICom.structure.ui[uuid]);
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
	html = html.replace(/label_node_/g,'label_print_node_').replace(/content-/g,'print_content-').replace(/comments_/g,'print_comments_');
	if (this.privatevalue)
	 html = html.replace(/#priv#/g,'private');
	if (nodetype=='asmUnit' || nodetype=='asmStructure')
		html = html.replace(/#first#/g,"first-node");
	
	htmlobj = $(html);
	$("#"+dest).append (html);
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
	//-------------- label --------------------------
	var gotView = false;
	var label_html = ""
	if (this.semantictag.indexOf("bubble_level1")>-1){
		label_html += " "+UICom.structure.ui[uuid].getBubbleView('std_node_'+uuid);
		gotView = true;
	}
	if (!gotView)
		label_html += " "+ this.getView('std_node_'+uuid);
	$("#label_print_node_"+uuid).html(label_html);
	//----------- Comments -----------
	UIFactory["Node"].displayComments('print_comments_'+uuid,UICom.structure.ui[uuid]);
	//----------------- hide lbl-div if empty ------------------------------------
	if (this.getLabel(null,'none',langcode)=="" && this.getButtons()=="" && this.getMenus(langcode)=="")
		$("div[name='lbl-div']","#node_"+uuid).hide()
}

//==============================
function printBox(id)
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Print box ==================== -->";
	html += "\n<div id='print-window-"+id+"'>";
	html += "\n		<div class=''>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div id='print-window-header-"+id+"' class='modal-footer' >";
	html += "\n				</div>";
	html += "\n				<div id='print-window-body-"+id+"' class=''>";
	html += "\n				</div>";
	html += "\n				<div id='print-window-footer-"+id+"' class='modal-footer' >";
	html += "\n				</div>";
	html += "\n			</div>";
	html += "\n		</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}

function printPage(id){
	var printContent = document.getElementById(id).innerHTML;
	var originalContent = document.body.innerHTML;
	document.body.innerHTML = printContent;
	window.print();
	document.body.innerHTML = originalContent;
}
//# sourceURL=print.js


