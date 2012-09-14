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
        // The parent logic will simply return the default set of modified field names/values.
        // Non-modified values will already have been excluded by writeValue() below which
        // skips any value matching the field's default value.
        var data = this.callParent(arguments);
        
        // Add in our custom logic to tailor the data for Google's API
        this.processDates(record, data);
        this.processRecurrence(record, data);
        
        return data;
    },
    
    processDates: function(record, data) {
        var EventMappings = Extensible.calendar.google.EventMappings,
            startDateTimeMapping = EventMappings.StartDateTime.mapping,
            endDateTimeMapping = EventMappings.EndDateTime.mapping;
        
        if (record.get(EventMappings.IsAllDay.name)) {
            delete data[startDateTimeMapping];
            delete data[endDateTimeMapping];
            
            //var adjustedEndDate = Extensible.Date.add(record.get(EventMappings.EndDate.name), { days: 1 });
            //data[EventMappings.EndDate.mapping] = Ext.Date.format(adjustedEndDate, 'Y-m-d');
        }
        else {
            data[startDateTimeMapping] = Ext.Date.format(record.get(EventMappings.StartDate.name), 'c');
            data[endDateTimeMapping] = Ext.Date.format(record.get(EventMappings.EndDate.name), 'c');
            delete data[EventMappings.StartDate.mapping];
            delete data[EventMappings.EndDate.mapping];
        }
        delete data[EventMappings.IsAllDay.mapping];
        return data;
    },
    
    processRecurrence: function(record, data) {
        var EventMappings = Extensible.calendar.google.EventMappings,
            timeZone = Extensible.calendar.google.CalendarSettings.userTimeZoneName;
        
        // Only set the RRULE if it has been added or edited (i.e. exists in data already)
        if (EventMappings.RRule && data[EventMappings.RRule.mapping]) {
            // The RRULE exists, but we must format it to Google's liking.
            
            //if (data[EventMappings.REditMode.mapping] !== 'single')
            
            // Google's API expects an array of rrule strings:
            data[EventMappings.Recurrence.mapping] = [data[EventMappings.RRule.mapping]];
            delete data[EventMappings.RRule.mapping];
            
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