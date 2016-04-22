/*
 * Run canvallax plugins after canvallax and all its methods have been set up.
 */
var pluginQueue = noop,
    plugins = win._clx || [],
    len = plugins.length,
    i = 0;

for (; i < len; i++) { plugins[i](canvallax); }

pluginQueue.push = function(fn){ fn(canvallax); }
win._clx = pluginQueue;
