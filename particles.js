/*
/ README
*/

// Basic control variables
var gridSize = 600; // The square size in pixels of the 2-d world
var numParticles = 10;
var epochTarget = 10;
var epochActual = 0;
var counter = 0;
var pType = 'reactantA';
var rx = 0;
var pRadius = 0;
// var OFFSET_Y = 300;
let Y_LIMIT = OFFSET_Y + height - 10;


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

var createParticle = function(status, x, y) {
    pType = "reactantA";
    pRadius = 8;
    rx = Math.floor((Math.random() * 10) + 1);
    if (rx > 5) {
    pType = "reactantB";
    pRadius = 5;
    }
    //console.log(i, pType);
    particles.push({
        x: x ? x : Math.floor(OFFSET_X + Math.random() * width),
        y: y ? y : Math.floor(OFFSET_Y + Math.random() * height),
        r: pRadius,
        status: status,
        key: counter++,
        type: pType,
        vx: getXSpeed(),
        vy: getYSpeed()
    });
};
// var particles = [];

var solventsss = newg.append("circle")
    .attr("id", "solvent")
    .attr("cx", w / 2 + 10  )
      .attr("cy", 40)
      .attr("r", 30)
      .attr("fill", 'rgb(255,90,30)');

var particles = [];

let resetIni = function() {
    createParticle("drop", w/2 + 10, 40)
    particles[0].r = 30;
    particles[0].color = "rgba(255,0,0,1)"
    particles[0].id = "solvent";
    for (var i = 0; i < numParticles; i++) {
        createParticle("init");
    }
};

resetIni();

var createSolvent = function(status, x, y) {
    pType = "reactantA";
    pRadius = 8;
    rx = Math.floor((Math.random() * 10) + 1);
    if (rx > 5) {
        pType = "reactantB";
        pRadius = 5;
    }

    //console.log(i, pType);
    particles.push({
        x: x ? x : Math.floor(w/2 - pRadius + Math.random() * width),
        y: y ? y : Math.floor( + Math.random() * height),
        r: pRadius,
        status: "solvent",
        key: counter++,
        type: pType,
        vx: getXSpeed(),
        vy: getYSpeed()
    });
};


for (var i = 50; i < numParticles; i++) {
  createParticle("init");
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
    if (d) {return d.key};
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
    })
    .attr("fill", function(d) {
        return d.color ? d.color : "rgba(255,0,0,0.7)"}
    )
    .attr("id", function(d) {
        return d.id ? d.id : ""}
    );

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
    })
    .attr("fill", function(d) {
        return d.color ? d.color : "rgba(255,0,0,0.7)"}
    )
    .attr("id", function(d) {
        return d.id ? d.id : ""}
    );

  particle.exit().remove();
};

/*
 */
var update = function(elapsed) {
  for (var j = 0; j < particles.length; j++) {



    var particle = particles[j];
    // console.log(particle.status)
    // console.log('particle.status:',particle.status);
    if (particle.status == "drop") {
        continue;
    }

    if (particle.status == 'fall' ) {
        if (particle.y < OFFSET_Y) {
            particle.vy = particle.vy + 1.2;
            particle.y = particle.y + (elapsed / 1000) * particle.vy;

            continue;
        } else {
            particle.status = 'collected';
            updateResult();
        }
    }
    if (particle.status == 'collected' && particle.y < Y_LIMIT && particle.vy > 12.7) {
        particle.vy = particle.vy - 0.8;
    } else {
        particle.status = '';
    }

    //  resize volume
    if (particle.y < OFFSET_Y) {
        particle.y = OFFSET_Y
    }

    particle.x = particle.x + (elapsed / 1000) * particle.vx;
    particle.y = particle.y + (elapsed / 1000) * particle.vy;

    if ((particle.y > (Y_LIMIT)) && particle.vy > 0) {
      particle.vy = particle.vy * -1;
    }
    if ((particle.y < (OFFSET_Y + particle.r)) && particle.vy < 0) {
      particle.vy = particle.vy * -1;
      // console.log(particle.vy)
    }
    if ((particle.x > (OFFSET_X + width - particle.r) )&& particle.vx > 0 ) {
      particle.vx = particle.vx * -1;
    }
    if ((particle.x < (OFFSET_X + particle.r)) && particle.vx < 0) {
      particle.vx = particle.vx * -1;
    }
    
    for (var k = 0; k < particles.length; k++){
    	var detP = particles[k];
      // console.log('detP.type:',detP.type);
      // console.log('particle.type:',particle.type);
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
// d3.select("#start").on('click', function(d) {
  // d3.select("#start").text("Running...");

  var dtg = new Date();
  epochActual = dtg.getTime();
  doEpoch();

let addSolventListener = function() {
    document.getElementById("solvent").addEventListener('click', function(){
        if (document.getElementById('hint-1')) {
            document.getElementById('hint-1').remove();
        }
        if (solvent + 10 > width * height / 100) {
            return;
        }
        solvent += 10;
        createParticle("fall", w/2 + 15, 210);
    });
}

addSolventListener();
// });