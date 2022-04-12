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
            this.cstOutput = [];
            // Tree data structure
            //this.cst = new Tree();
            //this.cst = new Tree();
            this.braces = 0;
        }
        Parser.prototype.parse = function () {
            this.program();
            return this.parseOutput;
        };
        Parser.prototype.cst = function () {
            return this.cstOutput;
        };
        Parser.prototype.program = function () {
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.parseOutput.push("Progrm");
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
        };
        Parser.prototype.parseBlock = function () {
            if (tokens[this.currentToken][1] == '{') {
                this.parseOutput.push("Block");
                this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.braces++;
                this.statementList();
            }
            else if (tokens[this.currentToken][1] == '}') {
                this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.braces--;
                if (tokens[this.currentToken][1] == '$') {
                    this.parseOutput.push("VALID - Found [EOP]");
                    //this.parseOutput.push("on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.program();
                }
                else {
                    this.statementList();
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            if (this.braces != 0) {
                this.parseOutput.push("ERROR - missing [}]");
            }
        };
        Parser.prototype.statementList = function () {
            if (tokens[this.currentToken][1] == '}' && tokens[this.currentToken - 1][1] == '{') {
                this.parseOutput.push("StatementList");
                this.parseOutput.push("VALID - Found [ε] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseBlock();
            }
            else if (tokens[this.currentToken][1] == '}') {
                this.parseBlock();
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.parseOutput.push("StatementList");
                this.statement();
                if (tokens[this.currentToken][1] != "$") {
                    this.currentToken++;
                    this.statementList();
                }
            }
            else {
                this.parseOutput.push("statement list - ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected token(s) [ PRINT, ID, INT, STRING, BOOLEAN, WHILE, STRING, IF, L_BRACE, R_BRACE ]");
            }
            return;
        };
        Parser.prototype.statement = function () {
            this.parseOutput.push("Statement");
            if (tokens[this.currentToken][0] == 'PRINT') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.printStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.assignmentStatement();
            }
            else if (tokens[this.currentToken][0] == 'INT_TYPE' || tokens[this.currentToken][0] == 'BOOL_TYPE'
                || tokens[this.currentToken][0] == 'STRING_TYPE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.varDecl();
            }
            else if (tokens[this.currentToken][0] == 'WHILE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.whileStatement();
            }
            else if (tokens[this.currentToken][0] == 'IF') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.ifStatement();
            }
            else if (tokens[this.currentToken][1] == '{' || tokens[this.currentToken][1] == '}') {
                this.parseBlock();
            }
            else {
                this.parseOutput.push("statemenet - ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.printStatement = function () {
            this.parseOutput.push("PrintStatement");
            if (tokens[this.currentToken][1] == '(') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.expression();
                if (tokens[this.currentToken][1] == ')') {
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                }
                else {
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.expression = function () {
            this.parseOutput.push("Expr");
            if (tokens[this.currentToken][0] == "DIGIT") {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.intExpr();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                this.stringExpr();
            }
            else if (tokens[this.currentToken][0] == "VARIABLE") {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
            }
            else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                this.booleanExpr();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.intExpr = function () {
            this.parseOutput.push("IntExpr");
            if (tokens[this.currentToken][0] == 'ADDITION_OP') {
                this.parseOutput.push("VALID - Found [+] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.expression();
            }
            return;
        };
        Parser.prototype.stringExpr = function () {
            this.parseOutput.push("StringExpr");
            this.charList();
            return;
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
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.expression();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected tokens: [ASSIGNMENT]");
            }
            return;
        };
        Parser.prototype.varDecl = function () {
            this.parseOutput.push("VarDecl");
            if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.booleanExpr = function () {
            this.parseOutput.push("BooleanExpr");
            if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.parseOutput.push("BoolVal");
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
            }
            else if (tokens[this.currentToken][0] == 'L_PAREN') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.expression();
                if (tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!=') {
                    this.parseOutput.push("BoolOp");
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                    if (tokens[this.currentToken][0] == 'R_PAREN') {
                        this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        this.currentToken++;
                    }
                    else {
                        this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "]] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    }
                }
                else {
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "]] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "]] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.ifStatement = function () {
            this.parseOutput.push("IfStatement");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExpr();
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        Parser.prototype.whileStatement = function () {
            this.parseOutput.push("WhileStatement");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExpr();
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            return;
        };
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
/*{
    int a
    a = 0
    string z
    while(a!=9){
        if(a!=5){
            print("bond")
        }
        {
        a = 1 + a
        string b
        b = "james bond"}
        print(b)
        }
    }
    {}
    boolean c
    c = true
    boolean d
    d = (true ==(true == false))
    d = (a == b)
    d = (1 == a)
    d = (1 != 1)
    d = ("string" == 1)
    d = (a != "string")
    if(d == true){
        int c
        c = 1 + d
        if(c == 1){
            print("ugh")
        }
    }
    while("string" == a){
        while(1 == true){
            a = 1 + "string"
        }
    }
}
*/
