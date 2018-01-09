
function get(name) { return document.getElementById(name); }

function mouseWithinSketch(sketch)
{
  return sketch.mouseX >= 0 &&
         sketch.mouseY >= 0 &&
         sketch.mouseX < sketch.width &&
         sketch.mouseY < sketch.height;
}

function p5InstanceFactory(divID)
{
  return function createP5Instance(sketch)
  {
    var instance = {
      lastFrameMouse: {
        dragging:false,
        x:0,
        y:0
      },
      cameraX: 0.0,
      cameraY: 0.0,
    };
    var controls = 
    {
        cameraX: {
            init: 0,
            min: -100,
            max: 100,
            points: 200,
        },
        cameraY: {
            init: 0,
            min: -100,
            max: 100,
            points: 200,
        },
        /*
        cameraZ: {
            init: 0,
            min: -100,
            max: 100,
            points: 200,
        },
        */
    };

    var canvasDiv = document.createElement('div');
    canvasDiv.id = divID;
    document.body.appendChild(canvasDiv);
    // add controls
    {
        var html = '';
        for(var name in controls)
        {
            var control = controls[name];
            var inputID = divID + name;
            html += '<div><label>' + name + ': </label>' +
                '<input oninput="' + inputID + 'Text.value = this.value" type="range"' +
                ' min="' + control.min + '" max="' + control.max + '" value="' + control.init + '" class="slider" id="' + inputID + 
                '" step="' + ((control.max - control.min) / control.points) +'"></input>' +
                '<output id="' + inputID + 'Text">' + control.init + '</output>' +
            '</div>';
        }
        canvasDiv.innerHTML = html;
        //get('ControlsDiv').innerHTML = html;
    }

    sketch.setup = function setup() {
      var canvas = sketch.createCanvas(640, 360, sketch.WEBGL);
      canvas.parent(canvasDiv);
    };
    sketch.draw = function draw()
    {
      if(instance.lastFrameMouse.dragging) {
        if(!sketch.mouseIsPressed) {
          instance.lastFrameMouse.dragging = false;
        } else {
          var diffX = sketch.mouseX - instance.lastFrameMouse.x;
          var diffY = sketch.mouseY - instance.lastFrameMouse.y;
          if(diffX != 0 || diffY != 0) {
            instance.cameraX += diffX;
            instance.cameraY += diffY;
            console.log(diffX + ", " + diffY);
          }
          instance.lastFrameMouse.x = sketch.mouseX;
          instance.lastFrameMouse.y = sketch.mouseY;
        }
      }

      sketch.camera(
        // eye position
        get(divID + "cameraX").value,
        get(divID + "cameraY").value,
        (sketch.height/2.0) / sketch.tan(sketch.PI*30.0/180.0),
        // scene center
        0, 0, 0,
        // upward axis
        0, 1, 0);
      //rotate(g.rotateX, [1, 0, 0]);
      //rotate(PI/4 * rotation, [1, 1, 0]);
      sketch.drawObjects();
    };
    sketch.mousePressed = function mousePressed()
    {
      if(mouseWithinSketch(this)) {
        instance.lastFrameMouse.dragging = true;
        instance.lastFrameMouse.x = sketch.mouseX;
        instance.lastFrameMouse.y = sketch.mouseY;
      }
    }
    // Note: I draw the objects in a seperate function so that
    //       I can render multiple scenes but using a different
    //       camera setup for each one
    sketch.drawObjects = function drawObjects()
    {
      if(divID == "first") {
        sketch.background(0);
      } else {
        sketch.background(100);
      }
    
      // draw axis
      sketch.stroke(255, 0, 0);
      sketch.line(-1000, 0, 0, 1000, 0, 0);
      sketch.stroke(0, 255, 0);
      sketch.line(0, -1000, 0, 0, 1000, 0);
      sketch.stroke(0, 0, 255);
      sketch.line(0, 0, -1000, 0, 0, 1000);
    
      sketch.noFill(); // not working?
      sketch.stroke(255);
      sketch.box();
    };
  }
}

function bodyOnload()
{
  new p5(p5InstanceFactory("first"));
  new p5(p5InstanceFactory("second"));
}
