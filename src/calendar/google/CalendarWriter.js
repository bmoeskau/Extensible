Ext.define('Extensible.calendar.google.CalendarWriter', {
    extend: 'Ext.data.writer.Json',
    alias : 'writer.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.EventMappings'
    ],
    
    writeAllFields: false,
    
    writeRecordId: false,
    
    expandData: true,
    
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
            data = this.callParent(arguments),
            startDateTimeMapping = EventMappings.StartDateTime.mapping,
            endDateTimeMapping = EventMappings.EndDateTime.mapping,
            timeZone = Extensible.calendar.google.CalendarSettings.userTimeZoneName;
        
        if (record.get(EventMappings.IsAllDay.name)) {
            delete data[startDateTimeMapping];
            delete data[endDateTimeMapping];
            
            var adjustedEndDate = Extensible.Date.add(record.get(EventMappings.EndDate.name), { days: 1 });
            data[EventMappings.EndDate.mapping] = Ext.Date.format(adjustedEndDate, 'Y-m-d');
        }
        else {
            data[startDateTimeMapping] = Ext.Date.format(record.get(EventMappings.StartDate.name), 'c');
            data[endDateTimeMapping] = Ext.Date.format(record.get(EventMappings.EndDate.name), 'c');
            delete data[EventMappings.StartDate.mapping];
            delete data[EventMappings.EndDate.mapping];
        }
        delete data[EventMappings.IsAllDay.mapping];
        
        // if (!this.usePatchUpdates) {
            // // Google's API requires start and end dates to always be included in UPDATE requests,
            // // even if they have not been modified. If using the PATCH method, these can be ommitted.
            // record.modified[startDate] = data[startDate];
            // record.modified[endDate] = data[endDate];
        // }
        
        if (EventMappings.RRule && record.get(EventMappings.RRule.name).length > 0) {
            data[EventMappings.Recurrence.mapping] = [record.get(EventMappings.RRule.name)];
            
            // Google requires the timezone to be explicitly set when inserting recurring events
            data[EventMappings.StartTimeZone.mapping] = timeZone;
            data[EventMappings.EndTimeZone.mapping] = timeZone;
        }
        
        return data;
    },
    
    writeValue: function(data, field, record){
        var name = field[this.nameProperty] || field.name,
            dateFormat = field.dateFormat,
            value = record.get(field.name);
        
        if (value === field.defaultValue) {
            return;
        }
        if (field.serialize) {
            data[name] = field.serialize(value, record);
        } else if (field.type === Ext.data.Types.DATE && dateFormat && Ext.isDate(value)) {
            if (dateFormat === 'time') {
                data[name] = value.getTime().toString();
            } else {
                if (dateFormat === 'timestamp') {
                    dateFormat = 'U';
                }
                data[name] = Ext.Date.format(value, dateFormat);
            }
        } else {
            data[name] = value;
        }
    }
});