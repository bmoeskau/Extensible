Extensible = {
    version: '1.6.0-b1'
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
         * - 'dynamic': uses Ext.Loader to load classes individually (e.g., ext.js). NOTE: this
         *    option does not work for IE, which will be defaulted to the 'debug' option.
         * 
         * Typically the default of 'debug' is the best trade-off between code readability and
         * load/execution speed. If you need to step into framework files frequently during
         * debugging you might switch to 'dynamic' mode -- it is much slower during initial
         * page load but generally provides a faster and easier debugging experience.
         * 
         * Note that for debug and release modes to reflect any code or CSS changes made to Extensible
         * files you must rebuild the framework after each change using the scripts provided under
         * the `/build` folder (requires Java). If you cannot build the framework and you've made any
         * changes to Extensible files you should use dynamic mode to ensure that changes are reflected.
         * 
         * @config {String} mode
         */
        mode: 'debug',
        
        /**
         * The root path to the Ext JS framework (defaults to loading 4.1.0 from the Sencha CDN via
         * 'http://cdn.sencha.io/ext-4.1.0-gpl/'). Path should be absolute and should end with a '/'.
         * 
         * Note that the Sencha CDN does not always provide the most current version of Ext JS
         * available (for example, support subscribers often have access to more up-to-date builds).
         * If the version you need is not hosted you'll have to download it locally and update this
         * path accordingly.
         * 
         * Alternate example values:
         * 
         * // Older Ext JS versions:
         * http://cdn.sencha.io/ext-4.0.2/
         * 
         * // Direct to cachefly.net, e.g. if sencha.io is down:
         * http://extjs.cachefly.net/ext-4.1.0-gpl/
         * 
         * // A custom absolute path:
         * http://localhost/extjs/
         * http://mydomain/extjs/4.0.2/
         * 
         * @config {String} extJsRoot
         */
        extJsRoot: 'http://cdn.sencha.io/ext-4.1.0-gpl/',
        
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
         * This option only applies when using `debug` or `dynamic` modes. In `release` mode the Extensible
         * version number will be used to ensure that Extensible files are always cached after the initial
         * load of each release and this option will be ignored. Note that when using `dynamic` mode you
         * would additionally have to ensure that the Ext.Loader's `disableCaching` option is true in order
         * to add the cache buster parameter to each dynamically-loaded class. 
         * 
         * Note that this option does not affect the caching of Ext JS files in any way. If you are
         * using dynamic loading, the Ext Loader will govern caching, otherwise the default browser
         * caching will be in effect.
         * 
         * @config {Boolean} cacheExtensible
         */
        cacheExtensible: true,

        /**
         * Language files to load for the Ext JS and Extensible frameworks. Valid values are ISO language codes of
         * supported languages. See directory src/locale for a list of supported languages. Examples are:
         * - 'en'
         * - 'en_GB'
         * - 'de'
         * - 'fr'
         * and many more.
         */
        language: 'en'
    },
    
    /**
     * Sets up all configurable properties and writes all includes to the document.
     */
    init: function() {
        var me = this,
            config = window.ExtensibleDefaults || {};
        
        me.isIE = /msie/.test(navigator.userAgent.toLowerCase());
        
        me.mode = config.mode || me.defaults.mode;
        me.extJsRoot = config.extJsRoot || me.defaults.extJsRoot;
        me.extensibleRoot = config.extensibleRoot || me.defaults.extensibleRoot || me.getSdkPath();
        me.cacheExtensible = config.cacheExtensible || me.defaults.cacheExtensible;
        me.language = config.language || me.defaults.language;

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
            cacheBuster = '?_dc=' + (me.cacheExtensible ? Extensible.version : (+new Date)),
            suffix = '',
            bootstrap = '';
        
        switch (me.mode) {
            case 'debug':
                suffix = '-all-debug';
                break;
            
            case 'release':
                suffix = '-all';
                // For release we want to refresh the cache on first load, but allow caching
                // after that, so use the version number instead of a unique string
                cacheBuster = '?_dc=' + Extensible.version;
                break;
            
            default:
                // IE does not work in dynamic mode for the Extensible examples currently
                // based on how it (mis)handles loading of scripts when mixing includes
                // and in-page scripts. Make sure IE always uses the regular debug versions.
                if (me.isIE) {
                    suffix = '-all-debug';
                }
                else {
                    bootstrap = '-bootstrap';
                }
        }
        
        me.includeStylesheet(me.extJsRoot + 'resources/css/ext-all.css');
        me.includeStylesheet(me.extensibleRoot + 'resources/css/extensible-all.css' + cacheBuster);
        me.includeStylesheet(me.extensibleRoot + 'examples/examples.css?_dc=' + Extensible.version);
        
        me.includeScript(me.extJsRoot + 'ext' + suffix + '.js');
        me.includeScript(me.extJsRoot + 'locale/ext-lang-' + me.language + '.js');
        me.includeScript(me.extensibleRoot + 'lib/extensible' + suffix + bootstrap + '.js' + cacheBuster);
        me.includeScript(me.extensibleRoot + 'src/locale/extensible-lang-' + me.language + '.js' + cacheBuster);
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
 *     mode: 'dynamic'
 * }
 * 
 * Note that this global config object is primarily supported for testability and for one-off
 * overriding of Extensible.Config. To change the configuration that you plan to use for your normal
 * day-to-day use you should simply edit the Extensible.Config.defaults as needed to change the
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
