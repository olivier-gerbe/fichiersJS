
//==================================
function userExists(identifier) {
//==================================
	const url = serverBCK_API+"/users/user/username/"+identifier;
	let ok ="";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			ok = true;
		},
		error : function(data) {
			ok = false;
		}
	});
	return ok;
}

//==================================
function portfolioExists(searchvalue) {
//==================================
	const url = serverBCK_API+"/portfolios?active=1&search="+searchvalue;
	let ok = "";
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			const items = $("portfolio",data);
			for ( let i = 0; i < items.length; i++) {
				const code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
				ok = code.indexOf(searchvalue)>-1;
				if (ok)
					break;
			}
		}
	});
	return ok
}


//# sourceURL=amu.js