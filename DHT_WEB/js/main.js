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
    if (!stopFlag) {
        var time = $("#txtCheckTime").val();

        $("#val_T").html("...");
        $("#val_H").html("...");
        $("#created_datetime").html("loading...");

        GetPVCLOUDValue(function (response) {
            processResponse(response);
            $("#imgClock").show();
            setTimeout(beginCapture, time * 1000);
        });
    }
}

/**
 * Processes a response value coming from retrieving data from pvCloud
 * @param {object} response
 * @returns {undefined}
 */
function processResponse(response) {
    var value = JSON.parse(response.vse_value);
    var created_datetime = response.created_datetime;
    if (value) {
        $("#val_T").html(value.t);
        $("#val_H").html(value.h);


        var now = new Date();
        var createdDateObj = new Date(created_datetime);
        createdDateObj.setHours(createdDateObj.getHours() + 1);
        console.log(now);

        console.log(createdDateObj);
        $("#created_datetime").html(createdDateObj);

        var diffsec = (now - createdDateObj) / 1000;

        if (diffsec > 60) {
            $("#created_datetime").css("color", "red");
        } else {
            $("#created_datetime").css("color", "green");
        }
        
        processWarnings();
        console.log(diffsec);

    }
    console.log(value);
}

function processWarnings() {
    var tempWarningValue = 1* $("#txtWarning_T_Trigger").val();
    var tempAlertValue = 1* $("#txtAlert_T_Trigger").val();
    var humWarningValue = 1* $("#txtWarning_H_Trigger").val();
    var humAlertValue = 1* $("#txtAlert_H_Trigger").val();
    var currentTemp = 1 *  $("#val_T").text();
    var currentHum = 1 * $("#val_H").text();

    console.log({currentTemp:currentTemp, currentHum:currentHum});
    console.log({tempWarning: tempWarningValue, tempAlert: tempAlertValue, humWarning: humWarningValue, humAlert: humAlertValue});
    
    if (currentTemp >= tempAlertValue) {
        $("#iconTemperature").css("color", "red");
    } else if (currentTemp >= tempWarningValue) {
        $("#iconTemperature").css("color", "orange");
    } else {
        $("#iconTemperature").css("color", "green");
    }

    if (currentHum <= humAlertValue) {
        $("#iconHumidity").css("color", "sienna");
    } else if (currentHum <= humWarningValue) {
        $("#iconHumidity").css("color", "orange");
    } else {
        $("#iconHumidity").css("color", "green");
    }
}

/**
 * Actually pefroms a Web Service Call to pvCloud to retrieve last value registered for the app.
 * @param {type} callback
 * @returns {undefined}
 */
function GetPVCLOUDValue(callback) {
    var url = BuildPVCloudURL_GetLastValue();

    $.ajax(url, {
        success: function (data) {
            callback(data);
        },
        error: function (error) {
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
    var device_id = 16;
    var account_id = 1;

    var url = "https://costaricamakers.com/pvcloud_backend/vse_get_value_last.php?account_id=" + account_id;
    url += "&device_id=" + device_id;
    url += "&api_key=" + api_key;
    url += "&optional_label=DHT11_READING";

    return url;
}