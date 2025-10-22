
//------ EXEC BATCH AT USER CREATION ------------------
g_execbatch = true;
var g_execbatchbuttonlabel1 = {};
	g_execbatchbuttonlabel1['fr'] = "Patience! Accès au forum ...";
	g_execbatchbuttonlabel1['en'] = "Wait! Access to the forum ...";
var g_json = {};

//=======================
function prepareBatch()
//=======================
{
	// ---- variables globales ---------
	g_json['model_code'] = "groupe-discussion.batch-auto-create";
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
