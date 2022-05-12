var TSC;
(function (TSC) {
    var CodeGen = /** @class */ (function () {
        function CodeGen() {
            this.staticTable = [];
            this.staticAreaLocation = 0;
            //this.ast = new Semantic(astRes);
            this.createdCode = [];
            this.codeGenLog = [];
            this.hexLocation = 0;
            this.heapStart = 245;
            this.staticTable = [];
            this.staticId = 0;
            //this.tree = {};
            //this.astG = new Semantic();
            //this.createdCode.push("Program 1");
            for (var i = 0; i < 256; i++) {
                this.createdCode.push("00");
            }
            //console.log(this.symbolList);
            this.codeGenLog.push("Added string [true] to heap, address 245");
            this.codeGenLog.push("Added string [false] to heap, address 250");
            this.createdCode[245] = "t".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[246] = "r".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[247] = "u".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[248] = "e".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[250] = "f".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[251] = "a".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[252] = "l".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[253] = "s".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[254] = "e".charCodeAt(0).toString(16).toUpperCase();
        }
        CodeGen.prototype.codeGenOutput = function (astRes) {
            var ast = astRes;
            if (ast === undefined) {
            }
            else {
                this.traverse(ast.root);
            }
            this.staticArea();
            this.backPatch();
            return this.codeGenLog;
        };
        CodeGen.prototype.codeOutput = function () {
            return this.createdCode;
        };
        CodeGen.prototype.setHex = function (curHex) {
            this.createdCode[this.hexLocation] = curHex;
            this.codeGenLog.push("Adding " + curHex + " at byte [" + this.hexLocation + "]");
            this.hexLocation++;
        };
        CodeGen.prototype.traverse = function (node) {
            var DIGIT = new RegExp('[0-9]');
            //const STRING = new RegExp('[a-z]');
            console.log(node);
            console.log(node.name);
            if (node.name == 'Root') {
                this.traverse(node.children[0]);
            }
            else if (node.name.slice(0, 7) == 'Program') {
                this.traverse(node.children[0]);
            }
            else if (node.name == 'Block') {
                for (var i = 0; i < node.children.length; i++) {
                    this.traverse(node.children[i]);
                }
            }
            else if (node.name == 'PrintStatement') {
                console.log(node.children[0].value);
                this.codeGenLog.push("Generating op code for PrintStatement:");
                //tests if the value in the print is a digit
                // tests if the value in print is a variable
                if (node.children[0].value == 'variable') {
                    this.setHex("AC");
                    var variable = node.children[0].name[0];
                    var scope = node.children[0].scope;
                    var staticVal = this.findVariable(variable, scope);
                    this.setHex(staticVal);
                    this.setHex("00");
                    for (var j = 0; j < this.staticTable.length; j++) {
                        if (this.staticTable[j][0].value == staticVal) {
                            if (this.staticTable[j][0].type == 'string' || this.staticTable[j][0].type == 'boolean') {
                                // load x regis with 2
                                this.setHex("A2");
                                this.setHex("02");
                            }
                            else if (this.staticTable[j][0].type == 'int') {
                                this.setHex("A2");
                                this.setHex("01");
                            }
                        }
                    }
                }
                //tests if the value in print is a string
                else if (node.children[0].value == 'string') {
                    this.setHex("A0");
                    ///console.log(node.children[1].name);
                    var hexVal = this.heapString(node.children[0].name);
                    this.setHex(hexVal);
                    this.setHex("A2");
                    this.setHex("02");
                }
                else if (node.children[0].value == 'boolean') {
                    this.setHex("A0");
                    if (node.children[0].name[0] == 'true') {
                        this.setHex((245).toString(16).toUpperCase());
                    }
                    else if (node.children[0].name[0] == "false") {
                        this.setHex((250).toString(16).toUpperCase());
                    }
                    this.setHex("A2");
                    this.setHex("02");
                }
                else if (node.children[0].value == 'digit' && node.children[1] === undefined) {
                    this.setHex("A0");
                    this.setHex("0" + node.children[0].name[0]);
                    this.setHex("A2");
                    this.setHex("01");
                }
                if (node.children[1] === undefined) { }
                else if (node.children[1].name == "ADDITION_OP") {
                    this.additionOp(node.children);
                    this.setHex("AC");
                    this.setHex("00");
                    this.setHex("00");
                    this.setHex("A2");
                    this.setHex("01");
                }
                else if (node.children[1].name[0] == 'BOOL_EQUAL' || node.children[1].name[0] == 'BOOL_NOTEQUAL') {
                    var address = this.handleBoolEqual(node.children);
                    this.setHex("EC");
                    this.setHex(address);
                    this.setHex("00");
                    this.setHex("D0");
                    this.setHex("0A");
                    this.setHex("A0");
                    //points to static location of saved true and false values
                    if (node.children[1].name[0] == 'BOOL_EQUAL') {
                        this.setHex("F5");
                    }
                    else {
                        this.setHex("FA");
                    }
                    this.setHex("AE");
                    this.setHex("FF");
                    this.setHex("00");
                    this.setHex("EC");
                    this.setHex("FE");
                    this.setHex("00");
                    this.setHex("D0");
                    this.setHex("02");
                    this.setHex("A0");
                    //points to static location of saved true and false values
                    if (node.children[1].name[0] == 'BOOL_EQUAL') {
                        this.setHex("FA");
                    }
                    else {
                        this.setHex("F%");
                    }
                    this.setHex("A2");
                    this.setHex("02");
                }
                this.setHex("FF");
            }
            else if (node.name == 'VarDecl') {
                this.codeGenLog.push("Generating op code for VarDecl:");
                this.setHex("A9");
                this.setHex("00");
                var staticValue = "T" + this.staticId;
                this.setHex("8D");
                this.setHex(staticValue);
                this.staticTable.push([{
                        key: node.children[1].name[0],
                        type: node.children[0].name[0],
                        scope: node.children[1].scope,
                        value: staticValue,
                        byteNum: this.hexLocation
                    }]);
                this.setHex("00");
                this.staticId++;
            }
            else if (node.name == 'AssignmentStatement') {
                this.codeGenLog.push("Generating op code for AssignmentStatement:");
                if (DIGIT.test(node.children[1].name[0])) {
                    this.setHex("A9");
                    this.setHex("0" + node.children[1].name[0]);
                }
                else if (node.children[1].value == 'string') {
                    var hexVal = this.heapString(node.children[1].name);
                    this.setHex("A9");
                    this.setHex(hexVal);
                }
                else if (node.children[1].value == 'boolean') {
                    if (node.children[1].name[0] == 'true') {
                        this.setHex("A9");
                        this.setHex((245).toString(16).toUpperCase());
                    }
                    else if (node.children[1].name[0] == "false") {
                        this.setHex("A9");
                        this.setHex((250).toString(16).toUpperCase());
                    }
                }
                else if (node.children[1].value == 'variable') {
                    this.setHex("AD");
                    var variable = node.children[1].name[0];
                    var scope = node.children[1].scope;
                    var staticVal = this.findVariable(variable, scope);
                    this.setHex(staticVal);
                    this.setHex("00");
                }
                var variable = node.children[0].name[0];
                var scope = node.children[0].scope;
                var staticVal = this.findVariable(variable, scope);
                this.setHex("8D");
                this.setHex(staticVal);
                this.setHex("00");
            }
            //this.traverse(node.parent.children[1]);
        };
        CodeGen.prototype.handleBoolEqual = function (node) {
            console.log(node);
            if (node[0].value == 'digit') {
                this.setHex("A2");
                this.setHex("0" + node[0].name);
            }
            if (node[2].value == 'digit') {
                this.setHex("A9");
                this.setHex("0" + node[2].name);
                var temp = "00";
                this.setHex("8D");
                this.setHex(temp);
                this.setHex("00");
                return temp;
            }
        };
        CodeGen.prototype.additionOp = function (node) {
            console.log("node:");
            console.log(node);
            if (node[0].value == 'digit') {
                this.setHex("A9");
                this.setHex("0" + node[0].name[0]);
                this.setHex("8D");
                this.setHex("00");
                this.setHex("00");
            }
            if (node[1] === undefined) {
                return;
            }
            else if (node[1].name == 'ADDITION_OP') {
                this.additionOp(node[1].children);
            }
            if (node[0].value == 'digit') {
                this.setHex("A9");
                this.setHex("0" + node[0].name[0]);
            }
            this.setHex("6D");
            this.setHex("00");
            this.setHex("00");
            this.setHex("8D");
            this.setHex("00");
            this.setHex("00");
        };
        CodeGen.prototype.staticArea = function () {
            this.staticAreaLocation = this.hexLocation + 1;
            var staticVarsLength = this.staticTable.length;
            for (var i = 0; i < this.staticTable.length; i++) {
                var newAddressVal = this.staticAreaLocation.toString(16).toUpperCase();
                if (newAddressVal.length < 2) {
                    newAddressVal = "0" + newAddressVal;
                }
                //for(var j = 0; j < this.staticTable.length; j++){
                // if(this.staticTable[i][0].)
                this.staticTable[i][0].byteNum = newAddressVal;
                this.staticAreaLocation++;
                //}
            }
        };
        CodeGen.prototype.backPatch = function () {
            for (var i = 0; i < this.createdCode.length; i++) {
                //console.log(this.createdCode[i].slice(0, 1));
                if (this.createdCode[i] === undefined) { }
                else if (this.createdCode[i].charAt(0) == "T") {
                    var patchVal = this.createdCode[i];
                    for (var j = 0; j < this.staticTable.length; j++) {
                        if (this.staticTable[j][0].value == patchVal) {
                            var memAddr = this.staticTable[j][0].byteNum;
                            this.createdCode[i] = memAddr;
                            this.codeGenLog.push("BackPatching " + patchVal + " with " + memAddr);
                        }
                    }
                }
            }
        };
        CodeGen.prototype.findVariable = function (variable, scope) {
            console.log(this.staticTable);
            for (var i = 0; i < this.staticTable.length; i++) {
                //var staticObject = itr.next();
                if (this.staticTable[i][0].key == variable && this.staticTable[i][0].scope <= scope) {
                    return this.staticTable[i][0].value;
                }
            }
        };
        CodeGen.prototype.heapString = function (string) {
            var stringLength = string.length;
            this.heapStart = this.heapStart - (stringLength + 1);
            var hexVal = this.heapStart;
            for (var i = this.heapStart; i < this.heapStart + stringLength; i++) {
                this.createdCode[i] = string.charCodeAt(i - this.heapStart).toString(16).toUpperCase();
                this.codeGenLog.push("Adding " + this.createdCode[i] + " at byte [" + i + "]");
            }
            return hexVal.toString(16).toUpperCase();
        };
        return CodeGen;
    }());
    TSC.CodeGen = CodeGen;
})(TSC || (TSC = {}));
