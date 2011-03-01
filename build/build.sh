# The current version string, substituted into the build path below
VER=extensible-1.0
EXTENSIBLE_ROOT=$HOME/Projects/Extensible
EXTENSIBLE_OUTPUT=$EXTENSIBLE_ROOT/deploy
docs=

function usage {
    echo "usage: sh build.sh [-d|--docs]"
	echo
	echo "       -d|-docs: Include updated docs in the output"
	echo
}

while [ "$1" != "" ]; do
    case $1 in
        -d| --docs )            shift
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
java -jar JSBuilder2.jar --projectFile $EXTENSIBLE_ROOT/extensible.jsb2 --homeDir $EXTENSIBLE_OUTPUT

# Copy the deploy files back into dev so that the samples get the latest code
echo Updating dev...
cp $EXTENSIBLE_OUTPUT/$VER/extensible-all.js $EXTENSIBLE_ROOT
cp $EXTENSIBLE_OUTPUT/$VER/extensible-all-debug.js $EXTENSIBLE_ROOT
cp $EXTENSIBLE_OUTPUT/$VER/resources/css/extensible-all.css $EXTENSIBLE_ROOT/resources/css

# Copy other resource files to output
cp $EXTENSIBLE_ROOT/*.textile $EXTENSIBLE_OUTPUT/$VER/
cp $EXTENSIBLE_ROOT/*.txt $EXTENSIBLE_OUTPUT/$VER/
cp $EXTENSIBLE_ROOT/*.html $EXTENSIBLE_OUTPUT/$VER/

# Docs
if [ "$docs" = "1" ]; then
	echo Generating docs...
	java -jar ext-doc.jar -p extensible.xml -o $EXTENSIBLE_OUTPUT/$VER/docs -t template/ext/template.xml
fi

echo All done!