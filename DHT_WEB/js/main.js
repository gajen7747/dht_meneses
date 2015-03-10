$(document).ready(function () {
    $("#btnRED").click(function (event, ui) {
        console.log(event);
        console.log(ui);
        $("#btnRED").html('switching...<img style="margin:0 5px;" src="img/ajax-loader.gif">');

        $("#ifrResult").load(function (event) {
            $("#ifrResult").off('load');
            console.log("Iframe LOAD");
            console.log(event);
            $("#btnRED").html('DONE');
            $("#btnGREEN").html('Switch to GREEN');
            LoadColor("RED");
        });
    });

    $("#btnGREEN").click(function (event, ui) {
        console.log(event);
        console.log(ui);
        $("#btnGREEN").html('switching...<img style="margin:0 5px;" src="img/ajax-loader.gif">');

        $("#ifrResult").load(function (event) {
            $("#ifrResult").off('load');
            console.log("Iframe LOAD");
            console.log(event);
            $("#btnGREEN").html('DONE');
            $("#btnRED").html('Switch to RED');
            LoadColor("GREEN");
        });
    });

    //timedLoadColor();

    //timerLoadSensor();


});

function timerLoadSensor() {
    LoadSensor();
    setTimeout(timerLoadSensor, 5000);
}

function timedLoadColor() {
    LoadColor();
    setTimeout(timedLoadColor, 5000);
}
var currentColorInLastCommand = "";
function LoadColor(color) {

    
        $("#currentColor_LOADING").fadeIn(200);

        var url = "https://costaricamakers.com/pvcloud_backend/vse_get_value_last.php?account_id=1&device_id=14&api_key=45cff46a4939a46e3d68d881fd94d6e98486de44&optional_label=COLOR_COMMAND";
        $.ajax(url, {
            success: function (data) {
                console.log(data);
                color = data.vse_value;
                if (color !== currentColorInLastCommand) {
                    currentColorInLastCommand = color;
                    $("#currentColor_RED, #currentColor_GREEN").fadeOut(200);
                    $("#currentColor_LOADING").fadeOut(200, function () {
                        $("#currentColor_" + color).fadeIn(200);
                    });
                }
                $("#currentColor_LOADING").fadeOut(200);
            },
            error: function (error) {
                console.log(error);
            }
        });
    

}

function LoadSensor(value) {
    if (!value) {
        value = Math.ceil(Math.random() * 100);
    }

    console.log("LOAD SENSOR FOR VALUE: " + value);
    console.log(value);

    $("#currentSensorLoading").fadeIn();
    $("#sensorBar").text("...");
    var url = "https://costaricamakers.com/pvcloud_backend/vse_get_value_last.php?account_id=1&device_id=14&api_key=45cff46a4939a46e3d68d881fd94d6e98486de44&optional_label=SENSOR_VALUE";
    $.ajax(url, {
        success: function (data) {
            console.log(data);
            if (data !== null) {
                value = data.vse_value;
            }
            $("#sensorBar").attr("aria-value-now", value);
            $("#sensorBar").css("width", value + "%");
            $("#sensorBar").text(value + "%");
            $("#currentSensorLoading").fadeOut();
        },
        error: function (error) {
            console.log(error);
        }

    });


}