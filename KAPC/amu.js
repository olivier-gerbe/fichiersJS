
function userExists(identifier) {
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


//# sourceURL=amu.js