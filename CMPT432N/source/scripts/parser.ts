

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
                this.currentToken = 0;
                // Tree data structure
                //this.cst = new Tree();
                this.braces = 0;

            }
            public parse() {
                if(tokens[this.currentToken][1] == undefined){
                } 
                else if(tokens[this.currentToken][1] == '{'){
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Expecting [{] found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                }
                //this.statementList();
                return this.parseOutput;
            }

            /*public parseBlock() {
                //if(tokens[this.currentToken][1]!=""){
                    this.parseOutput.push("Block");
                    for(this.currentToken = this.currentToken; this.currentToken < tokens.length; this.currentToken++){
                        if(tokens[this.currentToken][1] == '{'){
                            this.parseOutput.push("VALID - Expecting [L_BRACE], found [{] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                            this.currentToken++;
                            this.statementList();
                            if(tokens[this.currentToken][1] == '}'){
                                this.parseOutput.push("VALID - Expecting [R_BRACE], found [}] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                                this.currentToken++;
                                if(tokens[this.currentToken][1] == '$'){
                                    this.parseOutput.push("VALID - Expecting [EOP], found [$] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                                }
                                else if(tokens[this.currentToken][0] != '$'){
                                    this.parseOutput.push("ERROR - Expecting [EOP]");
                                    break;
                                }
                            }
                            else if(tokens[this.currentToken][1] != '}'){
                                this.parseOutput.push("ERROR - Expecting [}]");
                                break;
                            }
                        }
                        else if(tokens[this.currentToken][1] != '{'){
                            this.parseOutput.push("ERROR - Expecting [{]");
                            break;
                        }
                    }  
                }*/
                //else{}
            //}
            public parseBlock(){
                this.parseOutput.push("Block");
                if(tokens[this.currentToken][1] == '{'){
                    this.parseOutput.push("VALID - Found [L_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.statementList();
                    console.log("SHould be here now"+ tokens[this.currentToken][1]);

                    this.braces++;   
                }
                else if(tokens[this.currentToken][1] == '}'){
                    this.parseOutput.push("VALID - Found [R_BRACE] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.braces--;                    
                    console.log("Braces: "+ this.braces)
                    if(tokens[this.currentToken][1] == '$'){
                        this.parseOutput.push("VALID - Found [EOP]");
                        this.currentToken++;
                    }
                    else{
                        this.statementList();
                    }
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
                }
                /*if(this.braces != 0){
                    this.parseOutput.push("ERROR - missing [}]")
                }*/
            }
            public statementList(){
                this.parseOutput.push("StatementList");
                    /*if (tokens[this.currentToken][1] == '}') {
                        this.parseBlock();
                    }*/
                    if (tokens[this.currentToken][0] == 'PRINT' || tokens[this.currentToken][0] == "VARIABLE"
                        || tokens[this.currentToken][0] == "INT_TYPE" || tokens[this.currentToken][0] == "STRING_TYPE"
                        || tokens[this.currentToken][0] == "BOOL_TYPE" || tokens[this.currentToken][0] == "WHILE"
                        || tokens[this.currentToken][0] == "IF" || tokens[this.currentToken][0] == "L_BRACE") {
                        //console.log("statement elif ran");
                        //this.currentToken++;
                        this.statement();
                    }
                    console.log("Statement list return");
                    return;
            }
            public statement(){
                this.parseOutput.push("Statement");
                if(tokens[this.currentToken][0] == 'PRINT'){
                    this.currentToken++;
                    this.printStatement();
                }
                else if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.assignmentStatement();
                }
                else if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.assignmentStatement();
                }
                else if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.assignmentStatement();
                }
                else if(tokens[this.currentToken][0] == 'VARIABLE'){
                    this.assignmentStatement();
                }
                else if (tokens[this.currentToken][0] == "L_BRACE") {
                    this.parseBlock();
                }
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]")
                }
                console.log("Statement return");
                return;
            }
            public printStatement(){
                this.parseOutput.push("PrintStatement");
                this.parseOutput.push("VALID - Found [PRINT] on [ " + tokens[this.currentToken-1][2] + " , " + tokens[this.currentToken-1][3] + " ]");
                if(tokens[this.currentToken][1] == '('){
                    this.parseOutput.push("VALID - Found [L_PAREN] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                    console.log("does this run?");
                    console.log("this is " + tokens[this.currentToken][1])
                    if(tokens[this.currentToken][1] == ')'){
                        console.log("why this no run");
                        this.parseOutput.push("VALID - Found [R_PAREN] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                        this.currentToken++;
                        console.log("this is " + tokens[this.currentToken][1] + " now")
                        return;
                    }
                }   
            }
            
            public expression(){
                console.log("EXPR");
                this.parseOutput.push("Expr");
                if (tokens[this.currentToken][0] == "DIGIT") {
                    this.parseOutput.push("VALID - Found [" + tokens[this.currentToken][1] + "] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]")
                    this.currentToken++;
                    this.intExpr();
                } 
                else{
                    this.parseOutput.push("ERROR - Found [" + tokens[this.currentToken][1] + "]");
                    return;
                }
            }

            public intExpr(){
                this.parseOutput.push("IntExpr");
                if(tokens[this.currentToken][0] == 'ADDITION_OP'){
                    this.parseOutput.push("VALID - Found [+] on [ " + tokens[this.currentToken][2] + " , " + tokens[this.currentToken][3] + " ]");
                    this.currentToken++;
                    this.expression();
                    return;
                }
                else{
                    return;
                }
            }

            public assignmentStatement(){
                console.log("AssiGNMENT RAN");
                this.parseOutput.push("AssignmentStatement");
            }






            public lBrace(){
                this.braces++;
                return;
            }
            public rBrace(){
                this.braces--;
                return;
            }
    }
}