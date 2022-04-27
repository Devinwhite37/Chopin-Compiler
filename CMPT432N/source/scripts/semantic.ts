module TSC {
    export class Semantic {
        tokenList: Array<Lexer>; 
        currentToken: number; 


        constructor(tokens){
            this.tokenList = tokens;   
            this.currentToken = 0; 
        }


    }
}