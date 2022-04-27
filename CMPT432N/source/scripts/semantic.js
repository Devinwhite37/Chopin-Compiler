var TSC;
(function (TSC) {
    var Semantic = /** @class */ (function () {
        function Semantic(tokens) {
            this.tokenList = tokens;
            this.currentToken = 0;
        }
        Semantic.prototype.scope = function () {
        };
        return Semantic;
    }());
    TSC.Semantic = Semantic;
})(TSC || (TSC = {}));
