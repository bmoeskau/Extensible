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
        this.processReminders(record, data);
        
        return data;
    },
    
    processDates: function(record, data) {
        var EventMappings = Extensible.calendar.google.EventMappings,
            startDateTimeMapping = EventMappings.StartDateTime.mapping,
            endDateTimeMapping = EventMappings.EndDateTime.mapping,
            startDate = record.get(EventMappings.StartDate.name),
            endDate = record.get(EventMappings.EndDate.name),
            editMode = record.get(EventMappings.REditMode.name);
        
        if (record.isRecurring() && editMode === 'all') {
            var duration = record.get(EventMappings.Duration.name) || 0;
            
            // If updating the entire recurrence series, we have to use the master event
            // start date plus the duration, not the current instance dates
            startDate = record.masterEvent.get(EventMappings.StartDate.name);
            endDate = Extensible.Date.add(startDate, {minutes: duration});
        }
            
        if (record.get(EventMappings.IsAllDay.name)) {
            data[EventMappings.StartDate.mapping] = Ext.Date.format(startDate, 'Y-m-d');
            data[EventMappings.EndDate.mapping] = Ext.Date.format(endDate, 'Y-m-d');
            delete data[startDateTimeMapping];
            delete data[endDateTimeMapping];
        }
        else {
            data[startDateTimeMapping] = Ext.Date.format(startDate, 'c');
            data[endDateTimeMapping] = Ext.Date.format(endDate, 'c');
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
            
            if (data[EventMappings.REditMode.mapping] !== 'single') {
                // Google's API expects an array of rrule strings, except when editing a single
                // instance (it will throw an error in that case):
                data[EventMappings.Recurrence.mapping] = [data[EventMappings.RRule.mapping]];
                // Google requires the timezone to be explicitly set when inserting recurring events
                data[EventMappings.StartTimeZone.mapping] = timeZone;
                data[EventMappings.EndTimeZone.mapping] = timeZone;
            }
            delete data[EventMappings.RRule.mapping];
        }
        
        delete data[EventMappings.Duration.mapping];
        
        // Pass the edit mode since the "edit following" case must currently be evaluated on the server
        //delete data[EventMappings.REditMode.mapping];
        
        return data;
    },
    
    processReminders: function(record, data) {
        var EventMappings = Extensible.calendar.google.EventMappings,
            value;
        
        if (EventMappings.Reminder && data[EventMappings.Reminder.mapping]) {
            value = data[EventMappings.Reminder.mapping];
            
            data[EventMappings.Reminder.mapping] = {
                useDefault: false,
                overrides: [{
                    // Have to hard-code the method since there's nothing in the Extensible UI for that
                    method: 'popup',
                    minutes: value
                }]
            };
        }
        else {
            // In case it is there, but null
            delete data[EventMappings.Reminder.mapping];
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