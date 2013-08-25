# Setup for Remote Demos

All remote demos now share the same server code stored under `examples/server/[lang]` (currently PHP only, though other language examples may be added in the future).

To set up the back end:

 - You must set up a local database. The script `setup.sql` in this folder was exported from MySQL. You should be able to create an empty MySQL database with your own credentials and run that script and it will create all of the necessary tables
 - To tell the demos how to connect to your db, edit `server/php/config-template.php` as needed and rename it to `config.php`
 
After doing that, your demos should be up and running.