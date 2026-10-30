<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<xsl:output method="xml" />
	<xsl:param name="lang">fr</xsl:param>
	<xsl:template match="/">
		<html>
			<xsl:apply-templates select='//asmRoot//asmUnitStructure'/>
		</html>
	</xsl:template>

	<xsl:template match="asmUnitStructure[metadata/@semantictag='fiche-intervenant-employeur']">
		<div style='border:1px solid black;margin:5px;padding:5px;background-color:#E5E5E5'>
			<xsl:apply-templates select='asmContext'/>
		</div>		
	</xsl:template>

	<xsl:template match="asmContext[metadata/@semantictag='denomination-employeur']">
		<div>
			Dénomination : <xsl:value-of select="./asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</div>		
	</xsl:template>

	<xsl:template match="asmContext[metadata/@semantictag='nom-famille-employeur']">
		<div>
			Nom : <xsl:value-of select="./asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</div>		
	</xsl:template>

	<xsl:template match="asmContext[metadata/@semantictag='prenom-employeur']">
		<div>
			Prénom : <xsl:value-of select="./asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</div>		
	</xsl:template>

	<xsl:template match="asmContext[metadata/@semantictag='courriel-employeur']">
		<div>
			Courriel : <xsl:value-of select="./asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</div>		
	</xsl:template>

	<xsl:template match="asmContext[metadata/@semantictag='telephone-employeur']">
		<div>
			Téléphone : <xsl:value-of select="./asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</div>		
	</xsl:template>

	<xsl:template match="asmContext[metadata/@semantictag='adresse-employeur']">
		<div>
			Adresse : <xsl:value-of select="./asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</div>		
	</xsl:template>

	<xsl:template match="*"></xsl:template>
</xsl:stylesheet>