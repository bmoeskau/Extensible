Ext.require([
    'Extensible.calendar.data.EventModel'
],
function() {
    Ext.ns('Extensible.calendar.google');
    
    Extensible.calendar.google.EventMappings = {
        EventId: {
            name:    'EventId',
            mapping: 'id',
            type:    'string'
        },
        Title: {
            name: 'Title',
            mapping: 'summary',
            type: 'string'
        },
        StartDate: {
            name: 'StartDate',
            mapping: 'start.datetime',
            type: 'date'
        },
        EndDate: {
            name: 'EndDate',
            mapping: 'end.datetime',
            type: 'date'
        },
        StartDateAllDay: {
            name: 'StartDateAllDay',
            mapping: 'start.date',
            type: 'date',
            dateFormat: 'Y-m-d'
        },
        EndDateAllDay: {
            name: 'EndDateAllDay',
            mapping: 'end.date',
            type: 'date',
            dateFormat: 'Y-m-d'
        },
        StartTimeZone: {
            name: 'StartTimeZone',
            mapping: 'start.timeZone',
            type: 'string'
        },
        EndTimeZone: {
            name: 'EndTimeZone',
            mapping: 'end.timeZone',
            type: 'string'
        },
        IsAllDay: {
            name:    'IsAllDay',
            type:    'boolean'
        }
    };
    
    Extensible.calendar.data.EventModel.prototype.mappingClass = 'Extensible.calendar.google.EventMappings';
    Extensible.calendar.data.EventModel.reconfigure();
});
