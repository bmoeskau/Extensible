Ext.require([
    'Extensible.calendar.data.EventModel'
],
function() {
    Ext.ns('Extensible.calendar.google');
    
    Extensible.calendar.google.EventMappings = {
        Title: {
            name: 'Title',
            mapping: 'summary',
            type: 'string'
        },
        StartDate: {
            name: 'StartDate',
            mapping: 'start.date',
            type: 'date'
        },
        EndDate: {
            name: 'EndDate',
            mapping: 'end.date',
            type: 'date'
        }
    };
    
    Extensible.calendar.data.EventModel.prototype.mappingClass = 'Extensible.calendar.google.EventMappings';
    Extensible.calendar.data.EventModel.reconfigure();
});
