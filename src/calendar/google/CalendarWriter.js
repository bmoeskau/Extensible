Ext.define('Extensible.calendar.google.CalendarWriter', {
    extend: 'Ext.data.writer.Json',
    alias : 'writer.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.EventMappings'
    ],
    
    writeAllFields: false,
    
    writeRecordId: false,
    
    expandMappings: true,
    
    usePatchUpdates: true,
    
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
    },
    
    getRecordData: function(record, operation) {
        var EventMappings = Extensible.calendar.google.EventMappings,
            startName = EventMappings.StartDate.name,
            endName = EventMappings.EndDate.name;
        
        if (!this.usePatchUpdates) {
            // Google's API requires start and end dates to always be included in UPDATE requests,
            // even if they have not been modified. If using the PATCH method, these can be ommitted.
            record.modified[startName] = record.get(startName);
            record.modified[endName] = record.get(endName);
        }
        return this.callParent(arguments);
    }
});