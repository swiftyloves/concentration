/*
/ README
*/

// Basic control variables
var gridSize = 600; // The square size in pixels of the 2-d world
var numParticles = 3;
var epochTarget = 10;
var epochActual = 0;
var counter = 0;
var pType = 'reactantA';
var rx = 0;
var pRadius = 0;
var offset_y = 300;
var offset_x = 200;


var getXSpeed = function() {
  // Returns a number from -25 to -1 or 1 to 25
  return ((Math.random() > 0.5) ? -1 : 1) * ((Math.random() * 24) + 1);
};

var getYSpeed = function() {
  // Returns a number from 25-100
  return ((Math.random() * 75) - 50);
};

/*
 */
var particles = [];
for (var i = 0; i < numParticles; i++) {

  pType = "reactantA";
  pRadius = 8;
  rx = Math.floor((Math.random() * 10) + 1);
  if (rx > 5) {
    pType = "reactantB";
    pRadius = 5;
  }
  //console.log(i, pType);
  particles.push({
    x: Math.floor(Math.random() * width) + 100,
    y: Math.floor(Math.random() * height) + 300,
    r: pRadius,
    key: counter++,
    type: pType,
    vx: getXSpeed(),
    vy: getYSpeed()
  });
}

// Create the initial structure of the game board (using SVG rectangles)
// var svg = d3.select("#container").append("svg")
//   .attr("height", gridSize)
//   .attr("width", gridSize)
//   .append("g");

// Redraw function is responsible for updating the state of the dom
var redraw = function(elapsed) {
  // Bind the data to the particles
  var particle = svg.selectAll("circle").data(particles, function(d) {
    return d.key;
  });

  // Update
  particle
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("class", function(d) {
      return d.type;
    });

  // Enter

  particle.enter().append("circle")
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", function(d) {
      return d.r;
    });

  particle.exit().remove();
};

/*
 */
var update = function(elapsed) {
  for (var j = 0; j < particles.length; j++) {
    var particle = particles[j];

    particle.x = particle.x + (elapsed / 1000) * particle.vx;
    particle.y = particle.y + (elapsed / 1000) * particle.vy;

    if ((particle.y > height - particle.r) && particle.vy > 0) {
      particle.vy = particle.vy * -1;
    }
    if ((particle.y < (offset_y + particle.r)) && particle.vy < 0) {
      particle.vy = particle.vy * -1;
      console.log(particle.vy)
    }
    if ((particle.x > width - particle.r )&& particle.vx > 0 ) {
      particle.vx = particle.vx * -1;
    }
    if ((particle.x < (offset_x + particle.r)) && particle.vx < 0) {
      particle.vx = particle.vx * -1;
    }
    
    for (var k = 0; k < particles.length; k++){
    	var detP = particles[k];
      console.log('detP.type:',detP.type);
      console.log('particle.type:',particle.type);
      if (
      	(detP.type === "reactantA" && particle.type === "reactantB") ||
        (particle.type === "reactantA" && detP.type === "reactantB")
      ){
        var x = particle.x - detP.x,
            y = particle.y - detP.y,
            l = Math.sqrt(x * x + y * y); 
        if (l < particle.r) {   
          particle.type = "reactantC";
          detP.type = "reactantC";
        }
      }
    }
  }
};

/*
/ This function will orchestrate the main game loop, incrementing the
/ current epoch, calling update and then calling redraw for each epoch.
*/
var doEpoch = function() {
  var dtg = new Date();
  var elapsed = dtg.getTime() - epochActual;

  update(elapsed);
  redraw(elapsed);

  epochActual = dtg.getTime();
  window.setTimeout(doEpoch, epochTarget);
};

// Add the click handler to the start button
d3.select("#start").on('click', function(d) {
  d3.select("#start").text("Running...");

  var dtg = new Date();
  epochActual = dtg.getTime();
  doEpoch();
});