const deepCopy = (node) => {
    let copy;
    if (typeof(node) !== 'object' || node === null) {
      copy = node;
    } else {
      copy = {};
      Object.getOwnPropertyNames(node).forEach((key) => {
        copy[key] = deepCopy(node[key]);
      });
      Object.getOwnPropertySymbols(node).forEach((symbolKey) => {
        copy[symbolKey] = deepCopy(node[symbolKey]);
      });
    }
    return Array.isArray(node) ? Array.from(copy) : copy;
  };
  
  describe("deep copy tests", () => {
      const original = {
          primitive: 5,
          obj: {primitive: "test", obj: {}},
          arr: [{primitive: 1, obj: {a: "a"}},{primitive: 2, obj: {b:"b"}}],
          method: () => "test method",
          nullField: null
      }
  
      test('these are different objects', () => {
          const copied = deepCopy(original);
          copied.primitive = 6;
          expect(copied.primitive).not.toBe(original.primitive);
      });
  
      test('object primitives are equal ', () => {
          const copied = deepCopy(original);
          expect(copied.primitive).toBe(original.primitive);
      });
  
      test('inner objects are different', () => {
          const copied = deepCopy(original);
          copied.obj.primitive = "test inner object";
          expect(copied.obj.primitive).not.toBe(original.obj.primitive);
      });
  
      test('inner objects are different + shallow copied test', () => {
          const shallowCopied = {...original};
          const deepCopied = deepCopy(original);
          expect(shallowCopied.obj === original.obj).toBeTruthy();
          expect(deepCopied.odj === original.obj).toBeFalsy();
      });
  
      test('method was copied', () => {
          const copied = deepCopy(original);    
          expect(copied.method()).toBe(original.method());
      });
  
      test('objects methods are different', () => {
          const copied = deepCopy(original); 
          copied.method = () => "other test method";   
          expect(copied.method()).not.toBe(original.method());
      });
  
      test('array was copied', () => {
          const copied = deepCopy(original);   
          expect(copied.arr.lenght).toBe(original.arr.lenght);
      });
  
      test('objects of array are different + shallow copied test', () => {
          const shallowCopied = {...original};
          const deepCopied = deepCopy(original);
          original.arr[0].obj.a = "c";
          expect(shallowCopied.arr[0].obj.a).toBe(original.arr[0].obj.a);   
          expect(deepCopied.arr[0].obj.a).not.toBe(original.arr[0].obj.a);
          
      });
  
      test('objects of array are different + shallow copied test', () => {
          const shallowCopied = {...original};
          const deepCopied = deepCopy(original); 
          expect(Array.isArray(shallowCopied.arr)).toBeTruthy(); 
          expect(Array.isArray(deepCopied.arr)).toBeTruthy();
      });
  
      test('null copy correctly', () => {
          const copied = deepCopy(original);  
          expect(copied.nullField).toBeNull();
      });
  })
  
  // jest is a unit testing framework.
  // 2011 (c) Ben Brooks Scholz. MIT Licensed.
  
  (function (window) {
  
      "use strict";
  
      var Module = function (name) {
          this.name = name;
          this.tests = [];
      };
  
      Module.prototype = {
          setup: function () {
              var jestTests = id('jest-tests'),
                  module = id(this.name.split(' ').join('-')),
                  moduleHeader;
  
              if (!module && jestTests) {
                  module = create('ol');
                  module.id = this.name.split(' ').join('-');
                  moduleHeader = create('h2');
                  moduleHeader.innerHTML = this.name;
                  module.appendChild(moduleHeader);
                  jestTests.appendChild(module);
              }
          },
  
          run: function () {
              var test;
  
              while (this.tests.length) {
                  test = this.tests.shift();
                  this.currentTest = test;
                  test.setup.call(test);
                  test.run.call(test);
                  test.finish.call(test);
              }
          },
  
          finish: function () {
              return;
          }
      };
  
      var Test = function (module, name, expected, callback) {
          this.module = module;
          this.name = name;
          this.expected = expected;
          this.actual = 0;
          this.failed = 0;
          this.time;
          this.callback = callback;
          this.results = [];
      };
  
      Test.prototype = {
          setup: function () {
              var jestTests = id('jest-tests'),
                  module = id(this.module.split(' ').join('-')),
                  testList = create('ol'),
                  testsHeader = create('h3');
  
              if (jestTests) {
                  testList.id = this.name.split(' ').join('-');
                  testsHeader.id = this.name.split(' ').join('-') + '-header';
  
                  testList.appendChild(testsHeader);
                  module.appendChild(testList);
                  jestTests.appendChild(module);
              }
          },
  
          run: function () {
              this.time = getTime(this.callback);
  
              if (this.time === 0) {
                  this.time = '<1';
              } else if (this.time === 1) {
                  this.time = '~1';
              }
          },
  
          finish: function () {
              var module = id(this.module.split(' ').join('-')),
                  testList = id(this.name.split(' ').join('-')),
                  test,
                  header,
                  warning;
  
              if (module) {
                  header = id(this.name.split(' ').join('-') + '-header');
  
                  if ((this.failed === 0) && (this.expected === this.actual)) {
                      header.innerHTML = '&#10004; ';
                  } else {
                      header.innerHTML = '&#10008; ';
                  }
  
                  header.innerHTML += this.name + ' ( ' + this.actual + ' tests in ' + this.time;
  
                  if (typeof this.time !== 'number') {
                      header.innerHTML += ' millisecond. )';
                  } else {
                      header.innerHTML += ' milliseconds. )';
                  }
  
                  while (this.results.length) {
                      test = create('li');
                      test.innerHTML = this.results.shift();
                      testList.appendChild(test);
                  }
  
                  if (this.expected !== this.actual) {
                      warning = create('h1');
                      warning.className = 'warning';
                      warning.innerHTML = 'Warning: ' + this.actual +
                          ' tests were executed, but ' + this.expected + ' were expected.';
                      testList.insertBefore(warning, testList.firstChild.nextSibling);
                  }
              }
          }
      };
  
      // functions available to the user
      var Jest = {
          jest: function (moduleName) {
              var module = new Module(moduleName);
              Jest.modules.push(module);
              Jest.currentModule = module;
          },
  
          test: function (testsName, tests, expectedTests) {
              var test = new Test(Jest.currentModule.name, testsName, expectedTests, tests);
              Jest.currentModule.tests.push(test);
          },
  
          yes: function (given, message) {
              var result = !! given;
              Jest.process(result, message);
          },
  
          no: function (given, message) {
              var result = !given;
              Jest.process(result, message);
          },
  
          alike: function (given, expected, message) {
              var result = !! (given == expected);
              Jest.process(result, message);
          },
  
          unlike: function (given, expected, message) {
              var result = !(given == expected);
              Jest.process(result, message);
          },
  
          same: function (given, expected, message) {
              var result = !! Jest.isEqual(given, expected);
              Jest.process(result, message);
          },
  
          different: function (given, expected, message) {
              var result = !Jest.isEqual(given, expected);
              Jest.process(result, message);
          },
  
          range: function (given, range, message) {
              var result = ((given > range[0]) && (given < range[1]));
              Jest.process(result, message);
          }
      };
  
      expose(window, Jest);
  
      expose(Jest, {
          jestStats: {
              total: 0,
              failed: 0,
              time: 0
          },
  
          modules: [],
  
          init: function () {
              var summary = create('div'),
                  jestHeader = create('h1'),
                  userInfo = create('p'),
                  testStats = create('p'),
                  passedNumber = create('span'),
                  light = create('span'),
                  jestTime = create('span'),
                  error = create('div'),
                  jestTests = id('jest-tests'),
                  body = document.body;
  
              if (!jestTests) {
                  error.id = 'error';
                  error.innerHTML = '<span class=\"error\"> !! </span>Jest requires a div tag with an id of \'jest-tests\'.';
                  body.insertBefore(error, body.firstChild);
                  body.style.border = 'none';
                  body.style.width = '100%';
                  body.style.margin = '0';
                  return false;
              }
  
              summary.id = 'summary';
              jestHeader.id = 'jest-header';
              userInfo.id = 'user-info';
              testStats.id = 'test-stats';
              passedNumber.id = 'passed-number';
              light.id = 'light';
              jestTime.id = 'jest-time';
  
              light.className = "running";
  
              jestHeader.innerHTML = 'Jest Unit Tests';
  
              summary.appendChild(jestHeader);
              summary.appendChild(userInfo);
              passedNumber.appendChild(light);
              testStats.appendChild(passedNumber);
              testStats.appendChild(jestTime);
              summary.appendChild(testStats);
              body.insertBefore(summary, jestTests);
              body.insertBefore(create('hr'), jestTests);
  
              return true;
          },
  
          load: function () {
              if (Jest.init()) {
                  var module;
  
                  Jest.jestStats.time = getTime(function () {
                      while (Jest.modules.length) {
                          module = Jest.modules.shift();
                          module.setup.call(module);
                          module.run.call(module);
                          module.finish.call(module);
                      }
                  });
  
                  Jest.finish();
              }
          },
  
          process: function (result, message) {
              var resultStr = 'passed';
  
              if (!result) {
                  resultStr = 'failed';
                  Jest.jestStats.failed += 1;
                  Jest.currentModule.currentTest.failed += 1;
              }
  
              var resultData = '<div class=\"' + resultStr + ' test\">' + resultStr + '</div> ' + message;
              Jest.jestStats.total += 1;
              Jest.currentModule.currentTest.actual += 1;
              Jest.currentModule.currentTest.results.push(resultData);
          },
  
          finish: function () {
              var stat = Jest.jestStats,
                  browser = id('user-info'),
                  passedNumber = id('passed-number'),
                  time = id('jest-time'),
                  ui = userInfo();
  
              browser.innerHTML = '<p>' + ui.browser + ' ' + ui.version + '</p>' +
                  '<p>' + ui.os + '</p>';
  
              passedNumber.innerHTML += ' ' + (stat.total - stat.failed) +
                  ' of ' + stat.total + ' tests passed in ';
  
              if (stat.failed) {
                  id('light').className = "failed";
              } else {
                  id('light').className = "passed";
              }
  
              time.innerHTML = stat.time + ' milliseconds' + '.';
          },
  
          isEqual: function (a, b) {
              var aType = typeof a,
                  bType = typeof b;
  
              if (a === b) return true;
              if (aType !== bType) return false;
  
              if (Jest.isArray(a) && Jest.isArray(b)) {
                  if (a.length !== b.length) return false;
  
                  for (var i = 0; i < a.length; i++) {
                      if (a[i] !== b[i]) return false;
                  }
  
                  return true;
              }
  
              if (aType !== 'object') return false;
  
              for (var prop in a) {
                  if (a.hasOwnProperty(prop) && !b.hasOwnProperty(prop)) {
                      return false;
                  }
  
                  if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
                      return Jest.isEqual(a[prop], b[prop]);
                  }
              }
  
              return true;
          },
  
          isArray: function (a) {
              if (a === 'undefined') {
                  return false;
              }
              
              if (a && typeof a === 'object' && a.constructor === Array) {
                  return true;
              }
              
              if (Object.prototype.toString.call(a) === '[object Array]') {
                  return true;
              }
              
              return false;
          }
      });
  
      addEvent(window, 'load', Jest.load);
  
      function expose(exposed, exposer) {
          for (var property in exposer) {
              if (exposer.hasOwnProperty(property)) {
                  exposed[property] = exposer[property];
              }
          }
      }
  
      function addEvent(obj, type, callback) {
          if (obj.addEventListener) {
              obj.addEventListener(type, callback, false);
          } else if (obj.attachEvent) {
              obj.attachEvent('on' + type, callback);
          }
      }
  
      function getTime(callback) {
          var start = new Date(),
              done;
  
          callback();
          done = new Date();
  
          return done.getTime() - start.getTime();
      }
  
      function create(elem) {
          return document.createElement(elem);
      }
  
      function id(str) {
          return document.getElementById(str);
      }
  
      // from detect.js
      // (c) 2011 Ben Brooks Scholz. MIT Licensed.
      // http://github.com/benbscholz/detect
      function userInfo() {
          var browser,
          os,
          version,
          string,
          ua = window.navigator.userAgent,
              platform = window.navigator.platform,
  
              info = function () {
                  if (/MSIE/.test(ua)) {
                      browser = 'Internet Explorer';
                      if (/IEMobile/.test(ua)) {
                          browser += ' Mobile';
                      }
                      version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
                  } else if (/Chrome/.test(ua)) {
                      browser = 'Chrome';
                      version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
                  } else if (/Opera/.test(ua)) {
                      browser = 'Opera';
                      if (/mini/.test(ua)) {
                          browser += ' Mini';
                      } else if (/Mobile/.test(ua)) {
                          browser += ' Mobile';
                      }
                  } else if (/Android/.test(ua)) {
                      browser = 'Android Webkit Browser';
                      mobile = true;
                      os = /Android\s[\.\d]+/.exec(ua);
                  } else if (/Firefox/.test(ua)) {
                      browser = 'Firefox';
                      if (/Fennec/.test(ua)) {
                          browser += ' Mobile';
                      }
                      version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
                  } else if (/Safari/.test(ua)) {
                      browser = 'Safari';
                      if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) {
                          os = 'iOS';
                      }
                  }
  
                  if (!version) {
                      version = /Version\/[\.\d]+/.exec(ua);
                      if (version) {
                          version = version[0].split('/')[1];
                      } else {
                          version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1]
                      }
                  }
  
                  if (platform === 'MacIntel' || platform === 'MacPPC') {
                      os = 'Mac OS X ' + /10[\.\_\d]+/.exec(ua)[0];
                      if (/[\_]/.test(os)) {
                          os = os.split('_').join('.');
                      }
                  } else if (platform === 'Win32') {
                      os = 'Windows 32 bit';
                  } else if (platform == 'Win64') {
                      os = 'Windows 64 bit';
                  } else if (!os && /Linux/.test(platform)) {
                      os = 'Linux';
                  }
  
                  if (!os && /Windows/.test(ua)) {
                      os = 'Windows';
                  }
  
              }();
          return {
              browser: browser,
              version: version,
              os: os
          };
      }
  
  }(this));
  
  
  
  jest('Boolean Tests');
  
  test('yes examples', function () {
      yes(true, 'yes: true is true');
      yes(!false, 'yes: not false is true');
      yes( !! true, 'yes: not not true is true');
      yes(1, 'yes: truthy is true');
  }, 4);
  
  test('no examples', function () {
      no(false, 'no: false is false');
      no(!true, 'no: not true is false');
      no( !! false, 'no: not not false is false');
      no(0, 'no: falsy is false');
  }, 4);
  
  test('alike examples', function () {
      var a;
      alike(1, 1, 'alike: one is one');
      alike(true, true, 'alike: true is true');
      alike('jest', 'jest', 'alike: string is string');
      alike(a = [1], a, 'alike: array is array');
  }, 4);
  
  test('unlike examples', function () {
      var a;
      unlike(1, 2, 'unlike: one is not two');
      unlike(true, false, 'unlike: true is not false');
      unlike('jest', 'jester', 'unlike: string is not string');
      unlike(a = [1], [1], 'unlike: array is not array');
  }, 4);
  
  test('same examples', function () {
      same(1, 1, 'same: one is one');
      same('jest', 'jest', 'same: string is string');
      same([1], [1], 'same: array is array');
      same({1: 1}, {1: 1}, 'same: object is object');
  }, 4);
  
  test('different examples', function () {
      different(1, 2, 'different: one is not two');
      different('jest', 'jester', 'different: string is not string');
      different([1], [0], 'different: array is not array');
      different({1: 0}, {1: 1}, 'different: objects are different');
  }, 4);
  
  test('range examples', function () {
      range(1, [0, 10], 'range: one is between 0 and 10');
      range(2, [-1, 3], 'range: two is between -1 and 3');
  }, 2);
  