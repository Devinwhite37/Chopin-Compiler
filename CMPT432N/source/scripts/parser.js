var TSC;
(function (TSC) {
    var Production;
    (function (Production) {
        Production["Program"] = "Program";
        Production["Block"] = "Block";
        Production["Expr"] = "Expression";
        Production["Stmt"] = "Statement";
        Production["StmtList"] = "StatementList";
        Production["AssignStmt"] = "AssignmentStatement";
        Production["PrintStmt"] = "PrintStatement";
        Production["WhileStmt"] = "WhileStatement";
        Production["VarDecl"] = "VarDecl";
        Production["IfStmt"] = "IfStatement";
        Production["BooleanExpr"] = "BooleanExpression";
        Production["IntExpr"] = "IntegerExpression";
        Production["StringExpr"] = "StringExpression";
        Production["CharList"] = "CharList";
        Production["Id"] = "Id";
        Production["BoolVal"] = "BoolVal";
        Production["Type"] = "Type";
        Production["Char"] = "Char";
        Production["Digit"] = "Digit";
        Production["IntOp"] = "IntOp";
        Production["BoolOp"] = "BoolOp";
        Production["Space"] = "Space";
        Production["Addition"] = "Addition";
    })(Production = TSC.Production || (TSC.Production = {}));
    var Parser = /** @class */ (function () {
        // Constructor for parser, passed tokens from lexer. Inits values.
        function Parser(tokens) {
            this.tokenList = tokens;
            //tokens = this.tokenList;
            // Set current token to the first token in the list
            this.currentToken = 0;
            // Holds log messages generated by parser
            this.parseOutput = [];
            // Flag for parser error
            this.error = false;
            this.i = 0;
            // Tree data structure
            //this.cst = new Tree();
        }
        Parser.prototype.parse = function () {
            this.parseBlock();
            //this.statmentList();
            return this.parseOutput;
        };
        Parser.prototype.parseBlock = function () {
            //if(tokens[this.i][1]!=""){
            this.parseOutput.push("Block");
            for (this.i = this.i; this.i < tokens.length; this.i++) {
                if (tokens[this.i][1] == '{') {
                    this.parseOutput.push("VALID - Expecting [L_BRACE], found [{] on [ " + tokens[this.i][2] + " , " + tokens[this.i][3] + " ]");
                    this.i++;
                    this.statmentList();
                    if (tokens[this.i][1] == '}') {
                        this.parseOutput.push("VALID - Expecting [R_BRACE], found [}] on [ " + tokens[this.i][2] + " , " + tokens[this.i][3] + " ]");
                        this.i++;
                        if (tokens[this.i][1] == '$') {
                            this.parseOutput.push("VALID - Expecting [EOP], found [$] on [ " + tokens[this.i][2] + " , " + tokens[this.i][3] + " ]");
                        }
                        else if (tokens[this.i][0] != '$') {
                            this.parseOutput.push("ERROR - Expecting [EOP]");
                            break;
                        }
                    }
                    else if (tokens[this.i][1] != '}') {
                        this.parseOutput.push("ERROR - Expecting [}]");
                        break;
                    }
                }
                else if (tokens[this.i][1] != '{') {
                    this.parseOutput.push("ERROR - Expecting [{]");
                    break;
                }
            }
        };
        //else{}
        //}
        Parser.prototype.statmentList = function () {
            this.parseOutput.push("StatementList");
            for (this.i = this.i; this.i < tokens.length; this.i++) {
                console.log("token: " + tokens[this.i][1]);
                console.log("token: " + tokens[this.i][0]);
                if (tokens[this.i][0] == 'PRINT') {
                    //this.i--;
                    this.printStatement();
                }
                else if (tokens[this.i][0] == 'VARIABLE') {
                    console.log("Assignment Ran");
                    this.assignmentStatement();
                }
                else if (tokens[this.i][1] == '}' || tokens[this.i][1] == '{') {
                    //this.i++;
                    console.log("epsilon");
                    this.parseOutput.push("VALID - Found ε on [ " + tokens[this.i][2] + " , " + tokens[this.i][3] + " ]");
                    //this.parseBlock();
                    break;
                }
                else if (tokens[this.i][1] == "undefined") {
                    console.log("undefined ran");
                    break;
                }
                //else if(tokens[this.i][2] == '')
            }
        };
        Parser.prototype.printStatement = function () {
            this.parseOutput.push("PrintStatement");
            console.log("PRINT STATMENT RAN");
            for (this.i = this.i; this.i < tokens.length; this.i++) {
                console.log("token: " + tokens[this.i - 1][1]);
                console.log("token: " + tokens[this.i - 1][0]);
                if (tokens[this.i][0] == 'PRINT') {
                    this.i++;
                    this.parseOutput.push("VALID - Expecting [PRINT], found [print]");
                    if (tokens[this.i][0] == '(') {
                        this.parseOutput.push("VALID - Expecting [L_PAREN], found [(]");
                        console.log("test");
                        break;
                    }
                }
                /*else if(tokens[this.i][0] == 'missingEOP'){
                }*/
                /*else if(tokens[this.i][1] == '('){
                    this.parseOutput.push("VALID - Expecting [R_PAREN], found [(]");
                }
                else if(tokens[this.i][1] != '('){
                    this.parseOutput.push("ERROR - Expecting [R_PAREN], found ["+ tokens[this.i][0]+"]");
                }
                else if(tokens[this.i][0] == 'DIGIT' || 'VARIABLE'){
                    this.parseOutput.push("VALID - Expecting [EXPR], found [" + tokens[this.i][0] + "]");
                }
                else if(tokens[this.i][1] == ')'){
                    this.parseOutput.push("VALID - Expecting [L_PAREN], found [)]");
                }*/
                else {
                    break;
                }
            }
        };
        Parser.prototype.assignmentStatement = function () {
            console.log("AssiGNMENT RAN");
            this.parseOutput.push("AssignmentStatement");
        };
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
