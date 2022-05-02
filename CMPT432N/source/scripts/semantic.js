var TSC;
(function (TSC) {
    var Semantic = /** @class */ (function () {
        /*symbol: {
    programNum: number,
    key: String,
    type: String,
    scope: number,
    line: number,
    col: number
};*/
        function Semantic(tokens) {
            this.symbolOutput = [];
            this.symbol = {};
            this.tokenList = tokens;
            this.currentToken = 0;
            this.scopeTree = new ScopeTree();
            this.programNum = 1;
            this.scopeNum = -1;
            this.quoteVal = "";
            this.semanticOutput = [];
            /*this.symbol = {
                programNum: 0,
                key: "",
                type: "",
                scope: 0,
                line: 0,
                col: 0
            };*/
            this.scope = -1;
            this.symbols = [];
            this.scopeArray = [];
            this.scopeLevel = -1;
        }
        Semantic.prototype.semantic = function () {
            return this.semanticOutput;
        };
        /*public symbolTableOP(){
            this.scopeNum = -1;
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '{'){
                this.parseBlockSemantic();
            }
            return this.symbolOutput;

        }*/
        Semantic.prototype.scopeTreeOP = function () {
            return this.scopeTree.toString();
        };
        Semantic.prototype.programSemantic = function () {
            this.scopeNum = -1;
            this.scopeLevel = -1;
            this.scope = -1;
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.parseBlockSemantic();
            }
            return this.symbolOutput;
        };
        //parseBlockSemantic handles open and closed curly braces followed by an EOP marker
        Semantic.prototype.parseBlockSemantic = function () {
            this.scopeNum++;
            this.scopeLevel++;
            this.scopeArray.push(this.scope);
            this.scope = this.scopeNum;
            console.log(this.scope);
            //this.scopeTree.addNode("Scope: " + this.scopeNum, "branch", this.scopeNum);
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.currentToken++;
            }
            this.statementListSemantic();
            if (tokens[this.currentToken][1] == '}') {
                this.currentToken++;
                if (tokens[this.currentToken] === undefined) {
                    return;
                }
                else if (tokens[this.currentToken][1] == '$') {
                    this.semanticOutput.push("EOP");
                    this.programNum++;
                    this.currentToken++;
                    this.programSemantic();
                }
            }
            this.scopeLevel--;
            this.scopeTree.endChildren();
            this.scope = this.scopeArray.pop();
            console.log(this.scope);
        };
        //StatementListSemantic tests the tokens to see if we have valid statementListSemantics
        Semantic.prototype.statementListSemantic = function () {
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '}') {
                //return;
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.statementSemantic();
                this.statementListSemantic();
                if (tokens[this.currentToken] === undefined) {
                    return;
                }
            }
            return;
        };
        //statement is used to validate the tokens that are statmenets and pass them to their specified statement
        Semantic.prototype.statementSemantic = function () {
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][0] == 'PRINT') {
                this.currentToken++;
                this.printStatementSemantic();
            }
            else if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.currentToken++;
                this.assignmentStatementSemantic();
            }
            else if (tokens[this.currentToken][0] == 'INT_TYPE'
                || tokens[this.currentToken][0] == 'BOOL_TYPE'
                || tokens[this.currentToken][0] == 'STRING_TYPE') {
                this.currentToken++;
                this.varDeclSemantic();
            }
            else if (tokens[this.currentToken][0] == 'WHILE') {
                this.currentToken++;
                this.whileStatementSemantic();
            }
            else if (tokens[this.currentToken][0] == 'IF') {
                this.currentToken++;
                this.ifStatementSemantic();
            }
            else if (tokens[this.currentToken][1] == '{') {
                //this.ast.endChildren();
                this.parseBlockSemantic();
            }
            return;
        };
        Semantic.prototype.printStatementSemantic = function () {
            if (tokens[this.currentToken][1] == '(') {
                this.currentToken++;
                this.expressionSemantic();
                if (tokens[this.currentToken][1] == ')') {
                    this.currentToken++;
                }
            }
            return;
        };
        Semantic.prototype.expressionSemantic = function () {
            if (tokens[this.currentToken][0] == "DIGIT") {
                this.currentToken++;
                this.intExprSemantic();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                this.stringExprSemantic();
            }
            else if (tokens[this.currentToken][0] == "VARIABLE") {
                this.currentToken++;
            }
            else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                this.booleanExprSemantic();
            }
            return;
        };
        Semantic.prototype.intExprSemantic = function () {
            if (tokens[this.currentToken][0] == 'ADDITION_OP') {
                this.currentToken++;
                this.expressionSemantic();
                return;
            }
            else {
            }
            return;
        };
        Semantic.prototype.stringExprSemantic = function () {
            this.charListSemantic();
            return;
        };
        Semantic.prototype.charListSemantic = function () {
            this.currentToken++;
            if (tokens[this.currentToken][0] == "CHAR" || tokens[this.currentToken][0] == "SPACE") {
                this.quoteVal += tokens[this.currentToken - 1][1];
                this.charListSemantic();
            }
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.quoteVal += tokens[this.currentToken - 1][1];
                this.currentToken++;
                return;
            }
            return;
        };
        Semantic.prototype.assignmentStatementSemantic = function () {
            if (tokens[this.currentToken][1] == "=") {
                this.currentToken++;
                this.expressionSemantic();
            }
            return;
        };
        Semantic.prototype.varDeclSemantic = function () {
            if (tokens[this.currentToken][0] == 'VARIABLE') {
                //programNum = this.programNum;
                this.symbolOutput.push([
                    [this.programNum],
                    [tokens[this.currentToken][1]],
                    [tokens[this.currentToken - 1][1]],
                    [this.scope],
                    [tokens[this.currentToken][3]],
                    [tokens[this.currentToken][2]]
                ]);
                this.createSymbol(this.programNum, tokens[this.currentToken][1], tokens[this.currentToken - 1][1], this.scope, tokens[this.currentToken][3], tokens[this.currentToken][2]);
                this.semanticOutput.push("New variable declared [" + tokens[this.currentToken][1] + "] on [" + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + "] with type " + tokens[this.currentToken - 1][1]);
                this.currentToken++;
            }
            return;
        };
        Semantic.prototype.createSymbol = function (programNum, key, type, scope, line, col) {
            this.symbol = [
                programNum,
                key,
                type,
                scope,
                line,
                col
            ];
            /*this.symbol["type"] = tokens[this.currentToken - 1][1];
            this.symbol["key"] = tokens[this.currentToken][1];
            this.symbol["line"] = tokens[this.currentToken][3];
            this.symbol["col"] = tokens[this.currentToken][2];
            this.symbol["scope"] = this.scopeNum;
            this.symbol["scopeLevel"] = this.scopeLevel;
            this.symbols.push(this.symbolOutput);
            console.log(this.symbols);
            //this.symbol = {};
            let symbol = []*/
            this.scopeTree.addNode("Scope: " + this.scopeNum, "branch", this.scopeNum, this.symbolOutput);
            //symbol = [this.]
            //this.scopeTree.cur.symbols.push(this.symbols);
            return (this.symbol);
        };
        Semantic.prototype.booleanExprSemantic = function () {
            if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.currentToken++;
            }
            else if (tokens[this.currentToken][0] == 'L_PAREN') {
                this.currentToken++;
                this.expressionSemantic();
                if (tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!=') {
                    this.currentToken++;
                    this.expressionSemantic();
                    if (tokens[this.currentToken][0] == 'R_PAREN') {
                        this.currentToken++;
                    }
                }
            }
            return;
        };
        Semantic.prototype.ifStatementSemantic = function () {
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExprSemantic();
                this.parseBlockSemantic();
            }
            return;
        };
        Semantic.prototype.whileStatementSemantic = function () {
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExprSemantic();
                this.parseBlockSemantic();
            }
            return;
        };
        Semantic.prototype.scopeTreeVars = function () {
        };
        return Semantic;
    }());
    TSC.Semantic = Semantic;
})(TSC || (TSC = {}));
