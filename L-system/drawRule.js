
function DrawingRule(symbol, draw, type, rotate, degrees, axis){

	if(draw && rotate) throw "Cannot be both Draw and Rotation Rule!";
	if(draw && degrees != null) "Cannot be a Draw Rule and have an associated Rotation!";

	var Symbol = symbol;
	var Draw = draw;
	var Rotate = rotate;
	var Degrees = degrees;
	var Axis = axis;
	var Type = type; 
	


	this.getSymbol = function(){
		return Symbol.valueOf();
	}

	this.getDraw = function(){
		return draw;
	}

	this.getType = function(){
		return type; 
	}

	this.getRotate = function(){
		return Rotate;
	}

	this.getDegrees = function(){
		return Degrees;
	}

	this.getAxis = function(){
		return Axis;
	}


}