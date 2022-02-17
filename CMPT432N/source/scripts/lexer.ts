/* lexer.ts  */

module TSC
	{
	export class Lexer {

        public static lex(){
		{
		        // Grab the "raw" source code.
		        var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
		        // Trim the leading and trailing spaces.
				sourceCode = TSC.Utils.trim(sourceCode);
				
				// Declare Regular Expressions based on our grammar.

				const L_BRACE = new RegExp('{$');
				const R_BRACE = new RegExp('}$');
				const EOP = new RegExp('$$');
				const L_PAREN = new RegExp('($');
				const R_PAREN = new RegExp(')$');
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
				const NEWLINE = new RegExp('\n$');
				const DIGIT = new RegExp('[0-9]$');
				const INTOP = new RegExp('+$');
				const BOOL_TRUE = new RegExp('true$');
				const BOOL_FALSE = new RegExp('false$');
				const BOOL_EQUAL = new RegExp('==$');
				const BOOL_NOTEQUAL = new RegExp('!=$');
				const BEGINCOMMENT = new RegExp('/*$');
				const ENDCOMMENT = new RegExp('*/$');

				return sourceCode;
			}
		}
	}
}