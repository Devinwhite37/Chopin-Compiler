/* lexer.ts  */

/**
 * lexer.ts
 * Devin White, CMPT432N
 * 
 * Much inspiration taken from KaiCompiler from hall of fame projects.
 * 
 * lexer.ts is used to create tokens based on our given grammar, as 
 * well as to keep track of the line and column location for each token
 * 
 */
module TSC
	{
	export class Lexer {
		//the following are defined and used to push those fields to index.html
		tokens = "";
		tokenRegEx = "";
		lineNum = 0;
		columnNum = 1;
		//lexoutput is a matrix to hold all of the tokens
		lexOutput: any[][] = [];
		//end and start index are used to search specific locations 
		subStringStartIndex = 0;
		subStringEndIndex = 1;
		//tells wheater or not EOP marker is found
		eopFound: boolean = false;
		programNum = 1;
		//tells wheater on not we are in a comment
		commented: boolean = false;
		inQuote: boolean = false;
		constructor(){}

        public lex(){

		        // Grab the "raw" source code.
				var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
		        // Trim the leading and trailing spaces.
				sourceCode = TSC.Utils.trim(sourceCode);

				// Declare Regular Expressions for single characters in our grammar.
				// Multiple character tokens are taken care of using character matching if statments
				const L_BRACE = new RegExp('{');
				const R_BRACE = new RegExp('}');
				const L_PAREN = new RegExp('\\(');
				const R_PAREN = new RegExp('\\)');
				const DOUBLE_QUOTE = new RegExp('"');
				const VARIABLE = new RegExp('[a-z]');
				const ASSIGN = new RegExp('=');
                const SPACE = new RegExp(' ');
				const NEW_LINE = new RegExp('\n');
				const DIGIT = new RegExp('[0-9]');
				const ADDITION_OP = new RegExp('\\+');
				const EOP = new RegExp('\\$');
				const WHITESPACE = new RegExp('\t|\n|\r');

				//includes all possible characters so comment block can increment
				//line num for anything entered in a comment
				const ANY_CHAR = new RegExp('.');
				//includes all characters except those in our grammar
				//to return an invalid character
				const INVALID_CHAR = new RegExp('^(?!.*([a-z]|[0-9]|{|}|\\(|\\)|=|\\+| |"|!|\\$|/|\\*))');
				const CHAR = new RegExp('^(?!.*("))');
			
				while(1==1){
					while(sourceCode.length >=this.subStringEndIndex){
						console.log("WHILE RAN")
						console.log(this.subStringStartIndex);
						console.log(this.subStringEndIndex);

					//ignores all text inside a comment
					if(sourceCode.charAt(this.subStringEndIndex-1) == "/" && sourceCode.charAt(this.subStringEndIndex) == "*"){
						this.subStringStartIndex+=2;
						this.lineNum+=2;
						this.subStringEndIndex+=2;
						this.commented = true;
						while(this.commented = true){
							if(sourceCode.charAt(this.subStringEndIndex-1) == "*" && sourceCode.charAt(this.subStringEndIndex) == "/"){
								console.log("if RAN");
								this.subStringStartIndex+=2;
								this.lineNum+=2;
								this.subStringEndIndex+=2;
								this.commented = false;
								break;
							}
							else if(ANY_CHAR.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
								console.log("ANYCHR RAN");
								this.subStringStartIndex++;
								this.lineNum++;
							}
							else{
								console.log("else ran")
								this.lexOutput.push([
									["missingCommentEnd"]
								]);
								break;
							}
							this.subStringEndIndex++;
						}
						console.log(this.subStringStartIndex);
						console.log(this.subStringEndIndex);
					}					

					//NEWLINE and SPACE increment linenum and column num if one is found
					if(NEW_LINE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						console.log("Start Index: "+ this.subStringStartIndex);
						console.log("End Index: "+this.subStringEndIndex);
						this.subStringStartIndex++;
						this.columnNum++;
						this.lineNum = 0;
					}
					else if(SPACE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.subStringStartIndex++;
						this.lineNum++;
					}
					else if(DOUBLE_QUOTE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.tokens = "DOUBLE_QUOTE";
						this.tokenRegEx = '"';
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
						this.subStringEndIndex++;
						this.inQuote = true;
						while(this.inQuote = true){
							if(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex) ==""){
								console.log("else ran")
								this.lexOutput.push([
									["missingQuoteEnd"]
								]);
								break;
							}
							else if(CHAR.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
								console.log("IF DQUOTE")
								console.log(this.subStringStartIndex);
								console.log(this.subStringEndIndex);
								console.log(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex));
								this.tokens = "CHAR";
								this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex-1);
								this.lexOutput.push([
									[this.tokens],
									[this.tokenRegEx],
									[this.lineNum],
									[this.columnNum]
								]);
								this.subStringStartIndex++;
								this.lineNum++;
								//this.subStringEndIndex++;
							}
							else if(DOUBLE_QUOTE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
								console.log("ELIF DQUOT")
								this.tokens = "DOUBLE_QUOTE";
								this.tokenRegEx = '"';
								this.lexOutput.push([
									[this.tokens],
									[this.tokenRegEx],
									[this.lineNum],
									[this.columnNum]
								]);
								this.subStringStartIndex++;
								this.lineNum++;
								//this.subStringEndIndex++;
								this.inQuote = false;
								break;
							}
							
							this.subStringEndIndex++;
						}
						console.log(this.subStringEndIndex);
						console.log(this.subStringStartIndex);
					}
				
					//The following is use to create all tokens in our grammar.
					else if(L_BRACE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						console.log(this.subStringEndIndex);
						console.log(this.subStringStartIndex);
						this.tokens = "L_BRACE";
						this.tokenRegEx = "{";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
						}
					else if(R_BRACE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						console.log(this.subStringEndIndex);
						console.log(this.subStringStartIndex);
						this.tokens = "R_BRACE";
						this.tokenRegEx = "}";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
						}
						
					else if(L_PAREN.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.tokens = "L_PAREN";
						this.tokenRegEx = "(";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
			
						this.subStringStartIndex++;
						this.lineNum++;
					}

					else if(R_PAREN.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.tokens = "R_PAREN";
						this.tokenRegEx = ")";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
			
						this.subStringStartIndex++;
						this.lineNum++;
					}
					//create IF token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "i" && sourceCode.charAt(this.subStringEndIndex) == "f"){
							this.tokens = "IF";
							this.tokenRegEx = "if";
							this.lexOutput.push([
								[this.tokens],
								[this.tokenRegEx],
								[this.lineNum],
								[this.columnNum]
							]);
						this.subStringStartIndex+=2;
						this.lineNum+=2;
						this.subStringEndIndex++;						
					}
					//create INT token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "i" && sourceCode.charAt(this.subStringEndIndex) == "n" && sourceCode.charAt(this.subStringEndIndex+1) == "t" && sourceCode.charAt(this.subStringEndIndex-3) != "p"){
						this.tokens = "INT_TYPE";
						this.tokenRegEx = "int";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=3;
						this.lineNum+=3;
						this.subStringEndIndex+=2;						
					}
					//creat PRINT token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "p" && sourceCode.charAt(this.subStringEndIndex) == "r" && sourceCode.charAt(this.subStringEndIndex+1) == "i" && sourceCode.charAt(this.subStringEndIndex+2) == "n" && sourceCode.charAt(this.subStringEndIndex+3) == "t"){
						this.tokens = "PRINT";
						this.tokenRegEx = "print";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=5;
						this.lineNum+=5;
						this.subStringEndIndex+=4;						
					}
					//create WHILE token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "w" && sourceCode.charAt(this.subStringEndIndex) == "h" && sourceCode.charAt(this.subStringEndIndex+1) == "i" && sourceCode.charAt(this.subStringEndIndex+2) == "l" && sourceCode.charAt(this.subStringEndIndex+3) == "e"){
						this.tokens = "WHILE";
						this.tokenRegEx = "while";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=5;
						this.lineNum+=5;
						this.subStringEndIndex+=4;						
					}
					//create false token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "f" && sourceCode.charAt(this.subStringEndIndex) == "a" && sourceCode.charAt(this.subStringEndIndex+1) == "l" && sourceCode.charAt(this.subStringEndIndex+2) == "s" && sourceCode.charAt(this.subStringEndIndex+3) == "e"){
						this.tokens = "BOOL_FALSE";
						this.tokenRegEx = "false";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=5;
						this.lineNum+=5;
						this.subStringEndIndex+=4;						
					}
					//create boolean token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "b" && sourceCode.charAt(this.subStringEndIndex) == "o" && sourceCode.charAt(this.subStringEndIndex+1) == "o" && sourceCode.charAt(this.subStringEndIndex+2) == "l" && sourceCode.charAt(this.subStringEndIndex+3) == "e" && sourceCode.charAt(this.subStringEndIndex+4) == "a" && sourceCode.charAt(this.subStringEndIndex+5) == "n"){
						this.tokens = "BOOL_TYPE";
						this.tokenRegEx = "boolean";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=7;
						this.lineNum+=7;
						this.subStringEndIndex+=6;						
					}
					//create true token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "t" && sourceCode.charAt(this.subStringEndIndex) == "r" && sourceCode.charAt(this.subStringEndIndex+1) == "u" && sourceCode.charAt(this.subStringEndIndex+2) == "e"){
						this.tokens = "BOOL_TRUE";
						this.tokenRegEx = "true";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=4;
						this.lineNum+=4;
						this.subStringEndIndex+=3;						
					}
					//create string token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "s" && sourceCode.charAt(this.subStringEndIndex) == "t" && sourceCode.charAt(this.subStringEndIndex+1) == "r" && sourceCode.charAt(this.subStringEndIndex+2) == "i" && sourceCode.charAt(this.subStringEndIndex+3) == "n" && sourceCode.charAt(this.subStringEndIndex+4) == "g"){
						this.tokens = "STRING_TYPE";
						this.tokenRegEx = "string";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=6;
						this.lineNum+=6;
						this.subStringEndIndex+=5;						
					}
					//create == token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "=" && sourceCode.charAt(this.subStringEndIndex) == "="){
						this.tokens = "BOOL_EQUAL";
						this.tokenRegEx = "==";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=2;
						this.lineNum+=2;
						this.subStringEndIndex++;						
					}
					
					else if(ASSIGN.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.tokens = "ASSIGN";
						this.tokenRegEx = "=";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
					
						this.subStringStartIndex++;
						this.lineNum++;
					}
					else if(ADDITION_OP.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.tokens = "ADDITION_OP";
						this.tokenRegEx = "+";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
					
						this.subStringStartIndex++;
						this.lineNum++;
					}
					//create != token
					else if(sourceCode.charAt(this.subStringEndIndex-1) == "!" && sourceCode.charAt(this.subStringEndIndex) == "="){
						this.tokens = "BOOL_NOTEQUAL";
						this.tokenRegEx = "!=";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex+=2;
						this.lineNum+=2;
						this.subStringEndIndex++;						
					}
					else if (DIGIT.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))) {
						this.tokens = "DIGIT";
						this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex-1);
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
					}
					else if (VARIABLE.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))) {
						console.log(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex));
						console.log(this.subStringStartIndex);
						console.log(this.subStringEndIndex);
						this.tokens = "VARIABLE";
						this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex-1);
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
					}
					//create a token for any invalid character and return error
					else if(INVALID_CHAR.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						console.log(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex));
						console.log(this.subStringStartIndex);
						console.log(this.subStringEndIndex);
						this.tokens = "INVALID_CHAR";
						this.tokenRegEx = sourceCode.charAt(this.subStringEndIndex-1);
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
						}
					else if(EOP.test(sourceCode.substring(this.subStringStartIndex,this.subStringEndIndex))){
						this.tokens = "EOP";
						this.tokenRegEx = "$";
						this.programNum++;
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum],
							[this.programNum]
						]);
						this.subStringStartIndex++;
						this.lineNum++;
						this.eopFound = true;
					}
				this.subStringEndIndex++;
				}
				//if EOP was not found return a missingEOP error
				if(sourceCode.length > 0){
					if(this.eopFound == false){
					this.lexOutput.push([
						["missingEOP"]
					]);
					//this.subStringStartIndex++;
					this.lineNum++;
				}
			}
				return this.lexOutput;
			}
		}
	}
}