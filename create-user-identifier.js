function createUserIdentifier() {
	const firstname = replaceBatchVariable("###firstname###");
	const lastname = replaceBatchVariable("###lastname###");
	let prefix = strNoAccent(firstname.substring(0,1)+firstname.substring(firstname.length-1)+lastname.substring(0,1)+lastname.substring(lastname.length-1)).toLowerCase();
	let ok1 = true;
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users?username="+prefix,
		success : function(data) {
			var items = $("user",data);
			if (items.length>0) {
				for (i=0;i<items.length;i++) {
					const id = $('username',items[i]).text();
					const prenom = $('firstname',items[i]).text();
					const nom = $('lastname',items[i]).text();
					const courriel = $('email',items[i]).text();
					let ok3 = confirm(id+' - '+prenom+' '+nom+' '+courriel+ ' existe. Est-ce celui-ci?');
					if (ok3){
						ok1 = false;
						g_variables["identifiantApprenti"] = id;
						break;
					}
				}
			}
		}
	});
	if (ok1) {
		let number = null;
		let ok2 = false;
		while (!ok2) {
			number = (Math.floor(Math.random() * 10000)).toString();
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/users?username="+prefix+number,
				success : function(data) {
					var items = $("user",data);
					if (items.length==0) {
						g_variables["userIdentifier"] = prefix+number;
						ok2 = true;
					}
				}
			});
		}
	}
	alert("Identifiant de l'apprenti : "+g_variables["identifiantApprenti"]);
	return true;
}

function strNoAccent(a) {
  return a.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

//# sourceURL=create-user-identifier.js