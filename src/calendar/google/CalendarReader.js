Ext.define('Extensible.calendar.google.CalendarReader', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.EventMappings'
    ],

    root: 'items',
    
    readRecords: function(data) {
        var resultSet = this.callParent(arguments),
            headerData = {}
        
        // Append the header fields returned as part of the event list to the
        // returned resultSet so they'll be available for future processing:
        for (item in data) {
            if (data.hasOwnProperty(item) && item !== 'items') {
                headerData[item] = data[item];
            }
        }
        
        resultSet.headerData = headerData;
        
        return resultSet;
    },
    
    extractData: function(root) {
        var records = this.callParent(arguments),
            EventMappings = Extensible.calendar.google.EventMappings,
            data,
            processed = [],
            len = records.length,
            i = 0;
        
        for (i = 0; i < len; i++) {
            data = records[i].data;
            
            if (data[EventMappings.StartDateAllDay.name]) {
                data[EventMappings.StartDate.name] = data[EventMappings.StartDateAllDay.name];
                data[EventMappings.EndDate.name] = data[EventMappings.EndDateAllDay.name];
                data[EventMappings.IsAllDay.name] = true;
                
                delete data[EventMappings.StartDateAllDay.name];
                delete data[EventMappings.EndDateAllDay.name];
            }
            
            processed.push(records[i]);
        }
        
        return processed;
    }
});