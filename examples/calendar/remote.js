
Ext.onReady(function(){
    
    var today = new Date().clearTime();
        apiRoot = 'remote/php/app.php/events/';
    
    Ext.Msg.minWidth = 300;
    
    var proxy = new Ext.data.HttpProxy({
        disableCaching: false, // no need for cache busting when loading via Ajax
        api: {
            read:    apiRoot+'view',
            create:  apiRoot+'create',
            update:  apiRoot+'update',
            destroy: apiRoot+'destroy'
        },
        listeners: {
            exception: function(proxy, type, action, o, res, arg){
                var msg = res.message ? res.message : Ext.decode(res.responseText).message;
                // ideally an app would provide a less intrusive message display
                Ext.Msg.alert('Server Error', msg);
            }
        }
    });
    
    var reader = new Ext.data.JsonReader({
        totalProperty: 'total',
        successProperty: 'success',
        idProperty: 'id',
        root: 'data',
        messageProperty: 'message',
        fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange()
    });
    
    var writer = new Ext.data.JsonWriter({
        encode: true,
        writeAllFields: false
    });
    
    var store = new Ext.ensible.cal.EventStore({
        id: 'event-store',
        restful: true,
        proxy: proxy,
        reader: reader,
        writer: writer,
        // the view will automatically set start / end date params for you. You can
        // also pass a valid config object as specified by Ext.data.Store.load()
        // and the start / end params will be appended to it.
        autoLoad: true,
        
        // It's easy to provide generic CRUD messaging without having to handle events on every individual view.
        // Note that while the store provides individual add, update and remove events, those fire BEFORE the
        // remote transaction returns from the server -- they only signify that records were added to the store,
        // NOT that your changes were actually persisted correctly in the back end. The 'write' event is the best
        // option for generically messaging after CRUD persistance has succeeded.
        listeners: {
            'write': function(store, action, data, resp, rec){
                switch(action){
                    case 'create': 
                        Ext.ensible.sample.msg('Add', 'Added "' + Ext.value(rec.data[Ext.ensible.cal.EventMappings.Title.name], '(No title)') + '"');
                        break;
                    case 'update':
                        Ext.ensible.sample.msg('Update', 'Updated "' + Ext.value(rec.data[Ext.ensible.cal.EventMappings.Title.name], '(No title)') + '"');
                        break;
                    case 'destroy':
                        Ext.ensible.sample.msg('Delete', 'Deleted "' + Ext.value(rec.data[Ext.ensible.cal.EventMappings.Title.name], '(No title)') + '"');
                        break;
                }
            }
        }
    });
    
    // Let's load the calendar store remotely also. All you have to do to get
    // color-coding is include this store with the CalendarPanel.
    var calendarStore = new Ext.data.JsonStore({
        storeId: 'calendarStore',
        url: 'data/calendars.json',
        root: 'calendars',
        autoLoad: true,
        idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.mapping || 'id',
        fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange(),
        remoteSort: true,
        sortInfo: {
            field: Ext.ensible.cal.CalendarMappings.Title.name,
            direction: 'ASC'
        }
    });
    
    var cp = new Ext.ensible.cal.CalendarPanel({
        id: 'calendar-remote',
        eventStore: store,
        calendarStore: calendarStore,
        renderTo: 'cal',
        title: 'Remote Calendar',
        width: 900,
        height: 700
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
            store.setBaseParam('fail', true);
            cp.setTitle('Remote Calendar <span id="errTitle">(Currently in remote error mode)</span>');
        }
        else{
            delete store.baseParams['fail'];
            cp.setTitle('Remote Calendar');
        }
    };
    
    setRemoteErrorMode();
    errorCheckbox.on('click', setRemoteErrorMode);
});