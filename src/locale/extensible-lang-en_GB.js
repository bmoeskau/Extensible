/*
 * English GB (en_GB) locale.
 *
 * The English GB locale is mostly a copy of the default English locale. The main differences
 * are the date formats.
 * 
 * By Extensible, LLC
 * Contributors:
 * - Gabriel Sidler, http://www.teamup.com/
 */

Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);

    Extensible.Date.use24HourTime = false;

    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: 'Today',
            defaultEventTitleText: '(No title)',
            ddCreateEventText: 'Create event for {0}',
            ddMoveEventText: 'Move event to {0}',
            ddResizeEventText: 'Update event to {0}'
        });
    }

    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0} more...', // deprecated
            getMoreText: function(numEvents){
                return '+{0} more...';
            },
            detailsTitleDateFormat: 'j F'
        });
    }

    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
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

    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
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

    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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

    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'to',
            allDayText: 'All day'
        });
    }

    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'Calendar'
        });
    }

    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'Calendars'
        });
    }

    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'Display only this calendar'
        });
    }

    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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

    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
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

    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'j/n/Y'
        });
    }

    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'Edit Details',
            deleteText: 'Delete',
            moveToText: 'Move to...'
        });
    }

    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'j/n'
        });
    }

    if (exists('Extensible.calendar.dd.DayDropZone')) {
        Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'j/n'
        });
    }

    if (exists('Extensible.calendar.template.BoxLayout')) {
        Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D j',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'l, j F Y',
            multiDayFirstDayFormat: 'j M Y',
            multiDayMonthStartFormat: 'M j'
        });
    }

    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, j F Y'
        });
    }
});