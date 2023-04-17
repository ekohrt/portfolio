// P5 Animation for a bubble-popping game

// -----------------------------------------------------------//
// GLOBALS
// -----------------------------------------------------------//
let sandColor, lgtCyan, cyanTransp, darkBlue, black, white;
let lgtGreen, medGreen, darkGreen;
// useful color site: https://www.hexcolortool.com

let bubbleList = []         //init in setup, update/animate in draw
let popAnimationList = []   //add PopAnimations to this list, remove when they're over
let seaweedList = []        //keep track of all seaweed objects to draw

let score = 0               //number of bubbles popped

let sandHeight = 50         //height of the sand at bottom of screen


// -----------------------------------------------------------//
// MAIN P5 FUNCTIONS
// -----------------------------------------------------------//

let animation = {

  // setup happens *once*
  setup(p) {
    p.frameRate(30) // change to 30 fps

    // define some colors
    // color palette: https://coolors.co/ead5b6-2e8d9e-7fb9bb-154b66-11270b-598b2c-3c5a14
    sandy     = p.color('#D1BC9D') //p.color('#ead5b6')
    lgtCyan   = p.color('#7fb9bb')
    cyanTransp = p.color(189, 55, 40, 0.67) //p.color(182, 71, 32, 0.69)
    darkBlue  = p.color('#154b66')
    black     = p.color('#000000')
    white     = p.color('#ffffff')
    lgtGreen  = p.color('#598B2C')
    medGreen  = p.color('#3C5A14')
    darkGreen = p.color('#284020')

    // init random bubbles in list; random positions & sizes
    for (let i=0; i<20; i++){
      let x = Math.random(0, 100) * p.width
      let y = Math.random(0, 100) * p.height
      let diameter = Math.random() * 80 + 10 //min 10px, max 90px
      // add info to bubbleList (array of objs with x, y, size)
      bubbleList.push(new Bubble(x, y, diameter))
    }

    // init some seaweed at random places
    let n = 5
    for (let i=0; i<n; i++) {
      // actually, random doesn't look good
      let rand_x = 0 + (1+i) * p.width/(n+1)      //Math.random()*p.width
      let rand_y = p.height-sandHeight            //Math.random()*sandHeight + (p.height-sandHeight)
      seaweedList.push( new SeaweedStalk(p, rand_x, rand_y, numLeaves=1) )
    }

  },



  // *Happens each frame*
  draw(p) {
    p.clear()
    p.background(darkBlue)

    updateAllSeaweed(p)

    updateAllBubbles(p)
    drawSand(p)

    

    drawTextAtBottom(p)
    drawScoreText(p)
    updateAllPopAnimations(p)

    
  },

  // *Called once each time the mouse is clicked*
  mousePressed(p) {
    // check if any bubbles were clicked
    bubbleList.forEach((bubble) => {
      bubble.clicked(p)
    })
  }

}




// -----------------------------------------------------------//
// HELPER FUNCTIONS; be sure to pass the P5 object
// -----------------------------------------------------------//

function drawSand(p) {
    // Draw sand-colored rectangle at bottom of screen
    let rectColor = sandy
    p.fill(rectColor)
    p.strokeWeight(0)
    p.stroke(darkBlue)
    let rectWidth = p.width
    let rectHeight = sandHeight
    let rectX = 0
    let rectY = p.height-rectHeight
    p.rect(rectX, rectY, rectWidth, rectHeight) //draws the rect on screen
}

function drawTextAtBottom(p) {
  let textToDraw = "~ pop ~"
  let textColor = darkBlue
  p.fill(textColor)
  p.strokeWeight(0)
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(40)
  p.textStyle(p.ITALIC)
  p.text(textToDraw, p.width/2, p.height-5) //draws text on screen
}

function drawScoreText(p, size) {
  // draw a circle behind the score text
  p.fill(sandy)
  p.noStroke()
  p.ellipse(p.width/2, 0, 100, 100)

  // write the score at top of screen
  let textColor = darkBlue
  p.fill(textColor)
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(40)
  p.textStyle(p.NORMAL)
  p.text(score, p.width/2, 2)
}

// move the bubbles upward at speed based on size
function updateAllBubbles(p) {
  // loop over all bubbles. Update position and re-draw them.
  bubbleList.forEach((bubble, idx) => {
    bubble.updatePosition(p)
    bubble.draw(p)
  })
}

function updateAllPopAnimations(p) {
  popAnimationList = popAnimationList.filter( function(elmt){return !elmt.isDone(p)} )
  popAnimationList.forEach((pa) => {
    pa.draw(p)
  })
}

function updateAllSeaweed(p) {
  seaweedList.forEach((sw) => {
    sw.draw(p)
  })
}



//-------------------------------------------------------------------//
// BUBBLE CLASS
//-------------------------------------------------------------------//

class Bubble {

  static speed = 0.0005

  constructor(x, y, diameter) {
    this.x = x
    this.y = y
    this.diameter = diameter
    this.radius = diameter/2
  }

  draw(p) {
    p.fill(cyanTransp) //transp
    p.stroke(lgtCyan)
    p.strokeWeight(2)
    p.ellipse(this.x, this.y, this.diameter, this.diameter)
  }

  updatePosition(p) {
    this.y -= (Bubble.speed * this.radius**1.5)  *p.deltaTime // bouyant force is prop. to volume, which is prop. to r^3... but that's too fast
    //if reaches top of screen, reset bubble to bottom at random x position
    if (this.y < -this.radius) {
      this.y = p.height + this.radius
      this.x = Math.random() * p.width
    }
  }

  // call this check on every bubble every time the mouse is clicked
  clicked(p) {
    // return true if mouse is inside of bubble's radius
    if (p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.radius) {
      this.pop(p) // pop when clicked
      return true
    }
    return false
  }

  // just return to bottom of screen at random x location
  pop(p) {
      score += 1
      popAnimationList.push(new PopAnimation(p, this.x, this.y, this.diameter))
      this.y = p.height + this.radius
      this.x = Math.random() * p.width

      //add a leaf to a random seaweed, every 5 points
      if (score == 1  || score%5==0) {
        seaweedList[Math.floor(Math.random() * seaweedList.length)].addLeaf(p)
      }
  }
}



//-------------------------------------------------------------------//
// POP ANIMATION CLASS
//-------------------------------------------------------------------//

// text that shows up when you pop a bubble (just says "+1" or "pop" or something)
class PopAnimation {
  static lifespan = 600 //milliseconds
  static popText = "+1"

  // make one of these objects. When a bubble is popped, inc the score, show some text and fade out over time
  constructor(p, x, y, bubbleDiameter) {
    this.x = x
    this.y = y
    this.diameter = bubbleDiameter // base text size on bubble's size
    this.startTime = p.millis()
  }

  draw(p) {
    // draw text that fades out over time
    let textColor = white
    let pctLife = (p.millis() - this.startTime) / PopAnimation.lifespan
    textColor.setAlpha(1-pctLife)

    p.fill(textColor)
    p.strokeWeight(0)
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(this.diameter/2)
    p.textStyle(p.NORMAL)

    p.text(PopAnimation.popText, this.x, this.y) //draws text on screen
  }

  isDone(p) {
    return p.millis() - this.startTime > PopAnimation.lifespan
  }
}



//-------------------------------------------------------------------//
// SEAWEED CLASSES
//-------------------------------------------------------------------//

class SeaweedStalk {

  static leaf_width = 15 // controls the size of the leaves

  constructor(p, x, y, numLeaves=1) {
    // start with the right number of leaves (min 1 always)
    let random_sign = Math.round(Math.random()) * 2 - 1
    this.leaves = [new Leaf(p, x, y, SeaweedStalk.leaf_width, random_sign)]
    for (let i=0; i<numLeaves-1; i++) 
      this.addLeaf(p)
  }

  addLeaf(p) {
    // add a new leaf to the top of the stalk
    let topLeaf = this.leaves[this.leaves.length - 1]
    let topDir = topLeaf.dir
    let [x,y] = topLeaf.attachPoint
    this.leaves.push(new Leaf(p, x, y, SeaweedStalk.leaf_width, topDir*-1))
  }

  draw(p) {
    // draw all the leaves
    this.leaves.forEach((leaf) => {
      leaf.draw(p)
    })
  }
}



class Leaf {
  constructor(p, x, y, width, dir){
    this.coords = [x, y, x, y-(3*width), x+(dir*width), y-(4*width), x+(dir*width), y-width] // parallelogram coords[x1, y1, x2, y2, x3, y3, x4, y4]
    this.dir = dir                                  // +1 or -1 indicating left/right orientation
    this.attachPoint = [x, y-(2*width)] // location to place next leaf
  }

  draw(p) {
    p.fill(medGreen)
    p.strokeWeight(2)
    p.stroke(darkGreen)
    p.quad(...this.coords)
  }
}

