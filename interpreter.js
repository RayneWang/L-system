function Interpreter(plant){
    var Plant = plant;
    
    this.init = function(){
        Plant.addConstant("F"); //Branch
        Plant.addConstant("L"); //Leaf
        Plant.addConstant("+"); //Rotate right on y axis
        Plant.addConstant("-"); //Rotate left
        Plant.addConstant("["); //Push onto position stack
        Plant.addConstant("]"); //Pop from position stack
        Plant.addConstant("<"); //Push onto color stack
        Plant.addConstant(">"); //Pop from color stack
        Plant.addConstant("&"); //Pitch with positive angle (down)
        Plant.addConstant("^"); //Pitch with negative angle (up)
        Plant.addConstant("*"); //Roll with a positive angle (to the right) 
        Plant.addConstant("/"); //Roll with a negative angle (to the left)
        Plant.addConstant("g"); //Green stack color
        Plant.addConstant("y"); //Yellow stack color
        Plant.addConstant("r"); //Red stack color
        
      
        var PDRule1 = new DrawingRule("F", true, "branch", false, null, null);
        var PDRule2 = new DrawingRule("-", false, null, true, 25, new THREE.Vector3(0,0,1));
        var PDRule3 = new DrawingRule("+", false, null, true, -25, new THREE.Vector3(0,0,1));
        var PDRule4 = new DrawingRule("L", true, "leaf", false, null, null, null);
        var PDRule5 = new DrawingRule("&", false, null, true, 25, new THREE.Vector3(0,1,0));
        var PDRule6 = new DrawingRule("^", false, null, true, -25, new THREE.Vector3(0,1,0));
        var PDRule7 = new DrawingRule("*", false, null, true, 25, new THREE.Vector3(1,0,0));
        var PDRule8 = new DrawingRule("/", false, null, true, -25, new THREE.Vector3(1,0,0));
        var PDRule9 = new DrawingRule("g", false, null, false, null, null, 0x008800); //green
        var PDRule10 = new DrawingRule("y", false, null, false, null, null, 0xf6ef05); //yellow
        var PDRule11 = new DrawingRule("r", false, null, false, null, null ,0xcc0000); //red
        Plant.defineDrawingRule(PDRule1);
        Plant.defineDrawingRule(PDRule2);
        Plant.defineDrawingRule(PDRule3);
        Plant.defineDrawingRule(PDRule4);
        Plant.defineDrawingRule(PDRule5);
        Plant.defineDrawingRule(PDRule6);
        Plant.defineDrawingRule(PDRule7);
        Plant.defineDrawingRule(PDRule8);
        Plant.defineDrawingRule(PDRule9);
        Plant.defineDrawingRule(PDRule10);
        Plant.defineDrawingRule(PDRule11);
  

        var PSRule1 = new StackRule("[", true);
        var PSRule2 = new StackRule("]", false);
        var PSRule3 = new StackRule("<", true);
        var PSRule4 = new StackRule(">", false);
        Plant.defineStackRule(PSRule1);
        Plant.defineStackRule(PSRule2);
        Plant.defineStackRule(PSRule3);
        Plant.defineStackRule(PSRule4);
    }
    
    
    this.addRule = function(sym, rule, prob){
        Plant.addVariable(sym);
        var PRule1 = new ProductionRule(sym, rule[0], prob[0]);
        for(var i = 1; i < rule.length; i ++){
           PRule1.addRule(sym, rule[i], prob[i]);
        }
        Plant.defineProductionRule(PRule1);
        
        
    }
    
}