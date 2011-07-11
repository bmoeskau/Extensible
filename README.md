# Extensible

An [Ext JS](http://www.sencha.com/products/extjs) Component Library  
by Brian Moeskau

Currently includes Ext Calendar Pro and supporting components, more to come. See [ext.ensible.com](http://ext.ensible.com/) for complete details.

**NOTE:** You are currently viewing the Ext 3.x-compatible version of Extensible. If you are using Ext 4.0+, you should instead look at [Extensible 1.5.0](https://github.com/bmoeskau/Extensible) or above (the master branch in Github).

## Licensing
Extensible is dual-licensed both commercially and under the open source GPL v3, [just like Ext JS](http://www.sencha.com/company/dual.php). For complete details see the [Extensible Licensing Overview](http://ext.ensible.com/products/licensing/). To purchase a commercial license or premium support please visit the [Extensible Store](http://ext.ensible.com/store/).

**Please note that if you use Extensible under the free GPL license, then your project must also be open source and must adhere to the rules of the [GPL](http://ext.ensible.com/products/gpl-v3.txt). If your project is commercial and/or closed source, a [commercial license](http://ext.ensible.com/store/) is required.**

## Building the Source
Build scripts for both Mac/Unix (`build/build.sh`) and Windows (`build/build.bat`) are included.  You must have a current version of Java installed for JSBuilder to work.  You should also edit the build script and update the path variables as needed for your system.

If you run the build script (e.g., `sh build.sh` in the Mac terminal, or just `build` on the Windows command line) it will build everything (minus docs), create a `/deploy` folder and also place the `*-all` files in the root folder.  The jar file for the Ext-doc tool ([http://ext-doc.org/](http://ext-doc.org/)) is also included.  If you'd like to generate docs also, simply pass `-d` as a command line arg to the build script (e.g., `sh build.sh -d` or `build -d`).

**NOTE:** If you would prefer not to build the source yourself, you can always [download](http://github.com/bmoeskau/Extensible/downloads) the most current stable build, though it may not have the latest available fixes.

## Installation and Usage
Extensible requires the Ext JS framework (version 3.2 or later). By default the examples link to Ext via cachefly.net.  Alternately you can download the [latest version](http://www.sencha.com/products/js/download.php) of Ext JS and install Extensible in a sibling directory, adjusting the example paths as needed.

To use Extensible in your application simply include the Extensible JS and CSS files after the standard Ext JS includes. For example:

    <!-- Ext JS includes -->
    <link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.2.0/adapter/ext/ext-base-debug.js"></script>
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.2.0/ext-all-debug.js"></script>

    <!-- Extensible includes -->
    <link rel="stylesheet" type="text/css" href="path/to/extensible-all.css" />
    <script type="text/javascript" src="path/to/extensible-all-debug.js"></script>

During development you should include `extensible-all-debug.js`, but then for deployment use the minimized `extensible-all.js`.  If you are using individual source files then it's up to you to include them all, in the proper order. Look under the `/examples` folder to get a jump start on how to use the included components.

## Support
For help in setting up or using this library, or to report bugs, visit the "Extensible forums":http://ext.ensible.com/forum/.

We also have [premium support subscriptions](http://ext.ensible.com/store/) available if you need access to more direct assistance.