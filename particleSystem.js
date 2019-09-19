function ParticleSystem(){
    
    this.particles = [];
    
    this.insert = function(leaf,curColor){
        newPart = new Particle(leaf,curColor);
        this.particles.push(newPart);
    }
    
    this.nextStep= function(){
        for(var i = 0; i < this.particles.length; i++){
            element = this.particles[i];
            element.st
            if(element.prob >= 1){
                if (element.stage < 4){
                    element.stage += 1; 
                    element.prob = Math.random()*0.2;
                }
                update(element); 
            }else{
                element.prob += Math.random()*0.05; 
            }
        }
    }
    
    function update(particle){
        
        if(particle.stage == 1){//change to yellow  
            particle.leaf.material.color.setHex(0xFFFF00);
        }else if(particle.stage == 2){//change to red
            particle.leaf.material.color.setHex(0xD02B2B);
        }else if(particle.stage == 3){//change to brown
            particle.leaf.material.color.setHex(0xCD853F);
        }else{//falling
            if(particle.leaf.position.y > 1){
                
                particle.leaf.position.y -= (Math.random()*0.3)+0.05;
                particle.leaf.position.x += (Math.random()*0.05)-0.05;
                particle.leaf.position.z += (Math.random()*0.05)-0.06;
            }
        }
    }
}

function Particle(leaf, curColor){
    this.leaf = leaf;
    this.prob = Math.random()*0.2; 
    if(curColor==0x4C720B){ //green
        this.stage = 1;
    }
    else if(curColor==0xFFFF00){ //yellow
        this.stage = 2; 
    }
    else if(curColor==0xD02B2B){ //red
        this.stage = 3; 
    }
    
    
}