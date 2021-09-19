function setSessionPass(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function setNumberRand(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}


var sessionPass;
window.addEventListener('load', function() {
    sessionPass = setSessionPass(64);
    console.log(sessionPass);
    setSessionAjax(sessionPass, false);

    getUserAjax(getCookie("login"), getCookie("password"), false);
});


let timerId = setInterval(() => getSessionAjax(sessionPass), 2000);
var button = document.getElementById("authButton");
function auth() {
	getUserAjax($(".login").val(), $(".password").val(), true);
}

function gotoAuth () {
	if(control_button_checked > 0)
		gotoControl();

	clearAllTexts();
	
	document.cookie = "login=";
	document.cookie = "password=";
	$(".login_form_wrap").css("display", "block");
	$(".login_page").css("max-width", 404);
	
	$(".login").val("");
	$(".password").val("");
	$(".errorAuth").text("");

	$(".settings_form_wrap").css("display", "none");
	$(".monitor_form_wrap").css("display", "none");
	$(".login_page_logo").html('<center><p style="font-weight: bold;">RMS</p><p style="font-weight: regular;">Система управления ресторанным комплексом</p></center>');
	
	sessionPass = setSessionPass(64);
	console.log(sessionPass);
	setSessionAjax(sessionPass, false);
	doqr(sessionPass);
	timerId = setInterval(() => getSessionAjax(sessionPass), 2000);
}	

function clearAllTexts() {
	var inputs = document.getElementsByTagName("input");
	for (var ii=0; ii < inputs.length; ii++) {
		if (inputs[ii].type == "text") {
			inputs[ii].value = "";
		}
		if (inputs[ii].type == "number") {
			inputs[ii].value = "";
		}
	}
	var textareas = document.getElementsByTagName("textarea");
	for (var ii=0; ii < textareas.length; ii++) {
		textareas[ii].value = "";
	}

	var radio_buttons = $('.checkbox_admin').get();
	var admin_columns = $.map(radio_buttons, function(element) {
		$(element).prop("checked", false);
	});
	$('select option[value="Городской"]').prop("selected", true);
	$('select option[value="★★★★☆"]').prop("selected", true);
}

function gotoMonitor () 
{
	$(".errorAuth").text("");
	$(".login_form_wrap").css("display", "none");
	$(".login_page").css("max-width", 1767);

	//ВЫКЛЮЧЕНИЕ КНОПОК ДЛЯ РАЗНЫХ ТИПОВ ПОЛЬЗОВАТЕЛЕЙ
	switch(UserType)
	{
		case "manager":
			$("#admin_panel-1").prop('disabled', true);
			$("#admin_panel-5").prop('disabled', true);
			$("#admin_panel-6").prop('disabled', true);
			break;
		case "waiter":
			$("#control_button").prop('disabled', true);
			$("#reserv_from_map").prop('disabled', true);
			break;
		case "admin":
			for(var i = 1; i < 7; i ++)
				$("#admin_panel-"+i).prop('disabled', false);
			$("#control_button").prop('disabled', false);
			$("#reserv_from_map").prop('disabled', false);
		break;
	}

	$(".settings_form_wrap").css("display", "block");
	$(".monitor_form_wrap").css("display", "block");
	$(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapout');
	var uType = "";
	switch(UserType)
	{
		case "admin": uType = "Управляющий"; break;
		case "manager": uType = "Менеджер"; break;
		case "waiter": uType = "Официант"; break;
		case "bartender": uType = "Бармен"; break;
		case "chef": uType = "Повар"; break;
	}
	gotoChecking_Map();
	$(".login_page_logo").html('<center><p style="font-weight: bold;">Добро пожаловать!</p><p style="font-weight: regular;">ФИО: ' + UserSurname + ' ' + UserName + ' ' + UserLastName + ' || ' + uType + '</p></center>');
	clearInterval(timerId);
}

var UserLogin = "";
var UserType = "";
var UserSurname = "";
var UserName = "";
var UserLastName = "";
var UserRestaurants = "";
function getUserAjax (loginVal, passwordVal, show)
{
	$.ajax({
		method: "POST",
		url: "server/user.php",
		dataType: "json",
		data: { type: "get_user", login: loginVal, password: passwordVal }
	}).done(function( msg ) {
		console.log(msg.Logged);
		if(msg.Logged == "yes; logged")
		{
			document.cookie = "login=" + loginVal;
			document.cookie = "password=" + passwordVal;
			UserLogin = loginVal;
			UserType = msg.UserType;
			UserSurname = msg.UserSurname;
			UserName = msg.UserName;
			UserLastName = msg.UserLastName;
			UserRestaurants = msg.UserRestaurants;
			gotoMonitor();
		}
		else if(show == true)
		{
			$(".errorAuth").text("Неверный логин или пароль")
		}
	});
}



function setSessionAjax (sessionIdVal, statusVal) {
	$.ajax({
		method: "POST",
		url: "server/session.php",
		data: { type: "set_session", session: sessionIdVal, status: statusVal, update: "false" }
	}).done(function( msg ) {
		console.log("sended to server: " + msg);
	});
}

function getSessionAjax (sessionIdVal) {
	$.ajax({
		method: "POST",
		url: "server/session.php",
		dataType: "json",
		data: { type: "get_session", session: sessionIdVal }
	}).done(function( msg ) {
		
		if(msg.Logged == "yes; logged")
		{
			$(".login").val("");
		$(".password").val("");
			getUserAjax(msg.Login, msg.Password, true);
			//  	animation: 1s ease-out 0s 1 normal forwards running slidein;
		}
	});
}

function removeSessionAjax (sessionIdVal) {
	$.ajax({
		method: "POST",
		url: "server/session.php",
		data: { type: "remove_session", session: sessionIdVal }
	}).done(function( msg ) {
		console.log(msg);
	});
}