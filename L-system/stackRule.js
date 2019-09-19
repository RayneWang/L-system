function StackRule(sym, push){
    
    var symbol = sym;
    var push = push;
    
    this.getSymbol = function(){
		return symbol.valueOf();
	}

	this.getPush = function(){
		return push;
	}
}



