/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = /** @class */ (function () {
        function Lexer() {
            this.tokens = "";
            this.tokenRegEx = "";
            this.lineNum = 0;
            this.columnNum = 1;
            //lexOutput = {};
            this.currentIndex = 2;
            this.lexOutput = [];
            this.subStringStartIndex = 0;
            this.subStringEndIndex = 1;
        }
        Lexer.prototype.lex = function () {
            // Grab the "raw" source code.
            var sourceCode = document.getElementById("taSourceCode").value;
            //console.log(sourceCode+" sourcecode");
            // Trim the leading and trailing spaces.
            sourceCode = TSC.Utils.trim(sourceCode);
            //var lineNum = sourceCode.split("\n");
            // Declare Regular Expressions based on our grammar.
            var L_BRACE = new RegExp('{');
            var R_BRACE = new RegExp('}');
            var L_PAREN = new RegExp('\\(');
            var R_PAREN = new RegExp('\\)');
            var PRINT = new RegExp('print');
            var WHILE = new RegExp('while');
            var IF = new RegExp('if');
            var INT_TYPE = new RegExp('int');
            var BOOL_TYPE = new RegExp('boolean');
            var STRING_TYPE = new RegExp('string');
            var DOUBLE_QUOTE = new RegExp('"');
            var BOOL_EQUAL = new RegExp('==');
            var VARIABLE = new RegExp('[a-z]');
            var ASSIGN = new RegExp('=');
            var SPACE = new RegExp(' ');
            var NEW_LINE = new RegExp('\n');
            var DIGIT = new RegExp('[0-9]');
            var ADDITION_OP = new RegExp('\\+');
            var BOOL_TRUE = new RegExp('true');
            var BOOL_FALSE = new RegExp('false');
            var BOOL_NOTEQUAL = new RegExp('!=');
            var BEGIN_COMMENT = new RegExp('\\/*');
            var END_COMMENT = new RegExp('\\*/');
            var EOP = new RegExp('$');
            /*for(let j = 0; j < 2; j++){
                console.log("j: " + j);
            }*/
            while (1 == 1) {
                for (var i = 0; i < sourceCode.length; i++) {
                    if (NEW_LINE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.columnNum++;
                        this.lineNum = 0;
                    }
                    else if (SPACE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (L_BRACE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "L_BRACE";
                        this.tokenRegEx = "{";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (R_BRACE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "R_BRACE";
                        this.tokenRegEx = "}";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (L_PAREN.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "L_PAREN";
                        this.tokenRegEx = "(";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (R_PAREN.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "R_PAREN";
                        this.tokenRegEx = ")";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (PRINT.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 4))) {
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                        this.tokens = "PRINT";
                        this.tokenRegEx = "print";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 5;
                        this.lineNum += 5;
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                    }
                    else if (WHILE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                        this.tokens = "WHILE";
                        this.tokenRegEx = "while";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 5;
                        this.lineNum += 5;
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                    }
                    else if (IF.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex++))) {
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                        this.tokens = "IF";
                        this.tokenRegEx = "if";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                    }
                    else if (INT_TYPE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 3))) {
                        this.tokens = "INT_TYPE";
                        this.tokenRegEx = "int";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 3;
                        this.lineNum += 3;
                    }
                    else if (BOOL_TYPE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 7))) {
                        this.tokens = "BOOL_TYPE";
                        this.tokenRegEx = "boolean";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 7;
                        this.lineNum += 7;
                    }
                    else if (STRING_TYPE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 6))) {
                        this.tokens = "STRING_TYPE";
                        this.tokenRegEx = "string";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 6;
                        this.lineNum += 6;
                    }
                    else if (DOUBLE_QUOTE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "DOUBLE_QUOTE";
                        this.tokenRegEx = '"';
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (BOOL_EQUAL.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 2))) {
                        this.tokens = "BOOL_EQUAL";
                        this.tokenRegEx = "==";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                    }
                    else if (ASSIGN.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "ASSIGN";
                        this.tokenRegEx = "=";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (ADDITION_OP.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "ADDITION_OP";
                        this.tokenRegEx = "+";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (BOOL_TRUE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 4))) {
                        this.tokens = "BOOL_TRUE";
                        this.tokenRegEx = "true";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 4;
                        this.lineNum += 4;
                    }
                    else if (BOOL_FALSE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 5))) {
                        this.tokens = "BOOL_FALSE";
                        this.tokenRegEx = "false";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 5;
                        this.lineNum += 5;
                    }
                    else if (BOOL_NOTEQUAL.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex += 2))) {
                        this.tokens = "BOOL_NOTEQUAL";
                        this.tokenRegEx = "!=";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringEndIndex++;
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                    }
                    else if (EOP.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "EOP";
                        this.tokenRegEx = "$";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                    }
                }
                return this.lexOutput;
            }
            /*
            else if(VARIABLE.test(sourceCode)){
                this.tokens = "VARIABLE";
                this.tokenRegEx = sourceCode;
                this.lexOutput = {
                    "token": this.tokens,
                    "tokenRegEx": this.tokenRegEx,
                    "lineNum": this.lineNum,
                    "columnNum": this.columnNum
                };
                return this.lexOutput;
            }

        }
        else if(DIGIT.test(sourceCode)){
            this.tokens = "DIGIT";
            this.tokenRegEx = sourceCode;
            this.lexOutput = {
                "token": this.tokens,
                "tokenRegEx": this.tokenRegEx,
                "lineNum": this.lineNum,
                "columnNum": this.columnNum
            };
            return this.lexOutput;
        }


        else if(VARIABLE.test(sourceCode)){
            this.tokens = "VARIABLE";
            this.tokenRegEx = sourceCode;
            this.lexOutput = {
                "token": this.tokens,
                "tokenRegEx": this.tokenRegEx,
                "lineNum": this.lineNum,
                "columnNum": this.columnNum
            };
            return this.lexOutput;
        }*/
        };
        return Lexer;
    }());
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
