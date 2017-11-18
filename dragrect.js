var w = 1050,
    h = 700,
    r = 120;

var isXChecked = true,
    isYChecked = true;

let MAX_HEIGHT = 360,
    MIN_HEIGHT = 20;

var width = w / 3 * 2,
    height = 200,
    dragbarw = 20,
    solvent = 100,
    solution = width * height / 100;

let OFFSET_Y = height + 200;
let OFFSET_X = 200;

var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragmove);

var dragright = d3.behavior.drag()
    .origin(Object)
    .on("drag", rdragresize);

var dragleft = d3.behavior.drag()
    .origin(Object)
    .on("drag", ldragresize);

var dragtop = d3.behavior.drag()
    .origin(Object)
    .on("drag", tdragresize);


var dragbottom = d3.behavior.drag()
    .origin(Object)
    .on("drag", bdragresize);

var svg = d3.select("#container").append("svg")
    .attr("width", '100%')
    .attr("height", h)

var newg = svg.append("g")
      .selectAll("rect")
      .data([{x: OFFSET_X, y: OFFSET_Y, height: height}])
      .enter();

var solventContainer = newg.append("rect")
      .attr("x", OFFSET_X)
      .attr("y", OFFSET_Y - height + 45)
      .attr("height", MAX_HEIGHT - 5)
      .attr("width", width)
      .attr("fill-opacity", .2)
      .attr("fill", 'rgba(255,0,0,0.2)');
      // .attr("stroke", "red");

newg.append("rect")
    .attr("x", OFFSET_X)
    .attr("y", OFFSET_Y - height + 45)
    .attr("height", MAX_HEIGHT -5)
    .attr("width", 5)
    .attr("fill", 'rgba(255,0,0, 0.8)');

newg.append("rect")
    .attr("x", OFFSET_X + width)
    .attr("y", OFFSET_Y - height + 45)
    .attr("height", MAX_HEIGHT -5)
    .attr("width", 5)
    .attr("fill", 'rgba(255,0,0, 0.8)');

newg.append("rect")
    .attr("x", OFFSET_X)
    .attr("y", OFFSET_Y + height)
    .attr("height", 5)
    .attr("width", width + 5)
    .attr("fill", 'rgba(255,0,0, 0.8)');


// svg.append("rect")
//     .attr("filter", "url(#clippy)")
//     .attr("class", "extent") 
//     .attr("style", "cursor:move; opacity:0.2; fill: #FF9000")
//     .attr("x", "578")
//     .attr("height", "250")
//     .attr("width" "356")


var solventContainer = newg.append("rect")
      .attr("x", w / 2 + 5 )
      .attr("y", 40)
      .attr("height", 180)
      .attr("width", 10)
      .attr("fill-opacity", .8)
      .attr("fill", 'rgba(255,0,0,0.8)')
      .attr("cursor", "pointer");

var hint = d3.select("#container").append("div")
       // .style("display","none")
       .style('position',"absolute")
       .style("fill","black");


hint.text( "<--- Click the red dropper to add solvent")
        .attr("id", "hint-1")
       .style("left", (w / 2 + 80) + "px")
       .style("top", "30px")
       .style("color","red");

var hint2 = d3.select("#container").append("div")
       // .style("display","none")
       .style('position',"absolute")
       .style("fill","black");


hint2.text( "<--- Drag the bar to change the volume of solution.")
        .attr("id", "hint-2")
       .style("left", (w - 120) + "px")
       .style("top", OFFSET_Y - 10+ "px")
       .style("width", "200px")
       .style("color","blue");

var dragrect = newg.append("rect")
      .attr("id", "active")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("height", function(d) { return d.height; } )
      .attr("width", w / 3 * 2)
      .attr("fill-opacity", .5)
      .call(dragtop);
      // .call(drag);
var dragbartop = newg.append("rect")
      .attr("x", function(d) { return d.x + (dragbarw/2); })
      .attr("y", function(d) { return d.y - (dragbarw/2); })
      .attr("height", dragbarw)
      .attr("id", "dragleft")
      .attr("width", w / 3 * 2 - dragbarw)
      .attr("fill", "Orange")
      .attr("fill-opacity", .5)
      .attr("cursor", "ns-resize")
      .call(dragtop);

var chernoffTips = d3.select("#container").append("div")
       // .style("display","none")
       .style('position',"absolute")
       .style("fill","black");


dragbartop
    .on("mouseover", handleMouseOver)
    .on("mouseout",handleMouseOut)
    .on("mousemove", handleMouseMove);


function handleMouseOver(d,i){
   chernoffTips.style("display","inline");
}

function handleMouseMove(d,i){
   var fieldName=d3.select(this).attr('class');
   
   chernoffTips.text( width * height / 100 + " g")
       .style("left", (OFFSET_X - 30) + "px")
       .style("top", OFFSET_Y + "px")
       .style("color","black");
}
function handleMouseOut(d,i){
    if (document.getElementById('hint-2')) {
        document.getElementById('hint-2').remove();
    }
}



function dragmove(d) {
    dragrect
        .attr("y", d.y = Math.max(0, Math.min(h - height, d3.event.y)))
        .attr("fill", 'rgba(0, 156, 235, 0.6)');
    dragbarleft 
        .attr("y", function(d) { return d.y + (dragbarw/2); });
    dragbarright 
        .attr("y", function(d) { return d.y + (dragbarw/2); });
    dragbartop 
        .attr("y", function(d) { OFFSET_Y = d.y - (dragbarw/2); console.log('OFFSET_Y:',OFFSET_Y); return d.y - (dragbarw/2); });
    dragbarbottom 
        .attr("y", function(d) { return d.y + height - (dragbarw/2); });
}

function ldragresize(d) {
   if (isXChecked) {
      var oldx = d.x; 
     //Max x on the right is x + width - dragbarw
     //Max x on the left is 0 - (dragbarw/2)
      d.x = Math.max(0, Math.min(d.x + width - (dragbarw / 2), d3.event.x)); 
      width = width + (oldx - d.x);
      dragbarleft
        .attr("x", function(d) { return d.x - (dragbarw / 2); });
       
      dragrect
        .attr("x", function(d) { return d.x; })
        .attr("width", width);

     dragbartop 
        .attr("x", function(d) { return d.x + (dragbarw/2); })
        .attr("width", width - dragbarw)
     dragbarbottom 
        .attr("x", function(d) { return d.x + (dragbarw/2); })
        .attr("width", width - dragbarw)
  }
}

function rdragresize(d) {
   if (isXChecked) {
     //Max x on the left is x - width 
     //Max x on the right is width of screen + (dragbarw/2)
     var dragx = Math.max(d.x + (dragbarw/2), Math.min(w, d.x + width + d3.event.dx));

     //recalculate width
     width = dragx - d.x;

     //move the right drag handle
     dragbarright
        .attr("x", function(d) { return dragx - (dragbarw/2) });

     //resize the drag rectangle
     //as we are only resizing from the right, the x coordinate does not need to change
     dragrect
        .attr("width", width);
     dragbartop 
        .attr("width", width - dragbarw)
     dragbarbottom 
        .attr("width", width - dragbarw)
  }
}

let concentration = function(solvent, solution) {
    return solvent / solution;
};

let solutionColor = function(solvent, solution) {
    let linearScale_r = d3.scale.linear().domain([0,0.00833333333]).range([180, 255]);
    let linearScale_g = d3.scale.linear().domain([0,0.00833333333]).range([0, 135]);
    let linearScale_b = d3.scale.linear().domain([0,0.00833333333]).range([0, 155]);
    let linearScale2 = d3.scale.linear().domain([0,0.00833333333]).range([0.5, 1]);
    // console.log(concentration(solvent, solution))
    let r = Math.round(linearScale_r(concentration(solvent, solution)));
    let g = 135 - Math.round(linearScale_g(concentration(solvent, solution)));
    let b = 15 - Math.round(linearScale_b(concentration(solvent, solution)));
    let a = linearScale2(concentration(solvent, solution)) ;
    return 'rgba(' + r + ', ' + g + ', '  + b + ', ' + a + ')'
};

function tdragresize(d) {
 
   // if (isYChecked) {
      var oldy = d.y; 
     //Max x on the right is x + width - dragbarw
     //Max x on the left is 0 - (dragbarw/2)
      d.y = Math.max(0, Math.min(d.y + height - (dragbarw / 2), d3.event.y)); 
      height = height + (oldy - d.y);
      // console.log('height:',height);
      if (height > MAX_HEIGHT || height < MIN_HEIGHT || width * height / 100 < solvent) { return; }
      dragbartop
        .attr("y", function(d) { OFFSET_Y = d.y - (dragbarw/2); return d.y - (dragbarw / 2); });

      dragrect
        .attr("y", function(d) { return d.y; })
        .attr("height", height)
        .attr("fill", solutionColor(solvent, height * width));
    updateResult();
    // console.log('updateResult()')
}

function bdragresize(d) {
   if (isYChecked) {
     //Max x on the left is x - width 
     //Max x on the right is width of screen + (dragbarw/2)
     var dragy = Math.max(d.y + (dragbarw/2), Math.min(h, d.y + height + d3.event.dy));

     //recalculate width
     height = dragy - d.y;

     //move the right drag handle
     dragbarbottom
        .attr("y", function(d) { return dragy - (dragbarw/2) });

     //resize the drag rectangle
     //as we are only resizing from the right, the x coordinate does not need to change
     dragrect
        .attr("height", height);
     dragbarleft 
        .attr("height", height - dragbarw);
     dragbarright 
        .attr("height", height - dragbarw);
  }
}