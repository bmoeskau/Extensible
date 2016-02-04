#############################################
#
#  Extensible build script
#  by Extensible, LLC
#
#############################################

# Configuration
# The current version string, substituted into the build path below
VER=extensible-1.6.0-rc.2

# Default the root to the parent of the current \build folder
EXTENSIBLE_ROOT="`dirname "$0"`/.."

# Output everything here
EXTENSIBLE_OUTPUT=$EXTENSIBLE_ROOT/deploy

# Program start
function usage {
    echo "usage: sh build.sh [-d | --docs]"
    echo
    echo "       -d | --docs: Include updated docs in the output"
    echo
}

while [ "$1" != "" ]; do
    case $1 in
        -d | --docs )           shift
                                docs=1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

echo Preparing to build $VER from source $EXTENSIBLE_ROOT

# Any cleanup that needs to happen prior to the build
rm -rf $EXTENSIBLE_OUTPUT/$VER
rm $EXTENSIBLE_ROOT/resources/css/extensible-all.css

# Build it
java -jar $EXTENSIBLE_ROOT/build/resources/JSBuilder2.jar \
     --projectFile $EXTENSIBLE_ROOT/build/resources/extensible.jsb2 \
     --homeDir $EXTENSIBLE_OUTPUT

# Copy the Extensible class definition to /lib as extensible-bootstrap.js for dynamic loading support
cp $EXTENSIBLE_ROOT/src/Extensible.js $EXTENSIBLE_OUTPUT/$VER/lib/extensible-bootstrap.js

# Copy the deploy files back into dev so that the samples get the latest code
echo Copying output to $EXTENSIBLE_OUTPUT/$VER
cp $EXTENSIBLE_OUTPUT/$VER/lib/extensible-bootstrap.js $EXTENSIBLE_ROOT/lib
cp $EXTENSIBLE_OUTPUT/$VER/lib/extensible-all.js $EXTENSIBLE_ROOT/lib
cp $EXTENSIBLE_OUTPUT/$VER/lib/extensible-all-debug.js $EXTENSIBLE_ROOT/lib
cp $EXTENSIBLE_OUTPUT/$VER/resources/css/extensible-all.css $EXTENSIBLE_ROOT/resources/css

# Copy other resource files to output
cp $EXTENSIBLE_ROOT/Extensible-config.js $EXTENSIBLE_OUTPUT/$VER
cp $EXTENSIBLE_ROOT/lib/extensible-1.0-compat.js $EXTENSIBLE_OUTPUT/$VER/lib
cp $EXTENSIBLE_ROOT/*.html $EXTENSIBLE_OUTPUT/$VER
cp $EXTENSIBLE_ROOT/*.txt $EXTENSIBLE_OUTPUT/$VER
cp $EXTENSIBLE_ROOT/*.md $EXTENSIBLE_OUTPUT/$VER

# The example config.php file should not exist, make sure of it
rm $EXTENSIBLE_OUTPUT/$VER/examples/server/php/config.php

# The docs have now been converted to JSDuck. This assumes that JSDuck is installed
# correctly and available in the system path.
# - Installation: https://github.com/senchalabs/jsduck/wiki/Installation
# - Configuring this command: jsduck --help
if [ "$docs" = "1" ]; then
    echo Generating docs to $EXTENSIBLE_OUTPUT/$VER/docs
    jsduck $EXTENSIBLE_ROOT/src --output $EXTENSIBLE_OUTPUT/$VER/docs \
        --seo --builtin-classes \
        --head-html="<link rel='stylesheet' href='extensible-docs.css' type='text/css'>" \
        --message="Note that these docs have not yet been finalized for 1.6.0" \
        --title="Extensible Docs" \
        --footer="<a href='http://ext.ensible.com/'>Ext.ensible.com</a>" \
        --warnings=-all \
        --welcome="$EXTENSIBLE_ROOT/build/resources/welcome.html" \
        --examples="$EXTENSIBLE_ROOT/build/resources/examples.json" \
        --categories="$EXTENSIBLE_ROOT/build/resources/categories.json" \
        --examples-base-url="../examples" \
        --exclude=$EXTENSIBLE_ROOT/src/calendar/dd/CalendarScrollManager.js \
        --ignore-html=locale,debug

    cp $EXTENSIBLE_ROOT/build/resources/extensible-docs.css $EXTENSIBLE_OUTPUT/$VER/docs
fi

echo All done!
