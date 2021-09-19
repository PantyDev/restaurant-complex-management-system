//control
var control_button_checked = 0;
var admin_panel_button_id_checked = 0;


$("input[name=admin_panel]:radio").change(function () {
    $("#customization_group_" + $(this).val()).css('display', 'block');
    
    $("#customization_group_orders").css('display', 'none');
    for(var i = 1; i < 7; i ++)
    {
        if(i.toString() != $(this).val())
            $("#customization_group_" + i).css('display', 'none');
        $(".rest_add").scrollTop(0);
        $(".empl_add").scrollTop(0);
        $(".prod_add").scrollTop(0);
        $(".reserv_add").scrollTop(0);
    }
    switch($(this).val())
    {
        case "1":
            getRestAjax(""); break;
        case "2":
            getEmplAjax(""); break;
        case "3":
            getProdAjax(""); break;
        case "4":
            getReservAjax(""); break;
    }
    //alert('check!');
});
$("input[name=admin_panel]:radio").click(function () {
    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slidein');
    $(".slideout").css('display', 'block');
    $(".cust_overlay").css('display', 'none');
});
$(".slideout").click(function () {
    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slideout');
    $(".slideout").css('display', 'none');
    $(".cust_overlay").css('display', 'block');
    if(map_editing == 1)
        $(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapout');
});
$(".cust_overlay").click(function () {
    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slidein');
    $(".slideout").css('display', 'block');
    $(".cust_overlay").css('display', 'none');
});

function gotoControl() {
    control_button_checked ++;
    if(control_button_checked == 1)
    {
        $("#control_button").val("Карта");
        $(".zones").css('display', 'none');
        $(".table_selector").css('display', 'none');
        $(".visible_map").css('display', 'none');
        $(".cust_overlay").css('display', 'block');
        
        $(".admin_panel").css('display', 'block');
        $(".customization").css('display', 'block');

        $(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapin');
        
        //В ЗАВИСИМОСТИ ОТ ТИПА ПОЛЬЗОВАТЕЛЯ ОТКРЫТЬ МЕНЮ
        switch(UserType)
        {
            case "admin":
                $("#admin_panel-1").prop('checked', true);
                $("#admin_panel-1").trigger('change');
                break;
            case "manager":
                $("#admin_panel-2").prop('checked', true);
                $("#admin_panel-2").trigger('change');
                break;
        }
        

    }
    else if(control_button_checked > 1) {
        $("#control_button").val("Управлен.");
        $(".zones").css('display', 'block');
        $(".visible_map").css('display', 'block');
        $(".rest_list").css('display', 'block');

        $(".rest_add").css('display', 'none');
        $(".rest_remove").css('display', 'none');
        $(".slideout").css('display', 'none');
        $(".admin_panel").css('display', 'none');
        $(".customization").css('display', 'none');
        $(".map_editor").css('display', 'none');
        $("#remove_rest_button").css('display', 'none');
        
        //$(".block").remove();
        gotoChecking_Map();
        map_editing = 0;
        $(".rest_list_wrap").scrollTop(0);
        $(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapout');
        
        elementNumber = 0;
        clearAllTexts();

        control_button_checked = 0;
        $("#admin_panel-1").prop("checked", true);
    }
}

