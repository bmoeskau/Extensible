/*
 * Default English (US) locale
 * By Extensible, LLC
 */

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Today',
        moreText: '+{0} more...',
        defaultEventTitleText: '(No title)',
        ddCreateEventText: 'Create event for {0}',
        ddMoveEventText: 'Move event to {0}',
        ddResizeEventText: 'Update event to {0}'
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
        multiDayText: '{0} Days',
        weekText: 'Week',
        multiWeekText: '{0} Weeks'
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
        recurrenceLabelText: 'Repeats'
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
        minutesText: 'minutes',
        hourText: 'hour',
        hoursText: 'hours',
        dayText: 'day',
        daysText: 'days',
        weekText: 'week',
        weeksText: 'weeks',
        reminderValueFormat: '{0} {1} before start' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Edit Details',
        deleteText: 'Delete',
        moveToText: 'Move to...'
    });
}
