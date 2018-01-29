//proceed to open tabs on click
document.addEventListener('click', function(e) {
	if (!e.target.classList.contains('button')) {
		return;
	}
	openTabs();
});

//proceed to open tabs on press of "Enter" key in textbox
document.addEventListener('keypress', function (e) {
	if (!e.target.classList.contains('textbox')) {
		return;
	}
	if (e.which == 13){
		openTabs();
	}
});

function openTabs(){
	var chksites = document.getElementsByClassName('chkbx')
	var ischecked = false
	//open new tab for each checked checkbox
	for (i = 0; i < chksites.length; i++){
		if (chksites[i].checked){
			browser.tabs.create({
				url: formatUrl(chksites[i].value)
			});
			ischecked = true
		}
	}
	//if no checkbox is checked, open isupport by default
	if (ischecked == false){
		srchinput = document.getElementById('searchinput').value
		if (srchinput.search(/^\d{6}$/) == 0){
			browser.tabs.create({
				url: formatUrl('casenumber')
			});
		}
		else if (srchinput.search(/^(IC|DIALER|IONCORE|DP|LYNC)\-\d{4,6}$/i) == 0){
			browser.tabs.create({
				url: formatUrl('scrnumber')
			});	
		}
		else if (srchinput.search(/^(REQ|INC|RFC)\d{7}$/i) == 0){
			browser.tabs.create({
				url: formatUrl('sn-task')
			});	
		}
		else{
			browser.tabs.create({
				url: formatUrl('isupport')
			});
		}
	}
};


//looks for ticket / SCR / RFC / REQ / INC numbers entered on their own in search string
//function CustomRegex(is_sn){
//	
//};

//provides valid url formats based on selected checkbox and inputed text
function formatUrl(chkbx){
	srchinput = document.getElementById('searchinput').value
	switch(chkbx){
		case "isupport":
			url = "http://i3portal.inin.com/searchcenter/Pages/results.aspx?k=<SearchString>&s=ISupport%20Incidents";
			break;
		case "jira":
			url = "https://devjira.inin.com/issues/?jql=text%20~%20\"<SearchString>\"";
			break;
		case "kb":
			url = "https://my.inin.com/products/search/Pages/Results.aspx?k=<SearchString>&s=Knowledge%20Base";
			break;
		case "confluence":
			url = "https://confluence.inin.com/dosearchsite.action?spaceSearch=false&queryString=<SearchString>";
			break;
		case "ideas":
			url = "http://ideas.inin.com/ct/c_search.bix#<SearchString>;1;all";
			break;
		case "doc":
			url = "https://my.inin.com/products/search/Pages/results.aspx?k=<SearchString>";
			break;
		case "casenumber":
			url = "https://isupportweb.inin.com/viewincident.aspx?id=<SearchString>";
			break;
		case "scrnumber":
			url = "https://devjira.inin.com/browse/<SearchString>";
			break;
		case "sn-task":
			url = "https://ininhosted.service-now.com/nav_to.do?uri=task.do?sysparm_query=number=<SearchString>";
			break;
		case "sn-general":
			url = "https://ininhosted.service-now.com/nav_to.do?uri=$sn_global_search_results.do?sysparm_search=<SearchString>";
			break;
		default:
			url = "http://www.genesys.com/";
	}
	url = url.replace('<SearchString>',srchinput);
	return url
};