exports.spawn = spawnGit
exports.chainableExec = chainableExec
exports.whichAndExec = whichAndExec

var exec = require("child_process").execFile
  , spawn = require("./spawn")
  , npm = require("../npm.js")
  , which = require("which")
  , git = npm.config.get("git")
  , assert = require("assert")
  , log = require("npmlog")
  , pv = require("platformv");

function prefixGitArgs () {
  return pv.platform === "win32" ? ["-c", "core.longpaths=true"] : []
}

function execGit (args, options, cb) {
  log.info("git", args)

  if(pv.platform === "win32") {
    if(pv.platformv === "cygwin" && args) {
      for(var i=0; i<args.length; i++) {
        if(':\\'.indexOf(args[i]) != 1) {
          args[i] = args[i].replace(/\\/g, '/').replace(/^([A-Za-z])\:\//, "/cygdrive/$1/");
        }
      }
    }
    else if(pv.platformv === "msys2" || pv.platformv === "mingw"){
      for(var i=0; i<args.length; i++) {
        if(':\\'.indexOf(args[i]) != 1) {
          args[i] = args[i].replace(/\\/g, '/').replace(/^([A-Za-z])\:\//, '/$1/');
        }
      }
    }
  }

  var fullArgs = prefixGitArgs().concat(args || [])
  return exec(git, fullArgs, options, cb)
}

function spawnGit (args, options) {
  log.info("git", args)
  return spawn(git, prefixGitArgs().concat(args || []), options)
}

function chainableExec () {
  var args = Array.prototype.slice.call(arguments)
  return [execGit].concat(args)
}

function whichGit (cb) {
  return which(git, cb)
}

function whichAndExec (args, options, cb) {
  assert.equal(typeof cb, "function", "no callback provided")
  // check for git
  whichGit(function (err) {
    if (err) {
      err.code = "ENOGIT"
      return cb(err)
    }

    execGit(args, options, cb)
  })
}
