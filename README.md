# Extensible

An [Ext JS](http://www.sencha.com/products/extjs) Component Library  
by Brian Moeskau

Currently includes Ext Calendar Pro and supporting components, more to come. See [ext.ensible.com](http://ext.ensible.com/) for complete details.

## Ext Versions Supported
Extensible now fully supports **both Ext 3 and Ext 4**. Unfortunately since Ext 4 is not backwards-compatible it means that Extensible must now be managed in 2 separate branches in order to maintain support for both versions of Ext. As long as Ext 3 is supported by Sencha, the Ext 3 compatible versions of all Extensible components will be maintained as well.

The default master branch is now only compatible with Ext 4, and all Extensible releases from 1.5 forward will be for Ext 4. The Extensible 1.x branch (less than 1.5) will remain as the Ext 3 compatible line of code.

## Licensing
Extensible is dual-licensed both commercially and under the open source GPL v3, [just like Ext JS](http://www.sencha.com/company/dual.php). For complete details see the [Extensible Licensing Overview](http://ext.ensible.com/products/licensing/). To purchase a commercial license or premium support please visit the [Extensible Store](http://ext.ensible.com/store/).

**Please note that if you use Extensible under the free GPL license, then your project must also be open source and must adhere to the rules of the [GPL](http://ext.ensible.com/products/gpl-v3.txt). If your project is commercial and/or closed source, a [commercial license](http://ext.ensible.com/store/) is required.**

## Building the Source
Build scripts for both Mac/Unix (`build/build.sh`) and Windows (`build/build.bat`) are included.  You must have a current version of Java installed for JSBuilder to work.  You should also edit the build script and update the path variables as needed for your system.

If you run the build script (e.g., `sh build.sh` in the Mac terminal, or just `build` on the Windows command line) it will build everything (minus docs), create a `/deploy` folder and also place the `*-all` files in the root folder.  The jar file for the Ext-doc tool ([http://ext-doc.org/](http://ext-doc.org/)) is also included.  If you'd like to generate docs also, simply pass `-d` as a command line arg to the build script (e.g., `sh build.sh -d` or `build -d`).

**NOTE:** If you would prefer not to build the source yourself, you can always [download](http://github.com/bmoeskau/Extensible/downloads) the most current stable build, though it may not have the latest available fixes.

## Installation
Extensible 1.x links to cachefly for all Ext 3.x resources, so the examples should simply run as-is out of the box.

Extensible 1.5.x requires the Ext JS framework locally since it now supports full dynamic loading (version 4.0 or later, 4.0.2+ strongly preferred). You should download the [latest version](http://www.sencha.com/products/js/download.php) of Ext JS and install Extensible in a sibling directory. By default the Extensible examples look for Ext JS to be installed in a folder at the same level as Extensible named "extjs". You can adjust the example paths as needed, or preferably you can set up a matching symlink or rewrite rule (when used via HTTP) so that you can easily map the latest version of Ext JS at any future time to the "extjs" location without touching the examples.

Here is an example of a simple .htaccess file that will silently rewrite any resource under "extjs" to the physical folder "ext-4.0.2" (which could be any valid path name):

	RewriteEngine on
	RewriteRule ^extjs/(.*)$ ext-4.0.2/$1

## Usage (Extensible 1.x / Ext 3.x)

To use Extensible in your Ext JS 3.x application simply include the Extensible JS and CSS files after the standard Ext JS includes. For example:

    <!-- Ext JS includes -->
    <link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-3.2.0/resources/css/ext-all.css" />
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.2.0/adapter/ext/ext-base-debug.js"></script>
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.2.0/ext-all-debug.js"></script>

    <!-- Extensible includes -->
    <link rel="stylesheet" type="text/css" href="path/to/extensible-all.css" />
    <script type="text/javascript" src="path/to/extensible-all-debug.js"></script>

During development you should include `extensible-all-debug.js`, but then for deployment use the minimized `extensible-all.js`.  If you are using individual source files then it's up to you to include them all, in the proper order. Look under the `/examples` folder to get a jump start on how to use the included components.

## Usage (Extensible 1.5.x / Ext 4.x)

Ext 4 now supports dynamic loading of classes at runtime, which is usually preferable during development. For production deployment, you will still want to use the built versions of both Ext JS and Extensible. For a detailed overview of this topic see Sencha's official [Ext JS Getting Started Guide](http://docs.sencha.com/ext-js/4-0/#/guide/getting_started).

### Development
By default all Extensible examples are set up to use dynamic loading since they will only be used in development mode. You can view any example to see how this is set up. It will look something like this:

    <!-- Load the Ext and Extensible CSS -->
    <link rel="stylesheet" type="text/css" href="path/to/extjs/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="path/to/extensible/resources/css/extensible-all.css" />

    <!-- Load the Ext and Extensible bootstrap files -->
    <script type="text/javascript" src="path/to/extjs/ext-debug.js"></script>
    <script type="text/javascript" src="path/to/Extensible.js"></script>

    <!-- Enable the Ext.Loader with any paths needed to map 
         Extensible and any other app classes you may have -->
    <script type="text/javascript">
        Ext.Loader.setConfig({
            enabled: true,
            paths: {
                'Extensible': 'path/to/extensible/src'
            }
        });
    </script>

    <!-- Include your app and any other app-specific files.
         The app entry point will include app-specific dependency 
         declarations and should run inside an Ext.onReady block -->
    <script type="text/javascript" src="MyApp.js"></script>

If you get errors in the console that certain classes could not be loaded, double-check that the Ext.Loader path(s) are valid and accessible from your app's location.

### Deployment
The **TestApp** example (`examples/calendar/TestApp/`) also shows sample includes for deployment in the HTML file's `HEAD`, commented out by default. Instead of using Ext.Loader, you'll simply include the built (and minimized if necessary) framework files directly, similar to how it was always done in Ext 3.x. This could also be your own custom build files, if applicable. For example:

    <!-- Load the Ext and Extensible CSS -->
    <link rel="stylesheet" type="text/css" href="path/to/extjs/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="path/to/extensible/resources/css/extensible-all.css" />

    <!-- Load the Ext and Extensible deployment files -->
    <script type="text/javascript" src="path/to/extjs/ext-all-debug.js"></script>
    <script type="text/javascript" src="path/to/extensible-all-debug.js"></script>

    <!-- Include your app and any other app-specific files -->
    <script type="text/javascript" src="MyApp.js"></script>

## Upgrading from Extensible 1.x to 1.5
Nothing about the Extensible API changed between 1.x and 1.5 except the naming/namespacing and organization of classes. No new functionality was introduced that was not directly relevant to supporting Ext 4.0. Because of this upgrading should not be difficult, but since almost every single class was renamed and/or reorganized (to be more consistent with Ext 4 and also to provide support for dynamic loading), you may find it initially tedious to get existing application code back up and running under Extensible 1.5.

To ease this transition there is a compatibility file in the project root called `extensible-1.0-compat.js` that provides all of the necessary class aliases to get Extensible 1.x code working under 1.5. Simply include it right after your existing `extensible-all(-debug).js` include. You should eventually update your own code with the new class names so that you can remove the compat file, but it will not hurt anything to run with it as needed.

## Support
For help in setting up or using this library, or to report bugs, visit the [Extensible forums](http://ext.ensible.com/forum/).

We also have [premium support subscriptions](http://ext.ensible.com/store/) available if you need access to more direct assistance.

[View GPL v3 license terms](gpl-v3.txt)