/******************************************************
 *					MEDECINE
 ******************************************************/

/* l'utilisateur n'a pas besoin d'avoir les droits d'édition */
/* sur le code de l'élément pour utiliser cette fonction     */
function setNodeCodewDate(nodeid) {
	const code = new Date().getTime()+"@";
	$(UICom.structure.ui[nodeid].code_node).text(code);
	UICom.structure.ui[nodeid].save();
}

//==================================
function existChild(nodeid,semtag)
//==================================
{
	let exist = false;
	const child =  $("*:has(>metadata[semantictag*='"+semtag+"'])",UICom.structure.ui[nodeid].node);
	if (child.length>0)
		exist = true;
	return exist;
}

//==================================
function concatLibelle(nodeid,str)
//==================================
{
	const label = UICom.structure.ui[nodeid].getLabel(null,'none');
	$(UICom.structure.ui[nodeid].label_node[LANGCODE]).text(label + " " + str);
	UICom.structure.ui[nodeid].save();
}

//==================================
function concatCode(nodeid,str)
//==================================
{
	const label = UICom.structure.ui[nodeid].getCode();
	$(UICom.structure.ui[nodeid].code_node).text(label + " " + str);
	UICom.structure.ui[nodeid].save();
}

//==================== Validation des actes pro ========

//==================================
function valider(nodeid)
//==================================
{
	const valide_par =  $("*:has(>metadata[semantictag*='valide-par'])",UICom.structure.ui[nodeid].node)[0];
	const valide_parid = $(valide_par).attr("id");
	$(UICom.structure.ui[valide_parid].resource.text_node[LANGCODE]).text(USER.firstname+" "+USER.lastname);
	UICom.structure.ui[valide_parid].resource.save();
	submit(nodeid,true);
}

//==================================
function confirmSoumettreActes(nodeid,type)
//==================================
{
	document.getElementById('delete-window-body').innerHTML = "Validation de tous les actes de la rubrique. Cette action est irréversible.<br> Voulez-vous valider ?";
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"$('#delete-window').modal('hide');soumettreActes('"+nodeid+"','"+type+"')\">Valider</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons; //--------- ATTENTION OLIVIER' : J'AI AJOUTÉ +","+type MAIS JE NE SAIS PAS 
	$('#delete-window').modal('show');                                   //--------- CE QUI VA ARRIVER EN MÉDECINE (type N'EXISTE PAS DANS LES PARAS)
}

//==================================
function soumettreActes(nodeid,type)
//==================================
{
	//---------------
	let semtag = 'acte-professionnel-medecine';
	if (type=='h-pharma')
		semtag = 'acte-pro-Q10-hopital';
	if (type=='o-pharma')
		semtag = 'acte-pro-Q10-officine';
	//---------------
	let actes = $("*:has(>metadata[semantictag*='"+semtag+"'])",UICom.structure.ui[nodeid].node);
	for (var i=0;i<actes.length;i++){
		const acteid = $(actes[i]).attr("id");
		if (UICom.structure.ui[acteid].submitted==undefined)
			UICom.structure.ui[acteid].setMetadata();
		if (UICom.structure.ui[acteid].submitted!="Y")
			valider(acteid);
	}
}

//==================== Délégation ====================

//==================================
function appel_deleguer ()
//==================================
{
	$("#wait-window").modal('show');
	setTimeout(ajouterdelegation,0);
}

//==================================
function ajouterdelegation ()
//==================================
{
	//---------------
	let portfoliosemtag = 'portfolio-med-etudiant';
	//---------------
	const identifierid = $("*:has(>metadata[semantictag*=courriel-delegue])",g_portfolio_current).attr("id");
	const identifier = UICom.structure.ui[identifierid].resource.getCode().substring(1);
	const portfolios = $("*:has(>metadata[semantictag*='"+portfoliosemtag+"'])",g_portfolio_current);	
	const rolestages = $("*:has(>metadata[semantictag*=role-delegue])",g_portfolio_current);
	const rolestageid = $(rolestages[0]).attr("id");
	const rolestage =  UICom.structure.ui[rolestageid].resource.getCode().substring(1);
	// --- userid ---
	var userid = "";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : serverBCK_API+"/users/user/username/"+identifier,
		success : function(data) {
			userid = data;
		}
	});
	if (userid!="") {
		// --- partage des portfolios ----
		const xml = "<users><user id='"+userid+"'/></users>";
		for (let i=0; i<portfolios.length; i++) {
			const id = $(portfolios[i]).attr('id');
			const code = UICom.structure.ui[id].resource.getCode().substring(1);
			const portfolioid = UIFactory.Portfolio.getid_bycode(code) 
			//---- get role groupid ----------
			var groupid = "";
			// -- partage --
			$.ajax({
				async : false,
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+rolestage,
				success : function(data) {
					groupid = data;
					//---- share tree --------------
					var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
					$.ajax({
						async : false,
						type : "POST",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : xml,
						success : function(data) {
						},
						error : function(data) {
						}
					});
				}
			});
		}
		//-------- ajout role-stage dans portfolio dèlègué ---
		const srce = replaceVariable("##dossier-delegues-medecine##.portfolio-med-delegue-"+identifier);
		const referentiel = replaceVariable("##dossier-modeles-medecine##.referentiel-medecine");
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + srce + "&semtag=ss-stages",
			success : function(data) {
				const results =$("node",data);
				const destid = $(results[0]).attr("id");
				$.ajax({
					async : false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/nodes?portfoliocode="+srce+"&semtag=role-stage",
					success : function(data) {
						const nodes =$("node",data);
						let present = false;
						for (let j=0;j<nodes.length;j++){
							if ($("code",$("asmResource[xsi_type='Item']",nodes[j])).text()=="@"+rolestage) {
								present = true;
								break;
							}
						}
						if (!present) { // le rôle n'est pas déjà là'
							$.ajax({
								async : false,
								type : "GET",
								dataType : "xml",
								url : serverBCK_API+"/nodes?portfoliocode="+referentiel+"&semtag=role-stage",
								success : function(data) {
									const nodes =$("node",data);
									let srceid ="";
									for (let i=0;i<nodes.length;i++){
										if ($("code",nodes[i]).text()=="@"+rolestage) {
											srceid = $(nodes[i]).attr("id");
											break;
										}
									}
									$.ajax({
										type : "POST",
										dataType : "text",
										url : serverBCK_API+"/nodes/node/import/"+destid+"?uuid="+srceid,
										data : "",
										success :{
										},
										error : function(jqxhr,textStatus) {
										}
									})
								},
								error : function(data) {
								}
							});
						}
					},
					error : function(data) {
					}
				});
			},
			error : function(data) {
			}
		});
		//----------------------------------------------
		if (portfolios.length>0){
			if (portfolios.length>1)
				alert("Les portfolios ont été partagés.");
			else
				alert("Le portfolio a été partagé.");
		} else {
			alert("Aucun portfolio à partager.");
		}

	} else {
		alert("Sélectionnez un utilisateur.");
	}
	reloadPage();
	$("#wait-window").modal('hide');
}


//==================================
function appel_supprimerdelegation (type)
//==================================
{
	$("#wait-window").modal('show');
	setTimeout(supprimerdelegation,0,type);
}

//==================================
function supprimerdelegation (type)
//==================================
{
	//---------------
	let portfoliosemtag = 'portfolio-med-etudiant';
	let rolevalidateur = 'validateur-ap';
	if (type!=null && type=='h-pharma') {
		portfoliosemtag = 'portfolio-pharma-etudiant';
		rolevalidateur = 'validateurXX';
	}
	//---------------
	const identifierid = $("*:has(>metadata[semantictag*=courriel-delegue])",g_portfolio_current).attr("id");
	const identifier = email = UICom.structure.ui[identifierid].resource.getCode().substring(1);
	let rolestages = $("*:has(>metadata[semantictag*=role-delegue])",g_portfolio_current);
	const portfolios = $("*:has(>metadata[semantictag*='"+portfoliosemtag+"'])",g_portfolio_current);	
	// --- userid ---
	var userid = "";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : serverBCK_API+"/users/user/username/"+identifier,
		success : function(data) {
			userid = data;
		}
	});
	if (userid!="") {
		// --- départage des portfolios ----
		for (let i=0; i<portfolios.length; i++) {
			const id = $(portfolios[i]).attr('id');
			const code = UICom.structure.ui[id].resource.getCode().substring(1);
			const portfolioid = UIFactory.Portfolio.getid_bycode(code) 
			for (let j=0;j<rolestages.length;j++){
				let rolestage = "";
				if (type!=null && type.indexOf('enseignant-Q')>-1) {
					rolestage = rolestages[i];
				} else {
					const rolestageid = $(rolestages[j]).attr("id");
					rolestage =  UICom.structure.ui[rolestageid].resource.getCode().substring(1);
				}
				let groupid = "";
				$.ajax({
					async : true,
					type : "GET",
					contentType: "text/html",
					dataType : "text",
					url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+rolestage,
					success : function(data) {
						groupid = data;
						//---- unshare tree --------------
						var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
						$.ajax({
							async : false,
							type : "DELETE",
							contentType: "application/xml",
							dataType : "xml",
							url : url,
							data : "",
							success : function(data) {
							},
							error : function(data) {
							}
						});
					}
				});
			}
		}
		if (portfolios.length>0){
			if (portfolios.length>1)
				alert("Les portfolios ont été départagés.");
			else
				alert("Le portfolio a été départagé.");
		} else {
			alert("Aucun portfolio à départager.");
		}
	} else {
		alert("Sélectionnez un utilisateur.");
	}
	reloadPage();
	$("#wait-window").modal('hide');
}

//==================================
function supprimerdeleguer (type)
//==================================
{
	//---------------
	let portfoliosemtag = 'portfolio-med-etudiant';
	let rolevalidateur = 'validateur-ap';
	if (type!=null && type=='h-pharma') {
		portfoliosemtag = 'portfolio-pharma-etudiant';
		rolevalidateur = 'validateurXX';
	}
	//---------------
	const identifierid = $("*:has(>metadata[semantictag*=courriel-delegue])",g_portfolio_current).attr("id");
	const identifier = email = UICom.structure.ui[identifierid].resource.getCode().substring(1);
	const rolestageid = $("*:has(>metadata[semantictag*=role-stage])",g_portfolio_current).attr("id");
	const rolestage =  UICom.structure.ui[rolestageid].resource.getCode().substring(1);
	const portfolios = $("*:has(>metadata[semantictag*='"+portfoliosemtag+"'])",g_portfolio_current);	
	// --- userid ---
	var userid = "";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : serverBCK_API+"/users/user/username/"+identifier,
		success : function(data) {
			userid = data;
		}
	});
	// --- départage des portfolios ----
	for (let i=0; i<portfolios.length; i++) {
		const id = $(portfolios[i]).attr('id');
		const code = UICom.structure.ui[id].resource.getCode().substring(1);
		const portfolioid = UIFactory.Portfolio.getid_bycode(code) 
		//---- get role groupid ----------
		var groupid = "";
		$.ajax({
			async : false,
			type : "GET",
			contentType: "text/html",
			dataType : "text",
			url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+rolevalidateur,
			success : function(data) {
				groupid = data;
				//---- unshare tree --------------
				var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
				$.ajax({
					async : false,
					type : "DELETE",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : "",
					success : function(data) {
					},
					error : function(data) {
					}
				});
			}
		});
		$.ajax({
			async : false,
			type : "GET",
			contentType: "text/html",
			dataType : "text",
			url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+rolestage,
			success : function(data) {
				groupid = data;
				//---- unshare tree --------------
				var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
				$.ajax({
					async : false,
					type : "DELETE",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : "",
					success : function(data) {
					},
					error : function(data) {
					}
				});
			}
		});

	}
}


//============================== Création compte ====================

//==================================
function testuseringrouplabel(userid,groupid)
//==================================
{
	let result = false;
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+groupid,
		data: "",
		success : function(data) {
			var items = $("user",data);
			for ( var i = 0; i < items.length; i++) {
				if ($(items[i]).attr('id')==userid)
					result = true;
			}
		},
		error : function(jqxhr) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
	return result;
}

//==================================
function testportfolioingrouplabel(portfolioid,groupid)
//==================================
{
	let result = false;
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?group="+groupid,
		data: "",
		success : function(data) {
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				if ($(items[i]).attr('id')==portfolioid)
					result = true;
			}
		},
		error : function(jqxhr) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
	return result;
}


//==================================
function creerCompte(type)
//==================================
{
	let identifier = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='id-user'])",g_portfolio_current)).text();
	const email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='email-user'])",g_portfolio_current)).text();
	const firstname = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='firstname-user'])",g_portfolio_current)).text();
	const lastname = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='lastname-user'])",g_portfolio_current)).text();
	if (identifier.length==0 || identifier=="")
		identifier = email;
//---------------
	let template = "modeles-medecine.modele-portfolio-ms-delegue";
	let code = "portfolios-medecine-delegues.portfolio-med-delegue-"+identifier;
	let usergrouplabel = "Medecine-delegues-"+USER.id;
	let foliogrouplabel = "Medecine-delegues-"+USER.id;
	// --- userid ---
	var userid = "";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : serverBCK_API+"/users/user/username/"+identifier,
		success : function(data) {
			userid = data;
		}
	});
	if (userid!= "") {
		alert ("L'utilisateur a déjà un compte.");
	} else { // l'utilisateur n'existe pas
		// création utilisateur
		let xml = "";
		xml +="<?xml version='1.0' encoding='UTF-8'?>";
		xml +="<users>";
		xml +="<user>";
		xml +="	<username>"+identifier+"</username>";
		xml +="	<lastname>"+lastname+"</lastname>";
		xml +="	<firstname>"+firstname+"</firstname>";
		xml +="	<email>"+email+"</email>";
		xml +="	<password>"+email+"</password>";
		xml +="	<active>1</active>";
		xml +="	<other>xlimited ms</other>";
		xml +="	<admin>0</admin>";
		xml +="	<designer>0</designer>";
		xml +="	<sharer>0</sharer>";
		xml +="</user>";
		xml +="</users>";
		$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : serverBCK_API+"/users",
			data : xml,
			success : function(data) {
				alert("Le compte a été créé et le mot de passe temporaire est le courriel : "+email);
			}
		});
	}
	//----------------------------
	var evalportfolioid = "";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/" + code,
		success : function(data) {
			const result = $("portfolio", data);
			evalportfolioid = $(result).attr('id');
		},
		error : function(data) {
			// --- création portfolio ---
			const label = "Portfolio de " + firstname + " " + lastname;
			$.ajax({
				async : false,
				type : "POST",
				contentType: "application/xml",
				dataType : "text",
				url : serverBCK_API+"/portfolios/instanciate/null?sourcecode="+template+"&targetcode="+code+"&owner=true",
				data : "",
				success : function(data) {
					evalportfolioid = data;
					//----- update tree label -----
					$.ajax({
						async : false,
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag=root",
						success : function(data) {
							var nodeid = $("asmRoot",data).attr('id');
							let xml = "<asmResource xsi_type='nodeRes'>";
							xml += "<code>"+code+"</code>";
							for (var lan=0; lan<languages.length;lan++)
								xml += "<label lang='"+languages[lan]+"'>"+label+"</label>";
							xml += "</asmResource>";
							$.ajax({
								async : false,
								type : "PUT",
								contentType: "application/xml",
								dataType : "text",
								data : xml,
								url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
								success : function(data) {
								}
							});
						}
					});
					alert("Le portfolio du délégué a été créé.");
				}
			});
		}
	});
	// --- userid ---
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : serverBCK_API+"/users/user/username/"+identifier,
		success : function(data) {
			userid = data;
		}
	});
	// --- partage portfolio évaluateur ---
	const xml2 = "<users><user id='"+userid+"'/></users>";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "text/html",
		dataType : "text",
		url : serverBCK_API+"/rolerightsgroups?portfolio="+evalportfolioid+"&role=maitre-stage",
		success : function(data) {
			groupid = data;
			//---- share tree --------------
			$.ajax({
				async : false,
				type : "POST",
				contentType: "application/xml",
				dataType : "xml",
				url : serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users",
				data : xml2,
				success : function(data) {
				},
				error : function(data) {
				}
			});
		}
	});
	// --- départager portfolio évaluateur du rôle designer ---
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : serverBCK_API+"/users/user/username/"+USER.username,
		success : function(data) {
			var user_id = data;
			//---- get role groupid ----------
			var groupid = "";
			$.ajax({
				async : false,
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : serverBCK_API+"/rolerightsgroups?portfolio="+evalportfolioid+"&role=designer",
				success : function(data) {
					groupid = data;
					//---- unshare tree --------------
					var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+user_id;
					$.ajax({
						async : false,
						type : "DELETE",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : "",
						success : function(data) {
						},
						error : function(data) {
						}
					});
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in unshare tree ("+g_trees[treeref].code+") - role:"+role);
		}
	});
	// --- changer owner portfolio évaluateur pour root---
	$.ajax({
		async : false,
		type : "PUT",
		dataType : "text",
		url : serverBCK_API+"/portfolios/portfolio/" + evalportfolioid + "/setOwner/1",
		success : function(data) {
		}
	});
	//---- get usergroupid ----------
	let usergroupid = "";
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/xml; charset=UTF-8",
		dataType : "text",
		url : serverBCK_API+"/usersgroups?label="+usergrouplabel,
		success : function(data) {
			// group created - mise à jour groupe utilisateur dans Bienvenue
			const node = $("asmContext:has(metadata[semantictag*='groupe-delegues'])",g_portfolio_current);
			const nodeid = $(node).attr('id');
			var resource = $("asmResource[xsi_type='Get_Resource']",node);
			$("code",resource).text(data);
			$("label[lang='"+languages[LANGCODE]+"']",resource).text(usergrouplabel);
			var data = "<asmResource xsi_type='Field'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/resources/resource/" + nodeid,
				success : function(data) {
				},
				error : function(data) {
				}
			});
		},
		error : function(data) {
			// group already created - mise à jour groupe utilisateur dans Bienvenue
			const node = $("asmContext:has(metadata[semantictag*='groupe-delegues'])",g_portfolio_current);
			const nodeid = $(node).attr('id');
			var resource = $("asmResource[xsi_type='Get_Resource']",node);
			$("code",resource).text(usergrouplabel);
			$("label[lang='"+languages[LANGCODE]+"']",resource).text(usergrouplabel);
			var data = "<asmResource xsi_type='Field'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/resources/resource/" + nodeid,
				success : function(data) {
				},
				error : function(data) {
				}
			});
			}
	});
	//---------------- ajout utilisateur au usergroup du délégateur -------
	$.ajax({
		async : false,
		type : "GET",
		contentType: "text/html",
		dataType : "text",
		url : serverBCK_API+"/usersgroups",
		success : function(data) {
			var groups = $("group",data);
			for (var k=0;k<groups.length;k++){
				if ($('label',groups[k]).text()==usergrouplabel) {
					usergroupid = $(groups[k]).attr("id");
					break;
				}
			}
			if (!testuseringrouplabel(userid,usergroupid)) {
				//---- join group --------------
				$.ajax({
					async : false,
					type : 'PUT',
					dataType : "text",
					url : serverBCK_API+"/usersgroups?group=" + usergroupid + "&user=" + userid,
					data : "",
					success : function(data) {
					},
					error : function(data) {
					}
				});
			}
		},
		error : function(data) {
		}
	});

	//---------------- ajout utilisateur au portfoliogroup du délégateur -------
	//---- get portfoliogroupid ----------
	var foliogroupid = "";
	var url = serverBCK_API+"/portfoliogroups?type=portfolio&label="+foliogrouplabel;
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/xml; charset=UTF-8",
		dataType : "text",
		url : serverBCK_API+"/portfoliogroups?type=portfolio&label="+foliogrouplabel,
		success : function(data) {
			// group created
		},
		error : function(data) {
			// already created
		}
	});
	//-------------- ajout au groupe --------
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups",
		success : function(data) {
			var groups = $("group",data);
			for (var k=0;k<groups.length;k++){
				if ($('label',groups[k]).text()==foliogrouplabel)
					foliogroupid = $(groups[k]).attr("id");
			}
			if (!testportfolioingrouplabel(evalportfolioid,foliogroupid)) {
				//---- join group --------------
				$.ajax({
					async : false,
					type : 'PUT',
					dataType : "text",
					url : serverBCK_API+"/portfoliogroups?group="+foliogroupid+"&uuid=" + evalportfolioid,
					data : "",
					success : function(data) {
					},
					error : function(data) {
					}
				});
			}
		},
		error : function(data) {
		}
	});
	// --------------------------------------------------------
}

//==================================
function removeElts(nodeid,query)
//==================================
{
	$("#wait-window").modal('show');
	const node = UICom.structure.ui[nodeid].node;
	const semtag_indx = query.lastIndexOf('.');
	const semtag = query.substring(semtag_indx+1);
	let parent = node;
	if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent();
	} else	if (query.indexOf('parent.parent')>-1) {
		parent = $(node).parent().parent().parent();
	} else if (query.indexOf('parent')>-1) {
		parent = $(node).parent().parent();
	}
	const elts = $("*:has(>metadata[semantictag*='"+semtag+"'])",parent);
	for (let i=0;i<elts.length;i++) {
		const eltid = $(elts[i]).attr("id");
		$.ajax({
			async : false,
			type : "DELETE",
			dataType : "text",
			url : serverBCK_API+"/nodes/node/" + eltid,
			data : "",
			success : function(data) {
			},
			error : function(data) {
			}
		});
	}
	reloadPage();
	$("#wait-window").modal('show');
}

//==================================
function selectPortfolio(code,role)
//==================================
{
	let result = [];
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+code,
		success : function(data) {
			UIFactory.Portfolio.parse_add(data);
			var items = $("portfolio",data);
			for ( let i = 0; i < items.length; i++) {
				const portfolioid = $(items[i]).attr('id');
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						var rrgs = $("rrg",data);
						for ( let j = 0; j < rrgs.length; j++) {
							const label =  $("label",rrgs[j]).text();
							const users =  $("user",rrgs[j]);
							for ( let k = 0; k < users.length; k++) {
								if (label.indexOf(role)>-1 && USER.id==$(users[k]).attr("id"))
									result.push(portfolioid);
							}
						}
					}
	 			});
			}
		}
	});
	return result;
}

//==================================
function selectUsers(portfolioid,role)
//==================================
{
	let result = [];
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
		success : function(data) {
			var rrgs = $("rrg",data);
			for ( let j = 0; j < rrgs.length; j++) {
				const label =  $("label",rrgs[j]).text();
				if (label.indexOf(role)>-1) {
					const users =  $("user",rrgs[j]);
					for ( let k = 0; k < users.length; k++) {
							result.push($(users[k]).attr("id"));
					}
				}
			}
		}
	});
	return result;
}

//============================== Stages ====================

//==================================
function finaliserStage(nodeid,rolestage)
//==================================
{
	const js2 = "departagerStage('"+nodeid+"','"+rolestage+"')";
	confirmSubmit(nodeid,true,null,null,js2);
	
}

//==================================
function departagerStage(nodeid,rolestage)
//==================================
{
	const portfolio =  $("*:has(>metadata[semantictag*='portfolioid'])",UICom.structure.ui[nodeid].node)[0];
	const portfolioid = UICom.structure.ui[$(portfolio).attr("id")].resource.getView('none');
	const users = selectUsers(portfolioid,rolestage);
	$.ajax({
		async : false,
		type : "GET",
		contentType: "text/html",
		dataType : "text",
		url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+rolestage,
		success : function(data) {
			groupid = data;
			for ( let j = 0; j < users.length; j++) {
				//---- unshare tree --------------
				var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+users[j];
				$.ajax({
					async : false,
					type : "DELETE",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : "",
					success : function(data) {
					},
					error : function(data) {
					}
				});
			}
		}
	});
	UIFactory.Node.reloadUnit();
}

//==================================
function departagerValidateur(nodeid,type)
//==================================
{
	//---------------
	let rolevalidateur = 'validateur-ap';
	if (type!=null && type=='h-pharma') {
		rolevalidateur = 'validateur-h';
	}
	//---------------
	const portfolio =  $("*:has(>metadata[semantictag*='portfolioid'])",UICom.structure.ui[nodeid].node)[0];
	const portfolioid = UICom.structure.ui[$(portfolio).attr("id")].resource.getView('none');
	var groupid = "";
	$.ajax({
		async : true,
		type : "GET",
		contentType: "text/html",
		dataType : "text",
		url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+rolevalidateur,
		success : function(data) {
			groupid = data;
			//---- unshare tree --------------
			var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+USER.id;
			$.ajax({
				async : false,
				type : "DELETE",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
				success : function(data) {
				},
				error : function(data) {
				}
			});
		}
	});
}

//==================================
function majPortfolioid(nodeid)
//==================================
{	const portfolioid = $($("*:has(>metadata[semantictag*='portfolioid'])",UICom.structure.ui[nodeid].node)[0]).attr("id");
	$(UICom.structure.ui[portfolioid].resource.text_node[LANGCODE]).text(g_portfolioid);
	UICom.structure.ui[portfolioid].resource.save();
}

//==================================
function departagerTousLesRoles(nodeid)
//==================================
{
	if (confirm("Êtes-vous sûr? Vous n'aurez plus accès au portfolio de cet étudiant.")) {
		const portfolio =  $("*:has(>metadata[semantictag*='portfolioid'])",UICom.structure.ui[nodeid].node)[0];
		const portfolioid = UICom.structure.ui[$(portfolio).attr("id")].resource.getView('none');
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
			success : function(data) {
				var rrgs = $("rrg",data);
				for ( let j = 0; j < rrgs.length; j++) {
					const groupid =  $(rrgs[j]).attr('id');
					const users =  $("user",rrgs[j]);
					for ( let k = 0; k < users.length; k++) {
						if (USER.id==$(users[k]).attr("id")) {
							//---- unshare tree --------------
							var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+USER.id;
							$.ajax({
								async : false,
								type : "DELETE",
								contentType: "application/xml",
								dataType : "xml",
								url : url,
								data : "",
								success : function(data) {
								},
								error : function(data) {
								}
							});
						}

					}
				}
			}
		});
		UIFactory.Node.reloadUnit();
	}
}


//==================================
function specificXDisplayPortfolios(type)
//==================================
{
	if (USER.other=="maitre-stage") {
		if (type==null)
			type = 'card';
		let nb_visibleportfolios = 0;
		let visibleportfolios = [];
		let no_visibleportfolio = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible && $(portfolios_list[i].code_node).text().indexOf('portfolio-pp')<0 && $(portfolios_list[i].code_node).text().indexOf('alternance-')<0 && $(portfolios_list[i].code_node).text().indexOf('portfolio-etu')<0 && $(portfolios_list[i].code_node).text().indexOf('portfolio-pp-etu')<0) {
				visibleportfolios.push(portfolios_list[i].node);
				no_visibleportfolio = i;
				nb_visibleportfolios++;
			}
		}
		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>1)
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false',type,visibleportfolios);
		else if (nb_visibleportfolios==1){
			display_main_page(portfolios_list[no_visibleportfolio].id);
		}
	} else if (USER.other!="etudiant")
		throw 'non etudiant';
	else {
		let autoload = "";
		let nb_visibleportfolios = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible || portfolios_list[i].ownerid==USER.id) {
				nb_visibleportfolios++;
			}
			if (portfolios_list[i].autoload && $(portfolios_list[i].code_node).text().indexOf(USER.username)>-1) { // Pour éviter les portfolios partagsé comme pair
				autoload = portfolios_list[i].id;
			}
		}
		// -- if there is no autoload portfolio, we search if any has the role set in USER.other ---
		if (autoload=="") {
			var visible = [];
			for (var i=0;i<portfolios_list.length;i++){
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolios_list[i].id,
					success : function(data) {
						if ($("rrg:has('user[id="+USER.id+"]'):has('label:contains(etudia)')",data).length>0)
							visible[visible.length] = i; //portfolios_list[i].id;
					}
				});
			}
			if (visible.lenght==1)
				autoload = portfolios_list[visible[0]].id;
		}

		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>0 || autoload!="" )
			if (nb_visibleportfolios>9 && portfoliosnotinfolders.length>9)
				UIFactory.PortfolioFolder.displayPortfolios('project-portfolios','false','list',portfoliosnotinfolders);
			else if (nb_visibleportfolios>1 && autoload=="")
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			else if (autoload!="") {
				display_main_page(autoload);
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			}
			else {  // nb_visibleportfolios == 1
				display_main_page(visibleid);
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			}
		else if (portfolios_list.length==1) {
			display_main_page(portfolios_list[0].id);
			UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
		}
	}
}


//==================================
specificDisplay = function()
//==================================
{
	if (USER.other=="enseignant") {
		$("#portfolio-leftside").html("");
		$("#portfolio-search").html("");
		$("#portfolio-rightside-content2").html("<div class='card-deck' id='porfolios-deck'></div>");
		loadAndDisplayMedPharFolders();
		loadAndDisplayMedPharPortfolios();
		$(window).scrollTop(0);
		$("#spinner-4").hide();
	} else 
		throw "non enseigant";

}


//==================================
loadAndDisplayMedPharPortfolios = function()
//==================================
{
	$.ajax({
		async: true,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=false",
		success : function(data) {
			portfoliosnotinfolders = $("portfolio",data);
			UIFactory.Portfolio.parse_add(data);
			for (var j=0; j<portfoliosnotinfolders.length;j++){
				var portfolioid = $(portfoliosnotinfolders[j]).attr('id');
				var portfolio = portfolios_byid[portfolioid];
				var portfoliocode = portfolio.code_node.text();
				//-------------------- PORTFOLIO ----------------------
				if (portfolio.visible) {
					$("#porfolios-deck").append($("<div class='card portfolio-card' parentid id='portfolio_"+portfolio.id+"' onclick=\"display_main_page('"+portfolioid+"')\"></div>"));
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,'card',LANGCODE));
				}
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error loadAndDisplayMedPharPortfolios: "+textStatus);
			$("#wait-window").modal('hide');
		}
	});
}

//==================================
displayMedPharFolder = function (folderid)
//==================================
{
	cleanList();
	if (!folders_byid[folderid].loaded)
		folders_byid[folderid].loadContent();
	$("#portfolio-rightside-content1").html("");
	$("#portfolio-rightside-content2").html("<div class='card-deck' id='porfolios-deck'></div>");
	const folder_label = folders_byid[folderid].label_node[LANGCODE].text();
	let html = "<div class='card portfolio-card' style='width:95% !important' parentid id='folder_"+folderid+"' onclick=\"displayMedPharFolder('"+folderid+"')\">";
	html += "<div class='card-header'>"+folder_label+"</div><div class='card-body' style='background:white !important;border-left:1px solid var(--list-element-background-color) !important;border-right:1px solid var(--list-element-background-color) !important' id='card-body'></div><div class='card-footer'>&nbsp;</div></div>";
	html += "</div>";
	$("#porfolios-deck").append($(html));

	for (uuid in folders_byid[folderid].children){
		const portfolio = portfolios_byid[uuid];
		//-------------------- PORTFOLIO ----------------------
		if (portfolio.visible) {
			$("#card-body").append($("<div class='card portfolio-card' parentid id='portfolio_"+portfolio.id+"' onclick=\"display_main_page('"+portfolioid+"')\"></div>"));
			$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,'card',LANGCODE));
		}
	}
	$(window).scrollTop(0);
	$("#wait-window").modal('hide');
}

//==================================
loadAndDisplayMedPharFolders = function ()
//==================================
{
	$.ajax({
		async:true,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=true",
		success : function(data) {
			nb_folders = parseInt($('portfolios',data).attr('count'));
			UIFactory["Portfolio"].parse_add(data);
			UIFactory["PortfolioFolder"].parse(data);
			for (var i=0;i<folders_list.length;i++) {
				//---------------------
				const folderid = folders_list[i].id;
				const folder_code = folders_list[i].code_node.text();
				const folder_label = folders_list[i].label_node[LANGCODE].text();
				let html = "<div class='card portfolio-card' parentid id='folder_"+folderid+"' onclick=\"displayMedPharFolder('"+folderid+"')\">";
				html += "<div class='card-header'>"+folder_label+"</div><div class='card-body'></div><div class='card-footer'>&nbsp;</div></div>";
				html += "</div>";
				$("#porfolios-deck").append($(html));
		}

		},
		error : function(jqxhr,textStatus) {			
			alertHTML("Server Error loadAndDisplayMedPharFolders: "+textStatus);
			$("#wait-window").modal('hide');
		}
	});
}

//==================================
function existsElts(nodeid,query)
//==================================
{
	const node = UICom.structure.ui[nodeid].node;
	const semtag_indx = query.lastIndexOf('.');
	const semtag = query.substring(semtag_indx+1);
	let parent = node;
	if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent().parent();
	} else if (query.indexOf('parent.parent.parent')>-1) {
		parent = $(node).parent().parent().parent().parent();
	} else	if (query.indexOf('parent.parent')>-1) {
		parent = $(node).parent().parent().parent();
	} else if (query.indexOf('parent')>-1) {
		parent = $(node).parent().parent();
	}
	const elts = $("*:has(>metadata[semantictag*='"+semtag+"'])",parent);
	return elts.length>0;
}

//==================================
function specificDisplayPortfolios(type){
//==================================
	if (USER.other!="" && USER.other.indexOf("etudiant")<0 && USER.other.indexOf("superviseur")<0 && USER.other!='xlimited') {
		if (type==null)
			type = 'card';
		let nb_visibleportfolios = 0;
		let visibleportfolios = [];
		let no_visibleportfolio = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			const code = $(portfolios_list[i].code_node).text();
			if (portfolios_list[i].visible && (code.indexOf('-lecteur')>-1) || (code.indexOf('-ms')>-1) || (code.indexOf('-ens')>-1) || (code.indexOf('-delegue')>-1)) {
				visibleportfolios.push(portfolios_list[i].node);
				no_visibleportfolio = i;
				nb_visibleportfolios++;
			}
		}
		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>1)
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false',type,visibleportfolios);
		else if (nb_visibleportfolios==1){
			display_main_page(portfolios_list[no_visibleportfolio].id);
		}
	} else 
		throw 'autre';
}

//# sourceURL=medecine.js