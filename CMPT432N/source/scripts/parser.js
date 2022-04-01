/* parser.ts  */
/**
 * parser.ts
 * Devin White, CMPT432N
 *
 * Inspiration taken from Sonar in hall of fame projects.
 *
 * parser.ts is used to read the tokens created by lexer.
 * parser will test these tokens against our grammer to
 * ensure weve made correct productions
 */
var TSC;
(function (TSC) {
    var Parser = /** @class */ (function () {
        // Constructor for parser, passed tokens from lexer. Inits values.
        function Parser(tokens) {
            this.tokenList = tokens;
            this.parseOutput = [];
            this.currentToken = 0;
            // Tree data structure
            //this.cst = new Tree();
            this.braces = 0;
        }
        Parser.prototype.parse = function () {
            if (tokens[this.currentToken][1] == undefined) {
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            //this.statementList();
            return this.parseOutput;
        };
        Parser.prototype.parseBlock = function () {
            this.parseOutput.push("Block");
            if (tokens[this.currentToken][1] == '{') {
                this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.braces++;
                this.statementList();
                //console.log("SHould be here now"+ tokens[this.currentToken][1]);
            }
            else if (tokens[this.currentToken][1] == '}') {
                this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.braces--;
                console.log("Braces: " + this.braces);
                if (tokens[this.currentToken][1] == '$') {
                    this.parseOutput.push("VALID - Found [EOP]");
                    this.currentToken++;
                }
                else {
                    this.statementList();
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
            }
            /*if(this.braces != 0){
                this.parseOutput.push("ERROR - missing [}]")
            }*/
        };
        Parser.prototype.statementList = function () {
            this.parseOutput.push("StatementList");
            if (tokens[this.currentToken][1] == '}') {
                this.parseBlock();
            }
            /*if (tokens[this.currentToken][1] == '}') {
                this.parseBlock();
            }*/
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                //console.log("statement elif ran");
                //this.currentToken++;
                this.statement();
            }
            console.log("Statement list return");
            return;
        };
        Parser.prototype.statement = function () {
            this.parseOutput.push("Statement");
            if (tokens[this.currentToken][0] == 'PRINT') {
                this.currentToken++;
                this.printStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.assignmentStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.assignmentStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.assignmentStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.assignmentStatement();
            }
            else if (tokens[this.currentToken][0] == "L_BRACE") {
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
            }
            console.log("Statement return");
            return;
        };
        Parser.prototype.printStatement = function () {
            this.parseOutput.push("PrintStatement");
            this.parseOutput.push("VALID - Found [PRINT] on [ " + tokens[this.currentToken - 1][2] + " , " + tokens[this.currentToken - 1][3] + " ]");
            if (tokens[this.currentToken][1] == '(') {
                this.parseOutput.push("VALID - Found [L_PAREN] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.expression();
                if (tokens[this.currentToken][1] == ')') {
                    this.parseOutput.push("VALID - Found [R_PAREN] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                }
                else {
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
            }
            return;
        };
        Parser.prototype.expression = function () {
            console.log("EXPR");
            this.parseOutput.push("Expr");
            if (tokens[this.currentToken][0] == "DIGIT") {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.intExpr();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                this.stringExpr();
            }
            else if (tokens[this.currentToken][0] == "VARIABLE") {
                this.currentToken++;
                this.charList();
            }
            else if (tokens[this.currentToken][0] == "L_PAREN" || "BOOL_TRUE" || "BOOL_FALSE") {
                this.currentToken++;
                this.booleanExpr();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
                return;
            }
        };
        Parser.prototype.intExpr = function () {
            this.parseOutput.push("IntExpr");
            if (tokens[this.currentToken][0] == 'ADDITION_OP') {
                this.parseOutput.push("VALID - Found [+] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.expression();
                return;
            }
            return;
        };
        Parser.prototype.stringExpr = function () {
            this.parseOutput.push("StringExpr");
            this.charList();
        };
        Parser.prototype.charList = function () {
            this.parseOutput.push("CharList with value of [" + tokens[this.currentToken][1] + "]");
            this.currentToken++;
            if (tokens[this.currentToken][0] == "CHAR") {
                this.charList();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                return;
            }
        };
        Parser.prototype.assignmentStatement = function () {
            console.log("AssiGNMENT RAN");
            this.parseOutput.push("AssignmentStatement");
        };
        Parser.prototype.booleanExpr = function () {
            this.parseOutput.push("BooleanExpr");
        };
        Parser.prototype.lBrace = function () {
            this.braces++;
            return;
        };
        Parser.prototype.rBrace = function () {
            this.braces--;
            return;
        };
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
