
Ext.onReady(function(){
    
    var today = new Date().clearTime();
        apiRoot = 'remote/php/app.php/events/';
    
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
                Ext.Msg.alert('Error', msg);
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
        autoLoad: true
    });
    
    var cp = new Ext.ensible.cal.CalendarPanel({
        id: 'calendar-remote',
        eventStore: store,
        renderTo: 'remote',
        title: 'Remote Calendar',
        width: 900,
        height: 600
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