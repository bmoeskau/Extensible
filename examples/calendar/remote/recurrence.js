Ext.Loader.setConfig({
    enabled: true,
    //disableCaching: false,
    paths: {
        "Extensible": "../../../src",
        "Extensible.example": "../../"
    }
});
Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.data.proxy.Rest',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.data.EventStore',
    'Extensible.calendar.CalendarPanel'
]);

Ext.onReady(function() {

    // Settings for debugging PHP on the server:
    // Increase the timeout to allow enough time to debug and return a valid
    // response without timing out (set to 10 mins from default of 30 secs):
    //Ext.data.proxy.Ajax.prototype.timeout = 600000;
    Ext.Ajax.extraParams = {
        // Tell PHP to start a debugging session for an IDE to connect to.
        // This is passed as an additional parameter on each request:
        //XDEBUG_SESSION_START: 1,
        
        // Slight hack just so that we can reuse the same demo server code
        // with persistence across multiple examples so that each example gets
        // its own unique data set:
        app_id: 'recurrence'
    };
    
    // Set up mappings to match the DB column names as defined in examples/server/setup.sql
    Extensible.calendar.data.EventMappings = {
        EventId:     {name: 'EventId', mapping:'id', type:'string'},
        CalendarId:  {name: 'CalendarId', mapping: 'calendar_id', type: 'string'},
        Title:       {name: 'Title', mapping: 'title'},
        StartDate:   {name: 'Start', mapping: 'start', type: 'date', dateFormat: 'c'},
        EndDate:     {name: 'End', mapping: 'end', type: 'date', dateFormat: 'c'},
        Location:    {name: 'Location', mapping: 'location'},
        Notes:       {name: 'Notes', mapping: 'notes'},
        Url:         {name: 'Url', mapping: 'url'},
        IsAllDay:    {name: 'IsAllDay', mapping: 'all_day', type: 'boolean'},
        Reminder:    {name: 'Reminder', mapping: 'reminder'},
        
        // NOTE that since we want recurrence support in this demo, we must also include
        // the recurrence-specific data mappings. Typically RRule and Duration are the only
        // values that need to be persisted and returned with events, and they are the only ones
        // mapped to columns in the MySQL database:
        RRule:    {name: 'RRule', mapping: 'rrule', type: 'string', useNull: true},
        Duration: {name: 'Duration', mapping: 'duration', defaultValue: -1, useNull: true, type: 'int'},
        
        // These additional values are required for processing recurring events properly,
        // but are either calculated or used only during editing. They still must be mapped
        // to whatever the server expects, but typically aren't persisted in the DB. For additional
        // details see the comments in src/calendar/data/EventMappings.
        OriginalEventId:    {name: 'OriginalEventId', mapping: 'origid', type: 'string', useNull: true},
        RSeriesStartDate:   {name: 'RSeriesStartDate', mapping: 'rsstart', type: 'date', dateFormat: 'c', useNull: true},
        RInstanceStartDate: {name: 'RInstanceStartDate', mapping: 'ristart', type: 'date', dateFormat: 'c', useNull: true},
        REditMode:          {name: 'REditMode', mapping: 'redit', type: 'string', useNull: true}
    };
    Extensible.calendar.data.EventModel.reconfigure();
    
    // Calendars are loaded remotely from a static JSON file
    var calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../data/calendars.json',
            noCache: false,
            
            reader: {
                type: 'json',
                root: 'calendars'
            }
        }
    });
    
    // Events are loaded remotely via Ajax. For simplicity in this demo we use simple param-based
    // actions, although you could easily use REST instead, swapping out the proxy type below.
    // The event data will still be passed as JSON in the request body.
    var apiBase = '../../server/php/api/events-recurrence.php?action=';
    
    var eventStore = Ext.create('Extensible.calendar.data.EventStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            noCache: false,
            pageParam: null,
            startParam: null,
            limitParam: null,
            
            api: {
                read:    apiBase + 'load',
                create:  apiBase + 'add',
                update:  apiBase + 'update',
                destroy: apiBase + 'delete'
            },
            reader: {
                type: 'json',
                root: 'data'
            },
            writer: {
                type: 'json',
                nameProperty: 'mapping'
            }
        },

        // It's easy to provide generic CRUD messaging without having to handle events on every individual view.
        // Note that while the store provides individual add, update and remove events, those fire BEFORE the
        // remote transaction returns from the server -- they only signify that records were added to the store,
        // NOT that your changes were actually persisted correctly in the back end. The 'write' event is the best
        // option for generically messaging after CRUD persistence has succeeded.
        listeners: {
            'write': function(store, operation) {
                var title = Ext.value(operation.records[0].data[Extensible.calendar.data.EventMappings.Title.name], '(No title)');
                switch(operation.action){
                    case 'create':
                        Extensible.example.msg('Add', 'Added "' + title + '"');
                        break;
                    case 'update':
                        Extensible.example.msg('Update', 'Updated "' + title + '"');
                        break;
                    case 'destroy':
                        Extensible.example.msg('Delete', 'Deleted "' + title + '"');
                        break;
                }
            }
        }
    });
    
    // This is the code for the entire UI:
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            title: 'Example Overview',
            region: 'west',
            width: 280,
            collapsible: true,
            split: true,
            autoScroll: true,
            contentEl: 'sample-overview' // from recurrence.html
        },{
            xtype: 'extensible.calendarpanel',
            id: 'calendar-recurrence',
            region: 'center',
            eventStore: eventStore,
            calendarStore: calendarStore,
            title: 'Recurrence Calendar',
            showAgendaView: true,
            showListView: true,

            agendaViewCfg: {
                linkDatesToDayView: true,
                dateRangeDefault: '3months'
            },

            listViewCfg: {
                linkDatesToDayView: true,
                dateRangeDefault: '3months',
                groupBy: 'week'
            },
            
    
            // This is the magical config that enables the recurrence edit
            // widget to appear in the event form. Without it, any existing
            // recurring events sent from the server will still be rendered
            // correctly, but they would be non-editable without this config.
            // This is disabled by default since recurrence requires explicit
            // back end implementation for proper editing support.
            recurrence: true
        }]
    });
});