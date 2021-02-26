
//------ EXEC BATCH AT USER CREATION ------------------
g_execbatch = true;
var g_execbatchbuttonlabel1 = {};
	g_execbatchbuttonlabel1['fr'] = "Patience! Création de votre portfolio ...";
	g_execbatchbuttonlabel1['en'] = "Wait! Portfolio Creation ...";
var g_json = {};

//=======================
function prepareBatch()
//=======================
{
	var today = new Date();
	var annee = today.getFullYear();
	var mois = today.getMonth() + 1;
	if (mois < 10)
		mois = "0" + mois;
	// ---- variables globales ---------
	g_json['model_code'] = "KAPC-OG.autocreate-portfolio-etudiant";
	g_json['session'] = annee + "-" + mois;
	// ---- variables locales ---------
	g_json['lines'] = [];
	g_json.lines[0] =
	{
		"identifiant" : USER.username,
		"courriel" : USER.email,
		"prenom" : USER.lastname,
		"nom" : USER.firstname,
	};
}//----------------------------------------------------
