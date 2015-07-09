var platform = process.platform;
var platformv = getVariant();

exports.platform = platform;
exports.platformv = platformv;
exports.pathv = getPathVariant;

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

function getPathVariant(path) {
  if(platform !== "win32") {
    return platform;
  }
  var nixPath = path.toLowerCase().replace(/^([A-Za-z]):/, "/$1").replace(/\\/g, "/");
  if(platformv === "cygwin") {
    nixPath = "/cygdrive" + nixPath;
  }
  return nixPath;
}
