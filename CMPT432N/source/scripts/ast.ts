/* ast.ts  */

/**
 * parser.ts
 * Devin White, CMPT432N
 * 
 * Inspiration taken from Sonar in hall of fame projects.
 * 
 * ast.ts is used to create an Abstract Syntax Tree from 
 * the tokens given to us by the lexer
 */

module TSC {
    export class Ast {
        currentToken: number; 
        tokenList: Array<Lexer>; 
        braces: number;
        astOutput: Array<String>;
        ast: Tree;
        programNum: number;
        quoteVal: String;


        // Constructor for ast, passed tokens from lexer. Inits values.
        constructor(tokens){
            this.tokenList = tokens;
            this.currentToken = 0;
            this.astOutput = [];
            this.ast = new Tree();
            //this.ast.addNode("Root", "branch");
            this.programNum = 1;
            this.quoteVal = "";

        }

        //function to return AST to index.html
        public astTree(){
            this.program();
            return this.ast.toString();
        }
        
        //most of the following can be easily understood. There are many methods
        //which define portions of our grammar and add productions to parseOutput
        //Program tests to see if the first character is valid. if not send an error
        public program(){
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '{'){
                this.ast.addNode("Program "+ this.programNum, "branch");
                this.parseBlock();
            }
            this.ast.endChildren();
        }

        //parseBlock handles open and closed curly braces followed by an EOP marker
        public parseBlock(){
            if(tokens[this.currentToken][1] == '{'){
                this.ast.addNode("Block", "branch");
                this.currentToken++;
                this.statementList();
            }
            else if(tokens[this.currentToken][1] == '}'){
                this.ast.endChildren();
                this.currentToken++;
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] == '$'){
                    this.ast.endChildren();
                    this.programNum++;
                    this.currentToken++;
                    this.program();
                }
                else{
                    this.ast.endChildren();
                    this.statementList();
                }
            }
        }

        //StatementList tests the tokens to see if we have valid statementLists
        public statementList(){  
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][1] == '}' && tokens[this.currentToken-1][1] == '{'){
                this.parseBlock();
            }
            else if(tokens[this.currentToken][1] == '}'){
                this.parseBlock();
            }
            else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.statement();
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] != "$") {
                    this.statementList();
                }
            }
            return;
        }

        //statement is used to validate the tokens that are statmenets and pass them to their specified statement
        public statement(){
            if(tokens[this.currentToken] === undefined){
                return;
            }
            else if(tokens[this.currentToken][0] == 'PRINT'){
                this.currentToken++;
                this.printStatement();
            }
            else if(tokens[this.currentToken][0] == 'VARIABLE'){
                this.currentToken++;
                this.assignmentStatement();
            }
            else if(tokens[this.currentToken][0] == 'INT_TYPE' 
                || tokens[this.currentToken][0] == 'BOOL_TYPE' 
                || tokens[this.currentToken][0] == 'STRING_TYPE'){
                this.currentToken++;
                this.varDecl();
            }
            else if(tokens[this.currentToken][0] == 'WHILE'){
                this.currentToken++;
                this.whileStatement();
            }
            else if(tokens[this.currentToken][0] == 'IF'){
                this.currentToken++;
                this.ifStatement();
            }
            else if(tokens[this.currentToken][1] == '{' || tokens[this.currentToken][1] == '}') {
                //this.ast.endChildren();
                this.parseBlock();
            }
            return;
        }

        
        public printStatement(){
            this.ast.addNode("PrintStatement", "branch");  
            if(tokens[this.currentToken][1] == '('){
                this.currentToken++;
                this.expression();
                if(tokens[this.currentToken][1] == ')'){
                    this.currentToken++;
                }
            }
            this.ast.endChildren();
            return;
        }
        
        public expression(){
            if (tokens[this.currentToken][0] == "DIGIT") {
                this.ast.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
                this.intExpr();
            } 
            else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                this.currentToken++;
                this.stringExpr();
            }
            else if (tokens[this.currentToken][0] == "VARIABLE") {
                this.ast.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
            }
            else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                this.booleanExpr();
            }  
            return;
        }

        public intExpr(){
            if(tokens[this.currentToken][0] == 'ADDITION_OP'){
                this.currentToken++;
                this.expression();
                this.ast.endChildren();
                return;
            }
            else{
                this.ast.endChildren();
            }
            return; 
        }

        public stringExpr(){
            this.charList();
            this.ast.endChildren();
            return;
        }

        public charList(){
            this.currentToken++;
            if(tokens[this.currentToken][0] == "CHAR" || tokens[this.currentToken][0] == "SPACE"){
                this.quoteVal += tokens[this.currentToken-1][1];
                this.charList();
            }
            else if(tokens[this.currentToken][0] == "DOUBLE_QUOTE"){
                this.quoteVal += tokens[this.currentToken-1][1];
                this.currentToken++;
                this.ast.addNode(this.quoteVal, "leaf");
                return;
            }
            return;
        }

        public assignmentStatement(){
            this.ast.addNode("AssignmentStatement", "branch");
            this.ast.addNode(tokens[this.currentToken - 1][1], "leaf");
            if(tokens[this.currentToken][1] == "="){
                this.currentToken++;
                this.expression();
            }
            this.ast.endChildren();
            return;
        }

        public varDecl(){
            this.ast.addNode("VarDecl", "branch");
            if(tokens[this.currentToken][0] == 'VARIABLE'){
                this.ast.addNode(tokens[this.currentToken - 1 ][1], "leaf");
                this.ast.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
            }
            else{
                this.currentToken++;
            }
            this.ast.endChildren();
            return;
        }

        public booleanExpr(){
            if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.ast.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
            }
            else if(tokens[this.currentToken][0] == 'L_PAREN'){
                this.ast.addNode(tokens[this.currentToken][1], "leaf");
                this.currentToken++;
                this.expression();
                if(tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!='){
                    this.ast.addNode(tokens[this.currentToken][1], "leaf");
                    this.currentToken++;
                    this.expression();
                    if(tokens[this.currentToken][0] == 'R_PAREN'){
                        this.ast.addNode(tokens[this.currentToken][1], "leaf");
                        this.currentToken++;
                    }
                }
            }
            this.ast.endChildren();
            return;
        }

        public ifStatement(){
            this.ast.addNode("IfStatement", "branch");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExpr();
                this.parseBlock();
            }
            else{

            }
            this.ast.endChildren();
            return;
        }

        public whileStatement(){
            this.ast.addNode("WhileStatement", "branch");
            if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                this.booleanExpr();
                this.parseBlock();
            }
            else{
            }
            this.ast.endChildren();
            return;
        }
}
}