Ext.ns('Extensible.calendar.data');

Extensible.calendar.data.EventAttendeeMappings = {
    Email: {
        name:    'Email',
        mapping: 'email',
        type:    'string'
    },
    Name: {
        name:    'Name',
        mapping: 'displayName',
        type:    'string'
    },
    Optional: {
        name:    'Optional',
        mapping: 'optional',
        type:    'boolean'
    },
    ResponseStatus: {
        name:    'ResponseStatus',
        mapping: 'responseStatus',
        type:    'string'
    },
    Comment: {
        name:    'Comment',
        mapping: 'comment',
        type:    'string'
    },
    AdditionalGuests: {
        name:    'AdditionalGuests',
        mapping: 'additionalGuests',
        type:    'int'
    },
    
    //
    // Read-only fields that cannot be persisted:
    //
    Organizer: {
        name:    'Organizer',
        mapping: 'organizer',
        type:    'boolean',
        persist: false
    },
    Self: {
        name:    'Self',
        mapping: 'self',
        type:    'boolean',
        persist: false
    },
    Resource: {
        name:    'Resource',
        mapping: 'resource',
        type:    'boolean',
        persist: false
    }
};