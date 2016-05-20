<?php
/*
 * flexVDI WebPortal
 * Copyright (c) 2016 flexVDI (Flexible Software Solutions S.L.)
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * version 3 along with this program in the file "LICENSE".  If not, see
 * <http://www.gnu.org/licenses/agpl-3.0.txt>.
 *
 */

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
