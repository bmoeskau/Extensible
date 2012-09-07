
Ext.define('Extensible.calendar.google.EventModel', {
    extend: 'Extensible.calendar.data.EventModel',
    
    requires: [
        'Extensible.calendar.google.EventMappings',
        'Extensible.calendar.google.CalendarProxy'
    ],

    proxy: 'extensible.googlecalendar',
    
    mappingClass: 'Extensible.calendar.google.EventMappings',
    
    isEditable: function() {
        switch (this.data[Extensible.calendar.google.EventMappings.AccessRole.name]) {
            case 'owner':
            case 'writer':
                return true;
        }
        return false;
    },
    
    getId: function() {
        var recurringId = this.get(Extensible.calendar.google.EventMappings.OriginalEventId.name);
        return recurringId ? recurringId : this.callParent(arguments);
    }
},
function() {
    this.reconfigure();
});