Ext.define('Extensible.calendar.google.CalendarWriter', {
    extend: 'Ext.data.writer.Json',
    alias : 'writer.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.EventMappings'
    ],
    
    writeAllFields: false,
    
    nameProperty: 'mapping',
    
    writeRecords: function(request, data) {
        if (request.action === 'destroy') {
            // The parent implementation adds any modified data from the record into the JSON
            // body sent in the request. For DELETE, by default it adds the event id.
            // Unfortunately, though request bodies in DELETEs are technically OK per the HTTP specs,
            // Google disallows it and will reject the request. So for DELETE only we explicitly
            // ensure that no request body is set. The event id is already passed in the url, which
            // in addition to the DELETE request type, is all that's required.
            return request;
        }
        return this.callParent(arguments);
    }
});