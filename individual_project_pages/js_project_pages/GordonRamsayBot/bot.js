class CoffeeBot {
	constructor() {
		this.firstStep = true
		this.totalSteps = 0

		this.grammar = tracery.createGrammar(cookingGrammar)
		this.grammar.addModifiers(baseEngModifiers)
	}

	respondTo(s) {
		console.log("User said", s)
		let s_tokens = tokenize(s)

		// return "<img src='https://media.tenor.com/images/eff22afc2220e9df92a7aa2f53948f9f/tenor.gif'></img>"

		let greetings = ["hi", "hey", "hello", "howdy", "greetings"]
		if (greetings.some(term => s.includes(term))) {
			this.post( this.grammar.flatten("#introduction#") )
		}

		else if (s.includes("...")) {
			this.post( this.grammar.flatten("#insult#") )
		} 
		else if (!s.includes("yes chef")){
			this.post( this.grammar.flatten("#insult#") )
		}

		if (this.firstStep == true) {
			this.post("Let's get started.")
			this.firstStep = false
			this.totalSteps += 1
			return this.grammar.flatten("#firstStep#")
		} 
		else {
			return this.grammar.flatten("#recipeStep#")
			this.totalSteps += 2
		}

		
		
	}
}



//convert input string to separate tokens
function tokenize(s) {
	let new_s = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
	return new_s.split(" ")
}

function intersection(array1, array2) {
	return array1.filter(value => array2.includes(value));
}

//capitalize the first Letter
function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}