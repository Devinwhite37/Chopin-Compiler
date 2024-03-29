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
            this.braces = 0;
            this.cst = new Tree();
            this.cst.addNode("Root", "branch");
            this.programNum = 1;
        }
        //function to return productions to index.html
        Parser.prototype.parse = function () {
            this.program();
            return this.parseOutput;
        };
        //function to return CST to index.html
        Parser.prototype.cstTree = function () {
            return this.cst.toString();
        };
        //most of the following can be easily understood. There are many methods
        //which define portions of our grammar and add productions to parseOutput
        //Program tests to see if the first character is valid. if not send an error
        Parser.prototype.program = function () {
            for (var i = 0; i < 10; i++) {
                this.cst.endChildren();
            }
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.cst.addNode("Program " + this.programNum, "branch");
                this.parseOutput.push("Program");
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
        };
        //parseBlock handles open and closed curly braces followed by an EOP marker
        Parser.prototype.parseBlock = function () {
            if (tokens[this.currentToken][1] == '{') {
                this.cst.addNode("Block", "branch");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.parseOutput.push("Block");
                this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.braces++;
                this.statementList();
            }
            else if (tokens[this.currentToken][1] == '}') {
                this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.cst.endChildren();
                this.currentToken++;
                this.braces--;
                if (tokens[this.currentToken] === undefined) {
                    this.parseOutput.push("ERROR - Found [undefined] on [ undefined , undefined ]");
                    return;
                }
                else if (tokens[this.currentToken][1] == '$') {
                    if (this.braces != 0) {
                        if (this.braces > 0) {
                            this.parseOutput.push("ERROR - missing [}]");
                        }
                        else if (this.braces < 0) {
                            this.parseOutput.push("ERROR - missing [{]");
                        }
                    }
                    this.parseOutput.push("VALID - Found [EOP]");
                    this.cst.addNode(tokens[this.currentToken][1], "leaf");
                    this.cst.endChildren();
                    this.programNum++;
                    this.currentToken++;
                    this.program();
                }
                else if (tokens[this.currentToken][1] == '{' && this.braces == 0) {
                    this.parseOutput.push("ERROR - Found [{]");
                    this.parseOutput.push("Expected token(s): [$]");
                }
                else {
                    this.cst.endChildren();
                    this.statementList();
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
        };
        //StatementList tests the tokens to see if we have valid statementLists
        Parser.prototype.statementList = function () {
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '}' && tokens[this.currentToken - 1][1] == '{') {
                this.parseOutput.push("StatementList");
                this.cst.addNode("StatementList", "branch");
                this.parseOutput.push("VALID - Found [ε] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.endChildren();
                this.parseBlock();
            }
            else if (tokens[this.currentToken][1] == '}') {
                this.cst.endChildren();
                this.parseBlock();
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.parseOutput.push("StatementList");
                this.cst.addNode("StatementList", "branch");
                this.statement();
                if (tokens[this.currentToken] === undefined) {
                    return;
                }
                else if (tokens[this.currentToken][1] != "$") {
                    this.statementList();
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected token(s): [ PRINT, ID, INT, STRING, BOOLEAN, WHILE, STRING, IF, L_BRACE, R_BRACE ]");
            }
            this.cst.endChildren();
            return;
        };
        //statement is used to validate the tokens that are statmenets and pass them to their specified statement
        Parser.prototype.statement = function () {
            this.parseOutput.push("Statement");
            this.cst.addNode("Statement", "branch");
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][0] == 'PRINT') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.currentToken++;
                this.printStatement();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                //this.currentToken++;
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
            else if (tokens[this.currentToken][1] == '{' && this.braces != 0 || tokens[this.currentToken][1] == '}') {
                this.cst.endChildren();
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            this.cst.endChildren();
            this.cst.endChildren();
            return;
        };
        Parser.prototype.printStatement = function () {
            this.parseOutput.push("PrintStatement");
            this.cst.addNode("PrintStatement", "branch");
            this.cst.addNode("print", "leaf");
            if (tokens[this.currentToken][1] == '(') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
                this.expression();
                if (tokens[this.currentToken][1] == ')') {
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.cst.addNode(tokens[this.currentToken][1], "leaf");
                    this.currentToken++;
                }
                else {
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.parseOutput.push("Expected token(s): [R_PAREN]");
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected token(s): [L_PAREN]");
            }
            this.cst.endChildren();
            return;
        };
        Parser.prototype.expression = function () {
            this.parseOutput.push("Expr");
            this.cst.addNode("Expr", "branch");
            if (tokens[this.currentToken][0] == "DIGIT") {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
                this.intExpr();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                this.stringExpr();
            }
            else if (tokens[this.currentToken][0] == "VARIABLE") {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                //this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.iD();
                this.currentToken++;
            }
            else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                this.booleanExpr();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            this.cst.endChildren();
            return;
        };
        Parser.prototype.intExpr = function () {
            this.cst.addNode("IntExpr", "branch");
            this.parseOutput.push("IntExpr");
            if (tokens[this.currentToken][0] == 'ADDITION_OP') {
                this.parseOutput.push("VALID - Found [+] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
                this.expression();
                this.cst.endChildren();
                return;
            }
            else {
                this.cst.endChildren();
            }
            return;
        };
        Parser.prototype.stringExpr = function () {
            this.cst.addNode("StringExpr", "branch");
            this.parseOutput.push("StringExpr");
            this.charList();
            this.cst.endChildren();
            return;
        };
        Parser.prototype.iD = function () {
            this.cst.addNode("ID", "branch");
            this.cst.addNode(tokens[this.currentToken][1], "leaf");
            //this.cst.endChildren();
            return;
        };
        Parser.prototype.charList = function () {
            this.parseOutput.push("CharList with value of [" + tokens[this.currentToken][1] + "]");
            this.cst.addNode(tokens[this.currentToken][1], "leaf");
            this.currentToken++;
            if (tokens[this.currentToken][0] == "CHAR" || tokens[this.currentToken][0] == "SPACE") {
                this.charList();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                return;
            }
            return;
        };
        Parser.prototype.assignmentStatement = function () {
            this.cst.addNode("AssignmentStatement", "branch");
            //this.cst.addNode(tokens[this.currentToken][1], "leaf");
            this.parseOutput.push("AssignmentStatement");
            if (tokens[this.currentToken][0] == "VARIABLE") {
                this.iD();
                this.currentToken++;
                if (tokens[this.currentToken][1] == "=") {
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.cst.addNode(tokens[this.currentToken][1], "leaf");
                    this.currentToken++;
                    this.expression();
                }
                else {
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.parseOutput.push("Expected tokens: [ASSIGNMENT]");
                }
            }
            this.cst.endChildren();
            return;
        };
        Parser.prototype.varDecl = function () {
            this.cst.addNode("VarDecl", "branch");
            this.parseOutput.push("VarDecl");
            if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken - 1][1], "leaf");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected token(s): [VARIABLE]");
                this.currentToken++;
            }
            this.cst.endChildren();
            return;
        };
        Parser.prototype.booleanExpr = function () {
            this.cst.addNode("BooleanExpr", "branch");
            this.parseOutput.push("BooleanExpr");
            if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.parseOutput.push("BoolVal");
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
            }
            else if (tokens[this.currentToken][0] == 'L_PAREN') {
                this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.cst.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
                this.expression();
                if (tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!=') {
                    this.parseOutput.push("BoolOp");
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.cst.addNode(tokens[this.currentToken][1], "leaf");
                    this.currentToken++;
                    this.expression();
                    if (tokens[this.currentToken][0] == 'R_PAREN') {
                        this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        this.cst.addNode(tokens[this.currentToken][1], "leaf");
                        this.currentToken++;
                    }
                    else {
                        this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        this.parseOutput.push("Expected token(s): [R_PAREN]");
                    }
                }
                else {
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.parseOutput.push("Expected token(s): [BOOL_EQUAL, BOOL_NOTEQUAL]");
                }
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
            }
            this.cst.endChildren();
            return;
        };
        Parser.prototype.ifStatement = function () {
            this.cst.addNode("IfStatement", "branch");
            this.parseOutput.push("IfStatement");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExpr();
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected token(s): [L_PAREN, BOOL_TRUE, BOOL_FALSE]");
            }
            this.cst.endChildren();
            return;
        };
        Parser.prototype.whileStatement = function () {
            this.cst.addNode("WhileStatement", "branch");
            this.parseOutput.push("WhileStatement");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExpr();
                this.parseBlock();
            }
            else {
                this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                this.parseOutput.push("Expected token(s): [L_PAREN, BOOL_TRUE, BOOL_FALSE]");
            }
            this.cst.endChildren();
            return;
        };
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
