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
    Organizer: {
        name:    'Organizer',
        mapping: 'organizer',
        type:    'boolean'
    },
    Self: {
        name:    'Self',
        mapping: 'self',
        type:    'boolean'
    },
    Resource: {
        name:    'Resource',
        mapping: 'resource',
        type:    'boolean'
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
    }
};