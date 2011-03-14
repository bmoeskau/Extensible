/*
 * Default English (US) locale
 * By Extensible, LLC
 */
/*
 * A general note regarding pluralization... Some locales require conditional logic
 * to properly pluralize certain terms. When this might be required there is an additional
 * "get*" method in addition to the standard config. By default these simply return the
 * same value as the corresponding config, but if your locale requires such logic simply
 * implement the appropriate method bodies. The configs in these cases are still listed for
 * backwards compatibility, but they are deprecated and will be removed in a future release.
 * The Czech locale (extensible-lang-cs.js) is an example that uses these method overrides.
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Today',
        defaultEventTitleText: '(No title)',
        ddCreateEventText: 'Create event for {0}',
        ddMoveEventText: 'Move event to {0}',
        ddResizeEventText: 'Update event to {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} more...', // deprecated
        getMoreText: function(numEvents){
            return '+{0} more...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Today',
        dayText: 'Day',
        weekText: 'Week',
        monthText: 'Month',
        jumpToText: 'Jump to:',
        goText: 'Go',
        multiDayText: '{0} Days', // deprecated
        multiWeekText: '{0} Weeks', // deprecated
        getMultiDayText: function(numDays){
            return '{0} Days';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Weeks';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Add Event',
        titleTextEdit: 'Edit Event',
        savingMessage: 'Saving changes...',
        deletingMessage: 'Deleting event...',
        detailsLinkText: 'Edit Details...',
        saveButtonText: 'Save',
        deleteButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        titleLabelText: 'Title',
        datesLabelText: 'When',
        calendarLabelText: 'Calendar'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Event Form',
        titleTextAdd: 'Add Event',
        titleTextEdit: 'Edit Event',
        saveButtonText: 'Save',
        deleteButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        titleLabelText: 'Title',
        datesLabelText: 'When',
        reminderLabelText: 'Reminder',
        notesLabelText: 'Notes',
        locationLabelText: 'Location',
        webLinkLabelText: 'Web Link',
        calendarLabelText: 'Calendar',
        repeatsLabelText: 'Repeats'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'to',
        allDayText: 'All day'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendar'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendars'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Display only this calendar'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Repeats',
        recurrenceText: {
            none: 'Does not repeat',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            yearly: 'Yearly'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Reminder',
        noneText: 'None',
        atStartTimeText: 'At start time',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minute' : 'minutes';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'hour' : 'hours';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'day' : 'days';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'week' : 'weeks';
        },
        reminderValueFormat: '{0} {1} before start' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Edit Details',
        deleteText: 'Delete',
        moveToText: 'Move to...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'n/j'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'n/j'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'M j, Y',
        multiDayMonthStartFormat: 'M j'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, F j, Y'
    });
}
