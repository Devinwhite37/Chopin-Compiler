module TSC {
    export class CodeGen {
        createdCode: Array<any>;
        symbolList: Array<Semantic>;
        codeGenLog: Array<String>;
        hexLocation: number;
        astG: Array<Semantic>;
        ast: Semantic;
        tree: any;
        heapStart: number;
        staticTable: any[] = [];
        staticId: number;

        constructor(){
            //this.ast = new Semantic(astRes);
            this.createdCode = [];
            this.codeGenLog = [];
            this.hexLocation = 0;
            this.heapStart = 245;
            this.staticTable = [];
            this.staticId = 0;
            //this.tree = {};
            //this.astG = new Semantic();
            //this.createdCode.push("Program 1");
            for(var i=0; i<256; i++){
                this.createdCode.push("00");
            }
            //console.log(this.symbolList);
            this.codeGenLog.push("Added string [true] to heap, address 245");
            this.codeGenLog.push("Added string [false] to heap, address 250");
            this.createdCode[245] = "t".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[246] = "r".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[247] = "u".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[248] = "e".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[250] = "f".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[251] = "a".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[252] = "l".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[253] = "s".charCodeAt(0).toString(16).toUpperCase();
            this.createdCode[254] = "e".charCodeAt(0).toString(16).toUpperCase();
        }

        public codeGenOutput(astRes){
            let ast: ScopeTree = astRes;
            if(ast === undefined){
            }else{
                this.traverse(ast.root);
            }
            return this.codeGenLog;
        }

        public codeOutput(){
            return this.createdCode;
        }

        public setHex(curHex){
            this.createdCode[this.hexLocation] = curHex;
            this.codeGenLog.push("Adding " + curHex + " to [" + this.hexLocation + "]");
            this.hexLocation++;

        }

        public traverse(node: any){
            const DIGIT = new RegExp('[0-9]');
            const STRING = new RegExp('[a-z]');

            console.log(node);
            console.log(node.name);
            if(node.name == 'Root'){
                this.traverse(node.children[0]);
            }
            else if(node.name.slice(0,7) == 'Program'){
                this.traverse(node.children[0]);
            }
            else if(node.name == 'Block'){
                for(var i=0; i<node.children.length; i++){
                    this.traverse(node.children[i]);
                }
            }
            else if(node.name == 'PrintStatement'){
                this.codeGenLog.push("Generating op code for PrintStatement:")
                //tests if the value in the print is a digit
                
                if(DIGIT.test(node.children[0].name[0])){
                    this.setHex("A0");
                    this.setHex("0" + node.children[0].name[0]);
                    this.setHex("A2");
                    this.setHex("01");
                }
                // tests if the value in print is a string
                else if(STRING.test(node.children[0].name[0])){
                    this.setHex("A0");
                    console.log(node.children[0].name);
                    console.log(node.children[0].name[0]);
                    let hexVal = this.heapString(node.children[0].name);
                    this.setHex(hexVal);
                    this.setHex("A2");
                    this.setHex("02");
                }
                //tests if the value in print is a variable
                else if(STRING.test(node.children[0].name[0])){

                }
                this.setHex("FF");
            }
            else if(node.name == 'VarDecl'){
                //let tName = node.children[1].name[0];

                this.staticTable.push([{
                    key: node.children[1].name[0],
                    type: node.children[0].name[0],
                    scope: node.children[1].scope,
                    location: ""
                }]);

                this.setHex("8D");
                this.setHex("T" + this.staticId);
                this.setHex("00");
                this.staticId++;
            }
            else if(node.name == 'AssignmentStatement'){
                if(DIGIT.test(node.children[1].name[0])){
                    this.setHex("A9");
                    this.setHex("0" + node.children[1].name[0]);
                }
            }

            //this.traverse(node.parent.children[1]);
        }

        public heapString(string){
            var stringLength = string.length;
            this.heapStart = this.heapStart - (stringLength + 1);
            var hexVal = this.heapStart;
            for (var i = this.heapStart; i < this.heapStart + stringLength; i++) {
                this.createdCode[i] = string.charCodeAt(i - this.heapStart).toString(16).toUpperCase();
                this.codeGenLog.push("Adding " + this.createdCode[i] + " at byte [" + i + "]");

            }
            return hexVal.toString(16).toUpperCase();
        }
    }
}