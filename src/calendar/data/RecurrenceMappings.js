Ext.ns('Extensible.calendar.data');

Extensible.calendar.data.RecurrenceMappings = {
    RecurrenceId: {
        name:    'RecurrenceId',
        mapping: 'rid',
        type:    'int'
    },

    // The iCal-formatted RRULE (recurrence rule) pattern
    // See: http://www.kanzaki.com/docs/ical/rrule.html
    RRule: {
        name:    'RRule',
        mapping: 'rrule',
        type:    'string'
    },
    
    // When using recurrence, the EndDate value above will be the end date
    // of the _recurrence pattern_, not the end date of the "event". In fact,
    // with recurrence there is no single "event", only a pattern that generates
    // event instances, each of which has a separate start and end date.
    // Because of this we also store the duration of the event when using
    // recurrence so that the end date of each event instance can be
    // properly calculated.
    Duration: {
        name:    'Duration',
        mapping: 'duration',
        type:    'int'
    },
    
    // Recurrence edit metadata
    EditMode: {
        name:    'EditMode',
        mapping: 'edit',
        type:    'string'
    },
    
    // A comma-delimited list of exception dates that should be excluded
    // from the list of event instances generated from the RRULE pattern
    ExceptionDates: {
        name:    'ExceptionDates',
        mapping: 'exdates',
        type:    'string'
    }
};