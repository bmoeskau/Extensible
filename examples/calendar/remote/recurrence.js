Ext.Loader.setConfig({
    enabled: true,
    //disableCaching: false,
    paths: {
        "Extensible": "../../../src",
        "Extensible.example": "../../"
    }
});
Ext.require([
    'Ext.Viewport',
    'Ext.layout.container.Border',
    'Ext.data.proxy.Rest',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.data.EventStore',
    'Extensible.calendar.CalendarPanel'
]);

Ext.onReady(function () {

    // Settings for debugging PHP on the server:
    // Increase the timeout to allow enough time to debug and return a valid
    // response without timing out (set to 10 mins from default of 30 secs):
    //Ext.data.proxy.Ajax.prototype.timeout = 600000;
    Ext.Ajax.extraParams = {
        // Tell PHP to start a debugging session for an IDE to connect to.
        // This is passed as an additional parameter on each request:
        //XDEBUG_SESSION_START: 1,
        // Slight hack just so that we can reuse the existing remote PHP code,
        // but load a recurrence-friendly default data set the first time:
        app_id: 'recurrence_example'
    };

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
    
    var eventStore = Ext.create('Extensible.calendar.data.EventStore', {
        autoLoad: true,
        proxy: {
            type: 'rest',
            url: 'php/app.php/events',
            noCache: false,
            
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
            'write': function(store, operation){
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
    
    var cp = Ext.create('Extensible.calendar.CalendarPanel', {
        id: 'calendar-recurrence',
        region: 'center',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Recurrence Calendar',
        showAgendaView: true,
        activeItem: 3, // month view

        // This is the magical config that enables the recurrence edit
        // widget to appear in the event form. Without it, any existing
        // recurring events sent from the server will still be rendered
        // correctly, but they would be non-editable without this config.
        // This is disabled by default since recurrence requires explicit
        // back end implementation for proper editing support.
        recurrence: true
    });
    
    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [{
            title: 'Example Overview',
            region: 'west',
            width: 280,
            collapsible: true,
            split: true,
            autoScroll: true,
            contentEl: 'sample-overview'
        }, cp]
    });
});