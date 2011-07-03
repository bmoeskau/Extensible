#
# --- EXPERIMENTAL! ---
#
# This is for building docs ONLY (not code) using JsDuck.
#
#   https://github.com/nene/jsduck
#
# In order to use this, JsDuck and all dependencies
# will have to be installed separately. Note also
# that Ext JS must be installed locally when using
# the default configuration below.
#
# In the future this script will be made more generic
# and configurable, but for now it is for testing only.
#

VER=extensible-1.5.0-beta1

EXTJS_SRC=$HOME/Projects/ext-4.0.2a/src
EXTENSIBLE_ROOT=$HOME/Projects/Extensible
EXTENSIBLE_OUTPUT=$EXTENSIBLE_ROOT/deploy

find $EXTENSIBLE_ROOT/src $EXTJS_SRC -name '*.js' | egrep -v 'locale/|test/|adapter/' | xargs jsduck -v -o $EXTENSIBLE_OUTPUT/$VER/ducks