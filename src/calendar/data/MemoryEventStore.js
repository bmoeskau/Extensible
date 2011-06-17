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
Ext.define('Extensible.calendar.data.MemoryEventStore', {
    extend: 'Ext.data.Store',
    model: 'Extensible.calendar.data.EventModel',
    
    requires: [
        'Extensible.calendar.data.EventModel',
        'Extensible.calendar.data.EventMappings'
    ],
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'evts'
        },
        writer: {
            type: 'json'
        }
    },
    
//    sorters: [{
//        property: Extensible.calendar.data.EventMappings.StartDate.name,
//        direction: 'ASC'
//    }],
//    
//    //storeId: 'eventStore',
//    idProperty: Extensible.calendar.data.EventMappings.EventId.mapping || 'id',
//    fields: Extensible.calendar.data.EventModel.prototype.fields.getRange(),
    
    // private
    constructor: function(config){
        this.callParent(arguments);
        
        this.sorters = this.sorters || [{
            property: Extensible.calendar.data.EventMappings.StartDate.name,
            direction: 'ASC'
        }];
        
        this.idProperty = this.idProperty || Extensible.calendar.data.EventMappings.EventId.mapping || 'id',
        
        this.fields = Extensible.calendar.data.EventModel.prototype.fields.getRange();
        
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
            // this, in general the 'write' event is the best option for generically messaging after 
            // CRUD persistance has actually succeeded.
            this.on('write', this.onWrite, this);
        }
        
        this.autoMsg = config.autoMsg;
        this.onCreateRecords = Ext.Function.createInterceptor(this.onCreateRecords, this.interceptCreateRecords);
        this.initRecs();
    },
    
    // private - override to make sure that any records added in-memory
    // still get a unique PK assigned at the data level
    interceptCreateRecords: function(records, operation, success) {
        if (success) {
            var i = 0,
                rec,
                len = records.length;
            
            for (; i < len; i++) {
                records[i].data[Extensible.calendar.data.EventMappings.EventId.name] = records[i].id;
            }
        }
    },
    
    // If the store started with preloaded inline data, we have to make sure the records are set up
    // properly as valid "saved" records otherwise they may get "added" on initial edit.
    initRecs: function(){
        this.each(function(rec){
            rec.store = this;
            rec.phantom = false;
        }, this);
    },
    
    // private
    onWrite: function(store, operation) {
        var me = this;
        
//        if(Extensible.sample.msg) {
//            var success = operation.wasSuccessful(),
//                rec = operation.getRecords()[0],
//                title = rec.data[Extensible.calendar.data.EventMappings.Title.name];
//    
//            switch (operation.action) {
//                case 'create':
//                    Extensible.sample.msg('Add', 'Added "' + Ext.value(title, '(No title)') + '"');
//                    break;
//                case 'update':
//                    Extensible.sample.msg('Update', 'Updated "' + Ext.value(title, '(No title)') + '"');
//                    break;
//                case 'destroy':
//                    Extensible.sample.msg('Delete', 'Deleted "' + Ext.value(title, '(No title)') + '"');
//                    break;
//            }
//        }
    },
    
    // private - override the default logic for memory storage
    onProxyLoad: function(operation) {
        var me = this,
            records;
        
        if (me.data && me.data.length > 0) {
            // this store has already been initially loaded, so do not reload
            // and lose updates to the store, just use store's latest data
            me.totalCount = me.data.length;
            records = me.data.items;
        }
        else {
            // this is the initial load, so defer to the proxy's result
            var resultSet = operation.getResultSet(),
                successful = operation.wasSuccessful();

            records = operation.getRecords();

            if (resultSet) {
                me.totalCount = resultSet.total;
            }
            if (successful) {
                me.loadRecords(records, operation);
            }
        }

        me.loading = false;
        me.fireEvent('load', me, records, successful);
    }
});