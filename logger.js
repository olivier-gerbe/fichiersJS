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

//==================================
function logINFO(n,text,user)
//==================================
{
	$.ajax({
		type : "POST",
		contentType: "text",
		dataType : "text",
		data : text,
		url : serverBCK+"/logging?n="+n+"&user="+user,
		success : function() {
		}
	});
	return true;
}