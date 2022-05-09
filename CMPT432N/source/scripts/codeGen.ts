module TSC {
    export class CodeGen {
        tokenList: Array<Lexer>; 
        currentCode: Array<any>;

        constructor(tokens){
            this.tokenList = tokens; 
            this.currentCode = [];
            this.currentCode.push("Program 1");
            for(var i=0; i<256; i++){
                this.currentCode.push("00");
            }
        }

        public codeOutput(){
            console.log(this.currentCode);
            return this.currentCode;
        }
    }
}