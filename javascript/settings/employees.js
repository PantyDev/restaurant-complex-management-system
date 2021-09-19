var empl_change_type = 0;
function check_empl() {
    $(".empl_list").css('display', 'block');
    $(".empl_add").css('display', 'none');
    $(".empl_remove").css('display', 'none');
    $("#empl_error").text("");
    $(".empl_list_wrap").scrollTop(0);
    $(".empl_add").scrollTop(0);
    $("#remove_empl_button").css('display', 'none');
    getEmplAjax();
}

function add_empl() {
    getRestaurantCheckbox()
    empl_change_type = 0;
    $(".block").remove();
    $(".empl_remove").css('display', 'none');
    $(".empl_list").css('display', 'none');
    $("#empl_error").text("");
    $(".empl_add").css('display', 'block');
    $(".empl_list_wrap").scrollTop(0);
    $(".empl_add").scrollTop(0);
    $("#remove_empl_button").css('display', 'none');


    $(".empl_title").text("Добавление сотрудника");
    $("#empl_adding").val("Добавить сотрудника в базу");
    clearAllTexts();
}

function remove_empl() {
    empl_change_type = 2;
    $(".block").remove();
    $(".empl_add").css('display', 'none');
    $("#empl_error").text("");
    $(".empl_remove").css('display', 'block');
    $(".empl_list_wrap").scrollTop(0);
    $(".empl_add").scrollTop(0);
}

$('#empl_search').on('input', function(){ 
    getEmplAjax($("#empl_search").val());
});

empl_id = 0;
function edit_empl (element_name) {
    getRestaurantCheckbox();
    empl_change_type = 1;
    $(".block").remove();
    $(".empl_remove").css('display', 'none');
    $(".empl_list").css('display', 'none');
    $("#empl_error").text("");
    $(".empl_add").css('display', 'block');
    $(".empl_list_wrap").scrollTop(0);
    $(".empl_add").scrollTop(0);
    $("#remove_empl_button").css('display', 'inline-block');

    $(".empl_title").text("Редактирование сотрудника");
    $("#empl_adding").val("Подтвердить редактирование");
    
    $.ajax({
        method: "POST",
        url: "server/employee.php",
        dataType: "json",
        data: { 
            type: "get_employee_json",
            emplUserName: element_name
        }
    }).done(function( msg ) {
        empl_id = msg.Id;
        $("#empl_surname").val(msg.Surname);
        $("#empl_name").val(msg.Name);
        $("#empl_last_name").val(msg.LastName);
        $("#empl_sex").val(msg.Sex);
        $("#empl_birthdate").val(msg.Birthdate);
        $("#empl_hiringdate").val(msg.Hiringdate);
        $("#empl_phone_number").val(msg.PhoneNumber.substring(4));
        $("#empl_description").val(msg.Description);
        $("#empl_rating").val(msg.Rating);

        $("#empl_user_name").val(msg.UserName);
        $("#empl_password").val(msg.Password);
        $("#empl_user_type").val(msg.UserType);
        $("#empl_fixed_rate").val(msg.FixedRate);
        $("#empl_role").val(msg.Role);
        $("#empl_general_cache").val(msg.GeneralCache);
        $("#empl_percent").val(msg.Percent);
        $("#empl_days_worked").val(msg.DaysWorked);
        $("#empl_checks_count").val(msg.ChecksCount);
        restaurant_array = msg.Restaurants.split(", ");
        var radio_buttons = $('.checkbox_restaurant').get();
        var restaurants_columns = $.map(radio_buttons, function(element) {
            $(element).prop("checked", false);
            for(var i = 0; i < restaurant_array.length; i ++)
                if($(element).val() == restaurant_array[i])
                    $(element).prop("checked", true);
        });
    });
}


function confirm_empl(type) {
    var radio_buttons = $('.checkbox_restaurant:checked').get();
    var restaurant_columns = $.map(radio_buttons, function(element) {
        return $(element).attr("value");
    });
    //Фамилия
    if($("#empl_surname").val() == "")
        $("#empl_error").text("Поле 'Фамилия сотрудника' не должно быть пустым.");
    else if($("#empl_surname").val().charAt(0) == ' ')
        $("#empl_error").text("Поле 'Фамилия сотрудника' не должно начинаться с пробелов.");
    else if( $("#empl_surname").val().search(/\d/) != -1)
        $("#empl_error").text("Поле 'Фамилия сотрудника' не должно содержать цифр.");
    else if( $("#empl_surname").val().search(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/) != -1)
        $("#empl_error").text("Поле 'Фамилия сотрудника' не должно содержать специальных символов.");
    else if( $("#empl_surname").val().search(/[a-z]/) != -1)
        $("#empl_error").text("Поле 'Фамилия сотрудника' не должно содержать букв латинского алфавита.");
    else if( $("#empl_surname").val().length > 50)
        $("#empl_error").text("Поле 'Фамилия сотрудника' не должно содержать более 50 символов.");

    //Имя
    else if($("#empl_name").val() == "")
        $("#empl_error").text("Поле 'Имя сотрудника' не должно быть пустым.");
    else if($("#empl_name").val().charAt(0) == ' ')
        $("#empl_error").text("Поле 'Имя сотрудника' не должно начинаться с пробелов.");
    else if( $("#empl_name").val().search(/\d/) != -1)
        $("#empl_error").text("Поле 'Имя сотрудника' не должно содержать цифр.");
    else if( $("#empl_name").val().search(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/) != -1)
        $("#empl_error").text("Поле 'Имя сотрудника' не должно содержать специальных символов.");
    else if( $("#empl_name").val().search(/[a-z]/) != -1)
        $("#empl_error").text("Поле 'Имя сотрудника' не должно содержать букв латинского алфавита.");
    else if( $("#empl_name").val().length > 50)
        $("#empl_error").text("Поле 'Имя сотрудника' не должно содержать более 50 символов.");

    //Отчество
    else if($("#empl_last_name").val() == "")
        $("#empl_error").text("Поле 'Отчество сотрудника' не должно быть пустым.");
    else if($("#empl_last_name").val().charAt(0) == ' ')
        $("#empl_error").text("Поле 'Отчество сотрудника' не должно начинаться с пробелов.");
    else if( $("#empl_last_name").val().search(/\d/) != -1)
        $("#empl_error").text("Поле 'Отчество сотрудника' не должно содержать цифр.");
    else if( $("#empl_last_name").val().search(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/) != -1)
        $("#empl_error").text("Поле 'Отчество сотрудника' не должно содержать специальных символов.");
    else if( $("#empl_last_name").val().search(/[a-z]/i) > -1)
        $("#empl_error").text("Поле 'Отчество сотрудника' не должно содержать букв латинского алфавита.");
    else if( $("#empl_last_name").val().length > 50)
        $("#empl_error").text("Поле 'Отчество сотрудника' не должно содержать более 50 символов.");

    //Логин
    else if($("#empl_user_name").val() == "")
        $("#empl_error").text("Поле 'Логин пользователя' не должно быть пустым.");
    else if($("#empl_user_name").val().charAt(0) == ' ')
        $("#empl_error").text("Поле 'Логин пользователя' не должно начинаться с пробелов.");
    else if($("#empl_user_name").val().search(' ') != -1)
        $("#empl_error").text("Поле 'Логин пользователя' не должно состоять из пробелов.");
    else if($("#empl_user_name").val().search(/[а-яё]/i) > -1)
        $("#empl_error").text("Поле 'Логин пользователя' не должно состоять из кириллицы.");
    else if( $("#empl_user_name").val().search(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/) != -1)
        $("#empl_error").text("Поле 'Логин пользователя' не должно содержать специальных символов.");
    else if( $("#empl_user_name").val().length > 20)
        $("#empl_error").text("Поле 'Логин сотрудника' не должно содержать более 20 символов.");

    //Пароль пользователя
    else if($("#empl_password").val() == "")
        $("#empl_error").text("Поле 'Пароль пользователя' не должно быть пустым.");
    else if($("#empl_password").val().charAt(0) == ' ')
        $("#empl_error").text("Поле 'Пароль пользователя' не должно начинаться с пробелов.");
    else if($("#empl_password").val().search(' ') != -1)
        $("#empl_error").text("Поле 'Пароль пользователя' не должно состоять из пробелов.");
    else if($("#empl_password").val().search(/[а-яё]/i) > -1)
        $("#empl_error").text("Поле 'Пароль пользователя' не должно состоять из кириллицы.");
    else if( $("#empl_password").val().search(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/) != -1)
        $("#empl_error").text("Поле 'Пароль пользователя' не должно содержать специальных символов.");
    else if( $("#empl_password").val().length > 20)
        $("#empl_error").text("Поле 'Пароль сотрудника' не должно содержать более 20 символов.");
    
    //ресторан
    /* else if($('.checkbox_restaurant:checked').length == 0)
        $("#empl_error").text("Должен быть выбран как минимум один ресторан."); */
    
    //Ставка
    else if($("#empl_fixed_rate").val() == "")
        $("#empl_error").text("Поле 'Дневная фиксированная ставка' не должно быть пустым.");
    else if( $("#empl_rating").val().length > 50)
        $("#empl_error").text("Поле 'Дневная фиксированная ставка' не должно содержать более 50 символов.");

    //Длина полей
    else if( $("#empl_phone_number").val().length > 9)
        $("#empl_error").text("Поле 'Номер телефона' не должно содержать более 9 символов.");
    else if( $("#empl_description").val().length > 500)
        $("#empl_error").text("Поле 'Описание' не должно содержать более 500 символов.");
    else if( $("#empl_rating").val().length > 2)
        $("#empl_error").text("Поле 'Оценка' не должно содержать более 2 символов.");
    else if( $("#empl_rating").val().length > 50)
        $("#empl_error").text("Поле 'Роль пользователя' не должно содержать более 50 символов.");
    else if( $("#empl_general_cache").val().length > 50)
        $("#empl_error").text("Поле 'Общий доход' не должно содержать более 50 символов.");
    else if( $("#empl_percent").val().length > 3)
        $("#empl_error").text("Поле 'Процент от общего дохода' не должно содержать более 3 символов.");
    else if( $("#empl_days_worked").val().length > 50)
        $("#empl_error").text("Поле 'Отработано дней' не должно содержать более 50 символов.");
    else if( $("#empl_checks_count").val().length > 50)
        $("#empl_error").text("Поле 'Чеков сделано' не должно содержать более 50 символов.");
    else { 
        if(type == 0)
        {
            $.ajax({
                method: "POST",
                url: "server/employee.php",
                data: { 
                    type: "set_employee",
                    restId: -1,
                    emplUserName: $("#empl_user_name").val(),
                    emplPassword: $("#empl_password").val(),
                    emplUserType: $("#empl_user_type").val(),
                    emplName: $("#empl_name").val(),
                    emplSurname: $("#empl_surname").val(),
                    emplLastName: $("#empl_last_name").val(),
                    emplBirthdate: $("#empl_birthdate").val(),
                    emplHiringdate: $("#empl_hiringdate").val(),
                    emplPhoneNumber : "+380" + $("#empl_phone_number").val(),
                    emplRole: $("#empl_role").val(),
                    emplSex: $("#empl_sex").val(),
                    emplFixedRate: $("#empl_fixed_rate").val(),
                    emplGeneralCache: $("#empl_general_cache").val(),
                    emplPercent: $("#empl_percent").val(),
                    emplDaysWorked: $("#empl_days_worked").val(),
                    emplChecksCount : $("#empl_checks_count").val(),
                    emplDescription : $("#empl_description").val(),
                    emplRating: $("#empl_rating").val(),
                    emplRestaurants: restaurant_columns.join(", ")
                }
            }).done(function( msg ) {
                if(msg == "Пользователь с таким именем уже существует.")
                    $("#empl_error").text(msg);
                else {
                    $("#empl_error").text("");
                   
                    $(".empl_list").css('display', 'block');
                    $(".empl_add").css('display', 'none');
                    clearAllTexts();
                    getEmplAjax("");
                }
            });
        }
        if(type == 1)
        {
            $.ajax({
                method: "POST",
                url: "server/employee.php",
                data: { 
                    type: "update_employee",
                    emplId: empl_id,
                    emplUserName: $("#empl_user_name").val(),
                    emplPassword: $("#empl_password").val(),
                    emplUserType: $("#empl_user_type").val(),
                    emplName: $("#empl_name").val(),
                    emplSurname: $("#empl_surname").val(),
                    emplLastName: $("#empl_last_name").val(),
                    emplBirthdate: $("#empl_birthdate").val(),
                    emplHiringdate: $("#empl_hiringdate").val(),
                    emplPhoneNumber : "+380" + $("#empl_phone_number").val(),
                    emplRole: $("#empl_role").val(),
                    emplSex: $("#empl_sex").val(),
                    emplFixedRate: $("#empl_fixed_rate").val(),
                    emplGeneralCache: $("#empl_general_cache").val(),
                    emplPercent: $("#empl_percent").val(),
                    emplDaysWorked: $("#empl_days_worked").val(),
                    emplChecksCount : $("#empl_checks_count").val(),
                    emplDescription : $("#empl_description").val(),
                    emplRating: $("#empl_rating").val(),
                    emplRestaurants: restaurant_columns.join(", ")
                }
            }).done(function( msg ) {
                $("#empl_error").text("");
                $(".empl_list").css('display', 'block');
                $(".empl_add").css('display', 'none');
                $("#remove_empl_button").css('display', 'none');
                clearAllTexts();
                getEmplAjax("");
            });
        }
    }
}
function confirm_remove_empl() {
    $.ajax({
        method: "POST",
        url: "server/employee.php",
        data: { 
            type: "remove_employee",
            emplId: empl_id
        }
    }).done(function( msg ) {
        clearAllTexts();
        getEmplAjax("");
        check_empl();
    });
}


function getEmplAjax(emplNameVal) {
    $.ajax({
        method: "POST",
        url: "server/employee.php",
        data: { 
            type: "get_employee",
            emplUserName: emplNameVal
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".empl_list_wrap").html(msg);
        else  $(".empl_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}


function getRestaurantCheckbox() {
    $.ajax({
        method: "POST",
        url: "server/restaurant_checkbox.php",
        data: { 
            type: "checkbox"
        }
    }).done(function( msg ) {
        if(msg != "")
            $("#empl_restaurants").html(msg);
        else  $("#empl_restaurants").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}


$('#generate_login').click(function(){ 
    var translitted_name = "";
    if(!($('#empl_surname').val() != "" && $('#empl_last_name').val() != "" && $('#empl_last_name').val() != ""))
    {
        if($('#empl_name').val() != "")
            translitted_name =  translit($('#empl_name').val());
        else if($('#empl_surname').val() != "")
            translitted_name =  translit($('#empl_surname').val());
        else if($('#empl_last_name').val() != "")
            translitted_name =  translit($('#empl_last_name').val());
    }
    else
        translitted_name =  translit($('#empl_surname').val() + "_" + $('#empl_name').val()[0] + "_" + $('#empl_last_name').val()[0]);
    $('#empl_user_name').val(translitted_name);
    return false; 
});

$('#generate_password').click(function(){ 
    $('#empl_password').val(setSessionPass(12));
    return false; 
});

$('#count_days_from_hiring').click(function(){ 
    var d1 = new Date($('#empl_hiringdate').val());
    var d2 = new Date();
    $('#empl_days_worked').val(DateDiff.inDays(d1, d2));
    return false; 
});


var DateDiff = {

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000*7));
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

function translit(word){
	var converter = {
		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
		'э': 'e',    'ю': 'yu',   'я': 'ya',

        'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
		'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
		'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
		'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
		'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
		'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
		'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
	};
  
	var answer = '';
	for (var i = 0; i < word.length; ++i ) {
		if (converter[word[i]] == undefined){
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}
 
	
	answer = answer.replace(/[-]+/g, '-');
	answer = answer.replace(/^\-|-$/g, ''); 
    answer = answer.replace(' ', '_'); 
	return answer;
}