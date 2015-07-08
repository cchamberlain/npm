var platform = process.platform;

exports.platform = platform;
exports.platformv = getVariant();

function getVariant() {
  if(platform !== "win32") {
    return platform;
  }

  var path = process.env.PATH.toLowerCase();
  function location(str) {
    return path.indexOf(str);
  }
  var order = [
    { "msys2": location("msys") },
    { "mingw": location("mingw") },
    { "cygwin": location("cygwin") }
  ];

  if(order.msys === -1 && order.mingw === -1 && order.cygwin === -1) {
    return "win32";
  }
  return Object.keys(order.sort(function(a, b) {
    return a[1] - b[1];
  })[0])[0];
}
