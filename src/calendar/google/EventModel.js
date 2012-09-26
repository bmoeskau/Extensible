
Ext.define('Extensible.calendar.google.EventModel', {
    extend: 'Extensible.calendar.data.EventModel',
    
    requires: [
        'Extensible.calendar.google.EventMappings',
        'Extensible.calendar.google.CalendarProxy'
    ],

    proxy: 'extensible.googlecalendar',
    
    mappingClass: 'Extensible.calendar.google.EventMappings',
    
    isRecurring: function() {
        var originalEventId = Extensible.calendar.data.EventMappings.OriginalEventId,
            rrule = Extensible.calendar.data.EventMappings.RRule;
        
        if (originalEventId) {
            originalEventId = this.get(originalEventId.name);
        }
        if (rrule) {
            rrule = this.get(rrule.name);
        }
        return !!(originalEventId || rrule);
    },
    
    isEditable: function() {
        var accessRole = this.get(Extensible.calendar.google.EventMappings.AccessRole.name);
        
        switch (accessRole) {
            case 'none': // should not even be able to see the calendar
            case 'reader':
            case 'freeBusyReader':
            // other options are 'writer' and 'owner'
                return false;
        }
        // If accessRole is not provided default to editable
        return true;
    },
    
    getId: function() {
        var recurringId = this.get(Extensible.calendar.google.EventMappings.OriginalEventId.name),
            recurringEditMode = this.get(Extensible.calendar.google.EventMappings.REditMode.name);
        
        if (recurringId && recurringEditMode === 'all') {
            // If updating all recurring instances, use the master event's id in the
            // url, otherwise use the current event instance id. REditMode should only
            // be set after an edit has occurred when the record is getting persisted.
            return recurringId;
        }
        return this.callParent(arguments);
    }
},
function() {
    this.reconfigure();
});