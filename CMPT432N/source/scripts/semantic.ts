module TSC {
    export class Semantic {
        tokenList: Array<Lexer>; 
        currentToken: number; 
        scopeTree: Tree;
        programNum: number;
        scopeNum: number;
        quoteVal: String;
        symbolOutput: any[][] = [];



        constructor(tokens){
            this.tokenList = tokens;   
            this.currentToken = 0; 
            this.scopeTree = new Tree();
            this.programNum = 1;
            this.scopeNum = -1;
            this.quoteVal = "";
        }

        public semantic(){

        }
        public symbolTableOP(){
            this.parseBlockSemantic();
            console.log("SYMBOLOP");
            console.log(this.symbolOutput);

            return this.symbolOutput;

        }
        public scopeTreeOP(){

        }
        public scope(){

        }

        public programSemantic(){
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '{'){
                this.parseBlockSemantic();
            }
        }

        //parseBlockSemantic handles open and closed curly braces followed by an EOP marker
        public parseBlockSemantic(){
            if(tokens[this.currentToken] === undefined){
                return;
            }            
            if(tokens[this.currentToken][1] == '{'){
                this.currentToken++;
                this.scopeNum++;
                this.statementListSemantic();
            }
            else if(tokens[this.currentToken][1] == '}'){
                this.currentToken++;
                this.scopeNum--;
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] == '$'){
                    this.programNum++;
                    this.currentToken++;
                    this.programSemantic();
                }
                else{
                    this.statementListSemantic();
                }
            }
        }

        //StatementListSemantic tests the tokens to see if we have valid statementListSemantics
        public statementListSemantic(){  
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '}' && tokens[this.currentToken-1][1] == '{'){
                this.parseBlockSemantic();
            }
            else if(tokens[this.currentToken][1] == '}'){
                this.parseBlockSemantic();
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.statementSemantic();
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] != "$") {
                    this.statementListSemantic();
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
            else if(tokens[this.currentToken][1] == '{' || tokens[this.currentToken][1] == '}') {
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
    }
}