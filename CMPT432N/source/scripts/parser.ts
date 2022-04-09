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

            // Constructor for parser, passed tokens from lexer. Inits values.
            constructor(tokens){
                this.tokenList = tokens;
                this.parseOutput = [];
                this.currentToken = -1;
                // Tree data structure
                //this.cst = new Tree();
                this.braces = 0;
            }

            public parse() {
                this.program();
                return this.parseOutput;
            }

            public program(){
                this.currentToken = this.currentToken+1;
                this.parseOutput.push("Progrm");
                //console.log("PROGRAM: this " + tokens[this.currentToken][1] + " "  + this.currentToken);
                if(tokens[this.currentToken][0] == ""){
                    this.parseOutput.push("nocode");
                }
                else if(tokens[this.currentToken][1] == '{'){
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                //this.statementList();
            }

            public parseBlock(){
                //console.log(tokens[this.currentToken][2]);
                if(tokens[this.currentToken][1] == '{'){
                    this.parseOutput.push("Block");
                    this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.braces++;
                    this.statementList();
                    //console.log("SHould be here now"+ tokens[this.currentToken][1]);
                }
                else if(tokens[this.currentToken][1] == '}'){
                    this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    //console.log("this " + tokens[this.currentToken][1] + " "  + this.currentToken);
                    this.braces--;                    
                    console.log("Braces: "+ this.braces)
                    if(tokens[this.currentToken][1] == '$'){
                        this.parseOutput.push("VALID - Found [EOP]");
                        //this.currentToken++;
                        this.program();
                    }
                    else{
                        this.statementList();
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                /*if(this.braces != 0){
                    this.parseOutput.push("ERROR - missing [}]")
                }*/
            }
            public statementList(){
                if(tokens[this.currentToken][1] == '}'){
                    this.parseBlock();
                }
                else if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                //console.log("statement elif ran");
                //this.currentToken++;
                this.parseOutput.push("StatementList");
                this.statement();
                    if(tokens[this.currentToken][1] != "$") {
                        console.log("EOP IF RAN:: " + tokens[this.currentToken][1])
                        //this.currentToken++;
                        this.statementList();
                    }
                }
                return;
            }

            public statement(){
                this.parseOutput.push("Statement");
                if(tokens[this.currentToken][0] == 'PRINT'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.printStatement();
                }
                else if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
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
                        this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
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
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.intExpr();
                } 
                else if (tokens[this.currentToken][0] == "DOUBLE_QUOTE") {
                    this.currentToken++;
                    this.stringExpr();
                }
                else if (tokens[this.currentToken][0] == "VARIABLE") {
                    this.parseOutput.push("VALID- Found [" + tokens[this.currentToken][0] + "]");
                    this.currentToken++;
                    //this.id();
                }
                else if (tokens[this.currentToken][1] == '(' || tokens[this.currentToken][1] == 'true' || tokens[this.currentToken][1] == 'false') {
                    //this.currentToken++;
                    this.booleanExpr();
                }  
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }

            public intExpr(){
                this.parseOutput.push("IntExpr");
                console.log("intEXPR" + tokens[this.currentToken+1][0])
                if(tokens[this.currentToken+1][0] == 'ADDITION_OP'){
                    this.parseOutput.push("VALID - Found [+] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return; 
            }


            public stringExpr(){
                this.parseOutput.push("StringExpr");
                this.charList();
            }

            public charList(){
                this.parseOutput.push("CharList with value of [" + tokens[this.currentToken][1] + "]"); 
                this.currentToken++;
                if(tokens[this.currentToken][0] == "CHAR"){
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
                }
                return;
            }

            public varDecl(){
                this.parseOutput.push("VarDecl");
                if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.parseOutput.push("VALID - Found ["+ tokens[this.currentToken][0] +"] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                return;
            }

            public booleanExpr(){
                this.parseOutput.push("BooleanExpr");
                if(tokens[this.currentToken][0] == 'L_PAREN'){
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
                            this.parseOutput.push("first else ERROR - Found [" + tokens[this.currentToken][0] + "]] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        }
                    }
                    else{
                        this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "]] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][0] + "]] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
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
