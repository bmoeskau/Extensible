Extensible = {
    version: '1.0.2'
};
/**
 * This is intended as a development mode only convenience so that you can configure all include
 * paths for all Extensible examples in one place. For production deployment you should configure
 * your application with the proper paths directly.
 */
Extensible.Config = {
    /**
     * Edit the values of these default configs to customize how Ext JS and Extensible are loaded.
     */
    defaults: {
        /**
         * The mode to use for loading framework files. Valid values are:
         * 
         * - 'release': minified single file (e.g. ext-all.js)
         * - 'debug': (default) non-minifed single file (e.g. ext-all-debug.js)
         * 
         * @config {String} mode
         */
        mode: 'debug',
        
        /**
         * The root path to the Ext JS framework (defaults to loading 3.4.0 from the Sencha CDN via
         * 'http://cdn.sencha.io/ext-3.4.0/'). Path should be absolute and should end with a '/'.
         * 
         * Note that the Sencha CDN does not always provide the most current version of Ext JS
         * available (for example, support subscribers often have access to more up-to-date builds).
         * If the version you need is not hosted you'll have to download it locally and update this
         * path accordingly.
         * 
         * Alternate example values:
         * 
         * // Older Ext JS versions:
         * http://cdn.sencha.io/ext-3.3.0/
         * http://cdn.sencha.io/ext-3.2.0/
         * 
         * // Direct to cachefly.net, e.g. if sencha.io is down:
         * http://extjs.cachefly.net/ext-3.4.0/
         * 
         * // A custom absolute path:
         * http://localhost/extjs/
         * http://mydomain/extjs/3.4.0/
         * 
         * @config {String} extJsRoot
         */
        extJsRoot: 'http://cdn.sencha.io/ext-3.4.0/',
        
        /**
         * The root path to the Extensible framework (defaults to the current url of this script file,
         * 'Extensible-config.js', which is shipped in the root folder of Extensible). Path should
         * be absolute and should end with a '/'.
         * 
         * Alternate example values:
         * 
         * // A custom absolute path:
         * http://localhost/extensible/
         * http://mydomain/extensible/1.0.1/
         * 
         * @config {String} extensibleRoot
         */
        extensibleRoot: null, // initialized dynamically in getSdkPath()
        
        /**
         * True to allow the default browser behavior of caching the Extensible JS and CSS files
         * after initial load (defaults to true), or false to append a unique cache-buster parameter
         * to the url to enforce reloading Extensible files with each page refresh (useful if you are
         * actively changing and debugging Extensible code). If true, the current version number of
         * Extensible will still be used to force a reload with each new version of the framework, but
         * after the initial load of each version the cached files will be used.
         * 
         * Note that this option does not affect the caching of Ext JS files in any way. They will be
         * cached according to the default behavior of the browser.
         * 
         * @config {Boolean} cacheExtensible
         */
        cacheExtensible: true
    },

    /**
     * Sets up all configurable properties and writes all includes to the document.
     */
    init: function() {
        var me = this,
            config = window.ExtensibleDefaults || {};
         
        me.mode = config.mode || me.defaults.mode;
        me.extJsRoot = config.extJsRoot || me.defaults.extJsRoot;
        me.extensibleRoot = config.extensibleRoot || me.defaults.extensibleRoot || me.getSdkPath();
        me.cacheExtensible = config.cacheExtensible || me.defaults.cacheExtensible;
         
        me.adjustPaths();
        me.writeIncludes();
    },
    
    // private -- returns the current url to this script file, which is shipped in the SDK root folder
    getSdkPath: function() {
        var scripts = document.getElementsByTagName('script'),
            thisScriptSrc = scripts[scripts.length - 1].src,
            sdkPath = thisScriptSrc.substring(0, thisScriptSrc.lastIndexOf('/') + 1);
        
        return sdkPath;
    },
    
    // private -- helper function for ease of deployment
    adjustPaths: function() {
        if (this.extensibleRoot.indexOf('ext.ensible.com') > -1) {
            // If hosted at ext.ensible.com force non-debug release build includes
            this.mode = 'release';
        }
    },
    
    includeStylesheet: function(filePath) {
        document.write('<link rel="stylesheet" type="text/css" href="' + filePath + '" />');
    },
     
    includeScript: function(filePath) {
        document.write('<script type="text/javascript" src="' + filePath + '"></script>');
    },
    
    // private -- write out the CSS and script includes to the document
    writeIncludes: function() {
        var me = this,
            suffix = (me.mode === 'debug' ? '-debug' : ''),
            // For release we want to refresh the cache on first load, but allow caching
            // after that, so use the version number instead of a unique string
            cacheBuster = '?_dc=' + (!me.cacheExtensible && me.mode === 'debug' ? (+new Date) : Extensible.version);
        
        me.includeStylesheet(me.extJsRoot + 'resources/css/ext-all.css');
        me.includeStylesheet(me.extensibleRoot + 'resources/css/extensible-all.css' + cacheBuster);
        me.includeStylesheet(me.extensibleRoot + 'examples/examples.css?_dc=' + Extensible.version);
        
        me.includeScript(me.extJsRoot + 'adapter/ext/ext-base' + suffix + '.js'); 
        me.includeScript(me.extJsRoot + 'ext-all' + suffix + '.js');
        me.includeScript(me.extensibleRoot + 'lib/extensible-all' + suffix + '.js' + cacheBuster);
        me.includeScript(me.extensibleRoot + 'examples/examples.js?_dc=' + Extensible.version);
    }
};

/*
 * Kick it off. To customize the configuration settings from external code, you can create a global
 * object -- before including this Extensible-config.js script -- called "ExtensibleDefaults" and give
 * it properties corresponding to the Extensible.Config configs you want to set. If it exists the
 * ExtensibleDefaults object will be used and then destroyed automatically, otherwise the Extensible.Config
 * defaults will be used. Any options not specified in the ExtensibleDefaults object will simply use the
 * default value. For example:
 * 
 * ExtensibleDefaults = {
 *     mode: 'release'
 * }
 * 
 * Note that this global config object is primarily supported for testability and for one-off
 * overriding of Extensible.Config. To change the configuration that you plan to use for your normal
 * day-to-day use you should simply edit the Extensible.Configs.defaults as needed to change the
 * settings globally without having to create this object on each page.
 */
Extensible.Config.init();

// Clean up the global config override if it exists
try {
    delete window.ExtensibleDefaults;
}
catch(ex) {
    window.ExtensibleDefaults = null;
}
