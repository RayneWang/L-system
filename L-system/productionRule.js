function ProductionRule(Pre, Suc, Prob){

	var Predecessor = new String(Pre);
	var Successors = [];
	var Probabilities = [];
    
    
	Successors.push(new String(Suc));
	Probabilities.push(Prob);
    
	this.getPredecessor = function(){
		return Predecessor.valueOf();
	}

	this.getSuccessorCount = function (){
		return Successors.length;
	}
	this.getSuccessor = function(i){
		return Successors[i];
	}

	this.getProbability = function(i){
		return Probabilities[i];
	}

	this.addRule = function(Pre, Suc, Prob){
		Successors.push(new String(Suc));
		Probabilities.push(Prob);

	}
}