

//==============================
function test_login_password(login,pwd)
//==============================
{
	if (login == pwd) {
		$.ajax({
			async: false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/credential",
			data: "",
			success : function(data) {
				USER = new UIFactory["User"]($("user",data));
				UIFactory.User.callChangePassword();
				document.getElementById('password').value = '';
			}
		})
	}
}

//# sourceURL=test_login_password.js