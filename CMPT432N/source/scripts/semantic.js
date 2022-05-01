var TSC;
(function (TSC) {
    var Semantic = /** @class */ (function () {
        function Semantic(tokens) {
            this.symbolOutput = [];
            this.tokenList = tokens;
            this.currentToken = 0;
            this.symbolTree = new SymbolTree();
            this.programNum = 1;
            this.scopeNum = -1;
            this.quoteVal = "";
        }
        Semantic.prototype.semantic = function () {
        };
        Semantic.prototype.symbolTableOP = function () {
            this.parseBlockSemantic();
            console.log("SYMBOLOP");
            console.log(this.symbolOutput);
            return this.symbolOutput;
        };
        Semantic.prototype.scopeTreeOP = function () {
            return this.symbolTree.toString();
        };
        Semantic.prototype.scope = function () {
        };
        Semantic.prototype.programSemantic = function () {
            this.scopeNum = -1;
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.parseBlockSemantic();
            }
        };
        //parseBlockSemantic handles open and closed curly braces followed by an EOP marker
        Semantic.prototype.parseBlockSemantic = function () {
            this.scopeNum++;
            this.symbolTree.addNode("ScopeLevel: " + this.scopeNum, "branch", this.scopeNum);
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '{') {
                this.currentToken++;
            }
            this.statementListSemantic();
            if (tokens[this.currentToken][1] == '}') {
                this.currentToken++;
                //this.scopeNum--;
                if (tokens[this.currentToken] === undefined) {
                    return;
                }
                else if (tokens[this.currentToken][1] == '$') {
                    this.programNum++;
                    this.currentToken++;
                    this.programSemantic();
                }
            }
            //this.scopeNum--;
        };
        //StatementListSemantic tests the tokens to see if we have valid statementListSemantics
        Semantic.prototype.statementListSemantic = function () {
            if (tokens[this.currentToken] === undefined) {
                return;
            }
            else if (tokens[this.currentToken][1] == '}') {
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
            console.log(this.scopeNum);
            if (tokens[this.currentToken][0] == 'VARIABLE') {
                this.symbolOutput.push([
                    [this.programNum],
                    [tokens[this.currentToken][1]],
                    [tokens[this.currentToken - 1][1]],
                    [this.scopeNum],
                    [tokens[this.currentToken][3]],
                    [tokens[this.currentToken][2]]
                ]);
                this.currentToken++;
            }
            return;
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
        return Semantic;
    }());
    TSC.Semantic = Semantic;
})(TSC || (TSC = {}));
