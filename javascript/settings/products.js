var prod_change_type = 0;
function check_prod() {
    $(".prod_list").css('display', 'block');
    $(".prod_add").css('display', 'none');
    $(".prod_remove").css('display', 'none');
    $("#prod_error").text("");
    $(".prod_list_wrap").scrollTop(0);
    $(".prod_add").scrollTop(0);
    $("#remove_prod_button").css('display', 'none');
    getProdAjax();
}

function add_prod() {
    //getAdminsCheckbox();
    prod_change_type = 0;
    $(".block").remove();
    $(".prod_remove").css('display', 'none');
    $(".prod_list").css('display', 'none');
    $("#prod_error").text("");
    $(".prod_add").css('display', 'block');
    $(".prod_list_wrap").scrollTop(0);
    $(".prod_add").scrollTop(0);
    $("#remove_prod_button").css('display', 'none');
    $('.ajax-reply').css( "display", "none");
    $(".product_zones").load("server/products_zones.php");
    $("#prod_zone").change(function () {
        $.ajax({
            method: "POST",
            url: "server/products_types.php",
            data: { 
                prodZone: $("#prod_zone").val()
            }
        }).done(function( msg ) {
            $(".product_types").html(msg);
        });
    });
    //$(".product_options").load("server/products_options.php");

    $(".prod_title").text("Добавление продукта");
    $("#prod_adding").val("Добавить продукт в базу");
    clearAllTexts();
}


function remove_prod() {
    prod_change_type = 2;
    $(".block").remove();
    $(".prod_add").css('display', 'none');
    $("#prod_error").text("");
    $(".prod_remove").css('display', 'block');
    $(".prod_list_wrap").scrollTop(0);
    $(".prod_add").scrollTop(0);
}

$('#prod_search').on('input', function(){ 
    getProdAjax($("#prod_search").val());
});

prod_id = 0;
function edit_prod (element_name) {
    prod_change_type = 1;
    $(".block").remove();
    $(".prod_remove").css('display', 'none');
    $(".prod_list").css('display', 'none');
    $("#prod_error").text("");
    $(".prod_add").css('display', 'block');
    $(".prod_list_wrap").scrollTop(0);
    $(".prod_add").scrollTop(0);
    $("#remove_prod_button").css('display', 'inline-block');

    
    $(".product_zones").load("server/products_zones.php");

    $("#prod_zone").change(function () {
        $.ajax({
            method: "POST",
            url: "server/products_types.php",
            data: { 
                prodZone: $("#prod_zone").val()
            }
        }).done(function( msg ) {
            $(".product_types").html(msg);
        });
    });

    $(".prod_title").text("Редактирование продукта");
    $("#prod_adding").val("Подтвердить редактирование");

    $.ajax({
        method: "POST",
        url: "server/product.php",
        dataType: "json",
        async: false,
        data: { 
            type: "get_product_json",
            prodName: element_name
        }
    }).done(function( msg ) {
        console.log(msg);
        prod_id = msg.ProdId;
        $("#prod_name").val(msg.ProdName);
        $("#prod_description").val(msg.ProdDescription);
        $("#prod_type").val(msg.ProdType);
        $("#prod_zone").val(msg.ProdZone);
        $("#prod_cost").val(msg.ProdCost);
        $("#prod_rating").val(msg.ProdRating);
    });

    $.ajax({
        method: "POST",
        url: "server/products_types.php",
        data: { 
            prodZone: $("#prod_zone").val()
        }
    }).done(function( msg ) {
        $(".product_types").html(msg);
    });

    $.ajax({
        url:"uploads/" + prod_id + ".jpg",
        type:'HEAD',
        error: function()
        {
            $('.ajax-reply').css( "display", "none");
        },
        success: function()
        {
            $('.ajax-reply').css( "display", "block");
            $('.ajax-reply').attr( "src", "uploads/" + prod_id + ".jpg?dummy=" + setNumberRand(8));
        }
    });
}


function confirm_prod(type) {
    if($("#prod_name").val() == "")
        $("#prod_error").text("Название не должно быть пустым.");
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
                url: "server/product.php",
                data: { 
                    type: "set_product",
                    restId: -1,
                    prodName: $("#prod_name").val(), 
                    prodDescription: $("#prod_description").val(), 
                    prodType: $("#prod_type").val(),
                    prodZone: $("#prod_zone").val(),
                    prodCost: $("#prod_cost").val(),
                    prodRating: $("#prod_rating").val(),
                }
            }).done(function( msg ) {
                if(msg == "Продукт с таким именем уже существует.")
                    $("#prod_error").text(msg);
                else {
                    saveImage(msg);
                    $("#prod_error").text("");
                    $(".prod_list").css('display', 'block');
                    $(".prod_add").css('display', 'none');
                    clearAllTexts();
                    getProdAjax("");
                }
            });
        }
        if(type == 1)
        {
            $.ajax({
                method: "POST",
                url: "server/product.php",
                data: { 
                    type: "update_product",
                    prodId: prod_id,
                    prodName: $("#prod_name").val(), 
                    prodDescription: $("#prod_description").val(), 
                    prodType: $("#prod_type").val(),
                    prodZone: $("#prod_zone").val(),
                    prodCost: $("#prod_cost").val(),
                    prodRating: $("#prod_rating").val(),
                }
            }).done(function( msg ) {
                saveImage(msg);
                $('.ajax-reply').css( "display", "none");
                $("#prod_error").text("");
                $(".prod_list").css('display', 'block');
                $(".prod_add").css('display', 'none');
                $("#remove_prod_button").css('display', 'none');
                clearAllTexts();
                getProdAjax("");
            });
        }
    }
}



function confirm_remove_prod() {
    $.ajax({
        method: "POST",
        url: "server/product.php",
        data: { 
            type: "remove_product",
            prodId: prod_id
        }
    }).done(function( msg ) {
        clearAllTexts();
        getProdAjax("");
        check_prod();
    });
}


function getProdAjax(prodNameVal) {
    $.ajax({
        method: "POST",
        url: "server/product.php",
        data: { 
            type: "get_product",
            prodName: prodNameVal
        }
    }).done(function( msg ) {
        if(msg != "")
            $(".prod_list_wrap").html(msg);
        else  $(".prod_list_wrap").html('<p style="font-size: 24px;">Список пуст</p>');
    });
}

var files;
$('.prod_picture').on('change', function(){
	files = this.files;
});
$('.upload_files').on( 'click', function( event ){
	// ничего не делаем если files пустой
	if( typeof files == 'undefined' ) return;
});


function saveImage(name) {
    // создадим объект данных формы
    var data = new FormData();

    // заполняем объект данных файлами в подходящем для отправки формате
    $.each( files, function( key, value ){
        data.append( key, value );
    });

    // добавим переменную для идентификации запроса
    data.append( 'my_file_upload', 1 );
    data.append( 'filename_index', name );

    // AJAX запрос
    $.ajax({
        url         : 'server/submit.php',
        type        : 'POST', // важно!
        data        : data,
        cache       : false,
        dataType    : 'json',
        // отключаем обработку передаваемых данных, пусть передаются как есть
        processData : false,
        // отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
        contentType : false, 
        // функция успешного ответа сервера
        success     : function( respond, status, jqXHR ){

            // ОК - файлы загружены
            if( typeof respond.error === 'undefined' ){
                // выведем пути загруженных файлов в блок '.ajax-reply'
                var files_path = respond.files;
                var html = '';
                $.each( files_path, function( key, val ){
                        html += val;
                        console.log(val);
                } )
                $('.ajax-reply').css( "display", "block");
                $('.ajax-reply').attr( "src", html);
            }
            // ошибка
            else {
                console.log('ОШИБКА: ' + respond.data );
            }
        },
        // функция ошибки ответа сервера
        error: function( jqXHR, status, errorThrown ){
            console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
        }
    });
}

$('#prod_remove_type').click(function(){ 
    $.ajax({
        method: "POST",
        url: "server/product.php",
        data: { 
            type: "remove_product_type",
            prodType: $("#prod_type").val(),
        }
    }).done(function( msg ) {
        $("#prod_type").val("");
    });
    $(".prod_type_list").remove();
    $(".product_zones").load("server/products_zones.php");
    $("#prod_zone").change(function () {
        $.ajax({
            method: "POST",
            url: "server/products_types.php",
            data: { 
                prodZone: $("#prod_zone").val()
            }
        }).done(function( msg ) {
            $(".product_types").html(msg);
        });
    });
});

$('#prod_remove_zone').click(function(){ 
    $.ajax({
        method: "POST",
        url: "server/product.php",
        data: { 
            type: "remove_product_zone",
            prodZone: $("#prod_zone").val(),
        }
    }).done(function( msg ) {
        $("#prod_zone").val("");
    });
    $(".prod_type_list").remove();
    $(".product_zones").load("server/products_zones.php");
    $("#prod_zone").change(function () {
        $.ajax({
            method: "POST",
            url: "server/products_types.php",
            data: { 
                prodZone: $("#prod_zone").val()
            }
        }).done(function( msg ) {
            $(".product_types").html(msg);
        });
    });
});
