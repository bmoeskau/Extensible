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
            //mapping: 'start.dateTime',
            mapping: function(data, reader) {
                if (data.start) {
                    if (data.start.date) {
                        return data.start.date;
                    }
                    if (data.start.dateTime) {
                        return data.start.dateTime;
                    }
                }
                if (data.originalStartTime) {
                    if (data.originalStartTime.date) {
                        return data.originalStartTime.date;
                    }
                    if (data.originalStartTime.dateTime) {
                        return data.originalStartTime.dateTime;
                    }
                }
                debugger;
                return null;
            },
            type:    'date'
        },
        EndDate: {
            name:    'EndDate',
            //mapping: 'end.dateTime',
            mapping: function(data, reader) {
                if (data.end) {
                    if (data.end.date) {
                        return data.end.date;
                    }
                    if (data.end.dateTime) {
                        return data.end.dateTime;
                    }
                }
                if (data.start) {
                    if (data.start.date) {
                        return data.start.date;
                    }
                    if (data.start.dateTime) {
                        return data.start.dateTime;
                    }
                }
                if (data.originalStartTime) {
                    if (data.originalStartTime.date) {
                        return data.originalStartTime.date;
                    }
                    if (data.originalStartTime.dateTime) {
                        return data.originalStartTime.dateTime;
                    }
                }
                debugger;
                return null;
            },
            type:    'date'
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
        // Additional mappings provided by the Google API, but not used in the default Extensible UI
        //
        AccessRole: {
            name: 'AccessRole',
            mapping: 'accessRole',
            type: 'string'
        },
        StartTimeZone: {
            name:    'StartTimeZone',
            //mapping: 'start.timeZone',
            mapping: function(data, reader) {
                if (data.start) {
                    if (data.start.timeZone) {
                        return data.start.timeZone;
                    }
                }
                if (data.originalStartTime) {
                    if (data.originalStartTime.timeZone) {
                        return data.originalStartTime.timeZone;
                    }
                }
                return null;
            },
            type:    'string'
        },
        EndTimeZone: {
            name:    'EndTimeZone',
            //mapping: 'end.timeZone',
            mapping: function(data, reader) {
                if (data.end) {
                    if (data.end.timeZone) {
                        return data.end.timeZone;
                    }
                }
                return null;
            },
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
