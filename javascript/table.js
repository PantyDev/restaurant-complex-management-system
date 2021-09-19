var current_table_restName = "";
var current_table_elementID = -1;
var current_table_ID = -1;

function gotoTableSettings(table_restName, table_elementID, table_ID) {
    //alert(table_restName + " " + table_elementID + " " + table_ID);
    $(".table_selector").css('display', 'block');
    $(".table_title_id").html("Стол №" + table_ID);

    $(".table").css("background", "#df8686");
    $(".table").css("color", "#000");
    $("#" + table_elementID + ".table").css("background", "#4c4242");
    $("#" + table_elementID + ".table").css("color", "#fff");
    current_table_restName = table_restName;
    current_table_elementID = table_elementID;
    current_table_ID = table_ID;
}

$('.map').on('click',function (e) {
    var el = '.table';
    if ($(e.target).closest(el).length) return;
    $(".table").css("background", "#df8686");
    $(".table").css("color", "#000");
    $(".table_selector").css('display', 'none');
});



function changeOrderProdSummary(index, count, cost) { 
    $('#order_prod_summary_' + index).html(count * cost);
    
    var orderSummary = 0;
    for(var i = 0; i < $('.order_prod_summary').length; i ++) {
        orderSummary += parseFloat($('.order_prod_summary')[i].innerHTML);
    }

    $('.order_summary').html(orderSummary);
}

//ЗАКАЗЫ
function gotoTableEdit() {
    $(".visible_map").css('display', 'none');
    $(".cust_overlay").css('display', 'none');

    for(var i = 1; i < 7; i ++)
    {
        $("#customization_group_" + i).css('display', 'none');
    }
    
    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slidein');
    $(".slideout").css('display', 'block');
    $(".customization").css('display', 'block');
    $("#customization_group_orders").css('display', 'block');
    $("#back_prod_button").css('display', 'inline-block');

    $(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapin');
    getOrderAjax(current_table_ID, current_table_restName); 
}

function check_order() {
    $(".order_list").css('display', 'block');
    $(".order_add").css('display', 'none');
    $(".order_status_add").css('display', 'none');
    $(".order_remove").css('display', 'none');
    $(".order_zones_list").css('display', 'none');
    $(".order_types_list").css('display', 'none');
    $(".order_prodes_list").css('display', 'none');
    $("#remove_order_button").css('display', 'none');

    $("#order_error").text("");
    $(".order_list_wrap").scrollTop(0);
    $(".order_add").scrollTop(0);
    getOrderAjax(current_table_ID, current_table_restName); 
}
var order_change_type = 0;
function add_order() {
    //getAdminsCheckbox();
    order_change_type = 1;
    $(".order_remove").css('display', 'none');
    $(".order_list").css('display', 'none');
    $("#order_error").text("");
    $(".order_add").css('display', 'block');
    $(".order_status_add").css('display', 'none');
    $(".order_list_wrap").scrollTop(0);
    $(".order_add").scrollTop(0);
    $("#remove_order_button").css('display', 'none');
    $(".order_zones_list").css('display', 'none');
    $(".order_types_list").css('display', 'none');
    $(".order_prodes_list").css('display', 'none');

    $(".order_current_info").html("<span style='font-weight: bold'>Текущая информация:</span>" +
    "<br><span style='font-weight: bold'>Ресторан:</span> " + current_table_restName + 
    " || <span style='font-weight: bold'>Номер стола:</span> " + current_table_ID);

    $(".order_title").text("Добавление заказа");
    $("#order_adding").val("Создать заказ");
    clearAllTexts();
}

function confirm_order() {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "set_order",
            orderTableId: current_table_ID,
            orderRestName: current_table_restName,
            orderGuestType: $("#order_guest_type").val(),
            orderGuestCount: $("#order_guest_count").val(),
            orderDiscount: 0,
            orderStatus: "в обработке",
            orderPrice: 0,
            orderUserType: UserType,
            orderUserLogin: UserLogin
        }
    }).done(function( msg ) {
        $(".order_add").css('display', 'block');
        getOrderAjax(current_table_elementID, current_table_restName); 
        check_order_status(msg);
    });
}


function add_order_prod_element(productId) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "set_order_product",
            orderId: checked_order_Id,
            orderProductId: productId,
            orderProductCount: 1,
            orderProductServing: "1 подача",
            orderProductComment: ""
        }
    }).done(function( msg ) {
        clearAllTexts();
        order_prod_stage = -1;
        $(".order_remove").css('display', 'none');
        $(".order_prodes_list").css('display', 'none');
        check_order_status(checked_order_Id);
    });   
}

function getOrderExistProdesAjax(orderId) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "get_order_product",
            orderId: orderId,
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".order_products_list_wrap").html(msg);
        else  $(".order_products_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}

function save_order_prod(orderProductId) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "save_order_product",
            orderProductId: orderProductId,
            orderProductCount: $("#order_prod_count_" + orderProductId).val(),
            orderProductServing: $("#order_prod_serving_" + orderProductId).val(),
            orderProductComment: $("#order_prod_comment_" + orderProductId).val()
        }
    }).done(function( msg ) {
        $(".order_prod_element_" + orderProductId + "_overlay").css('display', 'flex');
        setTimeout("remove_order_overlay(" + orderProductId + ")", 800);
    });
}
function remove_order_overlay(orderProductId) {
    $(".order_prod_element_" + orderProductId + "_overlay").css('display', 'none');
}

function remove_order_prod(productId) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "remove_order_product",
            orderProductId: productId,
        }
    }).done(function( msg ) {
        check_order_status(checked_order_Id);
    });
}

var checked_order_Id = 0;
function check_order_status(orderId) {
    checked_order_Id = orderId;
    order_prod_stage = 0;

    /* order_products_array.push('Апельсин');
    order_products_array.push('банан');
    alert(order_products_array[1]); */
    $(".order_remove").css('display', 'none');
    $(".order_list").css('display', 'none');
    $("#order_error").text("");
    $(".order_list_wrap").scrollTop(0);
    $(".order_add").scrollTop(0);
    $("#remove_order_button").css('display', 'none');
    $(".order_add").css('display', 'none');
    $(".order_status_add").css('display', 'block');
    $("#remove_order_button").css('display', 'inline-block');

    $(".order_status_current_info").html("<span style='font-weight: bold'>Текущая информация:</span>" +
    "<br><span style='font-weight: bold'>Ресторан:</span> " + current_table_restName + 
    " || <span style='font-weight: bold'>Номер стола:</span> " + current_table_ID);
    $.ajax({
        method: "POST",
        url: "server/order.php",
        dataType: "json",
        data: { 
            type: "get_order_json",
            orderId: orderId
        }
    }).done(function( msg ) {
        $(".order_status_current_info").html("<span style='font-weight: bold'>Текущая информация:</span>" +
    "<br><span style='font-weight: bold'>Ресторан:</span> " + msg.OrderRestName + 
    " || <span style='font-weight: bold'>Номер стола:</span> " + msg.OrderTableId + 
    " || <span style='font-weight: bold'>Тип гостей:</span> " + msg.OrderGuestType + 
    " || <span style='font-weight: bold'>Количество гостей:</span> " + msg.OrderGuestCount + 
    "<br><span style='font-weight: bold'>Статус заказа:</span> " + msg.OrderStatus);
        $("#order_discount").val(msg.OrderDiscount);
        
        switch(UserType)
        {
            case "waiter":
                if(msg.OrderStatus == "в обработке")
                {
                    if(msg.HasProducts == "yes")
                        $("#order_print_oncoming").prop('disabled', false);
                    else $("#order_print_oncoming").prop('disabled', true);
                    $("#order_discount").prop('disabled', false);
                    $("#order_add_prod").prop('disabled', false);
                    $("#order_print_receipt").prop('disabled', true);
                    $("#remove_order_button").css('display', 'inline-block');
                }
                else if(msg.OrderStatus == "в процессе готовки")
                {
                    $("#order_print_oncoming").prop('disabled', true);
                    $("#order_discount").prop('disabled', true);
                    $("#order_add_prod").prop('disabled', true);
                    $("#order_print_receipt").prop('disabled', true);
                    $("#remove_order_button").css('display', 'none');
                }
                else if(msg.OrderStatus == "заказ готов")
                {
                    $("#order_print_oncoming").prop('disabled', true);
                    $("#order_discount").prop('disabled', true);
                    $("#order_add_prod").prop('disabled', true);
                    $("#order_print_receipt").prop('disabled', false);
                    $("#remove_order_button").css('display', 'none');
                }
                else if(msg.OrderStatus == "заказ выполнен")
                {
                    $("#order_print_oncoming").prop('disabled', true);
                    $("#order_discount").prop('disabled', true);
                    $("#order_add_prod").prop('disabled', true);
                    $("#order_print_receipt").prop('disabled', false);
                    $("#remove_order_button").css('display', 'none');
                }
                break;
        }
        
    });    

    
    getOrderExistProdesAjax(checked_order_Id);
}

function remove_order() {
    order_change_type = 2;
    $(".order_status_add").css('display', 'none');
    $("#rest_error").text("");
    $(".order_remove").css('display', 'block');
    $(".order_list_wrap").scrollTop(0);
    $(".order_add").scrollTop(0);
}

function confirm_remove_order() { 
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "remove_order",
            orderId: checked_order_Id
        }
    }).done(function( msg ) {
        clearAllTexts();
        order_prod_stage = -1;
        $(".order_remove").css('display', 'none');
        check_order();
    });
}

function getOrderAjax(orderElementId, orderRestName) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "get_order",
            orderTableId: orderElementId,
            orderRestName: orderRestName
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".order_list_wrap").html(msg);
        else  $(".order_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}

function back_prod_order() {
    switch(order_prod_stage)
    {
        case -1:
            $(".order_status_add").css('display', 'none');
            $(".order_zones_list").css('display', 'none');
            $("#back_prod_button").css('display', 'none');
            $(".visible_map").css('display', 'block');

            $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slideout');
            $(".slideout").css('display', 'none');
            $(".customization").css('display', 'none');
            $("#customization_group_orders").css('display', 'none');
            order_prod_stage = -1; 
        break;
        case 0:
            $("#remove_order_button").css('display', 'none');
            $(".order_remove").css('display', 'none');
            $(".order_list").css('display', 'block');
            $(".order_status_add").css('display', 'none');
            $(".order_add").css('display', 'none');
            check_order();
            order_prod_stage = -1; 
        break;
        case 1:
            $(".order_status_add").css('display', 'block');
            $(".order_zones_list").css('display', 'none');
            order_prod_stage = 0; 
        break;
        case 2: 
            $(".order_zones_list").css('display', 'block');
            $(".order_types_list").css('display', 'none');
            order_prod_stage = 1;
        break;
        case 3:
            $(".order_types_list").css('display', 'block');
            $(".order_prodes_list").css('display', 'none');
            order_prod_stage = 2;
        break;
    }
}

order_prod_stage = -1;
function add_order_prod_zone() {  
    order_prod_stage = 1;
    $("#remove_order_button").css('display', 'none');
    $(".order_status_add").css('display', 'none');
    $(".order_zones_list").css('display', 'block');
    getZoneAjax();
}

function add_order_prod_type(zoneName) {
    order_prod_stage = 2;
    $(".order_zones_list").css('display', 'none');
    $(".order_types_list").css('display', 'block');
    getTypeAjax(zoneName);
}

function add_order_prod(typeName, zoneName) {
    order_prod_stage = 3;
    $(".order_types_list").css('display', 'none');
    $(".order_prodes_list").css('display', 'block');
    getOrderProdAjax(typeName, zoneName);
}

function getZoneAjax() {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "get_zone"
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".order_zones_list_wrap").html(msg);
        else  $(".order_zones_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}

function getTypeAjax(zoneName) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "get_type",
            prodZone: zoneName
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".order_types_list_wrap").html(msg);
        else  $(".order_types_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}

function getOrderProdAjax(typeName, zoneName) {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "get_prod",
            prodZone: zoneName,
            prodType: typeName
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".order_prodes_list_wrap").html(msg);
        else  $(".order_prodes_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
        console.log(msg);
    });
}





function gotoOrderPrint(print_type) {
    if(print_type == 'oncoming')
    {
        var discount = 0;
        if($("#order_discount").val() == "")
            discount = 0;
        else discount = $("#order_discount").val();
        $.ajax({
            method: "POST",
            url: "server/order.php",
            data: { 
                type: "update_order_status",
                orderId: checked_order_Id,
                orderStatus: "в процессе готовки",
                orderDiscount: discount,
                orderPrice: $(".order_summary").html()
            }
        }).done(function( msg ) {
            check_order_status(checked_order_Id);
        });
    }

    if(print_type == 'receipt')
    {
        $.ajax({
            method: "POST",
            url: "server/order.php",
            data: { 
                type: "update_order_status_complete",
                orderId: checked_order_Id,
                orderStatus: "заказ выполнен"
            }
        }).done(function( msg ) {
            check_order_status(checked_order_Id);
            
        });
        getOrderProductReceipt();
    }
}

function getOrderProductReceipt() {
    $.ajax({
        method: "POST",
        url: "server/order.php",
        data: { 
            type: "get_order_product_receipt",
            orderId: checked_order_Id
        }
    }).done(function( msg ) {
        var frame = document.createElement('iframe');
        frame.name = "frame";
        frame.style.display = "none";
        document.body.appendChild(frame);
        var frameDoc = (frame.contentWindow) ? frame.contentWindow : (frame.contentDocument.document) ? frame.contentDocument.document : frame.contentDocument;
        frameDoc.document.open();
        frameDoc.document.write('<html><head>');
        frameDoc.document.write('</head><body>');
        frameDoc.document.write(msg);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame"].focus();
            window.frames["frame"].print();
            document.body.removeChild(frame);
        }, 500);
        return false;
    });
}

function gotoTableReservEdit() {
    $("#control_button").val("Карта");
    $(".zones").css('display', 'none');
    $(".table_selector").css('display', 'none');
    $(".visible_map").css('display', 'none');
    $(".cust_overlay").css('display', 'block');
    
    $(".admin_panel").css('display', 'block');
    $(".customization").css('display', 'block');

    $(".monitor_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running mapin');
    $(".settings_form_wrap").css('animation', '.3s ease-in 0s 1 normal forwards running slidein');
    $(".slideout").css('display', 'block');
    $(".cust_overlay").css('display', 'none');

    $("#admin_panel-4").prop('checked', true);
    $("#customization_group_4").css('display', 'block');

    add_reserv();
    $("#reserv_element_id").val(current_table_ID);
}