/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = /** @class */ (function () {
        function Lexer() {
            this.tokens = "";
            this.tokenRegEx = "";
            this.lineNum = 1;
            this.columnNum = 0;
            this.lexOutput = {};
        }
        Lexer.prototype.lex = function () {
            {
                // Grab the "raw" source code.
                var sourceCode = document.getElementById("taSourceCode").value;
                //console.log(sourceCode+" sourcecode");
                // Trim the leading and trailing spaces.
                sourceCode = TSC.Utils.trim(sourceCode);
                //var lineNum = sourceCode.split("\n");
                var columnNum = 0;
                var lineNum = 0;
                // Declare Regular Expressions based on our grammar.
                var L_BRACE = new RegExp('{$');
                var R_BRACE = new RegExp('}$');
                var EOP = new RegExp('$$');
                var L_PAREN = new RegExp('\\($');
                var R_PAREN = new RegExp('\\)$');
                var PRINT = new RegExp('print$');
                var WHILE = new RegExp('while$');
                var IF = new RegExp('if$');
                var INT_TYPE = new RegExp('int$');
                var BOOL_TYPE = new RegExp('boolean$');
                var STRING_TYPE = new RegExp('string$');
                var DOULBE_QUOTE = new RegExp('"$');
                var VARIABLE = new RegExp('[a-z]$');
                var ASSIGN = new RegExp('=$');
                var SPACE = new RegExp(' $');
                var NEW_LINE = new RegExp('\n$');
                var DIGIT = new RegExp('[0-9]$');
                var INTOP = new RegExp('\\+$');
                var BOOL_TRUE = new RegExp('true$');
                var BOOL_FALSE = new RegExp('false$');
                var BOOL_EQUAL = new RegExp('==$');
                var BOOL_NOTEQUAL = new RegExp('!=$');
                var BEGIN_COMMENT = new RegExp('\\/*$');
                var END_COMMENT = new RegExp('\\*/$');
                if (L_BRACE.test(sourceCode)) {
                    this.tokens = "L_BRACE";
                    this.tokenRegEx = "{";
                    this.lexOutput = {
                        "token": this.tokens,
                        "tokenRegEx": this.tokenRegEx,
                        "lineNum": this.lineNum,
                        "columnNum": this.columnNum
                    };
                    this.lineNum++;
                    this.columnNum++;
                    return this.lexOutput;
                }
                if (R_BRACE.test(sourceCode)) {
                    this.tokens = "R_BRACE";
                    this.tokenRegEx = "}";
                    this.lexOutput = {
                        "token": this.tokens,
                        "tokenRegEx": this.tokenRegEx,
                        "lineNum": this.lineNum,
                        "columnNum": this.columnNum
                    };
                    return this.lexOutput;
                }
            }
        };
        return Lexer;
    }());
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
