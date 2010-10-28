/*
 * Default English (US) locale
 */

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Today',
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
        titleTextAdd: 'Add Event',
        titleTextEdit: 'Edit Event',
        savingMessage: 'Saving changes...',
        deletingMessage: 'Deleting event...'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Display only this calendar'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendars'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        title: 'Event Form',
        titleTextAdd: 'Add Event',
        titleTextEdit: 'Edit Event'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'to',
        allDayText: 'All day'
    });
}