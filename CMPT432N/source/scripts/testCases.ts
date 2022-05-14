var project1 = "/* Sample Data */\n" +
	"{}$\n" +
	"{{{{{{}}}}}}$\n" +
	"{{{{{{}}}	/*	comments	are	ignored	*/	}}}}$\n" +
	"{	/*	comments	are	still	ignored	*/	int	@}$";

var good_case_1 = "/* Simple good text case */\n" +
"{}$";

function testCases(name) {
	//Intializes the return text
	var rText;
	//switches through to set the rtext
	switch (name) {
		case "good_case_1":
            rText =good_case_1;
            var TheTextBox = document.getElementById("taSourceCode");
            TheTextBox = TheTextBox + rText;

    }

}