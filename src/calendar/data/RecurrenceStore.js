Ext.define('Extensible.calendar.data.RecurrenceStore', {
    extend: 'Ext.data.Store',
    model: 'Extensible.calendar.data.RecurrenceModel',
    
    requires: [
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'Extensible.calendar.data.RecurrenceModel'
    ],
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'recurrence'
        }
    },

    initComponent: function() {
        //this.idProperty = this.idProperty || Extensible.calendar.data.CalendarMappings.CalendarId.name || 'id';
        
        this.fields = Extensible.calendar.data.RecurrenceModel.prototype.fields.getRange();
        
        this.callParent(arguments);
    }
});