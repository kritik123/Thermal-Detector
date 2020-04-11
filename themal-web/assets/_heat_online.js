var trendNo = 1;
var liveData = 'https://dasdata.co/e.aspx?das=GnlPTmXtNF9WFf10JlFYilmbyer6bFUgZfXzQ7J9QDU9s5uT4POeUunKabsLDTIKxsphZ8NhLm4TUw8O2/fXAQ==&from=0&to=' + trendNo + '&json=1';
var colorData = 'assets/rgb_colors.json';

var heatDiv = '#divHeat';
var colorDiv = '#divColor';
var heatBackSpan = '';


cmdCheckHeat();

$(document).ready(function () {
    $("#distanceCalculator").hide();
    var interval = setInterval(
        function cmdUpdateSrv() {
            cmdCheckHeat();  // check heat map  

        }, 5000);
});

$("#myQRCode").qrcode({
    size: 250,
    fill: 'silver',
    text: 'http://queck.me'
});


$("#myDistanceLocator").click(function () {

   // $("#distanceCalculator").show("slow");

    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(52.497786, 13.350347),
        zoom: 18
    });
    //Load the GeoJSON and HeatMap modules
    Microsoft.Maps.loadModule(['Microsoft.Maps.GeoJson', 'Microsoft.Maps.HeatMap'], function () {
        // earthquake data in the past 30 days from usgs.gov   https://opendata.ecdc.europa.eu/covid19/casedistribution/json/   https://coronadatascraper.com/#features.json

        Microsoft.Maps.GeoJson.readFromUrl('https://gist.githubusercontent.com/wavded/1200773/raw/e122cf709898c09758aecfef349964a8d73a83f3/sample.json', function (shapes) {
            //   Microsoft.Maps.GeoJson.readFromUrl('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson', function (shapes) {
            var heatMap = new Microsoft.Maps.HeatMapLayer(shapes, { radius: 5, propertyAsWeight: 'mag' });
            map.layers.insert(heatMap);
        });
    });

});

$("#btnHideDistance").click(function () {
    $("#distanceCalculator").hide("slow");
});

function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(39.393486, -98.100769),
        zoom: 3
    });
    //Load the GeoJSON and HeatMap modules
    Microsoft.Maps.loadModule(['Microsoft.Maps.GeoJson', 'Microsoft.Maps.HeatMap'], function () {
        // earthquake data in the past 30 days from usgs.gov
        Microsoft.Maps.GeoJson.readFromUrl('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson', function (shapes) {
            var heatMap = new Microsoft.Maps.HeatMapLayer(shapes, { radius: 5, propertyAsWeight: 'mag' });
            map.layers.insert(heatMap);
        });
    });

}

/*
 * Basic Count Up from Date and Time
 * Author: @mrwigster / https://guwii.com/bytes/count-date-time-javascript/
 */
window.onload = function () {
    // Month Day, Year Hour:Minute:Second, id-of-element-container
    countUpFromTime("March 22, 2020 12:00:00", 'countup1'); // ****** Change this line!
};


function countUpFromTime(countFrom, id) {
    countFrom = new Date(countFrom).getTime();
    var now = new Date(),
        countFrom = new Date(countFrom),
        timeDifference = (now - countFrom);

    var secondsInADay = 60 * 60 * 1000 * 24,
        secondsInAHour = 60 * 60 * 1000;

    days = Math.floor(timeDifference / (secondsInADay) * 1);
    hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
    mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
    secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);

    var idEl = document.getElementById(id);
    idEl.getElementsByClassName('days')[0].innerHTML = days;
    idEl.getElementsByClassName('hours')[0].innerHTML = hours;
    idEl.getElementsByClassName('minutes')[0].innerHTML = mins;
    idEl.getElementsByClassName('seconds')[0].innerHTML = secs;

    clearTimeout(countUpFromTime.interval);
    countUpFromTime.interval = setTimeout(function () { countUpFromTime(countFrom, id); }, 1000);
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function cmdCheckDistance() {
    var startPos;
    var startPosLat;
    var startPosLong;
    var distance;

    if (navigator.geolocation) {


        startPosLat = 44.95716993150707;
        startPosLong = -93.28439280496818;

        $("#startLat").text(startPosLat);
        $("#startLon").text(startPosLong);

        navigator.geolocation.watchPosition(function (position) {
            $("#currentLat").text(position.coords.latitude);
            $("#currentLon").text(position.coords.longitude);

            distance = calculateDistance(startPosLat, startPosLong, position.coords.latitude, position.coords.longitude)
            $("#distance").text(distance);

            if (distance < .05) {
                $("#message").text("Yes, were inside .05 KM!!! :) A+")
            } else if (distance > .05) {
                $("#message").text("No, not inside .05 KM :(")
            }
        });
    }

}


function cmdCheckHeat() {
    var valLikes = '';
    $(heatDiv).empty();
    readTextFile(liveData, function (text) {
        var tempObj = JSON.parse(text)
        // console.log(arrayOfObjects.Table);
        q = 0; var heatFrontSpan = '';
        for (i in tempObj.Table) { // in all records entries 
            var updateTime = tempObj.Table[i].AIDate;
            $("#lastUpdateDate").html(updateTime);

            for (j in tempObj.Table[i]) { // in all records entries 
                // console.log(tempObj.Table[i][j]); 
                var heatData = tempObj.Table;
                var heatPoints = heatData.length - 1;
                q += 1;
                const heatColorMap = parseInt(tempObj.Table[i][j]);
                $(topValue).html(heatColorMap); // adjust temp
                if (q > 2) {
                    if (heatColorMap) {
                        // console.log(q);
                        $.each(rgbColors, function (i, v) {
                            var modThis = parseInt(v[1]) % parseInt(c2f(heatColorMap));
                            // console.log(v[1] + ' ' + c2f(heatColorMap) + ' mod:' + modThis);
                            if (modThis < 2) {
                                heatBackSpan = v[2];
                            }
                            if (modThis < 5 && modThis < 20) {
                                heatFrontSpan = v[2];
                            }
                        });

                    }
                    $(heatDiv).append('<span alt="' + heatColorMap + '" style="width:50px;height:50px;background:#' + heatBackSpan + ';color:#' + heatFrontSpan + '">' + heatColorMap + '</span> ');

                }
            }
        }

        /*
        var liveData = text.split(" ");
        var updateTime = liveData[0] + ' ' + liveData[1];
        var heatData = liveData[2].split(",");
        var heatPoints = heatData.length - 1;
        var heatLines = 8;

        $("#lastUpdateDate").html(liveData[0]);
        $("#lastUpdateTime").html(liveData[1]);
        $(heatDiv).empty();

        for (var i = 0; i < heatPoints; i++) {
            const heatColorMap = parseInt(heatData[i]);
            var heatFrontSpan = '';
            var heatBackSpan = '';
            if (heatColorMap) {
                $.each(rgbColors, function (i, v) {
                    var modThis = parseInt(v[1]) % parseInt(c2f(heatColorMap));
                    console.log(v[1] + ' ' + c2f(heatColorMap) + ' mod:' + modThis);
                    if (modThis < 2) {
                        heatBackSpan = v[2];
                    }
                    if (modThis < 5 && modThis < 20) {
                        heatFrontSpan = v[2];
                    } 
                });

                $(heatDiv).append('<span alt="' + heatColorMap + '" style="width:40px;height:40px;background:#' + heatBackSpan + ';color:#' + heatFrontSpan + '">' + heatColorMap + '</span> ');
            }
        }
        */
    });
}




function f2c(temp) {
    // converts from fahrenheit 2 celsius
    var convTemp = parseInt((parseInt(temp) - 32) * 5 / 9);
    return convTemp;
}

function c2f(temp) {
    // converts from celsius 2 fahrenheit
    var convTemp = parseInt(parseInt(temp) * 9 / 5 + 32);
    return convTemp;
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


// From http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/

// Start with a temperature, in Kelvin, somewhere between 1000 and 40000.  (Other values may work,
//  but I can't make any promises about the quality of the algorithm's estimates above 40000 K.)
function cmdTempColors(tempVal) {
    var valColors = '';
    readTextFile(colorData, function (text) {
        var arrayOfObjects = JSON.parse(text)
        var colorArray = json2array(arrayOfObjects);
        var tempValinF = c2f(tempVal);
        //    console.log(tempValinF + ' ' + colorArray[0]); 
        var backHeat = "ffff";
        $.each(colorArray, function (i, v) {
            var modThis = parseInt(v[1]) % parseInt(tempValinF);
            //  console.log(tempValinF + ' ' + v[1] + ' mod:' + modThis);
            if (modThis < 5) {
                //  console.log(v[2]);
                backHeat = v[2];
                var heatSpan = '<span style="background:#' + backHeat + '">' + tempVal + '</span>';
                // console.log(heatSpan);
                return (heatSpan);
            }
        });
        //   return backHeat;

        //   $(colorDiv).empty();
        //   $(colorDiv).html(arrayOfObjects.length);

        // $(colorDiv).html(colorArray[0]);
    });
}



// Reused code - copyright Moveable Type Scripts - retrieved May 4, 2010.
// http://www.movable-type.co.uk/scripts/latlong.html
// Under Creative Commons License http://creativecommons.org/licenses/by/3.0/
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
Number.prototype.toRad = function () {
    return this * Math.PI / 180;
}


var rgbColors = [
    [89, 188, "FF0DF0", "255,13,240"],
    [88, 186, "FF0CF0", "255,12,240"],
    [87, 184, "FF0BF0", "255,11,240"],
    [86, 182, "FF0AF0", "255,10,240"],
    [85, 180, "FF09F0", "255,9,240"],
    [84, 178, "FF08F0", "255,8,240"],
    [83, 176, "FF07F0", "255,7,240"],
    [82, 174, "FF06F0", "255,6,240"],
    [81, 172, "FF05F0", "255,5,240"],
    [80, 170, "FF04F0", "255,4,240"],
    [79, 168, "FF03F0", "255,3,240"],
    [78, 166, "FF02F0", "255,2,240"],
    [77, 164, "FF01F0", "255,1,240"],
    [76, 162, "FF00F0", "255,0,240"],
    [75, 160, "FF00E0", "255,0,224"],
    [74, 158, "FF00D0", "255,0,208"],
    [73, 156, "FF00C0", "255,0,192"],
    [72, 154, "FF00B0", "255,0,176"],
    [71, 152, "FF00A0", "255,0,160"],
    [70, 150, "FF0090", "255,0,144"],
    [69, 148, "FF0080", "255,0,128"],
    [68, 146, "FF0070", "255,0,112"],
    [67, 144, "FF0060", "255,0,96"],
    [66, 142, "FF0050", "255,0,80"],
    [65, 140, "FF0040", "255,0,64"],
    [64, 138, "FF0030", "255,0,48"],
    [63, 136, "FF0020", "255,0,32"],
    [62, 134, "FF0010", "255,0,16"],
    [61, 132, "FF0000", "255,0,0"],
    [60, 130, "FF0a00", "255,10,0"],
    [59, 128, "FF1400", "255,20,0"],
    [58, 126, "FF1e00", "255,30,0"],
    [57, 124, "FF2800", "255,40,0"],
    [56, 122, "FF3200", "255,50,0"],
    [55, 120, "FF3c00", "255,60,0"],
    [54, 118, "FF4600", "255,70,0"],
    [53, 116, "FF5000", "255,80,0"],
    [52, 114, "FF5a00", "255,90,0"],
    [51, 112, "FF6400", "255,100,0"],
    [50, 110, "FF6e00", "255,110,0"],
    [49, 108, "FF7800", "255,120,0"],
    [48, 106, "FF8200", "255,130,0"],
    [47, 104, "FF8c00", "255,140,0"],
    [46, 102, "FF9600", "255,150,0"],
    [45, 100, "FFa000", "255,160,0"],
    [44, 98, "FFaa00", "255,170,0"],
    [43, 96, "FFb400", "255,180,0"],
    [42, 94, "FFbe00", "255,190,0"],
    [41, 92, "FFc800", "255,200,0"],
    [40, 90, "FFd200", "255,210,0"],
    [39, 88, "FFdc00", "255,220,0"],
    [38, 86, "FFe600", "255,230,0"],
    [37, 84, "FFf000", "255,240,0"],
    [36, 82, "FFfa00", "255,250,0"],
    [35, 80, "fdff00", "253,255,0"],
    [34, 78, "d7ff00", "215,255,0"],
    [33, 76, "b0ff00", "176,255,0"],
    [32, 74, "8aff00", "138,255,0"],
    [31, 72, "65ff00", "101,255,0"],
    [30, 70, "3eff00", "62,255,0"],
    [29, 68, "17ff00", "23,255,0"],
    [28, 66, "00ff10", "0,255,16"],
    [27, 64, "00ff36", "0,255,54"],
    [26, 62, "00ff5c", "0,255,92"],
    [25, 60, "00ff83", "0,255,131"],
    [24, 58, "00ffa8", "0,255,168"],
    [23, 56, "00ffd0", "0,255,208"],
    [22, 54, "00fff4", "0,255,244"],
    [21, 52, "00e4ff", "0,228,255"],
    [20, 50, "00d4ff", "0,212,255"],
    [19, 48, "00c4ff", "0,196,255"],
    [18, 46, "00b4ff", "0,180,255"],
    [17, 44, "00a4ff", "0,164,255"],
    [16, 42, "0094ff", "0,148,255"],
    [15, 40, "0084ff", "0,132,255"],
    [14, 38, "0074ff", "0,116,255"],
    [13, 36, "0064ff", "0,100,255"],
    [12, 34, "0054ff", "0,84,255"],
    [11, 32, "0044ff", "0,68,255"],
    [10, 30, "0032ff", "0,50,255"],
    [9, 28, "0022ff", "0,34,255"],
    [8, 26, "0012ff", "0,18,255"],
    [7, 24, "0002ff", "0,2,255"],
    [6, 22, "0000ff", "0,0,255"],
    [5, 20, "0100ff", "1,0,255"],
    [4, 18, "0200ff", "2,0,255"],
    [3, 16, "0300ff", "3,0,255"],
    [2, 14, "0400ff", "4,0,255"],
    [1, 12, "0500ff", "5,0,255"]
];