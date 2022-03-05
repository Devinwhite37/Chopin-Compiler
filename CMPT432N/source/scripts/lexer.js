/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = /** @class */ (function () {
        function Lexer() {
            this.tokens = "";
            this.tokenRegEx = "";
            this.lineNum = 0;
            this.columnNum = 1;
            this.currentIndex = 2;
            this.lexOutput = [];
            this.subStringStartIndex = 0;
            this.subStringEndIndex = 1;
            this.eopFound = false;
            this.programNum = 1;
            this.commented = false;
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
            var BOOL_EQUAL = new RegExp('\=\=');
            var VARIABLE = new RegExp('[a-z]');
            var ASSIGN = new RegExp('=');
            var SPACE = new RegExp(' ');
            var NEW_LINE = new RegExp('\n');
            var DIGIT = new RegExp('[0-9]');
            var ADDITION_OP = new RegExp('\\+');
            var BOOL_TRUE = new RegExp('true');
            var BOOL_FALSE = new RegExp('false');
            var BOOL_NOTEQUAL = new RegExp('\\!\=');
            var BEGIN_COMMENT = new RegExp('\\/*');
            var END_COMMENT = new RegExp('\\*/');
            var EOP = new RegExp('\\$');
            var ANY_CHAR = new RegExp('.');
            var INVALID_CHAR = new RegExp('^(?!.*([a-z]|[0-9]|{|}|\\(|\\)|=|\\+| |"|!|\\$|/|\\*|))');
            while (1 == 1) {
                while (sourceCode.length >= this.subStringEndIndex) {
                    console.log("WHILE RAN");
                    //for(let i = 0; i < sourceCode.length; i++){
                    /*if(BEGIN_COMMENT.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
                        if(ANY_CHAR.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
                            this.subStringStartIndex++;
                            this.lineNum++;
                        }
                        else if(END_COMMENT.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
                            continue;
                        }
                    }*/
                    if (sourceCode.charAt(this.subStringEndIndex - 1) == "/" && sourceCode.charAt(this.subStringEndIndex) == "*") {
                        console.log(this.subStringEndIndex);
                        console.log(this.subStringStartIndex);
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                        this.subStringEndIndex += 2;
                        this.commented = true;
                        while (this.commented = true) {
                            console.log("while" + this.subStringEndIndex);
                            console.log("while" + this.subStringStartIndex);
                            if (sourceCode.charAt(this.subStringEndIndex - 1) == "*" && sourceCode.charAt(this.subStringEndIndex) == "/") {
                                console.log("ELSE RAN2");
                                this.subStringStartIndex += 2;
                                this.lineNum += 2;
                                this.subStringEndIndex++;
                                //this.subStringEndIndex++;
                                this.commented = false;
                                break;
                            }
                            else if (ANY_CHAR.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                                console.log("ANYCHR RAN");
                                console.log("ANY_CHAR");
                                this.subStringStartIndex++;
                                this.lineNum++;
                                //this.subStringEndIndex++;
                            }
                            else {
                                break;
                            }
                            this.subStringEndIndex++;
                        }
                        //this.subStringEndIndex++;
                        console.log(this.subStringEndIndex);
                        console.log(this.subStringStartIndex);
                    }
                    /*else if(sourceCode.charAt(this.subStringEndIndex-1) == "*" && sourceCode.charAt(this.subStringEndIndex) == "/"){
                        console.log("ELSE RAN1");
                        //this.subStringStartIndex+=2;
                        this.lineNum++;
                        //this.subStringEndIndex++;
                        this.commented = false;
                    }*/
                    if (NEW_LINE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log("Start Index: " + this.subStringStartIndex);
                        console.log("End Index: " + this.subStringEndIndex);
                        this.subStringStartIndex++;
                        this.columnNum++;
                        this.lineNum = 0;
                    }
                    //ignore all characters in comment block
                    /*else if(ANY_CHAR.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
                        console.log("ANY_CHAR");
                        this.subStringStartIndex++;
                        this.lineNum++;
                        this.subStringEndIndex++;
                    }*/
                    else if (SPACE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (L_BRACE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log(this.subStringEndIndex);
                        console.log(this.subStringStartIndex);
                        this.tokens = "L_BRACE";
                        this.tokenRegEx = "{";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (R_BRACE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log(this.subStringEndIndex);
                        console.log(this.subStringStartIndex);
                        this.tokens = "R_BRACE";
                        this.tokenRegEx = "}";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
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
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "i" && sourceCode.charAt(this.subStringEndIndex) == "f") {
                        this.tokens = "IF";
                        this.tokenRegEx = "if";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                        this.subStringEndIndex++;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "i" && sourceCode.charAt(this.subStringEndIndex) == "n" && sourceCode.charAt(this.subStringEndIndex + 1) == "t" && sourceCode.charAt(this.subStringEndIndex - 3) != "p") {
                        this.tokens = "INT_TYPE";
                        this.tokenRegEx = "int";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 3;
                        this.lineNum += 3;
                        this.subStringEndIndex += 2;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "p" && sourceCode.charAt(this.subStringEndIndex) == "r" && sourceCode.charAt(this.subStringEndIndex + 1) == "i" && sourceCode.charAt(this.subStringEndIndex + 2) == "n" && sourceCode.charAt(this.subStringEndIndex + 3) == "t") {
                        this.tokens = "PRINT";
                        this.tokenRegEx = "print";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 5;
                        this.lineNum += 5;
                        this.subStringEndIndex += 4;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "w" && sourceCode.charAt(this.subStringEndIndex) == "h" && sourceCode.charAt(this.subStringEndIndex + 1) == "i" && sourceCode.charAt(this.subStringEndIndex + 2) == "l" && sourceCode.charAt(this.subStringEndIndex + 3) == "e") {
                        this.tokens = "WHILE";
                        this.tokenRegEx = "while";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 5;
                        this.lineNum += 5;
                        this.subStringEndIndex += 4;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "f" && sourceCode.charAt(this.subStringEndIndex) == "a" && sourceCode.charAt(this.subStringEndIndex + 1) == "l" && sourceCode.charAt(this.subStringEndIndex + 2) == "s" && sourceCode.charAt(this.subStringEndIndex + 3) == "e") {
                        this.tokens = "BOOL_FALSE";
                        this.tokenRegEx = "false";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 5;
                        this.lineNum += 5;
                        this.subStringEndIndex += 4;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "b" && sourceCode.charAt(this.subStringEndIndex) == "o" && sourceCode.charAt(this.subStringEndIndex + 1) == "o" && sourceCode.charAt(this.subStringEndIndex + 2) == "l" && sourceCode.charAt(this.subStringEndIndex + 3) == "e" && sourceCode.charAt(this.subStringEndIndex + 4) == "a" && sourceCode.charAt(this.subStringEndIndex + 5) == "n") {
                        this.tokens = "BOOL_TYPE";
                        this.tokenRegEx = "boolean";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 7;
                        this.lineNum += 7;
                        this.subStringEndIndex += 6;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "t" && sourceCode.charAt(this.subStringEndIndex) == "r" && sourceCode.charAt(this.subStringEndIndex + 1) == "u" && sourceCode.charAt(this.subStringEndIndex + 2) == "e") {
                        this.tokens = "BOOL_TRUE";
                        this.tokenRegEx = "true";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 4;
                        this.lineNum += 4;
                        this.subStringEndIndex += 3;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "s" && sourceCode.charAt(this.subStringEndIndex) == "t" && sourceCode.charAt(this.subStringEndIndex + 1) == "r" && sourceCode.charAt(this.subStringEndIndex + 2) == "i" && sourceCode.charAt(this.subStringEndIndex + 3) == "n" && sourceCode.charAt(this.subStringEndIndex + 4) == "g") {
                        this.tokens = "STRING_TYPE";
                        this.tokenRegEx = "string";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 6;
                        this.lineNum += 6;
                        this.subStringEndIndex += 5;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "=" && sourceCode.charAt(this.subStringEndIndex) == "=") {
                        this.tokens = "BOOL_EQUAL";
                        this.tokenRegEx = "==";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                        this.subStringEndIndex++;
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
                        this.subStringStartIndex++;
                        this.lineNum++;
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
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (sourceCode.charAt(this.subStringEndIndex - 1) == "!" && sourceCode.charAt(this.subStringEndIndex) == "=") {
                        this.tokens = "BOOL_NOTEQUAL";
                        this.tokenRegEx = "!=";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex += 2;
                        this.lineNum += 2;
                        this.subStringEndIndex++;
                    }
                    /*else if(BOOL_NOTEQUAL.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
                        this.tokens = "BOOL_NOTEQUAL";
                        this.tokenRegEx = "!=";
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex+=2;
                        this.lineNum+=2;
                    }*/
                    else if (DIGIT.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "DIGIT";
                        this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex - 1);
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (VARIABLE.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex));
                        console.log(this.subStringStartIndex);
                        console.log(this.subStringEndIndex);
                        console.log(sourceCode.charAt(this.subStringEndIndex - 1));
                        this.tokens = "VARIABLE";
                        this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex - 1);
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (INVALID_CHAR.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        console.log(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex));
                        console.log(this.subStringStartIndex);
                        console.log(this.subStringEndIndex);
                        console.log(sourceCode.charAt(this.subStringEndIndex - 1));
                        this.tokens = "INVALID_CHAR";
                        this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex - 1);
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum]
                        ]);
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                    else if (EOP.test(sourceCode.substring(this.subStringStartIndex, this.subStringEndIndex))) {
                        this.tokens = "EOP";
                        this.tokenRegEx = "$";
                        this.programNum++;
                        this.lexOutput.push([
                            [this.tokens],
                            [this.tokenRegEx],
                            [this.lineNum],
                            [this.columnNum],
                            [this.programNum]
                        ]);
                        this.subStringStartIndex++;
                        this.lineNum++;
                        this.eopFound = true;
                    }
                    this.subStringEndIndex++;
                }
                if (sourceCode.length > 0) {
                    if (this.eopFound == false) {
                        this.lexOutput.push([
                            ["missingEOP"]
                        ]);
                        this.subStringStartIndex++;
                        this.lineNum++;
                    }
                }
                return this.lexOutput;
            }
        };
        return Lexer;
    }());
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
