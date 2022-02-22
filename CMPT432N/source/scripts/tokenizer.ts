module TSC
	{
    export enum TokenType {
        TLbrace = "TLbrace"
    }
	export class Tokenizer {
        type: TokenType;

        constructor(tokenType: TokenType) {
            this.type = tokenType;
            
        }

    }
}