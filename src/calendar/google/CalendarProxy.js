Ext.define('Extensible.calendar.google.CalendarProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.CalendarReader',
        'Extensible.calendar.google.CalendarWriter',
        'Extensible.calendar.google.EventMappings',
        'Extensible.calendar.google.CalendarSettings'
    ],
    
    reader: 'extensible.googlecalendar',
    
    writer: 'extensible.googlecalendar',
    
    calendarId: 'primary',
    
    apiKey: undefined,
    
    authToken: undefined,
    
    authPrefix: 'Bearer ', // mandated by Google
    
    apiMethod: 'events',
    
    apiKeySeparator: 'key=', // mandated by Google
    
    url: 'https://www.googleapis.com/calendar/v3/calendars',
    
    noCache: false,
    
    appendId: false,
    
    pageParam: undefined,
    
    startParam: undefined,
    
    limitParam: undefined,
    
    usePatchUpdates: true,
    
    /**
     * @cfg {Boolean} includeDeletedEvents
     * True to tell Google to return deleted events (eventStatus: 'cancelled') in the response,
     * false to omit them (default). When false, an extra param is automatically added to each request notifying
     * Google that such events such not be returned. These events do not include complete event data (including
     * start and end dates) and cannot be handled by Extensible by default, so this config should be left as
     * false unless specific handling is added for cancelled items.
     */
    includeDeletedEvents: false,
    
    constructor: function(config) {
        this.callParent(arguments);
        
        if (this.usePatchUpdates) {
            this.actionMethods.update = 'PATCH';
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
    },
    
    buildUrl: function(request) {
        var me        = this,
            operation = request.operation,
            records   = operation.records || [],
            record    = records[0],
            url       = me.getUrl(request),
            id        = record ? record.getId() : null;
        
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
        
        if (request.action === 'read' && !id) {
            // Assume this is a list retrieval
            if (Extensible.calendar.google.CalendarSettings.expandRecurringEvents) {
                // Request expansion of recurring events to separate instances on the server
                url = Ext.String.urlAppend(url, 'singleEvents=true&orderBy=startTime');
            }
        }
        
        // Append extra params as needed
        if (request.action === 'read' && !this.includeDeletedEvents) {
            url = Ext.String.urlAppend(url, 'showDeleted=false');
        }
        
        // API key is optional, append if specified.
        // NOTE that this must always be last after all elements of the REST url.
        // Also note -- do NOT set this as a param programmatically via this.setExtraParam() or similar
        // as this will cause DELETEs to fail. Google rejects DELETE requests containing body data, but
        // Ext.data.Connection will automagically grab any configured params and use them as the request
        // body when there is no JSON data present. Normally this is OK, but it breaks Google's API in this case.
        if (me.apiKey) {
            url = Ext.String.urlAppend(url, me.apiKeySeparator + me.apiKey);
        }
        
        request.url = url;
        
        return me.callParent(arguments);
    }
});