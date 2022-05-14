var project1 = "/* Sample Data */\n" +
    "{}$\n" +
    "{{{{{{}}}}}}$\n" +
    "{{{{{{}}}	/*	comments	are	ignored	*/	}}}}$\n" +
    "{	/*	comments	are	still	ignored	*/	int	@}$";
var good_case_1 = "/* Simple good text case */\n" +
    "{}$";

var lexError = '{print("INVALID CHARS")}$'
function testCases(name) {
    var rText;
    switch (name) {
        case "good_case_1":
            rText = good_case_1;
            document.getElementById("taSourceCode").value = rText;
            break;
        case "lexError":
            rText = lexError;
            document.getElementById("taSourceCode").value = rText;
            break;

    }

}
