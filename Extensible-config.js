
Extensible = window.Extensible || {};

/**
 * This is intended as a development mode only convenience so that you can configure all include
 * paths for all Extensible examples in one place. For production deployment you should configure
 * your application with the proper paths directly.
 */
Extensible.Config = {

    /**
     * Sets up all configurable properties. Edit the property values in this method as needed. 
     */
    init: function() {
        /**
         * Whether or not to load the debug versions of all Ext JS and Extensible scripts by automatically
         * appending '-debug' to the end of script filename (e.g., 'ext-all-debug.js' vs. 'ext-all.js').
         * Defaults to true.
         */
        this.IsDebug = true;
        
        /**
         * The root path to the Ext JS framework (defaults to loading 3.4.0 from the Sencha CDN via
         * 'http://cdn.sencha.io/ext-3.4.0/'). Path should be absolute and should end with a '/'.
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
         */
        this.ExtJsRoot = 'http://cdn.sencha.io/ext-3.4.0/';
        
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
         */
        this.ExtensibleRoot = this.getSdkPath();
        
        this.writeIncludes();
    },
    
    // private -- returns the current url to this script file, which is shipped in the SDK root folder
    getSdkPath: function() {
        var scripts = document.getElementsByTagName('script'),
            thisScriptSrc = scripts[scripts.length - 1].src,
            sdkPath = thisScriptSrc.substring(0, thisScriptSrc.lastIndexOf('/') + 1);
        
        if (sdkPath.indexOf('ext.ensible.com') > -1) {
            // If hosted at ext.ensible.com force non-debug includes
            this.IsDebug = false;
        }
        return sdkPath;
    },
    
    // private -- write out the CSS and script includes to the document
    writeIncludes: function() {
        var debug = this.IsDebug ? '-debug' : '';
        
        // Ext JS includes:
        document.write('<link rel="stylesheet" type="text/css" href="' + this.ExtJsRoot + 'resources/css/ext-all.css" />');
        document.write('<script type="text/javascript" src="' + this.ExtJsRoot + 'adapter/ext/ext-base' + debug + '.js"></script>');
        document.write('<script type="text/javascript" src="' + this.ExtJsRoot + 'ext-all' + debug + '.js"></script>');
        
        // Extensible includes:
        document.write('<link rel="stylesheet" type="text/css" href="' + this.ExtensibleRoot + 'resources/css/extensible-all.css" />');
        document.write('<script type="text/javascript" src="' + this.ExtensibleRoot + 'extensible-all' + debug + '.js"></script>');
        
        // Shared example includes:
        document.write('<link rel="stylesheet" type="text/css" href="' + this.ExtensibleRoot + 'examples/examples.css" />');
        document.write('<script type="text/javascript" src="' + this.ExtensibleRoot + 'examples/examples.js"></script>');
    }
};

Extensible.Config.init();