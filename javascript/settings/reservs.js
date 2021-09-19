var reserv_change_type = 0;
function check_reserv() {
    $(".reserv_list").css('display', 'block');
    $(".reserv_add").css('display', 'none');
    $(".reserv_remove").css('display', 'none');
    $("#reserv_error").text("");
    $(".reserv_list_wrap").scrollTop(0);
    $(".reserv_add").scrollTop(0);
    $("#remove_reserv_button").css('display', 'none');
    getReservAjax();
}

function add_reserv() {
    getReservRestaurantCheckbox();
    reserv_change_type = 0;
    $(".block").remove();
    $(".reserv_remove").css('display', 'none');
    $(".reserv_list").css('display', 'none');
    $("#reserv_error").text("");
    $(".reserv_add").css('display', 'block');
    $(".reserv_list_wrap").scrollTop(0);
    $(".reserv_add").scrollTop(0);
    $("#remove_reserv_button").css('display', 'none');


    $(".reserv_title").text("Добавление брони");
    $("#reserv_adding").val("Добавить бронь в базу");
    clearAllTexts();
}

function remove_reserv() {
    reserv_change_type = 2;
    $(".block").remove();
    $(".reserv_add").css('display', 'none');
    $("#reserv_error").text("");
    $(".reserv_remove").css('display', 'block');
    $(".reserv_list_wrap").scrollTop(0);
    $(".reserv_add").scrollTop(0);
}

$('#reserv_search').on('input', function(){ 
    getReservAjax($("#reserv_search").val());
});

reserv_id = 0;
function edit_reserv (element_id) {
    getReservRestaurantCheckbox();
    reserv_change_type = 1;
    $(".block").remove();
    $(".reserv_remove").css('display', 'none');
    $(".reserv_list").css('display', 'none');
    $("#reserv_error").text("");
    $(".reserv_add").css('display', 'block');
    $(".reserv_list_wrap").scrollTop(0);
    $(".reserv_add").scrollTop(0);
    $("#remove_reserv_button").css('display', 'inline-block');

    $(".reserv_title").text("Редактирование брони");
    $("#reserv_adding").val("Подтвердить редактирование");
    var radio_buttons_test = $('.radio_restaurant')
    console.log(radio_buttons_test);

    

    $.ajax({
        method: "POST",
        url: "server/reserv.php",
        dataType: "json",
        async: false,
        data: { 
            type: "get_reserv_json",
            reservId: element_id
        }
    }).done(function( msg ) {
        console.log(msg);
        reserv_id = msg.ReservId;
        $("#reserv_element_id").val(msg.ElementId)
        /* $(radio_restaurant).val(),  */
        $(function(){
            $('.radio_restaurant').each(function(i,item){
                if($(item).attr("id") == msg.RestaurantId)
                    $(item).prop("checked", true)
            });
        });

        $("#reserv_name").val(msg.ReservFirstName);
        $("#reserv_surname").val(msg.ReservSurname);
        $("#reserv_last_name").val(msg.ReservLastName);
        $("#reserv_datetime").val(msg.ReservDateTime);
        $("#reserv_description").val(msg.ReservDescription);
        $("#reserv_cost").val(msg.ReservCost);
        $("#reserv_datetime_ending").val(msg.ReservDateTimeEnding);
        
    });
}

function confirm_reserv(type) {
    var radio_restaurant = $('.radio_restaurant:checked').get();
    if($("#reserv_name").val() == "")
        $("#reserv_error").text("Имя не должно быть пустым.");
/*     else if(!$("#rest_name").val().replace(/^\s+|\s+$/g, ''))
        $("#rest_error").text("Название не должно состоять из пробелов.");
    else if($("#rest_name").val().charAt(0) == ' ')
        $("#rest_error").text("Название не должно начинаться с пробелов.");
    else if($('.checkbox_admin:checked').length == 0)
        $("#rest_error").text("Должен быть выбран как минимум один учредитель.");
    else if($('#area').children().length < 5)
        $("#rest_error").text("На карте должно быть как минимум 5 элементов."); */
    else { 
        if(type == 0)
        {
            $.ajax({
                method: "POST",
                url: "server/reserv.php",
                data: { 
                    type: "set_reserv",
                    restId: -1,
                    reservElementId: $("#reserv_element_id").val(), 
                    reservRestaurant: $(radio_restaurant).val(), 
                    reservFirstName: $("#reserv_name").val(), 
                    reservSurname: $("#reserv_surname").val(), 
                    reservLastName: $("#reserv_last_name").val(), 
                    reservDateTime: $("#reserv_datetime").val(), 
                    reservDescription: $("#reserv_description").val(), 
                    reservCost: $("#reserv_cost").val(), 
                    reservDateTimeEnding: $("#reserv_datetime_ending").val()
                }
            }).done(function( msg ) {
                alert(msg);
                if(msg == "Бронь на этот стол уже существует.")
                    $("#reserv_error").text(msg);
                else {
                    $("#reserv_error").text("");
                    $(".reserv_list").css('display', 'block');
                    $(".reserv_add").css('display', 'none');
                    clearAllTexts();
                    getReservAjax("");
                }
            });
        }
        if(type == 1)
        {
            $.ajax({
                method: "POST",
                url: "server/reserv.php",
                data: { 
                    type: "update_reserv",
                    reservId: reserv_id,
                    reservElementId: $("#reserv_element_id").val(), 
                    reservRestaurant: $(radio_restaurant).val(), 
                    reservFirstName: $("#reserv_name").val(), 
                    reservSurname: $("#reserv_surname").val(), 
                    reservLastName: $("#reserv_last_name").val(), 
                    reservDateTime: $("#reserv_datetime").val(), 
                    reservDescription: $("#reserv_description").val(), 
                    reservCost: $("#reserv_cost").val(), 
                    reservDateTimeEnding: $("#reserv_datetime_ending").val()
                }
            }).done(function( msg ) {
                $("#reserv_error").text("");
                $(".reserv_list").css('display', 'block');
                $(".reserv_add").css('display', 'none');
                $("#remove_reserv_button").css('display', 'none');
                clearAllTexts();
                getReservAjax("");
            });
        }
    }
}
function confirm_remove_reserv() {
    $.ajax({
        method: "POST",
        url: "server/reserv.php",
        data: { 
            type: "remove_reserv",
            reservId: reserv_id
        }
    }).done(function( msg ) {
        clearAllTexts();
        getReservAjax("");
        check_reserv();
    });
}


function getReservAjax(elementIdVal) {
    if(elementIdVal == "")
        elementIdVal = "-1";
    $.ajax({
        method: "POST",
        url: "server/reserv.php",
        data: { 
            type: "get_reserv",
            reservElementId: elementIdVal
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".reserv_list_wrap").html(msg);
        else  $(".reserv_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}

function getReservRestaurantCheckbox() {
    $.ajax({
        method: "POST",
        url: "server/restaurant_checkbox.php",
        data: { 
            type: "radio"
        }
    }).done(function( msg ) {
        if(msg != "")
            $("#reserv_restaurants").html(msg);
        else  $("#reserv_restaurants").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}