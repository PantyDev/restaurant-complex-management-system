var rest_change_type = 0;
function check_rest() {
    $(".rest_list").css('display', 'block');
    $(".rest_add").css('display', 'none');
    $(".rest_remove").css('display', 'none');
    $("#rest_error").text("");
    $(".rest_list_wrap").scrollTop(0);
    $(".rest_add").scrollTop(0);
    $("#remove_rest_button").css('display', 'none');
    getRestAjax();
}

function add_rest() {
    getAdminsCheckbox();
    rest_change_type = 0;
    $(".block").remove();
    $(".rest_remove").css('display', 'none');
    $(".rest_list").css('display', 'none');
    $("#rest_error").text("");
    $(".rest_add").css('display', 'block');
    $(".rest_list_wrap").scrollTop(0);
    $(".rest_add").scrollTop(0);
    $("#remove_rest_button").css('display', 'none');


    $(".rest_title").text("Добавление ресторана");
    $("#rest_adding").val("Добавить ресторан в базу");
    clearAllTexts();
}

function remove_rest() {
    rest_change_type = 2;
    $(".block").remove();
    $(".rest_add").css('display', 'none');
    $("#rest_error").text("");
    $(".rest_remove").css('display', 'block');
    $(".rest_list_wrap").scrollTop(0);
    $(".rest_add").scrollTop(0);
}

$('#rest_search').on('input', function(){ 
    getRestAjax($("#rest_search").val());
});

rest_id = 0;
function edit_rest (element_name) {
    getAdminsCheckbox();
    rest_change_type = 1;
    $(".block").remove();
    $(".rest_remove").css('display', 'none');
    $(".rest_list").css('display', 'none');
    $("#rest_error").text("");
    $(".rest_add").css('display', 'block');
    $(".rest_list_wrap").scrollTop(0);
    $(".rest_add").scrollTop(0);
    $("#remove_rest_button").css('display', 'inline-block');

    $(".rest_title").text("Редактирование ресторана");
    $("#rest_adding").val("Подтвердить редактирование");
    
    $.ajax({
        method: "POST",
        url: "server/restaurant.php",
        dataType: "json",
        data: { 
            type: "get_restaurant_json",
            restName: element_name
        }
    }).done(function( msg ) {
        rest_id = msg.RestId;
        $("#rest_name").val(msg.RestName);
        //$("#rest_description").val(msg.RestFounders);
        admin_array = msg.RestFounders.split(", ");
        var radio_buttons = $('.checkbox_admin').get();
        var admin_columns = $.map(radio_buttons, function(element) {
            $(element).prop("checked", false);
            for(var i = 0; i < admin_array.length; i ++)
                if($(element).val() == admin_array[i])
                    $(element).prop("checked", true);
        });

        $("#rest_description").val(msg.RestDescription);
        $("#rest_product_range").val(msg.RestProductRange);
        $("#rest_classification").val(msg.RestClassification);
        $("#rest_location").val(msg.RestLocation);
        $("#rest_adress").val(msg.RestAdress);
        $("#rest_numbers").val(msg.RestNumbers);
        $("#rest_e_mail").val(msg.RestEMail);
        map("get_map", jsonIdElem, jsonNameElem, jsonXElem, jsonYElem, cellSize, areaSizeX, areaSizeY, $("#rest_name").val());
    });
}

function confirm_rest(type) {
    var radio_buttons = $('.checkbox_admin:checked').get();
    var admin_columns = $.map(radio_buttons, function(element) {
        return $(element).attr("value");
    });
    if($("#rest_name").val() == "")
        $("#rest_error").text("Название не должно быть пустым.");
    else if(!$("#rest_name").val().replace(/^\s+|\s+$/g, ''))
        $("#rest_error").text("Название не должно состоять из пробелов.");
    else if($("#rest_name").val().charAt(0) == ' ')
        $("#rest_error").text("Название не должно начинаться с пробелов.");
    else if($('.checkbox_admin:checked').length == 0)
        $("#rest_error").text("Должен быть выбран как минимум один учредитель.");
    else if($('#area').children().length < 5)
        $("#rest_error").text("На карте должно быть как минимум 5 элементов.");
    else { 
        if(type == 0)
        {
            
            $.ajax({
                method: "POST",
                url: "server/restaurant.php",
                data: { 
                    type: "set_restaurant",
                    restId: -1,
                    restName: $("#rest_name").val(), 
                    restFounders: admin_columns.join(", "), 
                    restDescription: $("#rest_description").val(), 
                    restProductRange: $("#rest_product_range").val(),
                    restClassification: $("#rest_classification").val(),
                    restLocation: $("#rest_location").val(),
                    restAdress: $("#rest_adress").val(),
                    restNumbers: $("#rest_numbers").val(),
                    restEMail: $("#rest_e_mail").val()
                }
            }).done(function( msg ) {
                if(msg == "Ресторан с таким именем уже существует.")
                    $("#rest_error").text(msg);
                else {
                    $("#rest_error").text("");
                    map("set_map", jsonIdElem, jsonNameElem, jsonXElem, jsonYElem, cellSize, areaSizeX, areaSizeY, $("#rest_name").val());
                    $(".rest_list").css('display', 'block');
                    $(".rest_add").css('display', 'none');
                    clearAllTexts();
                    getRestAjax("");
                }
            });
        }
        if(type == 1)
        {
            $.ajax({
                method: "POST",
                url: "server/restaurant.php",
                data: { 
                    type: "update_restaurant",
                    restId: rest_id,
                    restName: $("#rest_name").val(), 
                    restFounders: admin_columns.join(", "),
                    restDescription: $("#rest_description").val(), 
                    restProductRange: $("#rest_product_range").val(),
                    restClassification: $("#rest_classification").val(),
                    restLocation: $("#rest_location").val(),
                    restAdress: $("#rest_adress").val(),
                    restNumbers: $("#rest_numbers").val(),
                    restEMail: $("#rest_e_mail").val()
                }
            }).done(function( msg ) {
                $("#rest_error").text("");
                map("set_map", jsonIdElem, jsonNameElem, jsonXElem, jsonYElem, cellSize, areaSizeX, areaSizeY, $("#rest_name").val());
                $(".rest_list").css('display', 'block');
                $(".rest_add").css('display', 'none');
                $("#remove_rest_button").css('display', 'none');
                clearAllTexts();
                getRestAjax("");
            });
        }
    }
}
function confirm_remove_rest() {
    $.ajax({
        method: "POST",
        url: "server/restaurant.php",
        data: { 
            type: "remove_restaurant",
            restId: rest_id
        }
    }).done(function( msg ) {
        clearAllTexts();
        getRestAjax("");
        check_rest();
    });
}


function getRestAjax(restNameVal) {
    $.ajax({
        method: "POST",
        url: "server/restaurant.php",
        data: { 
            type: "get_restaurant",
            restName: restNameVal
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".rest_list_wrap").html(msg);
        else  $(".rest_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}


function getAdminsCheckbox() {
    $.ajax({
        method: "POST",
        url: "server/admins_checkbox.php",
    }).done(function( msg ) {
        if(msg != "")
            $("#rest_admins").html(msg);
        else  $("#rest_admins").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}