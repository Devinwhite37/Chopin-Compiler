var TSC;
(function (TSC) {
    var CodeGen = /** @class */ (function () {
        function CodeGen(tokens) {
            this.tokenList = tokens;
            this.createdCode = [];
            this.codeGenOP = [];
            this.curLocation = 0;
            //this.createdCode.push("Program 1");
            for (var i = 0; i < 256; i++) {
                this.createdCode.push("00");
            }
            //console.log(this.symbolList);
            this.createdCode[254] = "e".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[253] = "s".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[252] = "l".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[251] = "a".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[250] = "f".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[248] = "e".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[247] = "u".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[246] = "r".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[245] = "t".charCodeAt(0).toString(16).toUpperCase();
        }
        CodeGen.prototype.codeGenOutput = function () {
            return this.codeGenOP;
        };
        CodeGen.prototype.codeOutput = function () {
            console.log(this.createdCode);
            this.setHex("A9");
            this.setHex("00");
            return this.createdCode;
        };
        CodeGen.prototype.setHex = function (curHex) {
            this.createdCode[this.curLocation++] = curHex;
        };
        return CodeGen;
    }());
    TSC.CodeGen = CodeGen;
})(TSC || (TSC = {}));
