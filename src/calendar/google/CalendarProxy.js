Ext.define('Extensible.calendar.google.CalendarProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.CalendarReader',
    ],
    
    reader: 'extensible.googlecalendar',
    
    // writer: {
        // type: 'json',
        // nameProperty: 'mapping'
    // },
    
    calendarId: undefined,
    
    apiKey: undefined,
    
    apiMethod: 'events',
    
    url: 'https://www.googleapis.com/calendar/v3/calendars',
    
    apiKeySeparator: '?key=',
    
    buildUrl: function(request) {
        var me        = this,
            operation = request.operation,
            records   = operation.records || [],
            record    = records[0],
            url       = me.getUrl(request),
            id        = record ? record.getId() : operation.id;
        
        // Google's version 3 calendar url format:
        // https://www.googleapis.com/calendar/v3/calendars/{calendarId}/{apiMethod}?key={apiKey}
        
        // First clean the end of the base url in case it was customized
        // (make sure we have a trailing /):
        if (!url.match(/\/$/)) {
            url += '/';
        }
        
        // Append the calendar id and api method, both required:
        url += me.calendarId + '/' + me.apiMethod;
        
        // Append the item's id, if needed:
        if (me.appendId && id) {
            url += '/' + id;
        }
        
        // API key is optional, append if specified.
        // NOTE that this must always be last after all elements of the REST url:
        if (me.apiKey) {
            url += me.apiKeySeparator + me.apiKey;
        }
        
        request.url = url;
        
        return me.callParent(arguments);
    }
});