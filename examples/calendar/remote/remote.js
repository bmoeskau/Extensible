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

Ext.onReady(function(){

    // Settings for debugging PHP on the server:
    // Increase the timeout to allow enough time to debug and return a valid
    // response without timing out (set to 10 mins from default of 30 secs):
    //Ext.data.proxy.Ajax.prototype.timeout = 600000;
    Ext.Ajax.extraParams = {
        // Tell PHP to start a debugging session for an IDE to connect to.
        // This is passed as an additional parameter on each request:
        //XDEBUG_SESSION_START: 1
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
        id: 'calendar-remote',
        region: 'center',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Remote Calendar',
        showAgendaView: true,
        activeItem: 3 // month view
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
    
    // You can optionally call load() here if you prefer instead of using the
    // autoLoad config.  Note that as long as you call load AFTER the store
    // has been passed into the CalendarPanel the default start and end date parameters
    // will be set for you automatically (same thing with autoLoad:true).  However, if
    // you call load manually BEFORE the store has been passed into the CalendarPanel
    // it will call the remote read method without any date parameters, which is most
    // likely not what you'll want.
    // store.load({ ... });
    
    var errorCheckbox = Ext.get('forceError');
     
    var setRemoteErrorMode = function(){
        if(errorCheckbox.dom.checked){
            // force an error response to test handling of CUD (not R) actions. this param is
            // only implemented in the back end code for this sample -- it's not default behavior.
            eventStore.getProxy().extraParams.fail = true;
            cp.setTitle('Remote Calendar <span id="errTitle">(Currently in remote error mode)</span>');
        }
        else{
            delete eventStore.getProxy().extraParams.fail;
            cp.setTitle('Remote Calendar');
        }
    };
    
    setRemoteErrorMode();
    errorCheckbox.on('click', setRemoteErrorMode);
});