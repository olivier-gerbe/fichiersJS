<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:xs="http://www.w3.org/2001/XMLSchema"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <xsl:output method="xml"/>

  <xsl:template match="/">
  	<portfolio>
  		<version>4</version>
	<version>4</version>
	<asmRoot delete="Y" id="d25e6272-4d0c-11f0-8ea3-fa163ebfbd00"
		read="Y" role="" submit="Y" write="Y" last_modif="2022-03-28 17:43:43"
		xsi_type="">
		<metadata-wad seenoderoles="all" />
		<metadata-epm />
		<metadata multilingual-node="Y" public="Y"
			semantictag="root karuta-rubrics" sharedNode="N" sharedResource="N" />
		<asmResource>
			<code>testog/tests.ROMEv4-referentiel</code>
			<label lang="fr">Référentiel ROME V4</label>
			<label lang="en">Référentiel ROME V4</label>
			<value />
			<version />
		</asmResource>
		<asmResource xsi_type="context">
			<text lang="fr" />
			<text lang="en" />
		</asmResource>
		<xsl:for-each select="//fiche_metier">
		<asmUnitStructure xsi_type="asmUnitStructure">
			<metadata-wad collapsible="Y" seenoderoles="all" />
			<metadata-epm displayitselforg="default" />
			<metadata collapsed="N" multilingual-node="Y"
				semantictag="metier" />
			<asmResource xsi_type="nodeRes">
				<lastmodified />
				<code><xsl:value-of select=".//code_rome"/></code>
				<label lang="fr"><xsl:value-of select=".//intitule"/></label>
				<label lang="en">New Subsection</label>
			</asmResource>
			<asmResource xsi_type="context">
				<text lang="fr" />
				<text lang="en" />
			</asmResource>
			<xsl:for-each select=".//competences">#</xsl:for-each>
			<xsl:for-each select=".//competences/savoir_faire/enjeux/enjeu/items/item">
				<asmContext>
					<metadata-wad seenoderoles="all" />
					<metadata-epm />
					<metadata multilingual-node="Y" multilingual-resource="Y"
						semantictag="competence" sharedResource="N" />
					<asmResource xsi_type="nodeRes">
						<lastmodified />
						<code />
						<label lang="fr" />
						<label lang="en" />
					</asmResource>
					<asmResource xsi_type="context">
						<text lang="fr" />
						<text lang="en" />
					</asmResource>
					<asmResource
						contextid="e5514686-4d0c-11f0-8ea3-fa163ebfbd00"
						id="e558cafe-4d0c-11f0-8ea3-fa163ebfbd00"
						last_modif="2023-12-20 13:45:58" xsi_type="Item">
						<lastmodified />
						<code><xsl:value-of select="code_ogr"/></code>
						<value />
						<label lang="fr"><xsl:value-of select="libelle"/></label>
						<label lang="en" />
					</asmResource>
				</asmContext>
			</xsl:for-each>
		</asmUnitStructure>
		</xsl:for-each>
	</asmRoot>
	   </portfolio>
  </xsl:template>
</xsl:stylesheet>