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
    },
    
    // In real implementations the store is responsible for committing records
    // after a remote transaction has returned success = true. Since we never do
    // a real transaction, we never get any of the normal store callbacks telling
    // us that an edit occurred. This simple hack works around that for the purposes
    // of the local samples, but should NEVER actually be done in real code.
    afterEdit : function(rec){
        rec.commit();
    },
    
    listeners: {
        // Since MemoeryProxy has no "create" implementation, added events
        // get stuck as phantoms without an EventId. The calendar does not support
        // batching transactions and expects records to be non-phantoms, so for
        // the purpose of local samples we can hack that into place. In real remote
        // scenarios this is handled automatically by the store, and so you should
        // NEVER actually do something like this.
        'add': function(store, rec){
            var r = rec[0];
            r.data[Ext.ensible.cal.EventMappings.EventId.name] = r.id;
            r.phantom = false;
            r.commit();
        }
    }
});