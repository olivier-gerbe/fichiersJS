jqueryReportSpecificFunctions['.sortResourceLastModified()'] = ".sort(function(a, b){ return $(\"lastmodified\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"utc\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";