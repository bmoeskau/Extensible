#
# This is for building docs ONLY (not code) using JsDuck.
#
#   https://github.com/senchalabs/jsduck
#
# In order to use this, JsDuck and all dependencies
# will have to be installed separately. Note also
# that Ext JS must be installed locally when using
# the default configuration below, and the path set.
#

VER=extensible-1.6.0-b1

EXTJS_SRC="../../Lib/Sencha/Ext/4.2.0/src/"
EXTENSIBLE_ROOT="`dirname "$0"`/.."
EXTENSIBLE_OUTPUT=$EXTENSIBLE_ROOT/deploy

jsduck $EXTENSIBLE_ROOT/src --output $EXTENSIBLE_OUTPUT/$VER/docs