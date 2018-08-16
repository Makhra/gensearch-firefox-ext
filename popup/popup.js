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
	var site = 0;
	//open new tab for each checked checkbox
	for (i = 0; i < chksites.length; i++){
		if (chksites[i].checked){
			site = chksites[i].value;
			if (chksites[i].value == "sn-general"){site = SNCheck(usrinput);}
			else if (chksites[i].value == "jira"){site = JiraCheck(usrinput);}
			else if (chksites[i].value == "ideas"){site = IdeaCheck(usrinput);}
			else {site = chksites[i].value;}
			
			ischecked = true;
			browser.tabs.create({
				url: FormatUrl(site)
			});
		}
	}

	// if no checked box, run through pattern check functions and open new tab (isupport by default)
	if (ischecked == false){
		if (usrinput.length > 9){
			site = SNCheck(usrinput);
			if (site == "sn-general"){site = PatternsCheck(usrinput);}
		}
		else {site = PatternsCheck(usrinput);}
		
		browser.tabs.create({
			url: FormatUrl(site)
		});
	}
};

function PatternsCheck(i){
	if (JiraCheck(i) == "scrnumber"){return "scrnumber";}
	if (IdeaCheck(i) == "idea-id"){return "idea-id";}
	if (i.search(/^\s*\d{6}$\s*/) == 0){return "casenumber";}
	else{return "isupport";}
};

function JiraCheck(i){
	if (i.search(/^\s*(IC|DIALER|IONCORE|DP|LYNC|CC)\-\d{3,6}$\s*/i) == 0){return "scrnumber";}
	else{return "jira";}
};

//looks for RFC / REQ / INC numbers entered on their own in search string
function SNCheck(i){
	if (i.search(/^\s*REQ\d{7}$\s*/i) == 0){return "sn-req";}
	else if (i.search(/^\s*RFC\d{7}$\s*/i) == 0){return "sn-rfc";}
	else if (i.search(/^\s*INC\d{7}$\s*/i) == 0){return "sn-inc";}
	else {return "sn-general";}
};

//looks for string COxxx-I-yy where xxx is product type and yy is idea number.
function IdeaCheck(i){
	if (i.search(/^\s*CO[A-Z]{3,4}\-I\-\d{1,6}\s*/i) == 0){return "idea-id";}
	else{return "ideas";}
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
		case "confluence-i":
			url = "https://confluence.inin.com/dosearchsite.action?spaceSearch=false&queryString=<SearchString>";
			break;
		case "confluence-g":
			url = "https://intranet.genesys.com/dosearchsite.action?cql=siteSearch+~+%22<SearchString>%22+and+ancestor+%3D+%2263802937%22";
			break;
		case "ideas":
			url = "https://pureconnect.ideas.aha.io/ideas/search?query=<SearchString>";
			break;
		case "idea-id":
			url = "https://pureconnect.ideas.aha.io/ideas/<SearchString>";
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