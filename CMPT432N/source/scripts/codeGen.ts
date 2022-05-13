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
        heapTable: any[] = [];
        staticId: number;
        staticAreaLocation: number;

        constructor(){
            this.staticAreaLocation = 0;
            //this.ast = new Semantic(astRes);
            this.createdCode = [];
            this.codeGenLog = [];
            this.hexLocation = 0;
            this.heapStart = 245;
            this.staticTable = [];
            this.heapTable = [];
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
            this.staticArea();
            this.backPatch();

            return this.codeGenLog;
        }

        public codeOutput(){
            return this.createdCode;
        }

        public setHex(curHex){
            this.createdCode[this.hexLocation] = curHex;
            this.codeGenLog.push("Adding " + curHex + " at byte [" + this.hexLocation + "]");
            this.hexLocation++;

        }

        public traverse(node: any){
            //const DIGIT = new RegExp('[0-9]');
            //const STRING = new RegExp('[a-z]');

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
                console.log(node.children[0].value);

                this.codeGenLog.push("Generating op code for PrintStatement:")
                
                // tests if the value in print is a variable
                if(node.children[0].value == 'variable'){
                    this.setHex("AC");
                    var variable = node.children[0].name[0];
                    var scope = node.children[0].scope;
                    var staticVal = this.findVariable(variable, scope);
                    console.log(staticVal);
                    console.log(scope);
                    this.setHex(staticVal);
                    this.setHex("00");
                    for(var j = 0; j < this.staticTable.length; j++){
                        if (this.staticTable[j][0].value == staticVal) {
                            if(this.staticTable[j][0].type == 'string' || this.staticTable[j][0].type == 'boolean'){
                                this.setHex("A2");
                                this.setHex("02");
                            }
                            else if(this.staticTable[j][0].type == 'int'){
                                this.setHex("A2");
                                this.setHex("01");
                            }
                        }
                    }
                }
                //tests if the value in print is a string
                else if(node.children[0].value == 'string' && node.children[1] === undefined){
                    this.setHex("A0");
                    ///console.log(node.children[1].name);
                    let hexVal = this.setHeapString(node.children[0].name);
                    this.setHex(hexVal);
                    this.setHex("A2");
                    this.setHex("02");
                }
                //tests if the value in the print is a boolean
                else if(node.children[0].value == 'boolean'){
                    this.setHex("A0");
                    if (node.children[0].name[0] == 'true') {
                        this.setHex((245).toString(16).toUpperCase());
                    }
                    else if (node.children[0].name[0] == "false") {
                        this.setHex((250).toString(16).toUpperCase());
                    }
                    this.setHex("A2");
                    this.setHex("02");
                }
                //tests if the value in the print is a digit
                else if(node.children[0].value == 'digit' && node.children[1] === undefined){
                    this.setHex("A0");
                    this.setHex("0" + node.children[0].name[0]);
                    this.setHex("A2");
                    this.setHex("01");
                }
                //tests for additions in print statement
                if(node.children[1] === undefined){}
                else if(node.children[1].name == "ADDITION_OP"){
                    this.additionOp(node.children);
                    this.setHex("AC");
                    this.setHex("00");
                    this.setHex("00");
                    this.setHex("A2");
                    this.setHex("01");
                }
                //tests if there is a test for equality or inequality in print
                else if(node.children[1].name[0] == 'BOOL_EQUAL' || node.children[1].name[0] == 'BOOL_NOTEQUAL'){
                    var address = this.handleBoolEquality(node.children);
                    console.log(node.children);
                    this.setHex("EC");
                    this.setHex(address);
                    this.setHex("00");
                    this.setHex("D0");
                    this.setHex("0A");
                    this.setHex("A0");
                    //points to static location of saved true and false values
                    if(node.children[1].name[0] == 'BOOL_EQUAL'){
                        this.setHex("F5");
                    }else{this.setHex("FA");}
                    this.setHex("AE");
                    this.setHex("FF");
                    this.setHex("00");
                    this.setHex("EC");
                    this.setHex("FE");
                    this.setHex("00");
                    this.setHex("D0");
                    this.setHex("02");
                    this.setHex("A0");
                    //points to static location of saved true and false values
                    if(node.children[1].name[0] == 'BOOL_EQUAL'){
                        this.setHex("FA");
                    }else{this.setHex("F5");}
                    this.setHex("A2");
                    this.setHex("02");
                }      
                this.setHex("FF");
            }
            else if(node.name == 'VarDecl'){
                this.codeGenLog.push("Generating op code for VarDecl:")
                this.setHex("A9");
                this.setHex("00");
                let staticValue = "T" + this.staticId;
                this.setHex("8D");
                this.setHex(staticValue);
                this.staticTable.push([{
                    key: node.children[1].name[0],
                    type: node.children[0].name[0],
                    scope: node.children[1].scope,
                    value: staticValue,
                    byteNum: this.hexLocation
                }]);
                this.setHex("00");
                this.staticId++;
            }
            else if(node.name == 'AssignmentStatement'){
                this.codeGenLog.push("Generating op code for AssignmentStatement:")
                if(node.children[1].value == 'digit'){
                    this.setHex("A9");
                    this.setHex("0" + node.children[1].name[0]);
                }
                else if(node.children[1].value == 'string'){
                    let hexVal = this.setHeapString(node.children[1].name);
                    this.setHex("A9");
                    this.setHex(hexVal);
                }
                else if(node.children[1].value == 'boolean'){
                    if (node.children[1].name[0] == 'true') {
                        this.setHex("A9");
                        this.setHex((245).toString(16).toUpperCase());
                    }
                    else if (node.children[1].name[0] == "false") {
                        this.setHex("A9");
                        this.setHex((250).toString(16).toUpperCase());
                    }
                }
                else if(node.children[1].value == 'variable'){
                    this.setHex("AD");
                    
                    var variable = node.children[1].name[0];
                    var scope = node.children[1].scope;
                    var staticVal = this.findVariable(variable, scope);
                    this.setHex(staticVal);
                    this.setHex("00");
                }
                var variable = node.children[0].name[0];
                var scope = node.children[0].scope;
                var staticVal = this.findVariable(variable, scope);
                this.setHex("8D");
                this.setHex(staticVal);
                this.setHex("00");
            }
            //this.traverse(node.parent.children[1]);
        }

        public handleBoolEquality(node){
            console.log(node);
            if(node[0].value == 'digit'){
                this.setHex("A2");
                this.setHex("0" + node[0].name);
            }
            else if(node[0].value == 'string'){
                var variable = node[0].name;
                console.log(variable);
                var staticVal = this.setHeapString(variable);
                this.setHex("A2");
                this.setHex(staticVal);
            }
            else if(node[0].value == 'boolean'){
                if(node[0].name == "true") {
                    // load address of true 
                    this.setHex("A2");
                    this.setHex((245).toString(16).toUpperCase());
                }
                else if(node[0].name == "false") {
                    // load address of false
                    this.setHex("A2");
                    this.setHex((250).toString(16).toUpperCase());
                }
            }
            else if(node[0].value == 'variable'){
                this.setHex("AE");
                var variable = node[0].name;
                var scope = node[0].scope;
                var address = this.findVariable(variable, scope);
                this.setHex(address);
                this.setHex("00");
            }
            if(node[2].value == 'digit'){
                this.setHex("A9");
                this.setHex("0" + node[2].name);
                var temp = "00";
                this.setHex("8D");
                this.setHex(temp);
                this.setHex("00");
                return temp;
            }
            else if(node[2].value == 'string'){
                var variable = node[2].name;
                var staticVal = this.setHeapString(variable);
                this.setHex("A9");
                this.setHex(staticVal);
                var temp = "00";
                this.setHex("8D");
                this.setHex(temp);
                this.setHex("00");
                return temp;
            }
            else if(node[2].value == 'boolean'){
                if(node[2].name == "true") {
                    this.setHex("A9");
                    this.setHex((245).toString(16).toUpperCase());
                    var temp = "00";
                    this.setHex("8D");
                    this.setHex(temp);
                    this.setHex("00");
                    return temp;
                }
                else if(node[2].name == "false") {
                    this.setHex("A9");
                    this.setHex((250).toString(16).toUpperCase());
                    var temp = "00";
                    this.setHex("8D");
                    this.setHex(temp);
                    this.setHex("00");
                    return temp;
                }
            }
            else if(node[2].value == 'variable'){
                var variable = node[2].name;
                var scope = node[2].scope;
                var temp: string = this.findVariable(variable, scope);
                console.log(temp);
                return temp;
            }
            

        }

        public additionOp(node){
            console.log("node:")
            console.log(node[0]);
            var temp = "00";
            if(node[1] === undefined){}
            if(node[0].value == 'digit'){
                this.setHex("A9");
                this.setHex("0" + node[0].name[0]);
                this.setHex("8D");
                this.setHex(temp);
                this.setHex("00");
            }
            else if(node[1].name == 'ADDITION_OP'){
                temp = this.additionOp(node[1].children);
            }
            if(node[0].value == 'digit') {
                this.setHex("A9");
                this.setHex("0" +  node[0].name[0]);
            }
            this.setHex("6D");
            this.setHex("00");
            this.setHex("00");
            this.setHex("8D");
            this.setHex(temp);
            this.setHex("00");
            return(temp);
        }

        public staticArea(){
            this.staticAreaLocation = this.hexLocation + 1;
            //var staticVarsLength = this.staticTable.length;

            for (var i = 0; i < this.staticTable.length; i++) {
                var newAddressVal = this.staticAreaLocation.toString(16).toUpperCase();
                if(newAddressVal.length < 2){
                    newAddressVal = "0" + newAddressVal;
                }
                //for(var j = 0; j < this.staticTable.length; j++){
                   // if(this.staticTable[i][0].)
                    this.staticTable[i][0].byteNum = newAddressVal;
                    this.staticAreaLocation++;
                //}
            }

        }
        
        public backPatch(){
            for (var i = 0; i < this.createdCode.length; i++) {
                //console.log(this.createdCode[i].slice(0, 1));
                if(this.createdCode[i] === undefined){}
                else if(this.createdCode[i].charAt(0) == "T"){
                    var patchVal = this.createdCode[i];
                    for(var j = 0; j < this.staticTable.length; j++){
                        if(this.staticTable[j][0].value == patchVal){
                            var memAddr = this.staticTable[j][0].byteNum;
                            this.createdCode[i] = memAddr;
                            this.codeGenLog.push("BackPatching " + patchVal + " with " + memAddr);
                        }
                    }
                }
            }
        }

        public findVariable(variable, scope){
            console.log(variable);
            for (var i = 0; i < this.staticTable.length; i++) {
                //var staticObject = itr.next();
                if (this.staticTable[i][0].key == variable && this.staticTable[i][0].scope == scope) {
                    return this.staticTable[i][0].value;
                }
            }
        }

        public setHeapString(string){
            var stringLength = string.length;
            this.heapStart = this.heapStart - (stringLength + 1);
            var hexVal = this.heapStart;
            console.log(string);
            for (var j = 0; j < this.heapTable.length; j++) {
                if(this.heapTable[j][0].value == string){
                    return this.heapTable[j][0].pointer;
                }
            }
            for (var i = this.heapStart; i < this.heapStart + stringLength; i++) {
                this.createdCode[i] = string.charCodeAt(i - this.heapStart).toString(16).toUpperCase();
                this.codeGenLog.push("Adding " + this.createdCode[i] + " at byte [" + i + "]");
            }
            this.heapTable.push([{
                pointer: this.heapStart.toString(16).toUpperCase(),
                value: string
            }]);
            console.log(this.heapTable);
            return hexVal.toString(16).toUpperCase();
        }
    }
}