
function enregistrer_note(type,nodeid) {
	const note = $("text[lang='"+LANG+"']",UICom.structure.ui[nodeid].node).text();
	const selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",g_portfolio_current)).text();
	const login = selfcode.substring(selfcode.indexOf('portfolio-pharma-etudiant-')+26);
	const prenom = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom-etudiant'])",g_portfolio_current)).text();
	const nom = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='nom-famille-etudiant'])",g_portfolio_current)).text();
	deleteVector('pharma-notes',login,null,null,type);
	saveVector('pharma-notes',login,prenom,nom,type,note);
}

function htmlNotes(login,destid) {
	const result = searchVector('pharma-notes',login);
	const vectors = $("vector",result);
	let notes = [0,0,0,0,0];
	for (let i=0;i<vectors.length;i++){
		const type =  $("a5",vectors[0]).text();
		const note =  $("a6",vectors[0]).text();
		switch (type) {
		case "Q9" : notes[0] = note; break;
		case "CO" : notes[1] = note; break;
		case "PO" : notes[2] = note; break;
		case "CH" : notes[3] = note; break;
		case "PH" : notes[4] = note; break;
		}
	}
	let html = "";
	for (let i=0;i<5;i++){
			html += "<td>"+notes[i]+"</td>";
	}
	$("#"+destid).append($(html));
}
//# sourceURL=pharma-vector.js