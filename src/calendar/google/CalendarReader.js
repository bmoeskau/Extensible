Ext.define('Extensible.calendar.google.CalendarReader', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.extensible.googlecalendar',

    root: 'items',
    
    readRecords: function(data) {
        var resultSet = this.callParent([data]),
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
    }
});