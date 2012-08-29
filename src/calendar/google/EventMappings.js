/**
 * These mappings, in conjunction with the custom Extensible.calendar.google.CalendarReader/Writer
 * classes, provide the interchange between Google's calendar event API and Extensible's data model.
 * 
 * See Google's Event API reference here:
 * https://developers.google.com/google-apps/calendar/v3/reference/events
 * 
 * Note that attendees are handled separately via an Ext hasMany association defined in
 * {@link Extensible.calendar.data.EventModel}.  There are separate
 * {@link Extensible.calendar.data.EventAttendeeModel model} and
 * {@link Extensible.calendar.data.EventAttendeeMappings mappings} classes for attendees.
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
            name:       'StartDate',
            mapping:    'start.date',
            type:       'date',
            dateFormat: 'Y-m-d'
        },
        EndDate: {
            name:       'EndDate',
            mapping:    'end.date',
            type:       'date',
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
        // Recurrence-specific mappings.
        //
        // Recurrence is handled differently between Google and Extensible.  Extensible expects a single
        // RRule mapping while Google provides an array of multiple strings, each of which could be an
        // RRULE, RDATE, EXRULE or EXDATE. This will have to be handled specially inside the reader.
        //
        Recurrence: {
            name:    'Recurrence',
            mapping: 'recurrence'
        },
        OriginalEventId: {
            name:    'OriginalEventId',
            mapping: 'recurringEventId',
            type:    'string'
        },
        OriginalStartDate: {
            name:       'OriginalStartDate',
            mapping:    'originalStartTime.date',
            type:       'date',
            dateFormat: 'Y-m-d'
        },
        OriginalStartTimeZone: {
            name:    'OriginalStartTimeZone',
            mapping: 'originalStartTime.timeZone',
            type:    'string'
        },
        
        //
        // Additional core Extensible fields that require more customized mappings
        //
        
        // TODO: Google does not directly provide a calendar id...
        CalendarId: {
            name:    'CalendarId',
            mapping: 'colorId', // ???
            type:    'string'
        },
        
        // TODO: Google provides a more robust reminder API than Extensible requires. I think we're going
        // to have to process this in the reader...
        Reminder: {
            name:    'Reminder',
            mapping: 'reminders'
        },
        
        // The Google API provides both start.date and start.dateTime, and only one will ever be
        // included in each response (the other will be undefined in the JSON). Because of this
        // we have to map both explicitly, and then we have custom logic in
        // Extensible.calendar.google.CalendarReader.extractData() that normalizes these fields
        // for Extensible's consumption.  Same appiles to end date.
        StartDateTime: {
            name:       'StartDateTime',
            mapping:    'start.dateTime',
            type:       'date',
            dateFormat: 'c'
        },
        EndDateTime: {
            name:       'EndDateTime',
            mapping:    'end.dateTime',
            type:       'date',
            dateFormat: 'c'
        },
        OriginalStartDateTime: {
            name:       'OriginalStartDateTime',
            mapping:    'originalStartTime.dateTime',
            type:       'date',
            dateFormat: 'c'
        },

        //
        // Additional mappings provided by the Google API that are not directly defined by Extensible,
        // but are required for Extensible to provide equivalent functionality to Google calendar.
        //
        Status: {
            name:    'Status',
            mapping: 'status',
            type:    'string'
        },
        
        //
        // Everything from here below are additional mappings provided by the Google API, but not used
        // in Extensible by default. Mapped here for completeness and potential future use.
        //
        Kind: {
            name:    'Kind',
            mapping: 'kind',
            type:    'string'
        },
        Etag: {
            name:    'Etag',
            mapping: 'etag',
            type:    'string'
        },
        CreateDate: {
            name:       'CreateDate',
            mapping:    'created',
            type:       'date',
            dateFormat: 'c'
        },
        UpdateDate: {
            name:       'UpdateDate',
            mapping:    'updated',
            type:       'date',
            dateFormat: 'c'
        },
        AccessRole: {
            name:    'AccessRole',
            mapping: 'accessRole',
            type:    'string'
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
        EndTimeUnspecified: {
            name:    'EndTimeUnspecified',
            mapping: 'endTimeUnspecified',
            type:    'string'
        },
        Transparency: {
            name:    'Transparency',
            mapping: 'transparency',
            type:    'string'
        },
        Visibility: {
            name:    'Visibility',
            mapping: 'visibility',
            type:    'string'
        },
        ICalUID: {
            name:    'ICalUID',
            mapping: 'iCalUID',
            type:    'string'
        },
        Sequence: {
            name:    'Sequence',
            mapping: 'sequence',
            type:    'int'
        },
        AttendeesOmitted: {
            name:    'AttendeesOmitted',
            mapping: 'attendeesOmitted',
            type:    'boolean'
        },
        AnyoneCanAddSelf: {
            name:    'AnyoneCanAddSelf',
            mapping: 'anyoneCanAddSelf',
            type:    'boolean'
        },
        GuestsCanInviteOthers: {
            name:    'GuestsCanInviteOthers',
            mapping: 'guestsCanInviteOthers',
            type:    'boolean'
        },
        GuestsCanModify: {
            name:    'GuestsCanModify',
            mapping: 'guestsCanModify',
            type:    'boolean'
        },
        GuestsCanSeeOtherGuests: {
            name:    'GuestsCanSeeOtherGuests',
            mapping: 'guestsCanSeeOtherGuests',
            type:    'boolean'
        },
        IsPrivateCopy: {
            name:    'IsPrivateCopy',
            mapping: 'privateCopy',
            type:    'boolean'
        },
        IsLocked: {
            name:    'IsLocked',
            mapping: 'locked',
            type:    'boolean'
        },
        
        // Creator fields
        CreatorId: {
            name:    'CreatorId',
            mapping: 'creator.id',
            type:    'string'
        },
        CreatorEmail: {
            name:    'CreatorEmail',
            mapping: 'creator.email',
            type:    'string'
        },
        CreatorName: {
            name:    'CreatorName',
            mapping: 'creator.displayName',
            type:    'string'
        },
        IsCreator: {
            name:    'IsCreator',
            mapping: 'creator.self',
            type:    'boolean'
        },
        
        // Organizer fields
        OrganizerId: {
            name:    'OrganizerId',
            mapping: 'organizer.id',
            type:    'string'
        },
        OrganizerEmail: {
            name:    'OrganizerEmail',
            mapping: 'organizer.email',
            type:    'string'
        },
        OrganizerName: {
            name:    'OrganizerName',
            mapping: 'organizer.displayName',
            type:    'string'
        },
        IsOrganizer: {
            name:    'IsOrganizer',
            mapping: 'organizer.self',
            type:    'boolean'
        },
        
        //
        // Unsupported properties that are mapped, but probably won't ever do anything useful
        //
        ExtendedProperties: {
            // This is actually a complex object, but it does not have a specified data model as
            // it is used to store custom key/value pairs. This mapping will simply dump the raw object
            // into the record's data, but it will not be otherwise explicitly used.
            name:        'ExtendedProperties',
            mapping:     'extendedProperties',
            defaultValue: null
        },
        Gadget: {
            // This is also a complex object, but is only used in the context of Google's calendar UI
            name:        'Gadget',
            mapping:     'gadget',
            defaultValue: null
        },
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
