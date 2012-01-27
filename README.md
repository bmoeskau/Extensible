# Extensible

An [Ext JS](http://www.sencha.com/products/extjs) Component Library  
by Brian Moeskau

Currently includes Ext Calendar Pro and supporting components, more to come. See [ext.ensible.com](http://ext.ensible.com/) for complete details.

**NOTE:** You are currently viewing the **Ext 3.x-compatible** version of Extensible. If you are using Ext 4.0+, you should instead look at [Extensible 1.5.0](https://github.com/bmoeskau/Extensible) or above (the master branch in Github).

## Licensing

Extensible is dual-licensed both commercially and under the open source GPL v3, [just like Ext JS](http://www.sencha.com/company/dual.php). For complete details see the [Extensible Licensing Overview](http://ext.ensible.com/products/licensing/). To purchase a commercial license or premium support please visit the [Extensible Store](http://ext.ensible.com/store/).

---

**Please note that if you use Extensible under the free GPL license, then your project must also be open source and must adhere to the rules of the [GPL](http://ext.ensible.com/products/gpl-v3.txt). If your project is commercial and/or closed source, a [commercial license](http://ext.ensible.com/store/) is required.**

[View GPL v3 license terms](http://ext.ensible.com/products/gpl-v3.txt)

---

## Getting Started

The easiest way to get started with Extensible is to download one of the [released packages](http://github.com/bmoeskau/Extensible/downloads), which already contain the fully-built distribution files and documentation, and unzip it into your local web root (required for Ajax requests to work). By default, all examples use a relative reference to the pre-built debug version of Extensible (`[Extensible]/lib/extensible-all-debug.js`) and a url to a recent version of Ext hosted on the Sencha CDN (e.g., `http://cdn.sencha.io/ext-3.4.0/`). As long as you have an internet connection, the examples should work out of the box.

## Configuration

As of Extensible 1.0.2 you can easily customize the framework paths for the examples (e.g., if you want to run a different version of Ext, or host it locally), or switch between running the release and debug versions of Extensible. For complete details on all options, see the source comments included in `Extensible-config.js`.

## Building the Source

### "Compiling" the Code

If you clone or fork the repository to use the most up-to-date code, you'll probably want to be able to rebuild the project yourself. Build scripts for both Mac/Unix (`build.sh`) and Windows (`build.bat`) are included in the `/build` folder, as well as a version of [JSBuilder](http://www.sencha.com/products/jsbuilder) and a `.jsb2` project file for Extensible.  You must have a current version of Java installed for JSBuilder to work.

By default, each build script uses the script file's location to reference other files relatively, so they should work as expected without modification. When you execute a build script (e.g., `sh build.sh` on the Mac/Unix command line, or just `build` on the Windows command line) it will build everything (minus docs) into a `/deploy` folder and also copy the `-all` and `-all-debug` files into the main `/lib` folder so that the examples will always have the latest code as well.

### Generating Docs

The jar file for the [Ext-doc](http://ext-doc.org/) utility is also included.  If you'd like to generate docs as part of your build, simply pass `-d` as a command line arg to the build script (e.g., `sh build.sh -d` or `build -d`) and the current documentation will also be created under `/docs`.

## Deployment

Extensible 1.0.x requires the Ext JS 3.x framework (version 3.2 or later). For use in your own application, you'll simply include the built framework files, just like any other typical Ext application dependencies. This could be your own custom-built files, if you've made any changes to the Extensible source. For example:

    <!-- Ext JS includes -->
    <link rel="stylesheet" type="text/css" href="http://cdn.sencha.io/ext-3.4.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="http://cdn.sencha.io/ext-3.4.0/adapter/ext/ext-base[-debug].js"></script>
    <script type="text/javascript" src="http://cdn.sencha.io/ext-3.4.0/ext-all[-debug].js"></script>

    <!-- Extensible includes -->
    <link rel="stylesheet" type="text/css" href="path/to/extensible-all.css" />
    <script type="text/javascript" src="path/to/extensible-all[-debug].js"></script>

    <!-- Include your app and any other app-specific files -->
    <script type="text/javascript" src="MyApp.js"></script>

During development you should include `extensible-all-debug.js` for easier debugging, but then for deployment use the minimized `extensible-all.js`.  If you are using individual source files then it's up to you to include them all, in the proper order. Look under the `/examples` folder to get a jump start on how to use the included components.

## Additional Help

For questions about using Extensible, or to report bugs, visit the [Extensible forums](http://ext.ensible.com/forum/).

We also have [premium support subscriptions](http://ext.ensible.com/store/) available if you need more direct assistance, or would like to help support the project's continued development.