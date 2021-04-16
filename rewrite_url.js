function rewriteURL (portfoliocode) {
	if (portfoliocode.indexOf("eportfolium-com")>-1 && window.location.pathname.indexOf("index.htm")<0){
		history.pushState('', '', '../../index.htm');
	}
	if (portfoliocode.indexOf("site-karuta-project")>-1 && window.location.pathname.indexOf("index.htm")<0){
		history.pushState('', '', '../../index.htm');
	}
	if (portfoliocode.indexOf("documentation-karuta")>-1 && window.location.pathname.indexOf("index.htm")<0){
		history.pushState('', '', '../../index.htm');
	}
}