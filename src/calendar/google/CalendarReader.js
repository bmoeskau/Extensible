Ext.define('Extensible.calendar.google.CalendarReader', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.extensible.googlecalendar',
    
    requires: [
        'Extensible.calendar.google.EventMappings',
        'Extensible.calendar.google.CalendarSettings'
    ],

    root: 'items',
    
    listRoot: 'items',
    
    googleConstants: {
        Status: {
            CONFIRMED: 'confirmed',
            TENTATIVE: 'tentative',
            CANCELLED: 'cancelled'
        }
    },
    
    initRoot: function(rawData) {
        var me = this;
        
        me.root = rawData[me.listRoot] ? me.listRoot : '';
        
        if (me.root) {
            me.getRoot = me.createAccessor(me.root);
        } else {
            me.getRoot = Ext.identityFn;
        }
    },
    
    readRecords: function(rawData) {
        // Reader only understands a single root config by default. Google's API only uses a root
        // attribute 'items' when returning a list, otherwise there is no root, only the event data.
        // Unfortunately the reader cannot know which type of response it's getting ahead of time so
        // we have to evaluate the raw data coming in to see what we're reading. This is critical to
        // do first as the parent readRecords() uses this.root to do its thing.
        this.initRoot(rawData);
        
        var resultSet = this.callParent(arguments),
            EventMappings = Extensible.calendar.google.EventMappings,
            records = resultSet.records,
            len = records.length,
            data,
            i = 0,
            // Attributes to copy from the header into the records:
            timeZone = rawData.timeZone,
            accessRole = rawData.accessRole;
        
        for (i = 0; i < len; i++) {
            data = records[i].data;
            
            // If the event list header specifies a time zone, default that value into
            // any records that do not have an explicit time zone on the start or end dates:
            if (timeZone) {
                Extensible.calendar.google.CalendarSettings.userTimeZoneName = timeZone;
                
                if (!data[EventMappings.StartTimeZone.name]) {
                    data[EventMappings.StartTimeZone.name] = timeZone;
                }
                if (!data[EventMappings.EndTimeZone.name]) {
                    data[EventMappings.EndTimeZone.name] = timeZone;
                }
            }
            
            // Google's event model does not specify accessRole, but since we need it at the event
            // level in Extensible to render the events properly just copy it into each event: 
            if (accessRole) {
                data[EventMappings.AccessRole.name] = accessRole;
            }
        }
        
        return resultSet;
    },
    
    extractData: function(root) {
        if (root.status === 204 || root.kind === 'calendar#events') {
            // Google will return a 204 (success with no body content) after certain requests,
            // such as a successful DELETE. Since there is no data to read, just ignore. Technically
            // Ext should handle this case directly, but since it insists on attempting to read records
            // this is the simplest way to handle it and still follow the default processing path.
            //
            // If the raw response contains at least one event, the root will have been set to the 'items'
            // array and passed here as an array. If root is still the list root (kind = 'calendar#events'),
            // it means that the request did not match any events and so did not return an 'items' node.
            // There is no valid event data to extract so just return an empty list.
            return [];
        }
        
        var records = this.callParent(arguments),
            EventMappings = Extensible.calendar.google.EventMappings,
            data,
            status,
            processed = [],
            len = records.length,
            i = 0,
            recurrence,
            reminders;
        
        for (i = 0; i < len; i++) {
            data = records[i].data;
            status = data[EventMappings.Status.name];
            
            if (status && status === this.googleConstants.Status.CANCELLED) {
                // do not include cancelled events
                continue;
            }
            
            if (data[EventMappings.StartDateTime.name]) {
                data[EventMappings.StartDate.name] = data[EventMappings.StartDateTime.name];
                data[EventMappings.EndDate.name] = data[EventMappings.EndDateTime.name];
                
                delete data[EventMappings.StartDateTime.name];
                delete data[EventMappings.EndDateTime.name];
            }
            else {
                //data[EventMappings.EndDate.name] = Extensible.Date.add(data[EventMappings.EndDate.name], { days: -1 });
                data[EventMappings.IsAllDay.name] = true;
            }
            
            recurrence = data[EventMappings.Recurrence.name];
            
            if (recurrence && recurrence.length > 0) {
                data[EventMappings.RRule.name] = recurrence[0];
                delete data[EventMappings.Recurrence.name];
            }
            
            reminders = data[EventMappings.Reminder.name];
            
            if (reminders && reminders.overrides && reminders.overrides.length > 0) {
                // This is ugly, but basically assumes the reminder was created in Extensible (which only
                // supports a single value and assigns no meaning to the reminder behavior). Any reminders
                // created in Google that do not match one of the Extensible reminder combo values will be
                // ignored, along with any additional reminders beyond the first one.
                data[EventMappings.Reminder.name] = reminders.overrides[0].minutes + '';
            }
            
            processed.push(records[i]);
        }
        return processed;
    }
});