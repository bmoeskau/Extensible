# The current version string, substituted into the build path below
VER=extensible-1.0-alpha1
EXTENSIBLE_ROOT=$HOME/Projects/Extensible
EXTENSIBLE_OUTPUT=$EXTENSIBLE_ROOT/deploy

# Build it
java -jar JSBuilder2.jar --projectFile $EXTENSIBLE_ROOT/extensible.jsb2 --homeDir  $EXTENSIBLE_OUTPUT

# Copy the deploy files back into dev so that the samples get the latest code
echo Updating dev...
cp  $EXTENSIBLE_OUTPUT/$VER/extensible-all.js  $EXTENSIBLE_ROOT
cp  $EXTENSIBLE_OUTPUT/$VER/extensible-all-debug.js  $EXTENSIBLE_ROOT
cp  $EXTENSIBLE_OUTPUT/$VER/resources/css/extensible-all.css  $EXTENSIBLE_ROOT/resources/css

# Docs - uncomment if you want these generated
#echo Generating docs...
#java -jar ext-doc.jar -p extensible.xml -o $EXTENSIBLE_OUTPUT/$VER/docs -t template/ext/template.xml -verbose

echo All done!