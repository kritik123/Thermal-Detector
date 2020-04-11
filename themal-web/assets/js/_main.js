var devicesLocalFile = './../assets/home_devices.json';
var boardList = '';

// intial total consumption
var devTotalConsumption = 0;
var ConsumerScore = 1;

$(document).ready(function () {
    $('.menu .item')
        .tab();

    cmdDevicesList();
    cmdCalculateDevices();
    cmdChargeBattery();

    //  var consumNow = parseInt(document.getElementById("txtSelectedDevice").value); 
    ConsumerNow = parseInt($('#txtSelectedDevice').val());
    setTimeout(function () {
        console.log(ConsumerNow);

     // alert("Your consumption is TOO HIGH in this moment, consider unplug your bitcoin factory!")

    }, 10000);

    function cmdChargeBattery() {
        var boxes = $('#divBatteryNow');
        var boxesLength = boxes.length;
        //  $("#divBatteryNow").removeClass("empty").addClass("half");

        $.each(boxes, function (index, value) {
         //   $(value).toggleClass('red');
           $("#divBatteryNow").removeClass("empty").addClass("full");
        });

        setTimeout(function () {
           $("#divBatteryNow").removeClass("empty").addClass("full");
            cmdChargeBattery();
        }, 1000);
    }

    $(".checkDeviceBox").on("click", function (event) {
        alert(event)
        //  $('#divBatteryNow').html();
        //  $("#divBatteryNow").removeClass("red").addClass("green");

    });

    $("#btnBitCoinMine").on("click", function (event) {
        var _apiPostResult = '';
        $('#divBatteryNow').html();
        $("#divBatteryNow").removeClass("red").addClass("green");

    });

    function cmdPostMe(actionType, boardID, patternID) {
        var apiURL = 'api?=actiontype=' + actionType + '&token=' + boardID + '&pattern=' + patternID;
        $('#divLabel').html(boardID + ' ' + actionType);
        $.ajax({
            type: "POST",
            url: apiURL,
            success: function (response) {
                var arr = JSON.parse(response)
                _apiPostResult = JSON.stringify(arr);
                console.log(_apiPostResult);
            },
            error: function (err) {
                console.log('ERROR');
            }
        });
    }

    /*
        $("#btnRide").on("click", function (event) {
            var _apiPostResult = '';
            $('#divLabel').html();
            cmdPostMe('ride', selectedDevice, 'riding')
            $('#divLabel').html(" Ride mode ");
        });
    */

    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height > 100) {
            $('#section-two .grid').addClass('animated slideInUp');
        }
    });

    $('#toggle').click(function () {
        $('.ui.sidebar').sidebar('toggle');
    });

    var devTotalConsumption = 0;

    function cmdDevicesList() {
        readTextFile(devicesLocalFile, function (text) {
            var arrayOfObjects = JSON.parse(text);
            var cardBoards = '<h2>Your smarthome devices</h2><div class="ui one stackable cards">';
            for (var i = 0; i < arrayOfObjects.devices.length; i++) {
                var deviceName = arrayOfObjects.devices[i].deviceName;
                var deviceID = arrayOfObjects.devices[i].deviceID;
                var deviceDescription = arrayOfObjects.devices[i].deviceDescription;
                var deviceConsumption = arrayOfObjects.devices[i].deviceConsumption;
                var deviceUnit = arrayOfObjects.devices[i].deviceUnit;
                var devicePicture = arrayOfObjects.devices[i].devicePicture;
                var deviceStatus = arrayOfObjects.devices[i].deviceStatus;

                var deviceOnOff = "off";
                var switchOnOffCheck = "check";
                if (deviceStatus == deviceOnOff) {
                    deviceOnOff = "grey big ";
                    switchOnOffCheck = "";
                } else {
                    devTotalConsumption += parseInt(deviceConsumption); // get selected values from devices
                    switchOnOffCheck = "checked";
                    deviceOnOff = "green big ";
                }
                //  onclick="cmdUpdateConsumption(\'' + deviceID + '\', \'' + deviceConsumption + '\')"

                var switchControlOnOff = '<div class="ui bigCheckbox" "> <input style="width:50px;height:53px;" type="checkbox"  class="ui form right floated checkDeviceBox" onclick="cmdUpdateConsumption(this)" value="' + deviceConsumption + '" id="on-off-switch' + deviceID + '" name="switch' + deviceID + '" ' + switchOnOffCheck + '></div>';
                cardBoards += '<div style="cursor:pointer;" class="ui card"><div class="content">' + switchControlOnOff + '<i style="cursor:pointer;margin-right:20px;"  class="left floated ' + devicePicture + ' icon button big ' + deviceOnOff + '"></i><div class="header">' + deviceName + ' (' + deviceConsumption + ' ' + deviceUnit + ')</div><p>' + deviceDescription + '</p></div></div>';
                //   cardBoards  += deviceName;                
            }
            cardBoards += '</div><br><br>';
            $('#divHomeDevices').html(cardBoards);
            $('#txtSelectedDevice').val(devTotalConsumption);
            $('#divHomeDevicesLenght').html(' ' + arrayOfObjects.devices.length + ' registred devices');
        });
    }

    function cmdCalculateDevices() {
        var ConsumerNow = 1;
        ConsumerNow = parseInt($('#txtSelectedDevice').val());
        var ConsumerBonusNow = parseInt(1 / ConsumerNow * 0.00025);
        var ConsumerWeek = ConsumerNow * 7;
        var ConsumerBonusWeek = ConsumerBonusNow * 7;
        var ConsumerMonth = ConsumerWeek * 4;
        var ConsumerBonusMonth = ConsumerBonusWeek * 4;
        var ConsumerYear = ConsumerMonth * 12;
        var ConsumerBonusYear = ConsumerBonusMonth * 12;
        //  var ConsumerScore = ConsumerBonusYear / 100;

        //  alert(ConsumerNow);
        $('#divConsumerScore').html(ConsumerScore);
        //  $('#divConsumerNow').html(ConsumerNow + ' kWH');
        $('#divConsumerBonusNow').html(ConsumerBonusNow + ' units');
        $('#divConsumerWeek').html(ConsumerWeek + ' kWH');
        $('#divConsumerBonusWeek').html(ConsumerBonusWeek + ' units');
        $('#divConsumerMonth').html(ConsumerMonth + ' kWH');
        $('#divConsumerBonusMonth').html(ConsumerBonusMonth + ' units');
        $('#divConsumerYear').html(ConsumerYear + ' kWH');
        $('#divConsumerBonusYear').html(ConsumerBonusYear + ' units');
        //  $('#consumer').html(cardBoards);

        setTimeout(function () {
            //  $("#divBatteryNow").removeClass("empty").addClass("half");
            $('#txtSelectedDevice').val(devTotalConsumption);
            $('#divConsumerNow').html((parseInt(ConsumerNow)) + ' kWH');
            // make this loop 
            if (!ConsumerNow) {
                cmdCalculateDevices();
            }

        }, 100);

    }


    function cmdCheckLikes() {
        var valLikes = '';
        readTextFile(likesLocalFile, function (text) {
            var arrayOfObjects = JSON.parse(text)
            $(likeDiv).empty();
            $(likeDiv).html(arrayOfObjects.likes.length);
        });
    }


    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function (key) {
            result.push(json[key]);
        });
        return result;
    }

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }


});



function cmdNotify() {
    alert("Your consumption is TOO HIGH in this moment, consider unplug your bitcoin factory!");
    $('#divNotification').html();
    document.getElementById("divNotification").style.display = "none";
}

function cmdUpdateConsumption(el) {
    //  document.querySelector('#'+el.id).checked;
    var checkSel = document.querySelector('#' + el.id).checked;
    var consumNow = parseInt(document.getElementById("txtSelectedDevice").value);
    var consumSelDevice = parseInt(el.value);

    //  document.getElementById("txtSelectedDevice").value = el.value;

    if (!checkSel) {
        consumNow = consumNow - consumSelDevice;
        console.log('add comsumption' + consumNow);
    } else {
        consumNow = consumNow + consumSelDevice;
        console.log('remove comsumption' + consumNow);
    }
    //  var selectedElement = "on-off-switch"+  what;
    //  console.log(selectedElement);

    $('#txtSelectedDevice').val(consumNow);
    ConsumerNow = parseInt($('#txtSelectedDevice').val());
    cmdReCalculateDevices();
}


function cmdReCalculateDevices() {
    ConsumerNow = parseInt($('#txtSelectedDevice').val());
    var ConsumerBonusNow = parseInt(ConsumerNow * 0.00025);
    var ConsumerWeek = ConsumerNow * 7;
    var ConsumerBonusWeek = ConsumerBonusNow * 7;
    var ConsumerMonth = ConsumerWeek * 4;
    var ConsumerBonusMonth = ConsumerBonusWeek * 4;
    var ConsumerYear = ConsumerMonth * 12;
    var ConsumerBonusYear = ConsumerBonusMonth * 12;
    //  var ConsumerScore = ConsumerBonusYear / 100;

    //  alert(ConsumerNow);
    $('#divConsumerScore').html(ConsumerScore);
    //  $('#divConsumerNow').html(ConsumerNow + ' kWH');
    $('#divConsumerBonusNow').html(ConsumerBonusNow + ' units');
    $('#divConsumerWeek').html(ConsumerWeek + ' kWH');
    $('#divConsumerBonusWeek').html(ConsumerBonusWeek + ' units');
    $('#divConsumerMonth').html(ConsumerMonth + ' kWH');
    $('#divConsumerBonusMonth').html(ConsumerBonusMonth + ' units');
    $('#divConsumerYear').html(ConsumerYear + ' kWH');
    $('#divConsumerBonusYear').html(ConsumerBonusYear + ' units');
    //  $('#consumer').html(cardBoards);




    setTimeout(function () {
        //  $("#divBatteryNow").removeClass("empty").addClass("half");
        //   $('#txtSelectedDevice').val(devTotalConsumption);
        $('#divConsumerNow').html((parseInt(ConsumerNow)) + ' kWH');

        console.log(ConsumerNow);
        if (ConsumerNow > 800) {
            document.getElementById("divNotification").style.display = "display";

            $("#divBatteryNow").addClass("red");
            $("#divBatteryWeek").addClass("red");
            $("#divBatteryMonth").addClass("red");
            $("#divBatteryYear").addClass("red");
            $("#divBatteryNow").addClass("full");
            $("#divBatteryNow").removeClass("green").addClass("red");
            $("#divBatteryWeek").removeClass("green").addClass("red");
            $("#divBatteryMonth").removeClass("green").addClass("red");
            $("#divBatteryYear").removeClass("green").addClass("red");
        } else {
            $("#divBatteryNow").addClass("full");
            $("#divBatteryNow").removeClass("red").addClass("green");
            $("#divBatteryWeek").removeClass("red").addClass("green");
            $("#divBatteryMonth").removeClass("red").addClass("green");
            $("#divBatteryYear").removeClass("red").addClass("green");

        }

        // make this loop
        // cmdCalculateDevices();  
    }, 400);

}