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
 */

jQuery(function($) {
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function authenticate() {
        var managerAPI = "/vdi/desktop";
        if ($('#randed_post').val() == 'yes' || $('#randed_get').val() == 'yes') {
            managerAPI = "/html/desktop.php";
        }

        var user = $('#user_login').val();

        if (!document.getElementById('nativeres') || document.getElementById('nativeres').checked) {
            var fsmode = true;
        } else {
            var fsmode = false;
        }

        createCookie('fsmode', fsmode, 360);
        createCookie('hwaddress', $('#hwaddress').val(), 1);
        createCookie('username', $('#user_login').val(), 1);
        createCookie('password', $('#pass_login').val(), 1);

        $('#user_login').val(user.trim());
        var request = JSON.stringify({
            "hwaddress": $('#hwaddress').val(),
            "username": $('#user_login').val(),
            "password": $('#pass_login').val(),
            "desktop": $('#desktop').val()
        });
        var desktopList = null;

        $.post(managerAPI, request)
            .done(function(data) {
                var response = JSON.parse(data);
                if (response.status === "OK") {
                    if ($('#randed_post').val() == 'yes') {
                        var p1 = document.createElement('input');
                        p1.name = 'p1';
                        p1.type = 'hidden';
                        p1.value = 'spice';

                        var p2 = document.createElement('input');
                        p2.name = 'p2';
                        p2.type = 'hidden';
                        p2.value = response.spice_address;

                        var p3 = document.createElement('input');
                        p3.name = 'p3';
                        p3.type = 'hidden';
                        p3.value = response.spice_port;

                        var p4 = document.createElement('input');
                        p4.name = 'p4';
                        p4.type = 'hidden';
                        p4.value = response.spice_password;

                        var form = document.loginform;
                        form.method = 'post';
                        form.action = 'https://RANDEDIP/applaunch';
                        form.appendChild(p1);
                        form.appendChild(p2);
                        form.appendChild(p3);
                        form.appendChild(p4);
                        form.submit();
                    } else if ($('#randed_get').val() == 'yes') {
                        document.location.href = 'https://RANDEDIP/applaunch?p1=spice&p2=' + response.spice_address + '&p3=' + response.spice_port + '&p4=' + response.spice_password;
                    } else {
                        eraseCookie("token");
                        createCookie("token", JSON.stringify(response), 1);
                        document.location.href = 'spice-web-client/index.html';
                        /*
                        if (navigator.appVersion.indexOf("Win") != -1) {
                            document.location.href = 'spice-web-client/index.html';
                        } else {
                            document.location.href = 'spice-web-client/index.html?host=' + response.spice_address + '&port=' + response.spice_port + '&token=' + response.spice_password;
                        }
                        */
                    }
                } else if (response.status === "Pending") {
                    setTimeout(authenticate(), 10000);
                } else if (response.status === "SelectDesktop") {
                    desktopList = JSON.parse(response.message);
                    var i = 0;

                    for (var key in desktopList) {
                        if (desktopList[key] != "") {
                            var text = desktopList[key];
                        } else {
                            var text = key;
                        }

                        switch (i) {
                            case 0:
                                $('#entry1').val(key);
                                $('#entry1').text(text);
                                break;
                            case 1:
                                $('#entry2').val(key);
                                $('#entry2').text(text);
                                break;
                            case 2:
                                $('#entry3').val(key);
                                $('#entry3').text(text);
                                break;
                            case 3:
                                $('#entry4').val(key);
                                $('#entry4').text(text);
                                break;
                            default:
                                $("#msgerr").dialog("option", "title", "Error");
                                $('#msgerr').html('<p style="margin-top:1em" class="msg-error">Su política tiene demasiados Escritorios</p>');
                                $("#msgerr").dialog("open");
                                return;
                        }
                        i++;
                    }

                    $("#menu").menu({
                        select: function(event, ui) {
                            var item = ui.item.text();
                            var desktop = "";
                            for (var key in desktopList) {
                                if (key == item || desktopList[key] == item) {
                                    desktop = key;
                                    break;
                                }
                            }
                            $('#desktop').val(desktop);
                            authenticate();
                            $('#msgbox').dialog("close");
                        }
                    });
                    $('#msgbox').dialog("option", "title", "Seleccione un escritorio");
                    $('#msgbox').dialog("open");
                } else if (response.status === "Error") {
                    $("#msgerr").dialog("option", "title", "Error");
                    $('#msgerr').html('<p style="margin-top:1em" class="msg-error">' + response.message + '</p>');
                    $("#msgerr").dialog("open");
                }
            })
            .fail(function(jqXHR) {
                if (jqXHR.status != 0) {
                    $("#msgerr").dialog("option", "title", "Error " + jqXHR.status);
                    $('#msgerr').html('<p style="margin-top:1em" class="msg-error">No hay escritorios disponibles. Por favor, inténtelo más tarde.</p>');
                    $("#msgerr").dialog("open");
                }
            });
    }

    $(document).ready(function() {

        var uuid = readCookie('uuid');
        if (uuid == null) {
            uuid = guid();
            createCookie('uuid', uuid, 360);
        }
        $('#hwaddress').val("h5-" + uuid);
        $('#msgerr').dialog({
            autoOpen: false,
            modal: true,
            width: 350,
            height: 250,
            buttons: {
                CANCELAR: function() {
                    $(this).dialog("close");
                }
            }
        });
        $('#msgbox').dialog({
            autoOpen: false,
            modal: true,
            width: 350,
            height: 250,
            buttons: {
                CANCELAR: function() {
                    $(this).dialog("close");
                }
            }
        });
        $('#user_login').focus();
        $('#bot').on('click', function(e) {
            e.preventDefault();
            $('#desktop').val("");
            if ($('#user_login').val() !== '' && $('#pass_login').val() !== '') {
                $("#user_login").focus();
                authenticate();
            } else {
                $("#user_login").focus();
                $("#msgerr").dialog("option", "title", "Error");
                $('#msgerr').html('<p style="margin-top:1em" class="msg-error">Debe introducir Usuario y Password</p>');
                $("#msgerr").dialog("open");
            }
        });
        $('#reset').on('click', function(e) {
            history.go(-1);
        });
        $("#pass_login").keyup(function(event) {
            if (event.keyCode == 13) {
                $("#bot").click();
            }
        });
        if ($('#autologin').val() == 'yes') {
            $("#bot").click();
        }
    });
});
