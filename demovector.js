
function envoyerMessage() {
	const pageid = $("#page").attr('uuid');
	const envoyeur = USER.username;
	const recepteur = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='recepteur'])",UICom.structure.ui[pageid].node)).text();
	const message = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='message'])",UICom.structure.ui[pageid].node)).text();
	const dateEnvoi = new Date().getTime();
	const d = recepteur;
	const w = null;
	const r = recepteur;
	saveVector(envoyeur,recepteur,message,dateEnvoi,null,null,null,null,null,null,d,w,r);
}

function chercherMessages(recepteur) {
	const search = $("vector",searchVector(null,recepteur));
	return search;
}

function afficherMessages(destid,a1,a2,a3,a4) {
	const date = new Date(parseInt(a4));
	let html = "<hr/><div class='message'>";
	html += "<div class='envoyeur'>Envoyeur :" + a1 + "</div>";
	html += "<div class='date'>Date :" + date.toLocaleString() + "</div>";
	html += "<div class='contenu'>" + a3 + "</div>";
	html += "<button onclick=\"supprimerMessage('"+a2+"','"+a4+"')\">supprimer</button>";
	html += "</div>";
	$("#"+destid).append(html);
}

function supprimerMessage(recepteur,date) {
	deleteVector(null,recepteur,null,date);
	UIFactory.Node.reloadUnit();
}
//# sourceURL=demovector.js