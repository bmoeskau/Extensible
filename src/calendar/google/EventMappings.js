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
            mapping: 'start.datetime',
            type:    'date'
        },
        EndDate: {
            name:    'EndDate',
            mapping: 'end.datetime',
            type:    'date'
        },
        IsAllDay: {
            name:    'IsAllDay',
            type:    'boolean'
        },
        
        //
        // Required mappings to work around differences in the data API
        // between Extensible and Google Calendar 
        //
        // While Extensible only requires a single StartDate and EndDate,
        // Google provides separate data definitions for all-day dates
        // (date only, no time) and non-all-day events (datetime). Each event
        // passed from Google will have one or the other, and the mappings are
        // different. In order to handle that, we're adding dummy mappings for
        // StartDateAllDay and EndDateAllDay here. Then in the CalendarReader's
        // extractData() method it determines which kind of date value should be
        // used, applies the all-day mapping if needed, and removes these fields
        // so that we still always end up with a single start and end date in the model.
        StartDateAllDay: {
            name:       'StartDateAllDay',
            mapping:    'start.date',
            type:       'date',
            dateFormat: 'Y-m-d'
        },
        EndDateAllDay: {
            name:       'EndDateAllDay',
            mapping:    'end.date',
            type:       'date',
            dateFormat: 'Y-m-d'
        },
        
        //
        // Additional mappings provided by the Google API, but not used in the default Extensible UI
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
