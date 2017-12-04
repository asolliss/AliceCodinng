/**
 * Created by lexy on 12.05.17.
 */
function goToLevel(level) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location = this.responseText;
        }
    };

    xmlHttp.open("GET", 'lvl/' + level + '/', false);
    xmlHttp.send();
}

function goToTest() {
    window.location = '/test';
}

function incr_battery() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            reloadBattery(2);
        }
    };

    xmlHttp.open("GET", 'incr_battery/', false);
    xmlHttp.send();
}

function reloadBattery(mode) {
    var src = document.getElementById('battery').src;
    var lvl = parseInt(src.split('Battery')[1][0]);

    document.getElementById('battery').src = src.replace("Battery"+lvl,"Battery"+changeBatteryLvl(mode, lvl));
}

function changeBatteryLvl(mode, lvl) {
    if (mode == 1) {
        if (lvl > 0) {
            return lvl - 1;
        }
    }
    else {
        if (lvl < 4) {
            return lvl + 1;
        }
    }
    return lvl;
}


window.onload = function () {
    setTimeout(incr_battery, 60000);
};