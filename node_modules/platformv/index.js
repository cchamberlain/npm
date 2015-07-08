var platform = process.platform;

exports.platform = platform;
exports.platformv = getVariant();

function getVariant() {
  if(platform !== "win32") {
    return platform;
  }

  var path = process.env.PATH.toLowerCase()
    , order = []
    , loc = -1;

  function checkVariant(name, pathStr) {
    loc = path.indexOf(pathStr);
    if(loc !== -1) {
      order.push({variant: name, location: loc});
    }
  }

  checkVariant('msys2', 'msys');
  checkVariant('mingw', 'mingw');
  checkVariant('cygwin', 'cygwin');

  if(order.length === 0) {
    return "win32";
  }
  return order.sort(function(a, b) {
    return a.location - b.location;
  })[0].variant;
}
