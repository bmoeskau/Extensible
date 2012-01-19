Extensible = window.Extensible || {};

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
         * - 'dynamic': uses Ext.Loader to load classes individually (e.g., ext.js)
         * 
         * Typically the default of 'debug' is the best trade-off between code readability and
         * load/execution speed. If you need to step into framework files frequently during
         * debugging you might switch to 'dynamic' mode -- it is much slower during initial
         * page load but generally provides a faster and easier debugging experience.
         * 
         * @config {String} mode
         */
        mode: 'debug',
        
        /**
         * The root path to the Ext JS framework (defaults to loading 4.0.7 from the Sencha CDN via
         * 'http://cdn.sencha.io/ext-4.0.7-gpl/'). Path should be absolute and should end with a '/'.
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
         * http://extjs.cachefly.net/ext-4.0.7-gpl/
         * 
         * // A custom absolute path:
         * http://localhost/extjs/
         * http://mydomain/extjs/4.0.2/
         * 
         * @config {String} extJsRoot
         */
        extJsRoot: 'http://cdn.sencha.io/ext-4.0.7-gpl/',
        
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
        extensibleRoot: null // initialized dynamically in getSdkPath()
    },
    
    /**
     * Sets up all configurable properties and writes all includes to the document.
     */
    init: function() {
        var config = window.ExtensibleConfig || {};
        
        this.mode = config.mode || this.defaults.mode;
        this.extJsRoot = config.extJsRoot || this.defaults.extJsRoot;
        this.extensibleRoot = config.extensibleRoot || this.defaults.extensibleRoot || this.getSdkPath();
        
        this.adjustPaths();
        this.writeIncludes();
        this.writeLoaderScript();
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
    
    // private -- write out the CSS and script includes to the document
    writeIncludes: function() {
        var suffix = '';
        
        switch (this.mode) {
            case 'debug':
                suffix = '-all-debug';
                break;
            
            case 'release':
                suffix = '-all';
                break;
            
            // default is '' for dynamic loading
        }
        
        var includes = [
            '<link rel="stylesheet" type="text/css" href="' + this.extJsRoot + 'resources/css/ext-all.css" />',
            '<script type="text/javascript" src="' + this.extJsRoot + 'ext' + suffix + '.js"></script>',
            '<link rel="stylesheet" type="text/css" href="' + this.extensibleRoot + 'resources/css/extensible-all.css" />',
            '<script type="text/javascript" src="' + this.extensibleRoot + 'extensible' + suffix + '.js"></script>',
            '<link rel="stylesheet" type="text/css" href="' + this.extensibleRoot + 'examples/examples.css" />',
            '<script type="text/javascript" src="' + this.extensibleRoot + 'examples/examples.js"></script>'
        ].join('');
        
        document.write(includes);
    },
    
    // private -- write out the dynamic loading script
    writeLoaderScript: function() {
        // Always output this even when not dynamically loading the framework files as the
        // examples rely on Ext.Loader to load example-specific files at runtime.
        var extensiblePath = (this.mode === 'dynamic' ? '"Extensible": "' + this.extensibleRoot + 'src", ' : ''),
            script = [
                '<script type="text/javascript">',
                    'Ext.Loader.setConfig({',
                        'enabled: true, ',
                        'disableCaching: false, ',
                        'paths: {',
                            extensiblePath,
                            '"Extensible.example": "' + this.extensibleRoot + 'examples"',
                        '}',
                    '});',
                '</script>'
            ].join('');
        
        document.write(script);
    }
};

/*
 * Kick it off. To customize the configuration settings from external code, you can create a global
 * object -- before including this Extensible-config.js script -- called "ExtensibleConfig" and give
 * it properties corresponding to the Extensible.Config configs you want to set. If it exists the
 * ExtensibleConfig object will be used and then destroyed automatically, otherwise the Extensible.Config
 * defaults will be used. Any options not specified in the ExtensibleConfig object will simply use the
 * default value. For example:
 * 
 * ExtensibleConfig = {
 *     mode: 'dynamic'
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
    delete window.ExtensibleConfig;
}
catch(ex) {
    window.ExtensibleConfig = null;
}
