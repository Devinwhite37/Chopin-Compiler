module TSC {
    export class Semantic {
        tokenList: Array<Lexer>; 
        currentToken: number; 
        scopeTree: ScopeTree;
        programNum: number;
        scopeNum: number;
        quoteVal: String;
        symbolOutput: any[][] = [];
        semanticOutput: Array<String>;
        scopeArray: Array<number>;
        scopeLevel: number;
        symbol: Object = {};
        symbols: Array<any>;
                /*symbol: {
            programNum: number,
            key: String,
            type: String,
            scope: number,
            line: number,
            col: number
        };*/

        constructor(tokens){
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
            
            this.symbols = [];
            this.scopeArray = [];
            this.scopeLevel = -1;
        }

        public semantic(){
            console.log(this.semanticOutput);
            return this.semanticOutput;
        }

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

        public scopeTreeOP(){
            return this.scopeTree.toString();
        }

        public programSemantic(){
            this.scopeNum = -1;
            this.scopeLevel = -1;
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '{'){
                this.parseBlockSemantic();
            }
            return this.symbolOutput;

        }

        //parseBlockSemantic handles open and closed curly braces followed by an EOP marker
        public parseBlockSemantic(){
            this.scopeNum++;
            this.scopeLevel++;
            this.scopeArray.push(this.scopeNum)
            //this.scopeTree.addNode("Scope: " + this.scopeNum, "branch", this.scopeNum);
            if(tokens[this.currentToken] === undefined){
                return;
            }            
            else if(tokens[this.currentToken][1] == '{'){
                this.currentToken++;
            }
            this.statementListSemantic();

            if(tokens[this.currentToken][1] == '}'){
                this.currentToken++;
                this.scopeLevel--;
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] == '$'){
                    this.semanticOutput.push("EOP");
                    this.programNum++;
                    this.currentToken++;
                    this.programSemantic();
                }
            }
            this.scopeNum = this.scopeArray.pop();
        }

        //StatementListSemantic tests the tokens to see if we have valid statementListSemantics
        public statementListSemantic(){  
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '}'){
                return;
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
                this.currentToken++;
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
            return;
        }

        
        public printStatementSemantic(){
            if(tokens[this.currentToken][1] == '('){
                this.currentToken++;
                this.expressionSemantic();
                if(tokens[this.currentToken][1] == ')'){
                    this.currentToken++;
                }
            }
            return;
        }
        
        public expressionSemantic(){
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
        }

        public intExprSemantic(){
            if(tokens[this.currentToken][0] == 'ADDITION_OP'){
                this.currentToken++;
                this.expressionSemantic();
                return;
            }
            else{
            }
            return; 
        }

        public stringExprSemantic(){
            this.charListSemantic();
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
                return;
            }
            return;
        }

        public assignmentStatementSemantic(){
            
            if(tokens[this.currentToken][1] == "="){
                this.currentToken++;
                this.expressionSemantic();
            }
            return;
        }

        public varDeclSemantic(){
            console.log(this.scopeNum)
            if(tokens[this.currentToken][0] == 'VARIABLE'){
                //programNum = this.programNum;
                this.symbol["type"] = tokens[this.currentToken - 1][1];
                this.symbol["key"] = tokens[this.currentToken][1];
                this.symbol["line"] = tokens[this.currentToken][3];
                this.symbol["col"] = tokens[this.currentToken][2];
                this.symbol["scope"] = this.scopeNum;
                this.symbol["scopeLevel"] = this.scopeLevel;
                this.symbols.push(this.symbolOutput);
                console.log(this.symbols);
                /*this.symbolOutput.push([
                    [this.programNum],
                    [tokens[this.currentToken][1]],
                    [tokens[this.currentToken - 1][1]],
                    [this.scopeNum],
                    [tokens[this.currentToken][3]],
                    [tokens[this.currentToken][2]]
                ]);*/
                console.log(this.symbolOutput);
                this.createSymbol(this.programNum, tokens[this.currentToken][1], tokens[this.currentToken - 1][1], this.scopeNum, tokens[this.currentToken][3], tokens[this.currentToken][2]);
                this.semanticOutput.push("New variable declared [" + tokens[this.currentToken][1] + "] on [" + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + "] with type " + tokens[this.currentToken - 1][1]);
                this.currentToken++;
            }
            return;
        }

        public createSymbol(programNum, key, type, scope, line, col){
            /*this.symbol = {
                programNum: programNum,
                key: key,
                type: type,
                scope: scope,
                line: line,
                col: col
            }*/
            this.symbol["type"] = tokens[this.currentToken - 1][1];
            this.symbol["key"] = tokens[this.currentToken][1];
            this.symbol["line"] = tokens[this.currentToken][3];
            this.symbol["col"] = tokens[this.currentToken][2];
            this.symbol["scope"] = this.scopeNum;
            this.symbol["scopeLevel"] = this.scopeLevel;
            this.symbols.push(this.symbolOutput);
            console.log(this.symbols);
            //this.symbol = {};
            let symbol = []
            this.scopeTree.addNode("Scope: " + this.scopeNum, "branch", this.scopeNum, this.symbols);

            //symbol = [this.]
            //this.scopeTree.cur.symbols.push(this.symbols);
            return(this.symbol);
        }

        public booleanExprSemantic(){
            if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.currentToken++;
            }
            else if(tokens[this.currentToken][0] == 'L_PAREN'){
                this.currentToken++;
                this.expressionSemantic();
                if(tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!='){
                    this.currentToken++;
                    this.expressionSemantic();
                    if(tokens[this.currentToken][0] == 'R_PAREN'){
                        this.currentToken++;
                    }
                }
            }
            return;
        }

        public ifStatementSemantic(){
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExprSemantic();
                this.parseBlockSemantic();
            }
            return;
        }

        public whileStatementSemantic(){
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExprSemantic();
                this.parseBlockSemantic();
            }
            return;
        }

        public scopeTreeVars(){

        }
    }
}