/**
 * Function to be called by the system when everything is ready @ browser. 
 */
$(document).ready(function () {
    configureEvents();
});

/**
 * Configures behavior of each actionable control in the page.
 * @returns {undefined}
 */
function configureEvents() {
    $("#btnBegin").click(function () {
        $("#btnBegin").hide();
        $("#btnStop").show();
        stopFlag = false;
        beginCapture();
    }).removeAttr("disabled").text("BEGIN");

    $("#btnStop").click(function () {
        stopFlag = true;
        $("#btnBegin").show();
        $("#btnStop").hide();
        $("#imgClock").hide();
    });
}

/**
 * Flag used to control the recurrent retrieval of information from pvCloud
 * @type Boolean
 */
var stopFlag = false;

/**
 * Initiates and performs the recurrent capture of data from pvCloud
 * @returns {undefined}
 */
function beginCapture() {
    $("#imgClock").hide();
    if (!stopFlag) { /** /si stopflag es false, o sea si el boton no se ha presionado */
        var time = $("#txtCheckTime").val(); /** /txtCheckTime es el tiempo que uno le da para calcular*/

        $("#val_T").html("...");
        $("#val_H").html("...");
        $("#created_datetime").html("loading...");

        GetPVCLOUDValue(function (response) { /** /Obtiene el valor de pvCloud, ejecuta hasta que GetPVCLOUDValue tenga un valor */
            processResponse(response); /** /Data = response */
            $("#imgClock").show();
            setTimeout(beginCapture, time * 1000); /** /Se setea solo para volver a contar cada tiempo segun el #txtCheckTime */
        });
    }
}

/**
 * Processes a response value coming from retrieving data from pvCloud
 * @param {object} response
 * @returns {undefined}
 */
function processResponse(response) {
    var value = JSON.parse(response.vse_value); /** /  Pasa de tipo JSON (String) a un objeto Java. {T:20,H:60} --> value.H value.T   */
    var created_datetime = response.created_datetime; /** /    created_datetime = atributo de pvCloud q se da como un string */
    if (value) {
        $("#val_T").html(value.t); /** /    Pasando los valores a la pagina */
        $("#val_H").html(value.h);


        var now = new Date();
        var createdDateObj = new Date(created_datetime); /** /  pasa  created_datetime de string a date */
        createdDateObj.setHours(createdDateObj.getHours() + 1); /** / Hora de creacion del registro */
        console.log(now);

        console.log(createdDateObj);
        $("#created_datetime").html(createdDateObj); /** / Asigna a #created_datetime el valor html de createdDateObj */

        var diffsec = (now - createdDateObj) / 1000;

        if (diffsec > 60) {
            $("#created_datetime").css("color", "red"); /** / No ha vuelto a recibir datos hace 60 seg, se pone en rojo */
        } else {
            $("#created_datetime").css("color", "green");
        }

        processWarnings();
        console.log(diffsec);

    }
    console.log(value);
}

var messageSent = false;
var messageSentEmail = "";
function processWarnings() {
    var tempWarningValue = 1 * $("#txtWarning_T_Trigger").val(); /** /    Convierte los settings en numeros para compararlos despues */
    var tempAlertValue = 1 * $("#txtAlert_T_Trigger").val();
    var humWarningValue = 1 * $("#txtWarning_H_Trigger").val();
    var humAlertValue = 1 * $("#txtAlert_H_Trigger").val();
    var currentTemp = 1 * $("#val_T").text();
    var currentHum = 1 * $("#val_H").text();

    console.log({currentTemp: currentTemp, currentHum: currentHum}); /** /    Con F12, Se ven en console para hacer debugging del sistema */
    console.log({tempWarning: tempWarningValue, tempAlert: tempAlertValue, humWarning: humWarningValue, humAlert: humAlertValue});

    var message = "";
    if (currentTemp >= tempAlertValue) { /** /    Darle color a los iconos */
        message += "TEMP ALERT (" + currentTemp + " >= " + tempAlertValue + ") ";
        $("#iconTemperature").css("color", "red");
    } else if (currentTemp >= tempWarningValue) {
        $("#iconTemperature").css("color", "orange");
    } else {
        $("#iconTemperature").css("color", "green");
    }

    if (currentHum <= humAlertValue) {
        $("#iconHumidity").css("color", "sienna");
        if (message !== "")
            message += " | ";
        message += "HUMIDITY ALERT (" + currentHum + " <= " + humAlertValue + ") ";
    } else if (currentHum <= humWarningValue) {
        $("#iconHumidity").css("color", "orange");
    } else {
        $("#iconHumidity").css("color", "green");
    }

    var email = $("#txtAlertEmail").val();

    if (message !== "" && messageSentEmail !== email && email !== "") {
        var url = "sendAlert.php?email=" + email + "&key=1&message=" + encodeURIComponent(message);
        console.log("SENDING EMAIL...");
        console.log(url);
        $.ajax({
            url: url,
            success: function (response) {
                messageSentEmail = email;
                console.log("EMAIL SENT");
            }
        });
    }

}

/**
 * Actually pefroms a Web Service Call to pvCloud to retrieve last value registered for the app.
 * @param {type} callback
 * @returns {undefined}
 */
function GetPVCLOUDValue(callback) { /** /   Llamada en el browser, todo en el main.js */
    var url = BuildPVCloudURL_GetLastValue();

    $.ajax(url, {/** /Utiliza el url y hace que el browser llame a PVCloud, asincronica, no se detiene ahi, sigue llamando*/
        success: function (data) { /** /Data son los datos de PVCloud */
            callback(data); /** / Cuando tiene el dato, hace el callback y devuelve la info GetPVCLOUDValue, si no hay valores data es null  */
        },
        error: function (error) { /** / Error de comunicacion  */
            console.log(error);
            return null;
        }

    });

}

/**
 * Crafts a URL with the necessary parameters for getting last value from pvCloud
 * @returns {String}
 */
function BuildPVCloudURL_GetLastValue() {
    var api_key = "9c04d1bf0cb4b6409202b68495ebc06110011208";
    var device_id = 16; /** /    ID del Galileo */
    var account_id = 1;

    var url = "https://costaricamakers.com/pvcloud_backend/vse_get_value_last.php?account_id=" + account_id;
    url += "&device_id=" + device_id;
    url += "&api_key=" + api_key;
    url += "&optional_label=DHT11_READING";

    return url;
}
