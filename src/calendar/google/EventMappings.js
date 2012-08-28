/**
 * These mappings, in conjunction with the custom Extensible.calendar.google.CalendarReader/Writer
 * classes, provide the interchange between Google's calendar event API and Extensible's data model.
 * 
 * See Google's Event API reference here:
 * https://developers.google.com/google-apps/calendar/v3/reference/events 
 */
Ext.require([
    'Extensible.calendar.data.EventModel'
],
function() {
    Ext.ns('Extensible.calendar.google');
    
    Extensible.calendar.google.EventMappings = {
        //
        // Basic fields mapped to core Extensible attributes
        //
        EventId: {
            name:    'EventId',
            mapping: 'id',
            type:    'string'
        },
        Title: {
            name:    'Title',
            mapping: 'summary',
            type:    'string'
        },
        StartDate: {
            name:    'StartDate',
            mapping: 'start.date',
            type:    'date',
            dateFormat: 'Y-m-d'
        },
        EndDate: {
            name:    'EndDate',
            mapping: 'end.date',
            type:    'date',
            dateFormat: 'Y-m-d'
        },
        IsAllDay: {
            name:    'IsAllDay',
            type:    'boolean'
        },
        Location: {
            name:    'Location',
            mapping: 'location',
            type:    'string'
        },
        Notes: {
            name:    'Notes',
            mapping: 'description',
            type:    'string'
        },
        Url: {
            name:    'Url',
            mapping: 'htmlLink',
            type:    'string'
        },
        
        //
        // Additional core Extensible fields that require more customized mappings
        //
        
        // TODO: Google does not directly provide a calendar id...
        // CalendarId: {
            // name:    'CalendarId',
            // mapping: 'cid',
            // type:    'string'
        // },
        
        // TODO: Google provides a more robust reminder API than Extensible requires...
        // Reminder: {
            // name:    'Reminder',
            // mapping: 'rem',
            // type:    'string'
        // },
        
        // The Google API provides both start.date and start.dateTime, and only one will ever be
        // included in each response (the other will be undefined in the JSON). Because of this
        // we have to map both explicitly, and then we have custom logic in
        // Extensible.calendar.google.CalendarReader.extractData() that normalizes these fields
        // for Extensible's consumption.  Same appiles to end date.
        StartDateTime: {
            name:    'StartDateTime',
            mapping: 'start.dateTime',
            type:    'date',
            dateFormat: 'c'
        },
        EndDateTime: {
            name:    'EndDateTime',
            mapping: 'end.dateTime',
            type:    'date',
            dateFormat: 'c'
        },

        //
        // Additional mappings provided by the Google API that are not directly defined by Extensible,
        // but are required for Extensible to provide equivalent functionality to Google calendar.
        //
        Status: {
            name: 'Status',
            mapping: 'status',
            type: 'string'
        },
        
        //
        // Additional mappings provided by the Google API, but not used in Extensible by default.
        // Mapped here for completeness and potential future use.
        //
        AccessRole: {
            name: 'AccessRole',
            mapping: 'accessRole',
            type: 'string'
        },
        StartTimeZone: {
            name:    'StartTimeZone',
            mapping: 'start.timeZone',
            type:    'string'
        },
        EndTimeZone: {
            name:    'EndTimeZone',
            mapping: 'end.timeZone',
            type:    'string'
        },
        Locked: {
            name:    'Locked',
            mapping: 'locked',
            type:    'boolean'
        }
    };
    
    Extensible.calendar.data.EventModel.prototype.mappingClass = 'Extensible.calendar.google.EventMappings';
    Extensible.calendar.data.EventModel.reconfigure();
    
    Ext.override(Extensible.calendar.data.EventModel, {
        isEditable: function() {
            switch (this.data[Extensible.calendar.google.EventMappings.AccessRole.name]) {
                case 'owner':
                case 'writer':
                    return true;
            }
            return false;
        }
    });
});
