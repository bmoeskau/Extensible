#
# Execute the current Jasmine test suite via PhantomJS in the console.
# Obviously paths would change as needed.  Assumes PhantomJS is available
# in the system path and executable.
#
# Mainly intended for internal Extensible team usage, but included in case
# it's of interest to anyone else to see how we're testing things.
#

echo "*** Executing Jasmine suite via PhantomJS ***"
phantomjs phantom-jasmine.js http://projects.local/Extensible/test/unit/jasmine/