module TSC {
    export class CodeGen {
        tokenList: Array<Lexer>; 
        createdCode: Array<any>;
        symbolList: Array<Semantic>;
        codeGenOP: Array<String>;
        curLocation: number;

        constructor(tokens){
            this.tokenList = tokens; 
            this.createdCode = [];
            this.codeGenOP = [];
            this.curLocation = 0;
            //this.createdCode.push("Program 1");
            for(var i=0; i<256; i++){
                this.createdCode.push("00");
            }
            //console.log(this.symbolList);
            this.createdCode[254] = "e".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[253] = "s".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[252] = "l".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[251] = "a".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[250] = "f".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[248] = "e".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[247] = "u".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[246] = "r".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[245] = "t".charCodeAt(0).toString(16).toUpperCase();
        }

        public codeGenOutput(){
            return this.codeGenOP
        }

        public codeOutput(){
            console.log(this.createdCode);
            this.setHex("A9");
            this.setHex("00");
            return this.createdCode;

        }

        public setHex(curHex){
            this.createdCode[this.curLocation++] = curHex;
        }
    }
}