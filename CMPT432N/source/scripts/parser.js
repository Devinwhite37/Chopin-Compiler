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
            this.currentToken = -1;
            // Tree data structure
            //this.cst = new Tree();
            this.braces = 0;
        }
        Parser.prototype.parse = function () {
            this.program();
            return this.parseOutput;
        };
        Parser.prototype.program = function () {
            this.currentToken = this.currentToken + 1;
            console.log("PROGRAM: this " + tokens[this.currentToken][1] + " " + this.currentToken);
            if (tokens[this.currentToken][1] == '{') {
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            //this.statementList();
        };
        Parser.prototype.parseBlock = function () {
            //console.log(tokens[this.currentToken][2]);
            if (tokens[this.currentToken][1] == '{') {
                this.parseOutput.push("Block");
                this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.braces++;
                this.statementList();
                //console.log("SHould be here now"+ tokens[this.currentToken][1]);
            }
            else if (tokens[this.currentToken][1] == '}') {
                this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                //console.log("this " + tokens[this.currentToken][1] + " "  + this.currentToken);
                this.braces--;
                console.log("Braces: " + this.braces);
                if (tokens[this.currentToken][1] == '$') {
                    this.parseOutput.push("VALID - Found [EOP]");
                    //this.currentToken++;
                    this.program();
                }
                else {
                    this.statementList();
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] - block");
            }
            /*if(this.braces != 0){
                this.parseOutput.push("ERROR - missing [}]")
            }*/
        };
        Parser.prototype.statementList = function () {
            this.parseOutput.push("StatementList");
            if (tokens[this.currentToken][1] == '}') {
                this.parseBlock();
                //this.currentToken++;
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                //console.log("statement elif ran");
                //this.currentToken++;
                this.statement();
                if (tokens[this.currentToken][1] != "$") {
                    console.log("EOP IF RAN:: " + tokens[this.currentToken][1]);
                    //this.currentToken++;
                    this.statementList();
                }
            }
            /*if (tokens[this.currentToken][1] == '}') {
                this.parseBlock();
            }*/
            return;
        };
        Parser.prototype.statement = function () {
            this.parseOutput.push("Statement");
            if (tokens[this.currentToken][0] == 'PRINT') {
                this.currentToken++;
                this.printStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.currentToken++;
                this.assignmentStatement();
            }
            else if (tokens[this.currentToken][0] == 'INT_TYPE' || tokens[this.currentToken][0] == 'BOOL_TYPE' || tokens[this.currentToken][0] == 'STRING_TYPE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][1] + "]");
                this.currentToken++;
                this.varDecl();
            }
            else if (tokens[this.currentToken][0] == 'WHILE') {
                this.currentToken++;
                this.whileStatement();
            }
            else if (tokens[this.currentToken][0] == 'IF') {
                this.currentToken++;
                this.ifStatement();
            }
            else if (tokens[this.currentToken][1] == '{' || tokens[this.currentToken][1] == '}') {
                //this.currentToken++;
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
            }
            /*if(tokens[this.currentToken][1] == '{' || tokens[this.currentToken][1] == '}'){
                //this.currentToken++;
                this.parseBlock();
            }*/
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
                this.parseOutput.push("VALID- Found [" + tokens[this.currentToken][1] + "]");
                this.currentToken++;
                //this.id();
            }
            else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                //this.currentToken++;
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
            return;
        };
        Parser.prototype.assignmentStatement = function () {
            this.parseOutput.push("AssignmentStatement");
            if (tokens[this.currentToken][1] == "=") {
                this.currentToken++;
                this.expression();
            }
            return;
        };
        Parser.prototype.varDecl = function () {
            this.parseOutput.push("VarDecl");
            if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
            }
            return;
        };
        Parser.prototype.booleanExpr = function () {
            this.parseOutput.push("BooleanExpr");
            console.log(tokens[this.currentToken][0]);
            if (tokens[this.currentToken][0] == 'L_PAREN') {
                this.currentToken++;
                console.log(tokens[this.currentToken][0]);
                this.expression();
                if (tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!=') {
                    this.currentToken++;
                    this.expression();
                }
            }
            return;
        };
        Parser.prototype.ifStatement = function () {
            this.parseOutput.push("IfStatement");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                //go to boolean expression
                this.currentToken++;
                this.booleanExpr();
                //goes to block
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.whileStatement = function () {
            this.parseOutput.push("WhileStatement");
            return;
        };
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
