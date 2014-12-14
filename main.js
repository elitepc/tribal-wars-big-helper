//initialize globals
var url = "";
var warning_list = [];
var tasksOnPage = [{runInPage:"report", run:"getReport", keepRunning:1}];
var villages = [];
var farmVillages = {};


function warning(name, text){
	$('#pds-warning').append('<span class="' + name + '">' + text + "</span>");
	warning_list.push('no-villages');
	
}
function checkWarning(name){
	if($('#pds-warning').find('.' + name)){
		return true;
	}
	else{
		return false;
	}
}
function deleteWarning(name){
	$('#pds-warning').find('.' + name).remove();
}


function checkCurrentPage(page){
	if(url.indexOf("screen=" + page) === -1){
		return false;
	}
	else{
		return true;
	}
}


function runTaskOnPage(){
	if(tasksOnPage.length > 0){
		$.each(tasksOnPage, function(index){
	
		
			if(checkCurrentPage(tasksOnPage[index].runInPage)){
				var run_name = tasksOnPage[index].run;
				window[run_name]();
				
				
				if (tasksOnPage[index].keepRunning !== 1 && index > -1) {
					tasksOnPage.splice(index, 1);
				}
			}
		
		});
	}
}

function newWindowLoaded(newURL){
	url = newURL.href;
	console.log(url);
	$('#pds-url').val(url);
	runTaskOnPage();
	
}


function createBigHelperToolbar(){
	var toolbar = "<div style='width:100%; height:50px; background-color:#F3D99D'><div id='pds-warning' style='background-color:red; font-size:15px; text-align:center; color:#fff;'></div><input id='pds-url' value='" + url + "' style='width:100%'/><div id='pds-villages-list' style='padding:5px; background: transparent url(http://dspt.innogamescdn.com/8.30/23684/graphic/index/statusbar-separator2.png) scroll left top no-repeat;'></div><div onmouseover=\"$('#pds-lista-de-farms').css('display', 'block');\" onmouseout=\"$('#pds-lista-de-farms').css('display', 'none');\">Lista de Farms<div id='pds-lista-de-farms' style='display:none;'></div></div></div>";
	$('#supreme-body').append(toolbar);
	//TODO
}
function createGameIframe(){
	var iframe = $('<iframe>', {
		src: url,
		id:  'gameFrame',
		name:  'gameFrame',
		frameborder: 0,
		onload: "this.width=$(window).width() - 300;this.height=$(window).height() - 50;newWindowLoaded(this.contentWindow.location)"
	});
	iframe.appendTo('#supreme-body');
}
function createHelperIframe(){
	var iframe = $('<iframe>', {
		src: url,
		id:  'helperFrame',
		name:  'helperFrame',
		frameborder: 0,
		onload: "this.width=300;this.height=$(window).height() - 50;newWindowLoaded(this.contentWindow.location)"
	});
	iframe.appendTo('#supreme-body');
}

function checkUserVillages(){
	var villages = localStorage.getItem("pds_villages");
	if(villages){
		console.log(villages);
		if(checkWarning("no-villages")){
			deleteWarning("no-villages");
		}
		villages = JSON.parse(localStorage.pds_villages);
		$.each(villages, function(index){
			var a = "<a href='" + villages[index].link + "' target='gameFrame'>" + villages[index].coordinates + "</a>";
			$("#pds-villages-list").append(a);
		});
		
	}
	else if($.inArray('no-villages', warning_list) === -1){
	
		warning("no-villages", "Por favor vai à visualização geral");
		tasksOnPage.push({runInPage:"overview_villages", run:"getUserVillages"});
		
	}

}
function getUserVillages(){
	//
	var villages_mix = $("#gameFrame").contents().find('.quickedit-label').text().replace("\n", "").split(" ");
	villages_mix = villages_mix.filter(function(n){ return(n); });
	villages = [];
	//
	var i = 0;
	$(villages_mix).each(function( index ) {
		if( villages_mix[index].match(/(\d*\d\|\d*\d)/)){
			var coordinate = villages_mix[index];
			
			var link = $("#gameFrame").contents().find('#combined_table .quickedit-content a').not(".rename-icon")[i];
			var regexp = new RegExp(/village=\d*\d/);
			link = "game.php?" + regexp.exec(link)[0] + "&screen=overview";
			
			var insert = {coordinates:coordinate, "link":link};
			villages.push(insert);
			
			i++;
		}
	});
	
	localStorage["pds_villages"] = JSON.stringify(villages); // use JSON.parse(localStorage.pds_villages)
	
	$("#pds-villages-list").empty();
	$.each(villages, function(index){
		var a = "<a href='" + villages[index].link + "' target='gameFrame'>" + villages[index].coordinates + "</a>";
		$("#pds-villages-list").append(a);
	});
	
}

function rearrangePage(){
	$('#ds_body').empty();
	$('#ds_body').attr('id', "supreme-body");
	$('#supreme-body').css('overflow-y', 'hidden'); //no main scrollbar
	
	createBigHelperToolbar();
	createGameIframe();
	checkUserVillages();
}

function getDefensiveUnits(){
	if($("#gameFrame").contents().find('#attack_info_def_units .unit-item ').not(".hidden")){
		return 1;
	}
	else{
		return 0;
	}
}
function convertMonth(month){
	if(month === "Dez"){
		return 12;
	}
	else if(month === "Nov"){
		return 11;
	}
	else if(month === "Out"){
		return 10;
	}
	else if(month === "Set"){
		return 9;
	}
	else if(month === "Ago"){
		return 8;
	}
	else if(month === "Jul"){
		return 7;
	}
	else if(month === "Jun"){
		return 6;
	}
	else if(month === "Mai"){
		return 5;
	}
	else if(month === "Abr"){
		return 4;
	}
	else if(month === "Mar"){
		return 3;
	}
	else if(month === "Fev"){
		return 2;
	}
	else if(month === "Jan"){
		return 1;
	}
}
function getReport(){
	if($("#gameFrame").contents().find('.village_anchor :contains("Aldeia bárbara")').length > 0){
		var dateTime = $("#gameFrame").contents().find('.vis .nopad .vis').find('tr :contains("Tempo de batalha")').next().text().trim();
		dateTime = dateTime.substr(0, dateTime.length - 4).replace("(", "").replace(")", "");
		var date = dateTime.split(" ")[0].split("/");
		
		
		date[1] = convertMonth(date[1]);
		
		date = date[2] + "/" + date[1] + "/" + date[0];
		
		var time = dateTime.split(" ")[1];
		
		var finalDate = date + " " + time;

		var villageName = $("#gameFrame").contents().find('.village_anchor :contains("Aldeia bárbara")').text();
		var regexp = new RegExp(/(\d*\d\|\d*\d)/);
		var coordinates = regexp.exec(villageName)[0];
		
		var stop = 0;
		$.each(farmVillages, function(index){
			if(farmVillages[index] && coordinates in farmVillages[index] && (new Date(farmVillages[index].date).getTime() >= new Date(finalDate).getTime() || !farmVillages[index].date)){
				stop = 1;
				console.log("Já existe um relatório mais ou igualmente recente");
			}
		});
		if(stop === 0){
			var units = getDefensiveUnits();
		
			if($("#gameFrame").contents().find('#attack_spy_buildings_right td :contains("Muralha")').length > 0){
				var wall = Math.floor($("#gameFrame").contents().find('#attack_spy_buildings_right td :contains("Muralha")').parent().next().text());
			}
			else{
				var wall = 0;
			}
			
			var resources = $("#gameFrame").contents().find(' #attack_spy_resources tr :contains("Recursos detetados")').next().find(".nowrap").text().split(" ");
			resources = resources.filter(function(n){ return(n); });
			
			
			
			$.each(farmVillages, function(index){
				if(farmVillages[index] && coordinates in farmVillages[index]){
					delete farmVillages[index];
					console.log(1);
				}
			});
			farmVillages = farmVillages.filter(function(n){ return(n); });
			
			obj = {}
			
			obj[coordinates] = {"name":"Aldeia Bárbara", "coordinates":coordinates, "units":units, "wall":wall, "resources":resources, "date":finalDate};
			
			farmVillages.push(obj);
			
			
			
			localStorage["farmVillages"] = JSON.stringify(farmVillages);
			console.log(localStorage.farmVillages);
		}
	}
}

//start script
function startScript(){
	url = window.location.href; //get url
	rearrangePage();
	
	if(localStorage.farmVillages){
		farmVillages = JSON.parse(localStorage.farmVillages);
		
		var prepareString = "<ul>";
		
		$.each(farmVillages, function(index){
			$.each(farmVillages[index], function(index2){
				if(farmVillages[index][index2]){
					prepareString += "<li><a href='#'>" + farmVillages[index][index2].name + " " + farmVillages[index][index2].coordinates + "</a> | tropas: " + farmVillages[index][index2].units + " | muralha: " + farmVillages[index][index2].wall + " | recursos: " + farmVillages[index][index2].resources[0] + " - " + farmVillages[index][index2].resources[1] + " - " + farmVillages[index][index2].resources[2] + " | Data " + farmVillages[index][index2].date + "</li>";
				}
			});
		});
		
		prepareString += "</ul>";
		$('#pds-lista-de-farms').html(prepareString);
	}
	
}

//run script on download
startScript();
