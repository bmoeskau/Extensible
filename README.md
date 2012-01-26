# Extensible

An [Ext JS](http://www.sencha.com/products/extjs) Component Library  
by Brian Moeskau

Currently includes Calendar Pro and supporting components, more to come. See [ext.ensible.com](http://ext.ensible.com/) for complete details.

## About

Extensible actually contains a bunch of different components, but the primary product currently is Calendar Pro, a drop-in calendar solution styled after (the old) Google Calendar. It supports multiple views, drag-and-drop editing, calendar color-coding, localizability and is built to be easily extendable. For more details check out the [product page](http://ext.ensible.com/products/calendar/) or try the [online demos](http://ext.ensible.com/deploy/dev/examples/).

![Calendar Pro screenshot](http://ext.ensible.com/images/home-screenshot.gif)

## Licensing

Extensible is dual-licensed both commercially and under the open source GPL v3, [just like Ext JS](http://www.sencha.com/company/dual.php). For complete details see the [Extensible Licensing Overview](http://ext.ensible.com/products/licensing/). To purchase a commercial license or premium support please visit the [Extensible Store](http://ext.ensible.com/store/).

---

**Please note that if you use Extensible under the free GPL license, then your project must also be open source and must adhere to the rules of the [GPL](http://ext.ensible.com/products/gpl-v3.txt). If your project is commercial and/or closed source, a [commercial license](http://ext.ensible.com/store/) is required.**

[View GPL v3 license terms](gpl-v3.txt)

---

## Ext Version Support

Extensible fully supports **both Ext 3 and Ext 4**. Unfortunately since Ext 4 is not backwards-compatible it means that Extensible must be managed in two separate branches in order to maintain support for both versions of Ext. As long as Ext 3 is supported by Sencha, the Ext 3 compatible versions of all Extensible components will be maintained as well.

The default [master branch](https://github.com/bmoeskau/Extensible) is now only compatible with Ext 4, and all Extensible releases from 1.5 forward will be for Ext 4. The Extensible [1.x branch](https://github.com/bmoeskau/Extensible/tree/1.x) (less than 1.5) will remain as the Ext 3 compatible line of code.

## Getting Started

The easiest way to get started with Extensible is to download one of the [released packages](http://github.com/bmoeskau/Extensible/downloads), which already contain the fully-built distribution files and documentation, and unzip it into your local web root (required for Ajax requests to work). By default, all examples use a relative reference to the pre-built debug version of Extensible (`[Extensible]/lib/extensible-all-debug.js`) and a url to a recent version of Ext hosted on the Sencha CDN (e.g., `http://cdn.sencha.io/ext-4.0.7-gpl/`). As long as you have an internet connection, the examples should work out of the box.

## Configuration

As of Extensible 1.0.2 and 1.5.1 you can easily customize the framework paths for the examples (e.g., if you want to run a different version of Ext, or host it locally), or switch between running the pre-built versions of Extensible or using the Ext.Loader to dynamically load the individual Extensible classes (extremely useful if you have to step into Extensible code). For complete details on all options, see the source comments included in `Extensible-config.js`.

## Building from Source

### "Compiling" the Code

If you clone or fork the repository to use the most up-to-date code, you'll probably want to be able to rebuild the project yourself. Build scripts for both Mac/Unix (`build.sh`) and Windows (`build.bat`) are included in the `/build` folder, as well as a version of [JSBuilder](http://www.sencha.com/products/jsbuilder) and a `.jsb2` project file for Extensible.  You must have a current version of Java installed for JSBuilder to work.

By default, each build script uses the script file's location to reference other files relatively, so they should work as expected without modification. When you execute a build script (e.g., `sh build.sh` on the Mac/Unix command line, or just `build` on the Windows command line) it will build everything (minus docs) into a `/deploy` folder and also copy the `-all` and `-all-debug` files into the main `/lib` folder so that the examples will always have the latest code as well.

### Generating Docs

The jar file for the [Ext-doc](http://ext-doc.org/) utility is also included.  If you'd like to generate docs as part of your build, simply pass `-d` as a command line arg to the build script (e.g., `sh build.sh -d` or `build -d`) and the current documentation will also be created under `/docs`.

## Deployment

For use in your own application, you'll simply include the built framework files, just like any other typical Ext application dependencies. This could be your own custom-built files, if you've made any changes to the Extensible source. For example:

    <!-- Load the Ext and Extensible CSS -->
    <link rel="stylesheet" type="text/css" href="path/to/extjs/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="path/to/extensible/resources/css/extensible-all.css" />

    <!-- Load the Ext and Extensible deployment files -->
    <script type="text/javascript" src="path/to/extjs/ext-all[-debug].js"></script>
    <script type="text/javascript" src="path/to/extensible-all[-debug].js"></script>

    <!-- Include your app and any other app-specific files -->
    <script type="text/javascript" src="MyApp.js"></script>

## Upgrading from Extensible 1.x to 1.5+

Nothing about the Extensible API changed between 1.x and 1.5 except the naming/namespacing and organization of classes. No new functionality was introduced that was not directly relevant to supporting Ext 4.0. Because of this upgrading should not be difficult, but since almost every single class was renamed and/or reorganized (to be more consistent with Ext 4 and also to provide support for dynamic loading), you may find it initially tedious to get existing application code back up and running under Extensible 1.5+.

To ease this transition there is a compatibility file in the `/lib` folder called `extensible-1.0-compat.js` that provides all of the necessary class aliases to get Extensible 1.x code working under 1.5+. Simply include it right after your existing `extensible-all[-debug].js` reference. You should eventually update your own code with the new class names so that you can remove the compatibility file, but it will not hurt anything to run with it as needed.

## Additional Help

For questions about using Extensible, or to report bugs, visit the [Extensible forums](http://ext.ensible.com/forum/).

We also have [premium support subscriptions](http://ext.ensible.com/store/) available if you need more direct assistance, or would like to help support the project's continued development.