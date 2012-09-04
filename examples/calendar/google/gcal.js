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
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.google.EventMappings',
    'Extensible.calendar.google.CalendarProxy',
    'Extensible.calendar.data.EventStore',
    'Extensible.calendar.CalendarPanel'
]);

Ext.onReady(function(){
    
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
    
    var access_token = '';
    
    var eventStore = Ext.create('Extensible.calendar.data.EventStore', {
        //autoLoad: true,
        
        proxy: {
            type: 'extensible.googlecalendar',
            apiKey: 'AIzaSyB3JoleKFzjEQricJrXimhoHwkhLnbdSlg' // Read-only test API key provided by Google
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
    
    var loadStore = function() {
        var calendarId = Ext.getDom('calendarId').value;
        
        if (calendarId) {
            if (access_token) {
                eventStore.proxy.calendarId = calendarId;
                eventStore.proxy.setAuthToken(access_token);
                eventStore.removeAll();
                // Typically the store is loaded internally to the views, which set additional
                // params to restrict the query to the current view boundaries. Since we are
                // loading the store directly here, pass the view params manually.
                eventStore.load(calendarPanel.getActiveView().getStoreParams());
            }
            else {
                authenticate();
            }
        }
    }
    
    var authenticate = function() {
        var url = 'https://accounts.google.com/o/oauth2/auth' +
                  '?scope=https://www.googleapis.com/auth/calendar' +
                  '&client_id=997710304425.apps.googleusercontent.com' +
                  '&redirect_uri=http://localhost/Extensible/examples/calendar/google/oauth' +
                  '&response_type=token';
        
        var win = window.open(url, 'auth_window', 'width=800, height=600');

        var pollTimer = window.setInterval(function() {
            try {
                if (win.document.URL.indexOf('google/oauth') != -1) {
                    window.clearInterval(pollTimer);
                    
                    var params = {},
                        queryString = win.location.hash.substring(1),
                        regex = /([^&=]+)=([^&]*)/g,
                        m;
                        
                    while (m = regex.exec(queryString)) {
                        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                    }
                    
                    win.close();
                    access_token = params['access_token'];
                    validateToken();
                }
            }
            catch(ex) {}
        }, 100);
    }
    
    var validateToken = function() {
        if (access_token !== '') {
            Ext.Ajax.request({
                url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
                params : { 
                    access_token: access_token
                },
                method: 'POST',
                success: function (result, request) {
                    if (result.status === 200) {
                        var response = Ext.decode(result.responseText);
                        if (response.audience === '997710304425.apps.googleusercontent.com') { // must match client_id
                            loadStore();
                        }
                    }
                },
                failure: function (result, request) {
                    Ext.Msg.alert('Token Invalid');
                    console.dir(result);
                }
            });
        }
    }
    
    Ext.get('btn-load').on('click', loadStore);
    
    var calendarPanel = Ext.create('Extensible.calendar.CalendarPanel', {
        region: 'center',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Google Calendar',
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
        }, calendarPanel]
    });
});