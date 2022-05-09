var TSC;
(function (TSC) {
    var CodeGen = /** @class */ (function () {
        function CodeGen(tokens) {
            this.tokenList = tokens;
            this.currentCode = [];
            this.currentCode.push("Program 1");
            for (var i = 0; i < 256; i++) {
                this.currentCode.push("00");
            }
        }
        CodeGen.prototype.codeOutput = function () {
            console.log(this.currentCode);
            return this.currentCode;
        };
        return CodeGen;
    }());
    TSC.CodeGen = CodeGen;
})(TSC || (TSC = {}));
