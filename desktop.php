<?php
$postData =  array_keys($_POST)[0];

$context = stream_context_create(array(
    'http' => array(
        'method' => 'POST',
        'header' => 'Content-Type: application/json\r\n',
        'content' => $postData
    ),
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false
    )
));

$response = file_get_contents('https://10.111.8.11/vdi/desktop', FALSE, $context);
$data = json_decode($response, TRUE);

if ($data["spice_address"] == "demo01.flexvdi.com") {
    $data["spice_address"] = "pruebagmv.com";
} else if ($data["spice_address"] == "192.168.0.1") {
    $data["spice_address"] = "10.111.1.1";
}

print json_encode($data)
?>