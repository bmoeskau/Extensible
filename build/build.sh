# The current version string, substituted into the build path below
VER=extensible-1.5.0
EXTENSIBLE_ROOT="`dirname "$0"`/.."
EXTENSIBLE_OUTPUT=$EXTENSIBLE_ROOT/deploy

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

# Build it
java -jar $EXTENSIBLE_ROOT/build/JSBuilder2.jar --projectFile $EXTENSIBLE_ROOT/extensible.jsb2 --homeDir $EXTENSIBLE_OUTPUT

# Copy the Extensible class definition to the root as extensible.js for dynamic loading support
cp $EXTENSIBLE_ROOT/src/Extensible.js $EXTENSIBLE_OUTPUT/$VER/extensible.js

# Copy the deploy files back into dev so that the samples get the latest code
echo Updating dev...
cp $EXTENSIBLE_OUTPUT/$VER/extensible*.js $EXTENSIBLE_ROOT
cp $EXTENSIBLE_OUTPUT/$VER/resources/css/extensible-all.css $EXTENSIBLE_ROOT/resources/css

# Copy other resource files to output
cp $EXTENSIBLE_ROOT/*.js $EXTENSIBLE_OUTPUT/$VER/
cp $EXTENSIBLE_ROOT/*.html $EXTENSIBLE_OUTPUT/$VER/
cp $EXTENSIBLE_ROOT/*.css $EXTENSIBLE_OUTPUT/$VER/
cp $EXTENSIBLE_ROOT/*.txt $EXTENSIBLE_OUTPUT/$VER/
cp $EXTENSIBLE_ROOT/*.md $EXTENSIBLE_OUTPUT/$VER/

# Docs
if [ "$docs" = "1" ]; then
	echo Generating docs...
	java -jar $EXTENSIBLE_ROOT/build/ext-doc.jar -p $EXTENSIBLE_ROOT/build/extensible.xml -o $EXTENSIBLE_OUTPUT/$VER/docs -t $EXTENSIBLE_ROOT/build/template/ext/template.xml
fi

echo All done!
