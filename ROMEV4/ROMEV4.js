
/* =======================================================
	Copyright 2024 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */


karutaStr["fr"]['Get_ROMEV4'] = "Get_ROMEV4";
karutaStr["en"]['Get_ROMEV4'] = "Get_ROMEV4";
karutaStr['fr']['queryGet_ROMEV4']="Recherche <br/><span style='font-size:smaller'><i>ROMEV4</i>.tag_sémantique.<i>label</i><br></span>";

plugin_resources[plugin_resources.length] = {location:'karuta-configuration.configuration-tech',tag:'ROMEV4',label:'ROMEV4'};

menuElts ["import_get_romev4_multiple"]= "<import_get_romev4_multiple del='y'><boxlabel></boxlabel><unique>true</unique><search><foliocode/><semtag/><object/></search><g_actions><nop/></g_actions></import_get_romev4_multiple>";
menuElts ["import_get_get_romev4_multiple"]= "<import_get_get_romev4_multiple del='y'><boxlabel></boxlabel><unique>true</unique><parent><position/><semtag/></parent><gg_search><nop/></gg_search><gg_actions><nop/></gg_actions></import_get_get_romev4_multiple>";

menuItems['item'].push('import_get_get_romev4_multiple');

//# sourceURL=ROMEV4.js

var access_token = null;

function getToken() {
	const idclient = "PAR_karuta_53daa114db1e33b704b64ea935cc71060497b70cfdcf3f1c90fece0939ba5a49";
	const clientsecret = "08ce1de786ae1551fc79a52d462fd2c6d64f706acfbe1f3d39c2fd23cc88b996"
	const url = "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=partenaire";
	const data = "grant_type=client_credentials&client_id="+idclient + "&client_secret=" + clientsecret + "&scope=api_rome-metiersv1 api_rome-fiches-metiersv1 nomenclatureRome api_rome-competencesv1"
	$.ajax({
		async : false,
		type : "POST",
		url : url,
		data:data,
		crossDomain: true,
		contentType: 'application/x-www-form-urlencoded',
		success : function(data) {
			access_token = data.access_token;
			alert(access_token)
		},
		error : function(data) {
				alert("Erreur");
		}
	});
}

function getMetiers() {
	const url = "https://api.francetravail.io/partenaire/rome-metiers/v1/metiers/metier";
	const authorization = "Bearer " + access_token;
	alert (authorization);
	$.ajax({
		async : false,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", authorization);
		},
		type : "GET",
		dataType : "json",
		url : url,
		success : function(data) {
			alert("OK"+data);
		},
		error : function(data) {
				alert("Erreur"+data);
		}
	});
}

function getCompetences() {
	const url = "https://api.francetravail.io/partenaire/rome-competences/v1/competences/competence";
	const authorization = "Bearer " + access_token;
	$.ajax({
		async : false,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", authorization);
		},
		type : "GET",
		dataType : "json",
		url : url,
		success : function(data) {
			alert("OK"+data);
		},
		error : function(data) {
				alert("Erreur"+data);
		}
	});
}

function getCompetencesMetier(code) {
	const url = "https://api.francetravail.io/partenaire/rome-metiers/v1/metiers/metier/"+code;
	const authorization = "Bearer " + access_token;
	$.ajax({
		async : false,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", authorization);
		},
		type : "GET",
		dataType : "json",
		url : url,
		success : function(data) {
			alert("OK"+data);
		},
		error : function(data) {
				alert("Erreur"+data);
		}
	});
}


function getFichesMetier() {
	const url = "https://api.francetravail.io/partenaire/rome-fiches-metiers/v1/fiches-rome/fiche-metier";
	const authorization = "Bearer " + access_token;
	alert(authorization);
	$.ajax({
		async : false,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", authorization);
		},
		type : "GET",
		dataType : "json",
		url : url,
		success : function(data) {
			alert("OK"+data);
		},
		error : function(data) {
				alert("Erreur"+data);
		}
	});
}

function getFicheMetier(code) {
	const url = "https://api.francetravail.io/partenaire/rome-fiches-metiers/v1/fiches-rome/fiche-metier/"+code;
	const authorization = "Bearer " + access_token;
	$.ajax({
		async : false,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", authorization);
		},
		type : "GET",
		dataType : "json",
		url : url,
		success : function(data) {
			alert("OK"+data);
		},
		error : function(data) {
				alert("Erreur"+data);
		}
	});
}