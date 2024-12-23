
//------ EXEC BATCH AT USER CREATION ------------------
g_execbatch = true;
var g_execbatchbuttonlabel1 = {};
	g_execbatchbuttonlabel1['fr'] = "Patience! Préparation de votre portfolio ...";
	g_execbatchbuttonlabel1['en'] = "Wait! Portfolio Creation ...";
var g_json = {};

//=======================
function prepareBatch()
//=======================
{
	var today = new Date();
	var annee = today.getFullYear();
	var mois = today.getMonth() + 1;
	var session = ""
	if (mois >6)
		session = "@"+annee+ "-" + (annee+1);
	else
		session = "@"+(annee-1)+ "-" + annee;
	// ---- variables globales ---------
	g_json['model_code'] = "epf.batch-creation-formulaire";
	g_json['session'] = session;
	// ---- variables locales ---------
	g_json['lines'] = [];
	g_json.lines[0] =
	{
		"studentUsername" : USER.username,
		"studentEmail" : USER.email,
		"studentLastName" : USER.lastname,
		"studentFirstName" : USER.firstname,
	};
}//----------------------------------------------------
