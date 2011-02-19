/*
 * This is a simple in-memory store implementation that is ONLY intended for use with
 * calendar samples running locally in the browser with no external data source. Under
 * normal circumstances, stores that use a MemoryProxy are read-only and intended only
 * for displaying data read from memory. In the case of the calendar, it's still quite
 * useful to be able to deal with in-memory data for sample purposes (as many people 
 * may not have PHP set up to run locally), but by default, updates will not work since the
 * calendar fully expects all CRUD operations to be supported by the store (and in fact
 * will break, for example, if phantom records are not removed properly). This simple
 * class gives us a convenient way of loading and updating calendar event data in memory,
 * but should NOT be used outside of the local samples. 
 * 
 * For a real-world store implementation see the remote sample (remote.js).
 */
Ext.ensible.sample.MemoryEventStore = Ext.extend(Ext.data.Store, {
    // private
    constructor: function(config){
        config = Ext.applyIf(config || {}, {
            storeId: 'eventStore',
            root: 'evts',
            proxy: new Ext.data.MemoryProxy(),
            writer: new Ext.data.DataWriter(),
            fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange(),
            idProperty: Ext.ensible.cal.EventMappings.EventId.mapping || 'id'
        });
        this.reader = new Ext.data.JsonReader(config);
        Ext.ensible.sample.MemoryEventStore.superclass.constructor.call(this, config);
        
        // By default this shared example store will monitor its own CRUD events and 
        // automatically show a page-level message for each event. This is simply a shortcut
        // so that each example doesn't have to provide its own messaging code, but this pattern
        // of handling messages at the store level could easily be implemented in an application
        // (see the source of test-app.js for an example of this). The autoMsg config is provided
        // to turn off this automatic messaging in any case where this store is used but the 
        // default messaging is not desired.
        if(config.autoMsg !== false){
            // Note that while the store provides individual add, update and remove events, those only 
            // signify that records were added to the store, NOT that your changes were actually 
            // persisted correctly in the back end (in remote scenarios). While this isn't an issue
            // with the MemoryProxy since everything is local, it's still harder to work with the 
            // individual CRUD events since they have different APIs and quirks (notably the add and 
            // update events both fire during record creation and it's difficult to differentiate a true
            // update from an update caused by saving the PK into a newly-added record). Because of all
            // this, in general the 'write' event is the best optiosn for generically messaging after 
            // CRUD persistance has actually succeeded.
            this.on('write', this.onWrite, this);
        }
    },
    
    // private
    onWrite: function(store, action, data, resp, rec){
        if(Ext.ensible.sample.msg){
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
    },

    // private
    onCreateRecords : function(success, rs, data) {
        // Since MemoeryProxy has no "create" implementation, added events
        // get stuck as phantoms without an EventId. The calendar does not support
        // batching transactions and expects valid records to be non-phantoms, so for
        // the purpose of local samples we can hack that into place. In real remote
        // scenarios this is handled either automatically by the store or by your own
        // application CRUD code, and so you should NEVER actually do something like this.
        rs.phantom = false;
        rs.data[Ext.ensible.cal.EventMappings.EventId.name] = rs.id;
        rs.commit();
    }
});