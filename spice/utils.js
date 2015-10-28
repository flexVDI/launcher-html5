"use strict";
/*
   Copyright (C) 2012 by Jeremy P. White <jwhite@codeweavers.com>

   This file is part of spice-html5.

   spice-html5 is free software: you can redistribute it and/or modify
   it under the terms of the GNU Lesser General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   spice-html5 is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public License
   along with spice-html5.  If not, see <http://www.gnu.org/licenses/>.
*/

/*----------------------------------------------------------------------------
**  Utility settings and functions for Spice
**--------------------------------------------------------------------------*/
var DEBUG = 0;
var DUMP_DRAWS = false;
var DUMP_CANVASES = false;


/*----------------------------------------------------------------------------
**  combine_array_buffers
**      Combine two array buffers.
**      FIXME - this can't be optimal.  See wire.js about eliminating the need.
**--------------------------------------------------------------------------*/
function combine_array_buffers(a1, a2)
{
    var in1 = new Uint8Array(a1);
    var in2 = new Uint8Array(a2);
    var ret = new ArrayBuffer(a1.byteLength + a2.byteLength);
    var out = new Uint8Array(ret);
    var o = 0;
    var i;
    for (i = 0; i < in1.length; i++)
        out[o++] = in1[i];
    for (i = 0; i < in2.length; i++)
        out[o++] = in2[i];

    return ret;
}

/*----------------------------------------------------------------------------
**  hexdump_buffer
**--------------------------------------------------------------------------*/
function hexdump_buffer(a)
{
    var mg = new Uint8Array(a);
    var hex = "";
    var str = "";
    var last_zeros = 0;
    for (var i = 0; i < mg.length; i++)
    {
        var h = Number(mg[i]).toString(16);
        if (h.length == 1)
            hex += "0";
        hex += h + " ";

        if (mg[i] == 10 || mg[i] == 13 || mg[i] == 8)
            str += ".";
        else
            str += String.fromCharCode(mg[i]);

        if ((i % 16 == 15) || (i == (mg.length - 1)))
        {
            while (i % 16 != 15)
            {
                hex += "   ";
                i++;
            }

            if (last_zeros == 0)
                console.log(hex + " | " + str);

            if (hex == "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ")
            {
                if (last_zeros == 1)
                {
                    console.log(".");
                    last_zeros++;
                }
                else if (last_zeros == 0)
                    last_zeros++;
            }
            else
                last_zeros = 0;

            hex = str = "";
        }
    }
}

/*----------------------------------------------------------------------------
** Converting keycodes to AT scancodes is very hard.
** luckly there are some resources on the web and in the Xorg driver that help
** us figure out what browser depenend keycodes match to what scancodes.
**
** This will most likely not work for non US keyboard and browsers other than
** modern Chrome and FireFox.
**--------------------------------------------------------------------------*/
var common_scanmap = [];
common_scanmap['Q'.charCodeAt(0)]  = KEY_Q;
common_scanmap['W'.charCodeAt(0)]  = KEY_W;
common_scanmap['E'.charCodeAt(0)]  = KEY_E;
common_scanmap['R'.charCodeAt(0)]  = KEY_R;
common_scanmap['T'.charCodeAt(0)]  = KEY_T;
common_scanmap['Y'.charCodeAt(0)]  = KEY_Y;
common_scanmap['U'.charCodeAt(0)]  = KEY_U;
common_scanmap['I'.charCodeAt(0)]  = KEY_I;
common_scanmap['O'.charCodeAt(0)]  = KEY_O;
common_scanmap['P'.charCodeAt(0)]  = KEY_P;
common_scanmap['A'.charCodeAt(0)]  = KEY_A;
common_scanmap['S'.charCodeAt(0)]  = KEY_S;
common_scanmap['D'.charCodeAt(0)]  = KEY_D;
common_scanmap['F'.charCodeAt(0)]  = KEY_F;
common_scanmap['G'.charCodeAt(0)]  = KEY_G;
common_scanmap['H'.charCodeAt(0)]  = KEY_H;
common_scanmap['J'.charCodeAt(0)]  = KEY_J;
common_scanmap['K'.charCodeAt(0)]  = KEY_K;
common_scanmap['L'.charCodeAt(0)]  = KEY_L;
common_scanmap['Z'.charCodeAt(0)]  = KEY_Z;
common_scanmap['X'.charCodeAt(0)]  = KEY_X;
common_scanmap['C'.charCodeAt(0)]  = KEY_C;
common_scanmap['V'.charCodeAt(0)]  = KEY_V;
common_scanmap['B'.charCodeAt(0)]  = KEY_B;
common_scanmap['N'.charCodeAt(0)]  = KEY_N;
common_scanmap['M'.charCodeAt(0)]  = KEY_M;
common_scanmap[' '.charCodeAt(0)]  = KEY_Space;
common_scanmap[13]                 = KEY_Enter;
common_scanmap[27]                 = KEY_Escape;
common_scanmap[8]                  = KEY_BackSpace;
common_scanmap[9]                  = KEY_Tab;
common_scanmap[16]                 = KEY_ShiftL;
common_scanmap[17]                 = KEY_LCtrl;
common_scanmap[18]                 = KEY_Alt;
//common_scanmap[20]                 = KEY_CapsLock;
//common_scanmap[144]                = KEY_NumLock;
common_scanmap[112]                = KEY_F1;
common_scanmap[113]                = KEY_F2;
common_scanmap[114]                = KEY_F3;
common_scanmap[115]                = KEY_F4;
common_scanmap[116]                = KEY_F5;
common_scanmap[117]                = KEY_F6;
common_scanmap[118]                = KEY_F7;
common_scanmap[119]                = KEY_F8;
common_scanmap[120]                = KEY_F9;
common_scanmap[121]                = KEY_F10;
common_scanmap[122]                = KEY_F11;
common_scanmap[123]                = KEY_F12;

/* These externded scancodes do not line up with values from atKeynames */
common_scanmap[42]                 = 99;
common_scanmap[19]                 = 101;    // Break
//common_scanmap[111]                = 0xE035; // KP_Divide
//common_scanmap[106]                = 0x37; // KP_Multiply
common_scanmap[36]                 = 0x47; // Home
common_scanmap[38]                 = 0x67; // Up
common_scanmap[33]                 = 0x49; // PgUp
common_scanmap[37]                 = 0x69; // Left
common_scanmap[39]                 = 0x6A; // Right
common_scanmap[35]                 = 0x4F; // End
common_scanmap[40]                 = 0x6C; // Down
common_scanmap[34]                 = 0x51; // PgDown
common_scanmap[45]                 = 0x52; // Insert
common_scanmap[46]                 = 0x53; // Delete
//common_scanmap[44]                 = 0x2A37; // Print

/* These are not common between ALL browsers but are between Firefox and DOM3 */
common_scanmap['1'.charCodeAt(0)]  = KEY_1;
common_scanmap['2'.charCodeAt(0)]  = KEY_2;
common_scanmap['3'.charCodeAt(0)]  = KEY_3;
common_scanmap['4'.charCodeAt(0)]  = KEY_4;
common_scanmap['5'.charCodeAt(0)]  = KEY_5;
common_scanmap['6'.charCodeAt(0)]  = KEY_6;
common_scanmap['7'.charCodeAt(0)]  = KEY_7;
common_scanmap['8'.charCodeAt(0)]  = KEY_8;
common_scanmap['9'.charCodeAt(0)]  = KEY_9;
common_scanmap['0'.charCodeAt(0)]  = KEY_0;
common_scanmap[145]                = KEY_ScrollLock;
common_scanmap[103]                = KEY_KP_7;
common_scanmap[104]                = KEY_KP_8;
common_scanmap[105]                = KEY_KP_9;
common_scanmap[100]                = KEY_KP_4;
common_scanmap[101]                = KEY_KP_5;
common_scanmap[102]                = KEY_KP_6;
//common_scanmap[107]                = KEY_KP_Plus;
common_scanmap[97]                 = KEY_KP_1;
common_scanmap[98]                 = KEY_KP_2;
common_scanmap[99]                 = KEY_KP_3;
common_scanmap[96]                 = KEY_KP_0;
common_scanmap[110]                = KEY_KP_Decimal;
//common_scanmap[111]                = KEY_Slash;
common_scanmap[190]                = KEY_Period;
common_scanmap[188]                = KEY_Comma;
//common_scanmap[220]                = KEY_BSlash;
//common_scanmap[222]                = KEY_Tilde;
//common_scanmap[192]                = KEY_Quote;
//common_scanmap[219]                = KEY_LBrace;
//common_scanmap[221]                = KEY_RBrace;

common_scanmap[91]                 = 0xE05B; //KEY_LMeta
common_scanmap[92]                 = 0xE05C; //KEY_RMeta
common_scanmap[93]                 = 0xE05D; //KEY_Menu

/* Firefox/Mozilla codes */
var firefox_scanmap = [];
//firefox_scanmap[173]                = KEY_Minus;
//firefox_scanmap[109]                = KEY_Minus;
//firefox_scanmap[61]                 = KEY_Equal;
//firefox_scanmap[59]                 = KEY_SemiColon;

/* DOM3 codes */
var DOM_scanmap = [];
//DOM_scanmap[189]                = KEY_Minus;
//DOM_scanmap[187]                = KEY_Equal;
//DOM_scanmap[186]                = KEY_SemiColon;

/* PC-104 Spanish Keyboard */
var pc104_es_map = [];
pc104_es_map[186]               = [0x29];                     // Masculine
pc104_es_map[170]               = [KEY_ShiftL, 0x29];         // Femenine
pc104_es_map[92]                = [KEY_LCtrl, KEY_Alt, 0x29]; // Backslash
pc104_es_map[241]               = [0x27];                     // LC N-tilde
pc104_es_map[209]               = [KEY_ShiftL, 0x27];         // UP N-tilde
pc104_es_map[39]                = [0x0c];                     // '
pc104_es_map[63]                = [KEY_ShiftL, 0x0c];         // ?
pc104_es_map[161]               = [0x0d];                     // ¡
pc104_es_map[191]               = [KEY_ShiftL, 0x0d];         // ¿
pc104_es_map[96]                = [0x1a];                     // `
pc104_es_map[94]                = [KEY_ShiftL, 0x1a];         // ^
pc104_es_map[91]                = [KEY_LCtrl, KEY_Alt, 0x1a]; // [
pc104_es_map[43]                = [0x1b];                     // +
pc104_es_map[42]                = [KEY_ShiftL, 0x1b];         // *
pc104_es_map[93]                = [KEY_LCtrl, KEY_Alt, 0x1b]; // ]
pc104_es_map[123]               = [KEY_LCtrl, KEY_Alt, 0x28]; // {
pc104_es_map[125]               = [KEY_LCtrl, KEY_Alt, 0x2b]; // }
pc104_es_map[231]               = [0x2b];                     // ç
pc104_es_map[199]               = [KEY_ShiftL, 0x2b];         // Ç
pc104_es_map[45]                = [0x35];                     // -
pc104_es_map[95]                = [KEY_ShiftL, 0x35];         // _
pc104_es_map[60]                = [0x56];                     // <
pc104_es_map[62]                = [KEY_ShiftL, 0x56];         // >
pc104_es_map[47]                = [KEY_ShiftL, 0x08];         // /

var pc104_es_tilde_map = [];
pc104_es_tilde_map[224]         = [KEY_BackSpace, 0x1a, 0x1e]; // à
pc104_es_tilde_map[232]         = [KEY_BackSpace, 0x1a, 0x12]; // è
pc104_es_tilde_map[236]         = [KEY_BackSpace, 0x1a, 0x17]; // ì
pc104_es_tilde_map[242]         = [KEY_BackSpace, 0x1a, 0x18]; // ò
pc104_es_tilde_map[249]         = [KEY_BackSpace, 0x1a, 0x16]; // ù

pc104_es_tilde_map[225]         = [KEY_BackSpace, 0x28, 0x1e]; // á
pc104_es_tilde_map[233]         = [KEY_BackSpace, 0x28, 0x12]; // é
pc104_es_tilde_map[237]         = [KEY_BackSpace, 0x28, 0x17]; // í
pc104_es_tilde_map[243]         = [KEY_BackSpace, 0x28, 0x18]; // ó
pc104_es_tilde_map[250]         = [KEY_BackSpace, 0x28, 0x16]; // ú

pc104_es_tilde_map[252]         = [KEY_BackSpace, 0x28, 0x16]; // ü
pc104_es_tilde_map[220]         = [KEY_BackSpace, 0x28, 0x16]; // Ü

var prevent_map = [];
prevent_map[8]                  = true; // BackSpace
prevent_map[9]                  = true; // Tab
prevent_map[27]                 = true; // Esc
prevent_map[112]                = true; // F1
prevent_map[113]                = true; // F2
prevent_map[114]                = true; // F3
prevent_map[115]                = true; // F4
prevent_map[116]                = true; // F5
prevent_map[117]                = true; // F6
prevent_map[118]                = true; // F7
prevent_map[119]                = true; // F8
prevent_map[120]                = true; // F9
prevent_map[121]                = true; // F10
prevent_map[37]                 = true; // Left
prevent_map[38]                 = true; // Up
prevent_map[39]                 = true; // Right
prevent_map[40]                 = true; // Down
prevent_map[33]                 = true; // PgUp
prevent_map[34]                 = true; // PgDown
prevent_map[35]                 = true; // End
prevent_map[36]                 = true; // Begin


function get_scancode(code)
{
    if (common_scanmap[code] === undefined)
    {
        if (navigator.userAgent.indexOf("Firefox") != -1)
            return firefox_scanmap[code];
        else
            return DOM_scanmap[code];
    }
    else
        return common_scanmap[code];
}

function get_codelist_from_char(code)
{
    return pc104_es_map[code];
}

function get_codelist_from_tilde_char(code)
{
    return pc104_es_tilde_map[code];
}

function keycode_to_start_scan(code)
{
    var scancode = get_scancode(code);
    if (scancode === undefined)
    {
        console.log('no map for ' + code);
        return 0;
    }

    if (scancode < 0x100) {
        return scancode;
    } else {
        return 0xe0 | ((scancode - 0x100) << 8);
    }
}

function keycode_to_end_scan(code)
{
    var scancode = get_scancode(code);
    if (scancode === undefined)
        return 0;

    if (scancode < 0x100) {
        return scancode | 0x80;
    } else {
        return 0x80e0 | ((scancode - 0x100) << 8);
    }
}

function is_keycode_in_prevent_map(code)
{
    if (prevent_map[code] != undefined)
        return true;

    return false;
}

