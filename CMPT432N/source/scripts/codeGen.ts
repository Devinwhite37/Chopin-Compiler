module TSC {
    export class CodeGen {
        createdCode: Array<any>;
        symbolList: Array<Semantic>;
        codeGenOP: Array<String>;
        curLocation: number;
        astG: Array<Semantic>;
        ast: Semantic;
        tree: any;

        constructor(){
            //this.ast = new Semantic(astRes);
            this.createdCode = [];
            this.codeGenOP = [];
            this.curLocation = 0;
            this.tree = {};
            //this.astG = new Semantic();
            //this.createdCode.push("Program 1");
            for(var i=0; i<256; i++){
                this.createdCode.push("00");
            }
            //console.log(this.symbolList);
            this.codeGenOP.push("Added string [true] to heap, address 246");
            this.codeGenOP.push("Added string [false] to heap, address 251");
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

        public codeGenOutput(astRes){
            let ast: ScopeTree = astRes;
            console.log(ast);
            console.log(this.ast);
            console.log(this.tree);
            //this.astG.astRes = this.ast;
            console.log(this.ast);
            return this.codeGenOP;
        }

        public codeOutput(){
            this.setHex("A9");
            this.setHex("00");
            return this.createdCode;

        }

        public setHex(curHex){
            this.createdCode[this.curLocation++] = curHex;
        }
    }
}