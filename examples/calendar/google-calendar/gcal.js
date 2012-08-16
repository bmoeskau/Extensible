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
    
    Ext.apply(Extensible.calendar.data.EventMappings, {
        Title: {
            name: 'Title',
            mapping: 'summary',
            type: 'string'
        },
        StartDate: {
            name: 'StartDate',
            mapping: 'start.date',
            type: 'date'
        },
        EndDate: {
            name: 'EndDate',
            mapping: 'end.date',
            type: 'date'
        }
    });
    
    Extensible.calendar.data.EventModel.reconfigure();
    
    Ext.define('Extensible.calendar.plugins.gcal.GoogleCalendarReader', {
        extend: 'Ext.data.reader.Json',
        alias : 'reader.extensible.googlecalendar',
    
        root: 'items',
        
        readRecords: function(data) {
            var resultSet = this.callParent([data]),
                headerData = {}
            
            // Append the header fields returned as part of the event list to the
            // returned resultSet so they'll be available for future processing:
            for (item in data) {
                if (data.hasOwnProperty(item) && item !== 'items') {
                    headerData[item] = data[item];
                }
            }
            
            resultSet.headerData = headerData;
            
            return resultSet;
        }
    });
    
    Ext.define('Extensible.calendar.plugins.gcal.GoogleCalendarProxy', {
        extend: 'Ext.data.proxy.Rest',
        alias: 'proxy.extensible.googlecalendar',
        
        reader: 'extensible.googlecalendar',
        
        writer: {
            type: 'json',
            nameProperty: 'mapping'
        },
        
        calendarId: undefined,
        
        apiKey: undefined,
        
        apiMethod: 'events',
        
        url: 'https://www.googleapis.com/calendar/v3/calendars',
        
        apiKeySeparator: '?key=',
        
        buildUrl: function(request) {
            var me        = this,
                operation = request.operation,
                records   = operation.records || [],
                record    = records[0],
                url       = me.getUrl(request),
                id        = record ? record.getId() : operation.id;
            
            // Google's version 3 calendar url format:
            // https://www.googleapis.com/calendar/v3/calendars/{calendarId}/{apiMethod}?key={apiKey}
            
            // First clean the end of the base url in case it was customized
            // (make sure we have a trailing /):
            if (!url.match(/\/$/)) {
                url += '/';
            }
            
            // Append the calendar id and api method, both required:
            url += me.calendarId + '/' + me.apiMethod;
            
            // Append the item's id, if needed:
            if (me.appendId && id) {
                url += '/' + id;
            }
            
            // API key is optional, append if specified.
            // NOTE that this must always be last after all elements of the REST url:
            if (me.apiKey) {
                url += me.apiKeySeparator + me.apiKey;
            }
            
            request.url = url;
            
            return me.callParent(arguments);
        }
    });

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
            type: 'extensible.googlecalendar',
            apiKey: 'AIzaSyB3JoleKFzjEQricJrXimhoHwkhLnbdSlg',
            calendarId: 'en.usa%23holiday%40group.v.calendar.google.com' // US Holidays
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
        region: 'center',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Google Calendar'
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