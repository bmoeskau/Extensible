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

# Default:
~/Dropbox/Projects/Lib/Bryntum/Siesta/1.1.8/bin/phantomjs http://projects.local/Extensible/test/unit/siesta/

# In case of errors:
#~/Dropbox/Projects/Lib/Bryntum/Siesta/1.1.8/bin/phantomjs http://projects.local/Extensible/test/unit/siesta/ --verbose