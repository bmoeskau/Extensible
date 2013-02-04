#
# Execute the current Siesta test suite via PhantomJS in the console.
# Obviously paths would change as needed, and the paid version of
# Siesta is required to do this (you can run the web harness freely).
#
# More info here: http://www.bryntum.com/docs/siesta/#!/guide/siesta_automation
#
# Mainly intended for internal Extensible team usage, but included in case
# it's of interest to anyone else to see how we're testing things.
#

echo "*** Executing Siesta suite via PhantomJS ***"

# Pass through any command line args, e.g. --verbose
# Currently only handles up to 9 args, because I am lazy.
~/Dropbox/Projects/Lib/Bryntum/Siesta/1.1.8/bin/phantomjs http://projects.local/Extensible/test/unit/siesta/ "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8" "$9"