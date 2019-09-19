function LSystem(){
    
    function branchYPose(branch){
        return branch.position.y;
    }
    
    //variables
    var Vars = new Array();
	var Cons = new Array();
	var ProdRule = new Array();
	var DrawRule = new Array();
	var StackRule = new Array();
    var BranchHeap = new BinaryHeap(branchYPose);
    var system = new ParticleSystem();

    this.addVariable = function(char){
        Vars.push(char);
    }
    
    this.addConstant = function(char){
        Cons.push(char);
    }
    
    this.defineProductionRule = function(rule){
        ProdRule.push(rule);
    }
    
    this.defineDrawingRule = function(rule){
        DrawRule.push(rule);
    }
    
    this.defineStackRule = function(rule){
        StackRule.push(rule);
    }
    
    this.applyProductionRules = function(inputStr){
        var outputStr = "";
        
        while(inputStr.length != 0){
        
            for(var i=0; i<ProdRule.length; i++){

                //check to see if the input symbol exists 
                if(ProdRule[i].getPredecessor() == inputStr.charAt(0)){
                    
                    //find a rand probability to pick a successor
                    var rand = Math.random();

                    //to keep track of the probabilities of successors before
                    var prevProb = 0;

                    //loop through the possible successor
                    for(var j=0; j<ProdRule[i].getSuccessorCount(); j++){

                        prevProb += ProdRule[i].getProbability(j);
                        
                        if(rand <= prevProb){
                            outputStr = outputStr.concat(ProdRule[i].getSuccessor(j));
                            inputStr = inputStr.substr(1); //shrink the input string
                            //exit loop
                            break;
                        }
                    }
                }
            }


            //copy any constants over
            for(var i = 0; i < Cons.length; i ++){
                if(Cons[i] == inputStr.charAt(0)){
                    outputStr = outputStr.concat(Cons[i]);
                    inputStr = inputStr.substr(1); //shrink the input string
                    break;
                }
            }
        }
        return outputStr;
    }
    
    function getRadians(degrees){
        return degrees * (Math.PI / 180);
    }
    
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


    this.drawSystem = function(drawString, scene, speed, forwardVector){
        
    
        var posstack = []; //Position stack
        var colorstack = []; //Color stack
        
        //forward vector
        var forward = forwardVector;
        
        //line 
        // var material = new THREE.LineBasicMaterial({color: 0x5c1c1c, linewidth: 5});
        // var geometry = new THREE.Geometry();
        
        //keep track of vertices
        var curLoc = new THREE.Vector3(0,0,0);
        var curColor = null;
        var prevLoc;

        
        // geometry.vertices.push(curLoc);
        
        while(drawString.length > 0){
            var ruleFound = false;
            
            //loop through all draw rules 
            for(var i = 0; i < DrawRule.length; i ++){
                
                //if a draw rule is found
                if(DrawRule[i].getSymbol() == drawString.charAt(0)){
                    drawString = drawString.substr(1);
                    ruleFound = true;
                    
                    if(DrawRule[i].getDraw()){
                            
                        if(DrawRule[i].getType()=="branch"){
                            var nextLocation = new THREE.Vector3(0, 0, 0).addVectors(curLoc, forward);
                            
                            prevLoc = curLoc;
                            curLoc = nextLocation;
                            var branch = cylinderMesh(prevLoc,curLoc);
                            
                        }
                        else if(DrawRule[i].getType()=="leaf"){   
                            createLeaf(curLoc.x,curLoc.y,curLoc.z,curColor, scene);
                        }
                        
                    }else if(DrawRule[i].getRotate()){
                        var rads = getRadians(DrawRule[i].getDegrees());
                        forward.applyAxisAngle(DrawRule[i].getAxis(), rads);
                        
                    }
//                    scene.add(branch);
                    BranchHeap.push(branch);
                    
                }
                
                
            }
           
            
            //if it wasn't a draw rule
            if(!ruleFound){
                //check for stack rules
                for(var i = 0; i < StackRule.length; i ++){

                    //Position stack
					if(StackRule[i].getSymbol() == drawString.charAt(0)  && (StackRule[i].getSymbol() == "[" || StackRule[i].getSymbol() == "]")){
                   
						drawString = drawString.substr(1);
                        ruleFound = true;
                        
						//if push
						if(StackRule[i].getPush()){
                            //push the previous and current location onto the stack
							posstack.push(new THREE.Vector3(prevLoc.x, prevLoc.y, prevLoc.z));
							posstack.push(new THREE.Vector3(forward.x, forward.y, forward.z));
						}else{
                            //this is a pop
							//geometry.vertices.pop();
							forward = posstack.pop();
							curLoc = posstack.pop();
							//geometry.vertices.push(curLoc);
						}
                    }
                    
                    //Color stack
                    if(StackRule[i].getSymbol() == drawString.charAt(0)  && (StackRule[i].getSymbol() == "<" || StackRule[i].getSymbol() == ">")){

                        //if push
						if(StackRule[i].getPush()){
                            //push the color onto the stack
                           
                            //green
                            if(drawString.charAt(1)=='g'){
                                colorstack.push(0x4C720B);
                            }
                            
                            //red
                            else if(drawString.charAt(1)=='r'){
                                colorstack.push(0xD02B2B);
                            }
                            
                            //yellow
                            else if(drawString.charAt(1)=='y'){
                                colorstack.push(0xFFFF00);
                            }
                            
							
							
						}else{
                            //Pop the color off the stack and set current color to what's popped off stack
							curColor = colorstack.pop();
                        }
                        
                    }
				}
            }
            //remove if unknown 
            if (!ruleFound){
                drawString = drawString.substr(1);
            }
            
        }
        //draw
//        scene.add(branch);
        BranchHeap.push(branch);
        drawBranch(BranchHeap, scene, speed);
    }
    
    async function drawBranch(branchHeap, scene, speed){
        while(branchHeap.size() > 3){
            await sleep(speed);
            branch = branchHeap.pop();
            scene.add(branch);
        }    
        for(var time = 0; time <1000; time++){
            await sleep(30);
            system.nextStep();
        }
    }

    function createLeaf(x, y, z, c, scene){
        var path = new THREE.Shape();
        path.absellipse(0, 0, 0.3, 0.6, 0, Math.PI*2, false, 0.5);
        var geometry = new THREE.ShapeBufferGeometry( path );
        // var color = 0x008000;
        var material = new THREE.MeshStandardMaterial( { color: c, side: THREE.DoubleSide });
        var ellipse = new THREE.Mesh( geometry, material );
        ellipse.castShadow = true;
        ellipse.receiveShadow = true;
        ellipse.position.set(x, y-0.3, z);
        BranchHeap.push(ellipse);
        system.insert(ellipse, c);
    }

    //Draw cylindrical branch between previous and current location of branch
    function cylinderMesh(prev, cur) {
        var direction = new THREE.Vector3().subVectors(cur, prev);
        var orientation = new THREE.Matrix4();
        orientation.lookAt(prev, cur, new THREE.Object3D().up);
        orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
            0, 0, 1, 0,
            0, -1, 0, 0,
            0, 0, 0, 1));
        var cylinderGeometry = new THREE.CylinderGeometry(0.1,0.1, direction.length(), 8);
        
        
        var texture = new THREE.TextureLoader().load( "tree-texture.jpeg" );
        var material = new THREE.MeshStandardMaterial( {map: texture} );
        
        var cylinder = new THREE.Mesh(cylinderGeometry, material);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        cylinder.applyMatrix(orientation);
        // position based on midpoints - there may be a better solution than this
        cylinder.position.x = (cur.x + prev.x) / 2;
        cylinder.position.y = (cur.y + prev.y) / 2;
        cylinder.position.z = (cur.z + prev.z) / 2;
        return cylinder;
    }
    
    
}