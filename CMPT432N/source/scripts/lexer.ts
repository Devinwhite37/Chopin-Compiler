/* lexer.ts  */

module TSC
	{
	export class Lexer {
		tokens = "";
		tokenRegEx = "";
		lineNum = 1;
		columnNum = 0;
		lexOutput ={};
		
		constructor(){}

        public lex(){
		{
		        // Grab the "raw" source code.
				var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
				//console.log(sourceCode+" sourcecode");
		        // Trim the leading and trailing spaces.
				sourceCode = TSC.Utils.trim(sourceCode);

				//var lineNum = sourceCode.split("\n");

				var columnNum = 0;
				var lineNum = 0;
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
				const VARIABLE = new RegExp('[a-z]$');
				const ASSIGN = new RegExp('=$');
                const SPACE = new RegExp(' $');
				const NEW_LINE = new RegExp('\n$');
				const DIGIT = new RegExp('[0-9]$');
				const INTOP = new RegExp('\\+$');
				const BOOL_TRUE = new RegExp('true$');
				const BOOL_FALSE = new RegExp('false$');
				const BOOL_EQUAL = new RegExp('==$');
				const BOOL_NOTEQUAL = new RegExp('!=$');
				const BEGIN_COMMENT = new RegExp('\\/*$');
				const END_COMMENT = new RegExp('\\*/$');

				//this.tokens = ["please work"];
				console.log("tokens out if:" + tokens)
				if(L_BRACE.test(sourceCode)){
					//var token: Tokenizer = new Tokenizer(TSC.TokenType.TLbrace);
					let curToken = new String;
					this.tokens = "L_BRACE";
					this.tokenRegEx = "{";
					//this.tokens.push(curToken);
					console.log("tokens: " + tokens);
					console.log("curToken: " + curToken);
					console.log("LineNum: " + this.lineNum);
					this.lexOutput = {
						"token": this.tokens,
						"tokenRegEx": this.tokenRegEx,
						"lineNum": this.lineNum,
						"columnNum": this.columnNum

					};
					console.log("lexOutput: " + this.lexOutput);
					return this.lexOutput;

				}

			}
		}
	}
}