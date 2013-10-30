// the... colors... dummy
var colors = ["yellow", "red", "ruby", "green", "cyan", "teal", "blue", "orange", "purple", "lime", "brown"];

// shuffles the array
colors.sort(function() { return 0.5 - Math.random() });

var getRandomColor = function() {
  var color = colors.shift();
  colors.push(color);
  return color;
}
