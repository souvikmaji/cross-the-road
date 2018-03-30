/*
 * This is an image loading utility with a "caching" layer so
 * it will reuse cached images while loading the same image multiple times.
 */
(function() {
  var resourceCache = {};
  var readyCallbacks = [];

  /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single image
     */
  function load(urlOrArr) {
    if (urlOrArr instanceof Array) {
      // For an array of images
      urlOrArr.forEach(function(url) {
        _load(url);
      });
    } else {
      //single image file
      _load(urlOrArr);
    }
  }

  function _load(url) {
    if (resourceCache[url]) {
      return resourceCache[url];
    } else {
      var img = new Image();
      img.onload = function() {
        resourceCache[url] = img;
        if (isReady()) {
          readyCallbacks.forEach(function(func) {
            func();
          });
        }
      };
      resourceCache[url] = false;
      img.src = url;
    }
  }

  function get(url) {
    return resourceCache[url];
  }

  function isReady() {
    var ready = true;
    for (var k in resourceCache) {
      if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  function onReady(func) {
    readyCallbacks.push(func);
  }

  /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
  window.Resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
  };
})();
