/* lexer.ts  */

module TSC
	{
	export class Lexer {
		tokens = "";
		tokenRegEx = "";
		lineNum = 0;
		columnNum = 1;
		//lexOutput = {};
		currentIndex = 2;
		lexOutput: any[][] = [];
		subStringStartIndex = 0;
		subStringEndIndex = 1;
		constructor(){}

        public lex(){

		
		        // Grab the "raw" source code.
				var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
				//console.log(sourceCode+" sourcecode");
		        // Trim the leading and trailing spaces.
				sourceCode = TSC.Utils.trim(sourceCode);

				//var lineNum = sourceCode.split("\n");

				// Declare Regular Expressions based on our grammar.
				const L_BRACE = new RegExp('{$');
				const R_BRACE = new RegExp('}$');
				const EOP = new RegExp('$$');
				const L_PAREN = new RegExp('\\($');
				const R_PAREN = new RegExp('\\)$');
				const PRINT = new RegExp('print$');
				const WHILE = new RegExp('while$');
				const IF = new RegExp('if$');
				const INT_TYPE = new RegExp('int$');
				const BOOL_TYPE = new RegExp('boolean$');
				const STRING_TYPE = new RegExp('string$');
				const DOULBE_QUOTE = new RegExp('"$');
				const BOOL_EQUAL = new RegExp('==$');
				const VARIABLE = new RegExp('[a-z]$');
				const ASSIGN = new RegExp('=$');
                const SPACE = new RegExp(' $');
				const NEW_LINE = new RegExp('\n$');
				const DIGIT = new RegExp('[0-9]$');
				const ADDITION_OP = new RegExp('\\+$');
				const BOOL_TRUE = new RegExp('true$');
				const BOOL_FALSE = new RegExp('false$');
				const BOOL_NOTEQUAL = new RegExp('!=$');
				const BEGIN_COMMENT = new RegExp('\\/*$');
				const END_COMMENT = new RegExp('\\*/$');

				//for(let i = 0; i < 2; i++){
					/*if(L_BRACE.test(sourceCode.substring(0,1))){
						console.log("L ran");
						this.tokens = "L_BRACE";
						this.tokenRegEx = "{";
						this.lexOutput.push(
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						);
						console.log(sourceCode.length);
						return this.lexOutput;

						
					}
					else if(R_BRACE.test(sourceCode.substring(0,2))){
						console.log("R ran");
						this.tokens = "R_BRACE";
						this.tokenRegEx = "}";
						this.lexOutput.push(
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						);
						console.log(sourceCode.length);
						return this.lexOutput;

					}

				}*/


				/********if(L_BRACE.test(sourceCode)){
					this.tokens = "L_BRACE";
					this.tokenRegEx = "{";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};

					console.log(sourceCode.length);
					console.log("lineNum before increment: "+this.lineNum);
					this.lineNum ++;
					console.log("lineNUme after increment: " +this.lineNum);
					this.columnNum ++;
					return this.lexOutput;
				}
				else if(R_BRACE.test(sourceCode)){
					this.tokens = "R_BRACE";
					this.tokenRegEx = "}";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
				}
				return this.lexOutput;**/

			
				
				for(let i = 0; i < sourceCode.length; i++){
					if(L_BRACE.test(sourceCode.substring(0,4))){
						this.tokens = "L_BRACE";
						this.tokenRegEx = "{";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.lineNum++;
					}

					if(R_BRACE.test(sourceCode.substring(0,4))){
						this.tokens = "R_BRACE";
						this.tokenRegEx = "}";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.lineNum++;
					}

					if(L_PAREN.test(sourceCode.substring(0,3))){
						console.log("Lparen");
						this.tokens = "L_PAREN";
						this.tokenRegEx = "(";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.lineNum++;
					}

					if(R_PAREN.test(sourceCode.substring(1,4))){
						console.log("Rparen");
						this.tokens = "R_PAREN";
						this.tokenRegEx = ")";
						this.lexOutput.push([
							[this.tokens],
							[this.tokenRegEx],
							[this.lineNum],
							[this.columnNum]
						]);
						this.lineNum++;
				}
				return this.lexOutput;
			}
				/*
				else if(PRINT.test(sourceCode)){
					this.tokens = "PRINT";
					this.tokenRegEx = "print";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(WHILE.test(sourceCode)){
					this.tokens = "WHILE";
					this.tokenRegEx = "while";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(IF.test(sourceCode)){
					this.tokens = "IF";
					this.tokenRegEx = "if";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(INT_TYPE.test(sourceCode)){
					this.tokens = "INT_TYPE";
					this.tokenRegEx = "int";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(BOOL_TYPE.test(sourceCode)){
					this.tokens = "BOOL_TYPE";
					this.tokenRegEx = "boolean";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(STRING_TYPE.test(sourceCode)){
					this.tokens = "STRING_TYPE";
					this.tokenRegEx = "string";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(DOULBE_QUOTE.test(sourceCode)){
					this.tokens = "DOULBE_QUOTE";
					this.tokenRegEx = '"';
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				
				
				else if(SPACE.test(sourceCode)){
					this.tokens = "SPACE";
					this.tokenRegEx = " ";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				/*else if(NEW_LINE.test(sourceCode)){
					this.tokens = "NEW_LINE";
					this.tokenRegEx = "/n";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(DIGIT.test(sourceCode)){
					this.tokens = "DIGIT";
					this.tokenRegEx = sourceCode;
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(ADDITION_OP.test(sourceCode)){
					this.tokens = "ADDITION_OP";
					this.tokenRegEx = "+";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(BOOL_TRUE.test(sourceCode)){
					this.tokens = "BOOL_TRUE";
					this.tokenRegEx = "true";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(BOOL_FALSE.test(sourceCode)){
					this.tokens = "BOOL_FALSE";
					this.tokenRegEx = "false";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(BOOL_EQUAL.test(sourceCode)){
					this.tokens = "BOOL_EQUAL";
					this.tokenRegEx = "==";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(BOOL_NOTEQUAL.test(sourceCode)){
					this.tokens = "BOOL_NOTEQUAL";
					this.tokenRegEx = "!=";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}				
				else if(ASSIGN.test(sourceCode)){
					this.tokens = "ASSIGN";
					this.tokenRegEx = "=";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(VARIABLE.test(sourceCode)){
					this.tokens = "VARIABLE";
					this.tokenRegEx = sourceCode;
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}
				else if(EOP.test(sourceCode)){
					this.tokens = "EOP";
					this.tokenRegEx = "$";
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum
					};
					return this.lexOutput;
				}*/
			//}
		}
	}
}