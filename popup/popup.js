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

//main function
function openTabs(){
	var chksites = document.getElementsByClassName('chkbx');
	var usrinput = document.getElementById('searchinput').value;
	var ischecked = false

	//open new tab for each checked checkbox
	for (i = 0; i < chksites.length; i++){
		if (chksites[i].checked){
			if (chksites[i].value == "sn-general"){
				browser.tabs.create({
					url: FormatUrl(SNCheck(usrinput))
				});
			}
			else {
				browser.tabs.create({
					url: FormatUrl(chksites[i].value)
				});
			}
			ischecked = true
		}
	}

	// if no checked box, run through pattern check functions and open new tab (isupport by default)
	if (ischecked == false){
		var site = 0;
		if (usrinput.length > 9){
			site = SNCheck(usrinput);
			if (site == 'sn-general'){site = PatternsCheck(usrinput);}
		}
		else {site = PatternsCheck(usrinput);}
		
		browser.tabs.create({
			url: FormatUrl(site)
		});
	}
};

function PatternsCheck(i){
	if (i.search(/^\s*(IC|DIALER|IONCORE|DP|LYNC)\-\d{4,6}$\s*/i) == 0){return 'scrnumber';}
	if (i.search(/^\s*\d{6}$\s*/) == 0){return 'casenumber';}
	else{return 'isupport';}
}

//looks for RFC / REQ / INC numbers entered on their own in search string
function SNCheck(i){
	if (i.search(/^\s*REQ\d{7}$\s*/i) == 0){return "sn-req";}
	else if (i.search(/^\s*RFC\d{7}$\s*/i) == 0){return "sn-rfc";}
	else if (i.search(/^\s*INC\d{7}$\s*/i) == 0){return "sn-inc";}
	else {return "sn-general";}
};

//provides valid url formats based on selected checkbox and inputed text
function FormatUrl(chkbx){
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
		case "sn-general":
			url = "https://ininhosted.service-now.com/nav_to.do?uri=$sn_global_search_results.do?sysparm_search=<SearchString>";
			break;
		case "sn-req":
			url = "https://ininhosted.service-now.com/nav_to.do?uri=sc_request.do?sysparm_query=number=<SearchString>";
			break;
		case "sn-rfc":			
			url = "https://ininhosted.service-now.com/nav_to.do?uri=change_request.do?sysparm_query=number=<SearchString>";
			break;
		case "sn-inc":			
			url = "https://ininhosted.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number=<SearchString>";
			break;
		default:
			url = "http://www.genesys.com/";
	}
	url = url.replace('<SearchString>',document.getElementById('searchinput').value);
	return url;
};