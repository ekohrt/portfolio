
//---------------------------------------------------------------------------//
// Start P5 Bubble Animation Stuff vvv
//---------------------------------------------------------------------------//

let canvasHolder = document.getElementById("p5BubbleGameCanvasGoesHere")
let size = 500

// Create a P5 app
mainP5 = new p5(

  // Run after processing is initialized
  function(p) {
    // console.log(p)
    // Set the size of the canvas that P5 thinks its using
    // Use HSL mode (WAAAYYY better than RGB!)
    p.colorMode(p.HSL);
    
    p.setup = () => {
      let cnv = p.createCanvas(size, size);
      cnv.parent('p5BubbleGameCanvasGoesHere')

      if (animation.setup)
        animation.setup(p)
    }
    
    p.draw = () => {
      animation.draw(p)
    }

    p.mousePressed = () => {
      animation.mousePressed(p)
    }

  }, canvasHolder)

//---------------------------------------------------------------------------//
// End P5 Stuff ^^^
//---------------------------------------------------------------------------//