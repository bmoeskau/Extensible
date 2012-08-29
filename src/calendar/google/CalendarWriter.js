Ext.define('Extensible.calendar.google.CalendarWriter', {
    extend: 'Ext.data.writer.Json',
    alias : 'writer.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.EventMappings'
    ],
    
    writeAllFields: false,
    
    nameProperty: 'mapping',
    
    writeRecords: function(request, data) {
        
        return this.callParent(arguments);
    }
});