function testRNCP() {
	let rncp = false;
	let element_programme = $("*:has(\">metadata[semtag='element-programme']\")");
	if (element_programme.length>0) {
		if ($("code",element_programme[0]).text(),indexOf('rncp')>-1)
			rncp = true;
	}
	return rncp;
}