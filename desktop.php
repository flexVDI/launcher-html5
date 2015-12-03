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

// Ajustar esta IP para que apunte a la direccion interna del Manager
$response = file_get_contents('https://MANAGERIP/vdi/desktop', FALSE, $context);
$data = json_decode($response, TRUE);

// Como randed necesita acceder a las IPs internas, y no soporte proxificado
// HTTPS, hay que meter manualmente la relacion IPs publicas a internas.
if ($data["spice_address"] == "IPPUBLICADELHOST") {
    $data["spice_address"] = "IPINTERNADELHOST";
} else if ($data["spice_address"] == "192.168.0.1") {
    $data["spice_address"] = "10.111.1.1";
}

print json_encode($data)
?>