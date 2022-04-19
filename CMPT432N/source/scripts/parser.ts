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

module TSC {
        export class Parser {
            currentToken: number; 
            tokenList: Array<Lexer>; 
            parseOutput: Array<String>; 
            braces: number;
            cstOutput: Array<String>;
            cstt: Array<Tree>;


            // Constructor for parser, passed tokens from lexer. Inits values.
            constructor(tokens){
                this.tokenList = tokens;
                this.parseOutput = [];
                this.currentToken = 0;
                this.cstOutput = [];
                // Tree data structure
                //this.cst = new Tree();
                //this.cst = new Tree();
                this.braces = 0;
            }

            //define array to return productions to index.html
            public parse() {
                this.program();
                return this.parseOutput;
            }

            //define array to return CST to index.html
            public cst(){
                return this.cstOutput;
            }
            
            //most of the following can be easily understood. There are many methods
            //which define portions of our grammar and add productions to parseOutput
            //Program tests to see if the first character is valid. if not send an error
            public program(){
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] == '{'){
                    this.parseOutput.push("Progrm");
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
            }

            //parseBlock handles open and closed curly braces followed by an EOP marker
            public parseBlock(){
                if(tokens[this.currentToken][1] == '{'){
                    this.parseOutput.push("Block");
                    this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.braces++;
                    this.statementList();
                }
                else if(tokens[this.currentToken][1] == '}'){
                    this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.braces--;                    
                    if(tokens[this.currentToken][1] == '$'){
                        if(this.braces != 0){
                            if(this.braces > 0){
                                this.parseOutput.push("ERROR - missing [}]")
                            }
                            else if(this.braces < 0){
                                this.parseOutput.push("ERROR - missing [{]")
                            }
                        }
                        this.parseOutput.push("VALID - Found [EOP]");
                        this.currentToken++;
                        this.program();
                    }
                    else{
                        this.statementList();
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
            }

            //StatementList tests the tokens to see if we have valid statementLists
            public statementList(){
                if(tokens[this.currentToken] === undefined){
                    return;
                }
                else if(tokens[this.currentToken][1] == '}' && tokens[this.currentToken-1][1] == '{'){
                    this.parseOutput.push("StatementList");
                    this.parseOutput.push("VALID - Found [ε] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.parseBlock();
                }
                else if(tokens[this.currentToken][1] == '}'){
                    this.parseBlock();
                }
                else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                this.parseOutput.push("StatementList");
                this.statement();
                    if(tokens[this.currentToken] === undefined){
                        return;
                    }
                    else if(tokens[this.currentToken][1] != "$") {
                        //this.currentToken++;
                        this.statementList();
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.parseOutput.push("Expected token(s) [ PRINT, ID, INT, STRING, BOOLEAN, WHILE, STRING, IF, L_BRACE, R_BRACE ]")
                }
                return;
            }

            //statement is used to validate the tokens that are statmenets and pass them to their specified statement
            public statement(){
                this.parseOutput.push("Statement");
                if(tokens[this.currentToken][0] == 'PRINT'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.printStatement();
                }
                else if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0]+ " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.assignmentStatement();
                }
                else if(tokens[this.currentToken][0] == 'INT_TYPE' || tokens[this.currentToken][0] == 'BOOL_TYPE' 
                || tokens[this.currentToken][0] == 'STRING_TYPE'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.varDecl();
                }
                else if(tokens[this.currentToken][0] == 'WHILE'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.whileStatement();
                }
                else if(tokens[this.currentToken][0] == 'IF'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.ifStatement();
                }
                else if(tokens[this.currentToken][1] == '{' || tokens[this.currentToken][1] == '}') {
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }

            
            public printStatement(){
                this.parseOutput.push("PrintStatement");
                if(tokens[this.currentToken][1] == '('){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.expression();
                    if(tokens[this.currentToken][1] == ')'){
                        this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        this.currentToken++;
                    }
                    else{
                        this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }
            
            public expression(){
                this.parseOutput.push("Expr");
                if (tokens[this.currentToken][0] == "DIGIT") {
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.intExpr();
                } 
                else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                    this.currentToken++;
                    this.stringExpr();
                }
                else if (tokens[this.currentToken][0] == "VARIABLE") {
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0]+ " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                }
                else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                    this.booleanExpr();
                }  
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }

            public intExpr(){
                this.parseOutput.push("IntExpr");
                if(tokens[this.currentToken][0] == 'ADDITION_OP'){
                    this.parseOutput.push("VALID - Found [+] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                }
                return; 
            }

            public stringExpr(){
                this.parseOutput.push("StringExpr");
                this.charList();
                return;
            }

            public charList(){
                this.parseOutput.push("CharList with value of [" + tokens[this.currentToken][1] + "]"); 
                this.currentToken++;
                if(tokens[this.currentToken][0] == "CHAR" || tokens[this.currentToken][0] == "SPACE"){
                    this.charList();
                }
                else if(tokens[this.currentToken][0] == "DOUBLE_QUOTE"){
                    this.currentToken++;
                    return;
                }
                return;
            }

            public assignmentStatement(){
                this.parseOutput.push("AssignmentStatement");
                if(tokens[this.currentToken][1] == "="){
                    this.parseOutput.push("VALID - Found ["+ tokens[this.currentToken][0] +"] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.parseOutput.push("Expected tokens: [ASSIGNMENT]")
                }
                return;
            }

            public varDecl(){
                this.parseOutput.push("VarDecl");
                if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0]+ " - " + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                }
                return;
            }

            public booleanExpr(){
                this.parseOutput.push("BooleanExpr");
                if (tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                    this.parseOutput.push("BoolVal");
                    this.parseOutput.push("VALID - Found ["+ tokens[this.currentToken][0] +"] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                }
                else if(tokens[this.currentToken][0] == 'L_PAREN'){
                    this.parseOutput.push("VALID - Found ["+ tokens[this.currentToken][0] +"] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                    if(tokens[this.currentToken][1] == '==' || tokens[this.currentToken][1] == '!='){
                        this.parseOutput.push("BoolOp");
                        this.parseOutput.push("VALID - Found ["+ tokens[this.currentToken][0] +"] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        this.currentToken++;
                        this.expression();
                        if(tokens[this.currentToken][0] == 'R_PAREN'){
                            this.parseOutput.push("VALID - Found ["+ tokens[this.currentToken][0] +"] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                            this.currentToken++;
                        }
                        else{
                            this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        }
                    }
                    else{
                        this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }

            public ifStatement(){
                this.parseOutput.push("IfStatement");

                if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                    this.booleanExpr();
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }

            public whileStatement(){
                this.parseOutput.push("WhileStatement");
                if (tokens[this.currentToken][0] == "L_PAREN" || tokens[this.currentToken][0] == "BOOL_TRUE" || tokens[this.currentToken][0] == "BOOL_FALSE") {
                    this.booleanExpr();
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }
    }
}