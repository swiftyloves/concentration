function handleMouseMove(d,i){
       var fieldName=d3.select(this).attr('class');
       chernoffTips.text(d.name+" "+fieldName+": "+d[fieldName])
           .style("left", (d3.event.pageX - 34) + "px")
           .style("top", (d3.event.pageY - 12) + "px")
           .style("color","black");
   }