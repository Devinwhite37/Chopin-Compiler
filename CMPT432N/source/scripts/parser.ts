

module TSC {
    export enum Production {
        Program = "Program",
        Block = "Block",
        Expr = "Expression",
        Stmt = "Statement",
        StmtList = "StatementList",
        AssignStmt = "AssignmentStatement",
        PrintStmt = "PrintStatement",
        WhileStmt = "WhileStatement",
        VarDecl = "VarDecl",
        IfStmt = "IfStatement",
        BooleanExpr = "BooleanExpression",
        IntExpr = "IntegerExpression",
        StringExpr = "StringExpression",
        CharList = "CharList",
        Id = "Id",
        BoolVal = "BoolVal",
        Type = "Type",
        Char = "Char",
        Digit = "Digit",
        IntOp = "IntOp",
        BoolOp = "BoolOp",
        Space = "Space",
        Addition = "Addition"
    }
        export class Parser {
            currentToken: number; // the index of the current token we're looking at
            tokenList: Array<Lexer>; // list of tokens passed from lexer
            parseOutput: Array<String>; // log of parser
            error: boolean; // keeps track if the parser has run into an error
            //cst: Tree; // pointer to the tree
            //tokens = Lexer.lex();
            i: number;

            // Constructor for parser, passed tokens from lexer. Inits values.
            constructor(tokens){
                this.tokenList = tokens;
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
            public parse() { 
                this.parseBlock();
                console.log
                return this.parseOutput;
            }

            public parseBlock() {
                console.log("tokenList: ");
                console.log(tokens);
                for(let i = 0; i < tokens.length; i++){
                    if(tokens[i][1] == '{'){
                        this.parseOutput.push("VALID - Expecting [Program], found [Block]");
                        this.i++;
                    }
                    else if(tokens[i][1] != '{'){
                        this.parseOutput.push("ERROR - Expecting [Block], found [ " + tokens[i][1] + " ]");
                    }
                    return this.parseOutput;
                }   
        }
    }
}