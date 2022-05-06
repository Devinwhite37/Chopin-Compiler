module TSC {
    export class Semantic {
        tokenList: Array<Lexer>; 
        currentToken: number; 
        ast: ScopeTree;
        programNum: number;
        scopeNum: number;
        quoteVal: String;
        symbolOutput: any[] = [];
        semanticOutput: Array<String>;
        scopeArray: Array<number>;
        scopeLevel: number;
        symbol: Object = {};
        symbols: Array<any>;
        scope: number;
        currentVar:  String;
        prevVars: String;
        prevVarScope: number;
        prevProgramNum: number;

        constructor(tokens){
            this.tokenList = tokens;   
            this.currentToken = 0; 
            this.ast = new ScopeTree();
            this.programNum = 1;
            this.scopeNum = -1;
            this.quoteVal = "";
            this.semanticOutput = [];
            this.scope = -1;
            this.symbols = [];
            this.scopeArray = [];
            this.scopeLevel = -1;
            this.currentVar = "";
            this.prevVars = "";
            this.prevVarScope = -1;
            this.symbolOutput = [];
            this.prevProgramNum = -1;
            /*this.symbolOutput =([
                [0],
                [0[0][0]],
                [0[0][0]],
                [0],
                [0[0][0]],
                [0[0][0]]
            ]);*/
        }

        public astTree(){
            this.programSemantic();
            return this.ast.toString();
        }
        
        public semantic(){
            return this.semanticOutput;
        }

        public scopeTreeOP(){
            return this.ast.toString();
        }

        public symbolTableOP(){
            return this.symbolOutput;
        }

        public programSemantic(){
            this.scopeNum = -1;
            this.scopeLevel = -1;
            this.scope = -1;
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '{'){
                this.ast.addNode("Program "+ this.programNum, "branch", this.scope);
                this.parseBlockSemantic();
            }
            this.ast.endChildren();
            return this.symbolOutput;

        }

        //parseBlockSemantic handles open and closed curly braces followed by an EOP marker
        public parseBlockSemantic(){
            this.scopeNum++;
            this.scopeLevel++;
            this.scopeArray.push(this.scope);
            this.scope = this.scopeNum;

            //this.scopeTree.addNode("Scope: " + this.scopeNum, "branch", this.scopeNum);
            if(tokens[this.currentToken] === undefined){
                return;
            }            
            else if(tokens[this.currentToken][1] == '{'){
                this.ast.addNode("Block", "branch", this.scope);
                this.currentToken++;
            }
            this.statementListSemantic();

            if(tokens[this.currentToken][1] == '}'){
                this.ast.endChildren();
                this.currentToken++;
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] == '$'){
                    this.ast.endChildren();
                    this.areVarsInitialized();
                    this.semanticOutput.push("EOP");
                    this.programNum++;
                    this.currentToken++;
                    this.programSemantic();
                }
            }
            this.scopeLevel--;
            this.scope = this.scopeArray.pop();
        }

        public areVarsInitialized(){
            for(var j = 0; j < this.symbolOutput.length; j++){
                if(this.symbolOutput[j][0].initialized == false){
                    this.semanticOutput.push("WARNING - " + this.symbolOutput[j][0].type + " " + this.symbolOutput[j][0].key + " was declared but never initialized.");
                }

            }

        }
        //StatementListSemantic tests the tokens to see if we have valid statementListSemantics
        public statementListSemantic(){  
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '}'){
                //return;
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.statementSemantic();
                this.statementListSemantic();
                if(tokens[this.currentToken] === undefined){
                    return;
                }
            }
            return;
        }

        //statement is used to validate the tokens that are statmenets and pass them to their specified statement
        public statementSemantic(){
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][0] == 'PRINT'){
                this.currentToken++;
                this.printStatementSemantic();
            }
            else if(tokens[this.currentToken][0] == 'VARIABLE'){
                //this.currentToken++;
                this.assignmentStatementSemantic();
            }
            else if(tokens[this.currentToken][0] == 'INT_TYPE' 
                || tokens[this.currentToken][0] == 'BOOL_TYPE' 
                || tokens[this.currentToken][0] == 'STRING_TYPE'){
                this.currentToken++;
                this.varDeclSemantic();
            }
            else if(tokens[this.currentToken][0] == 'WHILE'){
                this.currentToken++;
                this.whileStatementSemantic();
            }
            else if(tokens[this.currentToken][0] == 'IF'){
                this.currentToken++;
                this.ifStatementSemantic();
            }
            else if(tokens[this.currentToken][1] == '{') {
                //this.ast.endChildren();
                this.parseBlockSemantic();
            }
        }

        
        public printStatementSemantic(){
            this.ast.addNode("PrintStatement", "branch", this.scope);  
            if(tokens[this.currentToken][1] == '('){
                this.currentToken++;
                this.expressionSemantic();
                if(tokens[this.currentToken][1] == ')'){
                    this.currentToken++;
                }
            }
            this.ast.endChildren();
        }
        
        public expressionSemantic(){
            if (tokens[this.currentToken][0] == "DIGIT") {
                this.ast.addNode(tokens[this.currentToken][1], "leaf", this.scope);
                this.currentToken++;
                this.intExprSemantic();
            } 
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                this.stringExprSemantic();
            }
            else if (tokens[this.currentToken][0] == "VARIABLE") {
                this.ast.addNode(tokens[this.currentToken][1], "leaf", this.scope);  
                this.currentToken++;
            }
            else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                this.booleanExprSemantic();
            }  
        }

        public intExprSemantic(){
            if(tokens[this.currentToken][0] == 'ADDITION_OP'){
                this.ast.addNode("+", "leaf", this.scope);
                this.currentToken++;
                this.expressionSemantic();
                return;
            }
            else{
                this.ast.endChildren();
            }
        }

        public stringExprSemantic(){
            this.charListSemantic();
            this.ast.endChildren();
            return;
        }

        public charListSemantic(){
            this.currentToken++;
            if(tokens[this.currentToken][0] == "CHAR" || tokens[this.currentToken][0] == "SPACE"){
                this.quoteVal += tokens[this.currentToken-1][1];
                this.charListSemantic();
            }
            else if(tokens[this.currentToken][0] == "DOUBLE_QUOTE"){
                this.quoteVal += tokens[this.currentToken-1][1];
                this.currentToken++;
                this.ast.addNode(this.quoteVal, "leaf", this.scope);
                return;
            }
            return;
        }

        public assignmentStatementSemantic(){
            this.ast.addNode("AssignmentStatement", "branch", this.scope);
            this.ast.addNode(tokens[this.currentToken][1], "leaf", this.scope);
            this.currentVar = tokens[this.currentToken][1][0];
            this.currentToken++;
            if(tokens[this.currentToken][1] == "="){
                this.currentToken++;
                this.expressionSemantic();
                this.isVarInitialized();
            }
            return;
        }

        public isVarInitialized(){
            for(var j = 0; j < this.symbolOutput.length; j++){
                if(this.symbolOutput[j][0].key == this.currentVar){
                    this.symbolOutput[j][0].initialized = true;
                    console.log(this.symbolOutput);
                }
            }
        }

        public iD(){
            this.ast.addNode(tokens[this.currentToken][1], "leaf", this.scope);
            return;
        }

        public varDeclSemantic(){
            console.log(this.ast.cur);
            this.ast.addNode("VarDecl", "branch", this.scope);
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][0] == 'VARIABLE'){
                this.ast.addNode(tokens[this.currentToken - 1 ][1], "leaf", this.scope);
                this.ast.addNode(tokens[this.currentToken][1], "leaf", this.scope);
                this.currentVar = tokens[this.currentToken][1][0];
                this.isVarDeclared();

                //checks to see if the same variable declared was in the same scope
                if(this.currentVar == this.prevVars && this.scope == this.prevVarScope && this.programNum == this.prevProgramNum){
                    this.semanticOutput.push("ERROR: Variable [" + tokens[this.currentToken][1] + "] already declared in scope in " + this.scope);
                }
                else{
                    this.symbolOutput.push([{
                        programNum: this.programNum,
                        key: tokens[this.currentToken][1][0],
                        type: tokens[this.currentToken - 1][1][0],
                        scope: this.scope,
                        line: tokens[this.currentToken][3][0],
                        col: tokens[this.currentToken][2][0],
                        initialized: false,
                        used: false
                    }]);
                    //this.symbolOutput[0][0].used = true;
                    this.semanticOutput.push("New "+ tokens[this.currentToken - 1][1]+" declared [" + tokens[this.currentToken][1] + "] in scope " + this.scope + " on [" + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + "]");
                        this.currentToken++;
                }   
            }            
            this.ast.endChildren();
        }

        public isVarDeclared(){
            for(var j = 0; j < this.symbolOutput.length; j++){
                if(this.symbolOutput[0] === undefined){
                    this.prevVars = "";
                }
                //checks if we have ever seen current variable declared in any scope
                else if(this.symbolOutput[j][0].key == this.currentVar){
                    this.prevVarScope = this.symbolOutput[j][0].scope;
                    this.prevVars = this.symbolOutput[j][0].key;
                    this.prevProgramNum = this.symbolOutput[j][0].programNum;
                    break;
                }
                else{
                    this.prevVars = "";
                }
            }
        }

        public booleanExprSemantic(){
            if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.ast.addNode(tokens[this.currentToken][1], "leaf", this.scope);
                this.currentToken++;
            }
            else if(tokens[this.currentToken][0] == 'L_PAREN'){
                this.currentToken++;
                this.expressionSemantic();
                if(tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!='){
                    this.ast.addNode(tokens[this.currentToken][0], "leaf", this.scope);
                    this.currentToken++;
                    this.expressionSemantic();
                    if(tokens[this.currentToken][0] == 'R_PAREN'){
                        this.currentToken++;
                    }
                }
            }
            this.ast.endChildren();
            return;
        }

        public ifStatementSemantic(){
            this.ast.addNode("IfStatement", "branch", this.scope);
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExprSemantic();
                this.parseBlockSemantic();
            }
            this.ast.endChildren();
            return;
        }

        public whileStatementSemantic(){
            this.ast.addNode("WhileStatement", "branch", this.scope);
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExprSemantic();
                this.parseBlockSemantic();
            }
            this.ast.endChildren();
            return;
        }

        public scopeTreeVars(name, type, scope, col){
            this.symbol = {
                name: name,
                type: type,
                scope: scope,
                col: col
            }
            return this.symbol;

        }
    }
}