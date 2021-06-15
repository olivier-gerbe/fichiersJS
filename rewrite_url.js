function rewriteURL (portfoliocode) {
	if (portfoliocode.indexOf("eportfolium-com")>-1){
		history.pushState('', '', 'cooperative.htm');
	}
	if (portfoliocode.indexOf("site-karuta-project")>-1 && window.location.pathname.indexOf("index.htm")<0){
		history.pushState('', '', 'project.htm');
	}
	if (portfoliocode.indexOf("documentation-karuta")>-1 && window.location.pathname.indexOf("index.htm")<0){
		history.pushState('', '', 'documentation.htm');
	}
}