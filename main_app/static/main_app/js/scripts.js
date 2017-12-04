/**
 * Created by lexy on 20.04.17.
 */
var textAreaContents = new Array(2);
var elemId;
var curLvlPage;

function outf(text) {
    var mypre = document.getElementById(elemId);
    mypre.innerHTML = mypre.innerHTML + text;
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runit(elem) {
    elemId = elem;

    var prog;

    if (elem == 'output1') {
        prog = textAreaContents[0].getValue();
    }
    else {
        prog = textAreaContents[1].getValue();
    }

    var mypre = document.getElementById(elemId);
    mypre.innerHTML = '';
    Sk.pre = "output";
    Sk.configure(
        {
            inputfun: function (prompt) {
                return window.prompt(prompt);
            },
            inputfunTakesPrompt: true,
            output: outf,
            read: builtinRead
        });

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';

    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });

    myPromise.then(function (mod) {
            var res = verifyCode();

            if (res != "") {
                mypre.innerHTML = res;
                decr_battery();
            }

        },
        function (err) {
            console.log(err.toString());
            mypre.innerHTML = err.toString();
            decr_battery();
        });
}

function decr_battery() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            reloadBattery(1);
        }
    };

    xmlHttp.open("GET", 'decr_battery/', false);
    xmlHttp.send();

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

    var newLvl = changeBatteryLvl(mode, lvl)
    document.getElementById('battery').src = src.replace("Battery" + lvl, "Battery" + newLvl);
    if (newLvl == 0) {
        location.href = '/map';
    }
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


function verifyCode() {
    curLvlPage = window.location.href.split("lvl")[1].split("#")[0];
    return verifySpecificLevel();
}

function verifySpecificLevel() {
    var res = "";
    switch (curLvlPage) {
        case '1':
            res = parseFirstLevel();
            break;
        case '2':
            res = parseSecondLevel();
            break;
        case '3':
            res = parseThirdLevel();
            break;
        case '4':
            res = parseFourthLevel();
            break;
        case '5':
            res = parseFifthLevel();
            break;
        case '6':
            res = parseSixthLevel();
            break;
        case '7':
            res = parseSeventhLevel();
            break;
        default:
            console.log('error');
            break;
    }

    return res;
}

function parseFirstLevel() {
    var code;

    if (elemId == 'output1') {
        code = textAreaContents[0].getValue();
        if (!code.includes('print')) {
            return "You should check 'print'";
        }
    }
    else {
        code = textAreaContents[1].getValue();
        if (!code.includes('print')) {
            return "There should be 'print' command";
        }
        if ((!code.includes('How') || !code.includes('how')) && !code.includes('are') && !code.includes('you')) {
            return "You should print 'How are you?'";
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'update_lvl/' + curLvlPage + '/', false);
        xmlHttp.send();

        document.getElementById("toSecLvlBtn").style.visibility = 'visible';
    }

    return "";
}

function parseSecondLevel() {
    var code;

    if (elemId == 'output1') {
        code = textAreaContents[0].getValue();
        if (!code.includes('print')) {
            return "You should check 'print' command";
        }
        if (!code.includes('input')) {
            return "You should check 'input' command";
        }
    }
    else {
        code = textAreaContents[1].getValue();
        if (!code.includes('input')) {
            return "There should be 'input' command";
        }
        if (!code.includes('print')) {
            return "There should be 'print' command";
        }
        if (!code.includes('are') && !code.includes('you') && !code.includes('already')) {
            return "You should print 'Wow, are you already 18?' (any age)";
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'update_lvl/' + curLvlPage + '/', false);
        xmlHttp.send();

        document.getElementById("next").style.visibility = 'visible';
    }

    return "";
}

function parseThirdLevel() {
    var code;

    if (elemId == 'output1') {
        code = textAreaContents[0].getValue();
        if (!code.includes('print')) {
            return "There should be 'print' command";
        }
        if (!code.includes('input')) {
            return "There should be 'input' command";
        }

        if (!code.includes('Name') && !code.includes('name')) {
            alert(code);
            return "The result should contain 'name'";
        }
        if (!code.includes('Phone') && !code.includes('phone')) {
            return "The result should contain 'phone'";
        }
        if (!code.includes('Email') && !code.includes('email')) {
            return "The result should contain 'email'";
        }

        document.getElementById("toNextTask").style.visibility = 'visible';
    }
    else {
        code = textAreaContents[1].getValue();
        if (!code.includes('print')) {
            return "There should be 'print' command";
        }
        if (!code.includes('-') && !code.includes('*') && !code.includes('/')) {
            return "There should be - * / operations";
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'update_lvl/' + curLvlPage + '/', false);
        xmlHttp.send();

        document.getElementById("toFourthLevel").style.visibility = 'visible';
    }

    return "";
}

function parseFourthLevel() {
    var code = textAreaContents[0].getValue();
    if (!code.includes('print')) {
        return "There should be 'print' command";
    }
    if (!code.includes('input')) {
        return "There should be 'input' command";
    }
    if (!code.includes('if')) {
        return "There should be 'if'";
    }
    if (!code.includes('Yes') && !code.includes('yes')) {
        return "There should be 'yes'";
    }
    if (!code.includes('else')) {
        return "There should be 'else'";
    }
    if (!code.includes('No') && !code.includes('no')) {
        return "There should be 'no'";
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'update_lvl/' + curLvlPage + '/', false);
    xmlHttp.send();

    document.getElementById("toFifthLvl").style.visibility = 'visible';


    return "";
}

function parseFifthLevel() {
    var code = textAreaContents[0].getValue();
    if (!code.includes('money')) {
        return "There should be variable 'money'";
    }

    if (!code.includes('0') || !code.includes('5')) {
        return "The first interval should be in range 0-5";
    }

    if (!code.includes('nothing') || !code.includes('you') || !code.includes('can') || !code.includes('buy')) {
        return "There should be a message 'Sorry, there's nothing you can buy'";
    }

    if (!code.includes('if')) {
        return "There should be 'if'";
    }

    if (!code.includes('elif')) {
        return "There should be 'elif'";
    }

    if (!code.includes('6') || !code.includes('20')) {
        return "The second interval should be in range 6-20";
    }

    if ((!code.includes('Buy') && !code.includes('buy')) || !code.includes('apple')) {
        return "There should be a message 'Buy an apple'";
    }

    if ((!code.includes('Buy') && !code.includes('buy')) || !code.includes('pie')) {
        return "There should be a message 'Buy a pie'";
    }

    if (!code.includes('21') || !code.includes('100')) {
        return "The third interval should be in range 21-100";
    }

    if ((!code.includes('Buy') && !code.includes('buy')) || !code.includes('anything') || !code.includes('else')) {
        return "There should be a message 'Buy anything else'";
    }

    if (!code.includes('101')) {
        return "The fourth interval should be in range 101 and more";
    }

    if (!code.includes('print')) {
        return "There should be 'print' command";
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'update_lvl/' + curLvlPage + '/', false);
    xmlHttp.send();

    document.getElementById("toSixthLvl").style.visibility = 'visible';


    return "";

}

function parseSixthLevel() {
    var code = textAreaContents[0].getValue();

    if (!code.includes('[') || !code.includes(']')) {
        return "There should be a list";
    }

    if (!code.includes('sort')) {
        return "You should sort a list";
    }

    if (!code.includes('insert') || (!code.includes('history') && !code.includes('History'))) {
        return "You should insert 'History'";
    }

    if (!code.includes('reverse')) {
        return "You should reverse a list";
    }

    if (!code.includes('pop')) {
        return "You should pop the first value";
    }

    if (!code.includes('len') || !code.includes('print')) {
        return "You should print length";
    }

    document.getElementById("toSeventhLevel").style.visibility = 'visible';
    return "";
}

function parseSeventhLevel() {
    var code = textAreaContents[0].getValue();

    if (!code.includes('for')) {
        return "There should be 'for'";
    }

    if (!code.includes('range')) {
        return "You should indicate range";
    }

    if (!code.includes('5') || !code.includes('8')) {
        return "The range should be 5-8";
    }

    if (!code.includes('print')) {
        return "There should be print";
    }

    if (!code.includes('*')) {
        return "There should be *";
    }

    document.getElementById("toNextBlock").style.visibility = 'visible';
    return "";
}

window.onload = function () {
    setInterval(incr_battery, 60000);

    for (var i = 0; i < 2; ++i) {
        textAreaContents[i] = CodeMirror.fromTextArea(document.getElementsByClassName("code-place")[i], {
            mode: {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            },
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true
        });
    }

};

