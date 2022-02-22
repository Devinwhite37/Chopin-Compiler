var TSC;
(function (TSC) {
    var TokenType;
    (function (TokenType) {
        TokenType["TLbrace"] = "TLbrace";
    })(TokenType = TSC.TokenType || (TSC.TokenType = {}));
    var Tokenizer = /** @class */ (function () {
        function Tokenizer(tokenType) {
            this.type = tokenType;
        }
        return Tokenizer;
    }());
    TSC.Tokenizer = Tokenizer;
})(TSC || (TSC = {}));
