(function (global) {
  var aaa = 1;

  function func(msg) {
    console.log(msg);
  }

  global.func = func;
  func(aaa);

})(this);
