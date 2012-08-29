Ext.define('Extensible.calendar.google.CalendarProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.CalendarReader',
        'Extensible.calendar.google.CalendarWriter',
        'Extensible.calendar.google.EventMappings'
    ],
    
    reader: 'extensible.googlecalendar',
    
    writer: 'extensible.googlecalendar',
    
    calendarId: undefined,
    
    apiKey: undefined,
    
    authToken: undefined,
    
    authPrefix: 'Bearer ', // mandated by Google
    
    apiMethod: 'events',
    
    apiKeyName: 'key', // mandated by Google
    
    url: 'https://www.googleapis.com/calendar/v3/calendars',
    
    noCache: false,
    
    appendId: false,
    
    pageParam: undefined,
    
    startParam: undefined,
    
    limitParam: undefined,
    
    constructor: function(config) {
        this.callParent(arguments);
        
        if (config && config.apiKey) {
            this.setApiKey(config.apiKey);
        }
    },
    
    setAuthToken: function(authToken) {
        var me = this;
        
        me.authToken = authToken;
        me.headers = me.headers || {};
        
        Ext.apply(me.headers, {
            Authorization: me.authPrefix + authToken
        });
    },
    
    setApiKey: function(apiKey) {
        this.apiKey = apiKey;
        this.setExtraParam(this.apiKeyName, apiKey);
    },
    
    buildUrl: function(request) {
        var me        = this,
            operation = request.operation,
            records   = operation.records || [],
            record    = records[0],
            url       = me.getUrl(request),
            id        = record ? record.getId() : operation.id;
        
        // Google's version 3 calendar url format (eventId is optional):
        // https://www.googleapis.com/calendar/v3/calendars/{calendarId}/{apiMethod}[/{eventId}]?key={apiKey}
        
        // First clean the end of the base url in case it was customized
        // (make sure we have a trailing /):
        if (!url.match(/\/$/)) {
            url += '/';
        }
        
        // Append the calendar id and api method, both required:
        url += me.calendarId + '/' + me.apiMethod;
        
        if (request.action === 'update' || request.action === 'destroy') {
            url += '/' + id;
        }
        
        request.url = url;
        
        return me.callParent(arguments);
    }
});