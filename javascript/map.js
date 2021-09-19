var jsonIdElem;
var jsonNameElem;
var jsonXElem;
var jsonYElem;
var map_editing = 0;

$("input[name=map_editor]:radio").click(function () {
    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slidein');
	$(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapin');
    $(".slideout").css('display', 'block');
});

$("input[name=map_editor]:radio").change(function() { 
	
	if($(this).val() != "remove" && $(this).val() != "remove_all" && $(this).val() != "save_all")
	{
		elementNumber = 0;
		elementType = $(this).val();
		createElement();
	}
	else if($(this).val() == "remove")
	{
		if($('#element' + elementID) != null)
			$('#element' + elementID).remove();
		removing = true;
		elementNumber = 0;
	}
	else if($(this).val() == "remove_all")
	{
		$(".block").remove();
		elementNumber = 0;
	}
	else if($(this).val() == "save_all")
	{
		if($('#element' + elementID) != null)
			$('#element' + elementID).remove();
		var elementChildrens = document.getElementById("area").children;
		var bounds = document.getElementById("area").getBoundingClientRect();
	
		var idElem = [elementChildrens.length];
		var nameElem = [elementChildrens.length];
		var xElem = [elementChildrens.length];
		var yElem = [elementChildrens.length];
		
		for(let i = 0, child; child=elementChildrens[i]; i++)
		{
			idElem[i] = elementChildrens[i].id;
			nameElem[i] = elementChildrens[i].className;
			
			var rect = elementChildrens[i].getBoundingClientRect();
			xElem[i] = rect.left - bounds.left;
			yElem[i] = rect.top - bounds.top;
		} 
	
		
		jsonIdElem = JSON.stringify(idElem);
		jsonNameElem = JSON.stringify(nameElem);
		jsonXElem = JSON.stringify(xElem);
		jsonYElem = JSON.stringify(yElem);
		//map(jsonIdElem, jsonNameElem, jsonXElem, jsonYElem, cellSize, areaSizeX, areaSizeY, $("#rest_name").val());
		elementNumber = 0;

		$(".admin_panel").css('display', 'block');
		$(".customization").css('display', 'block');
		$(".visible_map").css('display', 'none');
		$(".map_editor").css('display', 'none');
		$(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slidein');
		$(".slideout").css('display', 'block');
		$(".cust_overlay").css('display', 'none');
		$(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapin');
		map_editing = 0;
	}
});

function gotoEditing_Map() {
	map_editing = 1;
    $(".admin_panel").css('display', 'none');
    $(".customization").css('display', 'none');
    $(".visible_map").css('display', 'block');
    $(".map_editor").css('display', 'block');
	$(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapout');

    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slideout');
    $(".slideout").css('display', 'none');
    $("#map_editor-1").prop("checked", true);

    elementNumber = 0;
    elementType = "vertical_wall";
    createElement();
}

function gotoChecking_Map() {
	$(".block").remove();
	
	var UserRestaurantsArray = UserRestaurants.split(", ");


	var html = '<select id="rest_listing" size="1" style="width:100%; height: 50px; font-size:20px; outline: none;">';
	for(var i = 0; i < UserRestaurantsArray.length; i ++)
		html += '<option value="' + UserRestaurantsArray[i] + '">' + UserRestaurantsArray[i] + '</option>'
	html += '</select>';
	
	$(".rest_selector").html(html);

	
	map("get_map_select_table[no_cells]", jsonIdElem, jsonNameElem, jsonXElem, jsonYElem, cellSize, areaSizeX, areaSizeY, UserRestaurantsArray[0]);

	$('#rest_listing').on('change', function() {
		$(".block").remove();
		map("get_map_select_table[no_cells]", jsonIdElem, jsonNameElem, jsonXElem, jsonYElem, cellSize, areaSizeX, areaSizeY, this.value);
	});
}



function map (caseVal, idVal, typeVal, posXVal, posYVal, cellSizeVal, areaSizeXVal, areaSizeYVal, restNameVal) {
	var type = "";
	if(caseVal.indexOf("[") > -1)
	{
		type = caseVal.substring(caseVal.indexOf("["));
		caseVal = caseVal.substring(0, caseVal.indexOf("["));
	}
	switch(type)
	{
		case "":
			$(".map").css('background-image', 'url(images/cell.png)');
			break;
		case "[no_cells]":
			$(".map").css('background-image', 'none');
			break;
	}
	$.ajax({
		method: "POST",
		url: "server/map.php",
		data: { case: caseVal, id: idVal, type: typeVal, posX: posXVal, posY: posYVal, cellSize: cellSizeVal, areaSizeX: areaSizeXVal, areaSizeY: areaSizeYVal, restName: restNameVal }
	}).done(function( msg ) {
		if("get_map")
			$(".map").html(msg);
	});
}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}		

$(document).ready(function(){
	$(".map").css('background-size', cellSize + 'px');
	$('.map').css('width', areaSizeX);
	$('.map').css('height', areaSizeY);
	//Обрабатываем событие перемещения курсора мыши
	$('.map').click(function(e){ 
		if(elementNumber >= 1)
		{
			document.getElementById('element' + elementID).classList.remove('selected');

			elementID ++;
			elementNumber = 0;
			createElement();
		}
		if(removing)
		{
			var block = document.elementFromPoint(Math.round(xCellPos) * cellSize, Math.round(yCellPos) * cellSize);
			if(hasClass(block, "block"))
			{
				//removeAjax(block.id);
				block.remove();
			}
		}
	})
	
	var xCellPos = 0;
	var yCellPos = 0;

	$('.map').mousemove(function(e){ 
		if(elementNumber != 0 && !removing)
		{	
			var bounds = document.getElementById("area").getBoundingClientRect();
			var x = e.clientX - bounds.left  - cellSize / 2;
			var y = e.clientY - bounds.top  - cellSize / 2;
			xCellPos = (x / cellSize);
			yCellPos = (y / cellSize);
			
			$('#element' + elementID).css('left', Math.round(xCellPos) * cellSize);
			$('#element' + elementID).css('top', Math.round(yCellPos) * cellSize);
		}
		if(removing)
		{
			xCellPos = e.pageX / cellSize;
			yCellPos = e.pageY / cellSize;
		}
	})
	
});



var elementNumber = 0;
var elementID = 0;
var elementType = "";
var removing = false;
function createElement() {
	removing = false;
	if($('#element' + elementID) != null)
		$('#element' + elementID).remove();
	elementNumber ++;
	if(elementNumber == 1)
	{	
		document.getElementsByClassName('map')[0].innerHTML = document.getElementsByClassName('map')[0].innerHTML + '<div class="block ' + elementType + ' selected" id="element' + elementID +  '"></div>'; 
		switch (elementType) {
			case "horizontal_wall":
				$('#element' + elementID).css('width', 4 * cellSize);
				$('#element' + elementID).css('height', 2 * cellSize);
				$('#element' + elementID).css('background', '#695d6d'); 
			break;
			case "vertical_wall":
				$('#element' + elementID).css('width', 2 * cellSize);
				$('#element' + elementID).css('height', 4 * cellSize);
				$('#element' + elementID).css('background', '#695d6d'); 
			break;
			case "chair":
				$('#element' + elementID).css('width', 2 * cellSize);
				$('#element' + elementID).css('height', 2 * cellSize);
				$('#element' + elementID).css('background', '#dfaa86'); 
				$('#element' + elementID).css('border-radius', '10px'); 
			break;
			case "table":
				$('#element' + elementID).css('width', 4 * cellSize);
				$('#element' + elementID).css('height', 4 * cellSize);
				$('#element' + elementID).css('background', '#df8686'); 
				$('#element' + elementID).css('border-radius', '10px'); 
			break;
		}
	}
}


/* var cellSize = document.getElementById("rangeCellSize").value;
var cellSizeBuf = cellSize; */
var cellSize = 20;
var cellSizeBuf = cellSize;
function changeCellSize(size)
{
	cellSize = size;
	$("#area").css('background-size', cellSize + 'px');
	var elementChildrensArea = $("#area").children();
	var rect = [elementChildrensArea.length] ;
	for(let i = 0, child; child=elementChildrensArea[i]; i++)
	{
		console.log();
		if(elementChildrensArea[i].classList.contains("horizontal_wall"))
		{
			$(elementChildrensArea[i]).css('width', 4 * cellSize);
			$(elementChildrensArea[i]).css('height', 2 * cellSize);
		}
		if(elementChildrensArea[i].classList.contains("vertical_wall"))
		{
			$(elementChildrensArea[i]).css('width', 2 * cellSize);
			$(elementChildrensArea[i]).css('height', 4 * cellSize);
		}
		if(elementChildrensArea[i].classList.contains("chair"))
		{
			$(elementChildrensArea[i]).css('width', 2 * cellSize);
			$(elementChildrensArea[i]).css('height', 2 * cellSize);
		}
		if(elementChildrensArea[i].classList.contains("table"))
		{
			$(elementChildrensArea[i]).css('width', 4 * cellSize);
			$(elementChildrensArea[i]).css('height', 4 * cellSize);
		}
		

		rect[i] = elementChildrensArea[i].getBoundingClientRect();
		var bounds = document.getElementById("area").getBoundingClientRect();
		
		var xElem = [elementChildrensArea.length];
		var yElem = [elementChildrensArea.length];

		xElem[i] = (Math.round(rect[i].left) - Math.round(bounds.left)) * (cellSize / cellSizeBuf);
		yElem[i] = (Math.round(rect[i].top) - bounds.top) * (cellSize / cellSizeBuf);
		$(elementChildrensArea[i]).css('left', xElem[i] + 'px');
		$(elementChildrensArea[i]).css('top', yElem[i] + 'px');
		
	} 
	cellSizeBuf = size;

}

var areaSizeX = 1800;
var areaSizeY = 800;
function changeAreaSize(sizeX, sizeY)
{
	areaSizeX = sizeX;
    areaSizeY = sizeY;

    $('#area').css('width', areaSizeX);
    $('#area').css('height', areaSizeY);

}