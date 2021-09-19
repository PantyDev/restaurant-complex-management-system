<?php

if( isset( $_POST['my_file_upload'] ) ){  
	// ВАЖНО! тут должны быть все проверки безопасности передавемых файлов и вывести ошибки если нужно

	$uploaddir = '../uploads'; // . - текущая папка где находится submit.php

	// cоздадим папку если её нет
	if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );

	$files      = $_FILES; // полученные файлы
	$done_files = array();

	// переместим файлы из временной директории в указанную
	foreach( $files as $file ){
		$file_name = $_POST['filename_index'].".JPG";

		if( move_uploaded_file( $file['tmp_name'], "$uploaddir/$file_name" ) ){
			$done_files[] = "http://rms:3535/uploads/".$file_name;
		}
	}

	$data = $done_files ? array('files' => $done_files, 'filename' => $file_name ) : array('error' => 'Ошибка загрузки файлов.');

	die( json_encode( $data ) );
}
?>