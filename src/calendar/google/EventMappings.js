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
            type:    'string',
            persist:  false
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
            // Calculated and used by Extensible, but not a valid field to send to Google which
            // differentiates all-day events by the date vs. dateTime mappings. 
            name:    'IsAllDay',
            type:    'boolean',
            persist: false
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
        
        // There is no corresponding field in the Google API:
        // Url: {
            // name:    'Url',
            // mapping: 'url',
            // type:    'string'
        // },
        
        //
        // Recurrence-specific mappings.
        //
        // Recurrence is handled differently between Google and Extensible.  Extensible expects a single
        // RRule mapping while Google provides an array of multiple strings, each of which could be an
        // RRULE, RDATE, EXRULE or EXDATE. This will have to be handled specially inside the reader.
        //
        RRule: {
            // Required by Extensible. Will not be sent to the Google API, but will be used internally
            // and mapped into the Recurrence field programmatically. Important: this field must be set as
            // persistable by default so that it can be processed by the CalendarWriter class, which will
            // ultimately replace it with the attributes expected by Google.
            name:    'RRule',
            mapping: 'rrule',
            type:    'string'
        },
        REditMode: {
            // Required by Extensible to determine how to set up recurrence requests to the Google API.
            // Keep as persistable so that CalendarWriter can process recurrence correctly.
            name:    'REditMode',
            mapping: 'redit',
            type:    'string'
        },
        Duration: {
            name:         'Duration',
            mapping:      'duration',
            defaultValue: -1, // the standard int default of 0 is actually a valid duration
            type:         'int'
        },
        Recurrence: {
            name:    'Recurrence',
            mapping: 'recurrence',
            convert: function(v) {
                // HACK: Ext <4.1.1 requires this when there is no type attribute
                return v;
            }
        },
        OriginalEventId: {
            // Immutable, but still gets passed back in requests when creating exceptions
            name:    'OriginalEventId',
            mapping: 'recurringEventId',
            type:    'string'
        },
        OriginalStartDate: {
            // Immutable, but still gets passed back in requests when creating exceptions
            name:       'OriginalStartDate',
            mapping:    'originalStartTime.date',
            type:       'date',
            dateFormat: 'Y-m-d',
            persist:    false
        },
        OriginalStartTimeZone: {
            // Immutable, but still gets passed back in requests when creating exceptions
            name:    'OriginalStartTimeZone',
            mapping: 'originalStartTime.timeZone',
            type:    'string',
            persist:    false
        },
        
        //
        // Additional core Extensible fields that require more customized mappings
        //
        
        // TODO: Google does not directly provide a calendar id...
        CalendarId: {
            name:    'CalendarId',
            mapping: 'colorId', // ???
            type:    'string',
            persist: false
        },
        
        // TODO: Google provides a more robust reminder API than Extensible requires. I think we're going
        // to have to process this in the reader...
        Reminder: {
            name:    'Reminder',
            mapping: 'reminders',
            convert: function(v) {
                // HACK: Ext <4.1.1 requires this when there is no type attribute
                return v;
            }
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
            dateFormat: 'c',
            persist:    false
        },

        //
        // Additional mappings provided by the Google API that are not directly defined by Extensible,
        // but are required for Extensible to provide equivalent functionality to Google calendar.
        // Because Extensible does not use them by default they default to persist: false, but this
        // could be changed if needed.
        //
        Status: {
            // One of "confirmed" (default), "tentative" or "cancelled". Google returns cancelled events, but
            // they are not valid events for Extensible's purposes and are filtered out. Currently Extensible
            // does not differentiate "confirmed" from "tentative" events, but it could be extended to do so.
            name:    'Status',
            mapping: 'status',
            type:    'string',
            persist: false
        },
        IsLocked: {
            // Whether this is a locked event copy where no changes can be made to the
            // main event fields "summary", "description", "location", "start", "end" or "recurrence".
            // This is always a read-only field (should never send to the server), but may be evaluated in
            // Extensible to ensure that update attempts to locked events do not fail unexpectedly.
            name:    'IsLocked',
            mapping: 'locked',
            type:    'boolean',
            persist: false
        },
        AccessRole: {
            // The user's access role for this calendar, one of: "none" (no access), "freeBusyReader",
            // "reader", "writer" or "owner". This is read-only, but potentially required to differentiate
            // UI behavior and access rights available to the user.
            name:    'AccessRole',
            mapping: 'accessRole',
            type:    'string',
            persist: false
        },
        Transparency: {
            // Whether the event blocks time on the calendar, either "opaque" (default) or "transparent".
            name:    'Transparency',
            mapping: 'transparency',
            type:    'string',
            persist: false
        },
        Visibility: {
            // Scope of who can view the event, one of: "default" (default, uses the calendar's setting),
            // "public" (visible to anyone), "private" (attendees may view) or "confidential" (same as
            // private, only provided for compatibility).
            name:    'Visibility',
            mapping: 'visibility',
            type:    'string',
            persist: false
        },
        StartTimeZone: {
            // Required in some cases, like inserting recurring events
            name:    'StartTimeZone',
            mapping: 'start.timeZone',
            type:    'string'
        },
        EndTimeZone: {
            // Required in some cases, like inserting recurring events
            name:    'EndTimeZone',
            mapping: 'end.timeZone',
            type:    'string'
        },
        
        //==================================================================================================
        //
        // Everything from here below are additional mappings provided by the Google API, but not used
        // in Extensible by default. Mapped here for completeness and potential future use.
        //
        //==================================================================================================
        
        //
        // These fields are potentially editable, but not implemented at this time. Because of this,
        // they will be marked persist: false by default, but this could be changed if needed.
        //
        Sequence: {
            name:    'Sequence',
            mapping: 'sequence',
            type:    'int',
            persist: false
        },
        AttendeesOmitted: {
            name:    'AttendeesOmitted',
            mapping: 'attendeesOmitted',
            type:    'boolean',
            persist: false
        },
        AnyoneCanAddSelf: {
            name:    'AnyoneCanAddSelf',
            mapping: 'anyoneCanAddSelf',
            type:    'boolean',
            persist: false
        },
        GuestsCanInviteOthers: {
            name:    'GuestsCanInviteOthers',
            mapping: 'guestsCanInviteOthers',
            type:    'boolean',
            persist: false
        },
        GuestsCanModify: {
            name:    'GuestsCanModify',
            mapping: 'guestsCanModify',
            type:    'boolean',
            persist: false
        },
        GuestsCanSeeOtherGuests: {
            name:    'GuestsCanSeeOtherGuests',
            mapping: 'guestsCanSeeOtherGuests',
            type:    'boolean',
            persist: false
        },
        
        //
        // Everything below here are read-only fields that cannot be persisted per Google's API
        // and should never be sent to the server.
        //
        CreatorId: {
            name:    'CreatorId',
            mapping: 'creator.id',
            type:    'string',
            persist: false
        },
        CreatorEmail: {
            name:    'CreatorEmail',
            mapping: 'creator.email',
            type:    'string',
            persist: false
        },
        CreatorName: {
            name:    'CreatorName',
            mapping: 'creator.displayName',
            type:    'string',
            persist: false
        },
        IsCreator: {
            name:    'IsCreator',
            mapping: 'creator.self',
            type:    'boolean',
            persist: false
        },
        
        // Organizer fields. Technically the organizer fields are persistable when importing events via
        // Google's import API (https://developers.google.com/google-apps/calendar/v3/reference/events/import).
        // However in all other cases organizer is read-only, and will be considered so in Extensible.
        OrganizerId: {
            name:    'OrganizerId',
            mapping: 'organizer.id',
            type:    'string',
            persist: false
        },
        OrganizerEmail: {
            name:    'OrganizerEmail',
            mapping: 'organizer.email',
            type:    'string',
            persist: false
        },
        OrganizerName: {
            name:    'OrganizerName',
            mapping: 'organizer.displayName',
            type:    'string',
            persist: false
        },
        IsOrganizer: {
            name:    'IsOrganizer',
            mapping: 'organizer.self',
            type:    'boolean',
            persist: false
        },
        
        // Other read-only fields
        Kind: {
            name:    'Kind',
            mapping: 'kind',
            type:    'string',
            persist: false
        },
        Etag: {
            name:    'Etag',
            mapping: 'etag',
            type:    'string',
            persist: false
        },
        ICalUID: {
            name:    'ICalUID',
            mapping: 'iCalUID',
            type:    'string',
            persist: false
        },
        IsPrivateCopy: {
            name:    'IsPrivateCopy',
            mapping: 'privateCopy',
            type:    'boolean',
            persist: false
        },
        HtmlLink: {
            // Url to the source event in Google calendar
            name:    'Url',
            mapping: 'htmlLink',
            type:    'string',
            persist: false
        },
        CreateDate: {
            name:       'CreateDate',
            mapping:    'created',
            type:       'date',
            dateFormat: 'c',
            persist:    false
        },
        UpdateDate: {
            name:       'UpdateDate',
            mapping:    'updated',
            type:       'date',
            dateFormat: 'c',
            persist:    false
        },
        
        //
        // Unsupported properties that are mapped, but probably won't ever do anything useful
        //
        EndTimeUnspecified: {
            // Even if this is set an end time will still be created for compatibility reasons internally
            // by Google Calendar. Extensible does not handle this and it should not be used.
            name:    'EndTimeUnspecified',
            mapping: 'endTimeUnspecified',
            type:    'string',
            persist: false
        },
        ExtendedProperties: {
            // This is actually a complex object, but it does not have a specified data model as
            // it is used to store custom key/value pairs. This mapping will simply dump the raw object
            // into the record's data, but it will not be otherwise explicitly used.
            name:        'ExtendedProperties',
            mapping:     'extendedProperties',
            defaultValue: null,
            persist:      false
        },
        Gadget: {
            // This is also a complex object, but is only used in the context of Google's calendar UI
            name:        'Gadget',
            mapping:     'gadget',
            defaultValue: null,
            persist:      false
        }
    };
    
    Extensible.calendar.data.EventModel.prototype.mappingClass = 'Extensible.calendar.google.EventMappings';
    Extensible.calendar.data.EventModel.reconfigure();
    
    /*Ext.override(Extensible.calendar.data.EventModel, {
        isEditable: function() {
            switch (this.data[Extensible.calendar.google.EventMappings.AccessRole.name]) {
                case 'owner':
                case 'writer':
                    return true;
            }
            return false;
        }
    });*/
});