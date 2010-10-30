/*
 * French (France) locale
 * By devil1591 (Oct-26-2010)
 */

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Aujourd\'hui',
        moreText: '+{0} more...',
        defaultEventTitleText: '(No title)',
        ddCreateEventText: 'Créer évènement le {0}',
        ddMoveEventText: 'Déplacer évènement le {0}',
        ddResizeEventText: 'Update event to {0}'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Aujourd\'hui',
        dayText: 'Jour',
        weekText: 'Semaine',
        monthText: 'Mois',
        jumpToText: 'Aller au :',
        goText: 'OK',
        multiDayText: '{0} jours',
        weekText: 'Semaine',
        multiWeekText: '{0} semaines'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 640,
        labelWidth: 65,
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        savingMessage: 'Sauvegarde des changements...',
        deletingMessage: 'Suppression de l\'évènement...',
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
        title: 'Formulaire évènement',
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        saveButtonText: 'Save',
        deleteButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        titleLabelText: 'Title',
        datesLabelText: 'When',
        reminderLabelText: 'Reminder',
        notesLabelText: 'Notes',
        locationLabelText: 'Location',
        webLinkLabelText: 'Web Link',
        calendarLabelText: 'Calendrier',
        recurrenceLabelText: 'Repeats'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'au',
        allDayText: 'Toute la journée'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendrier'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendriers'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'N\'afficher que ce calendrier'
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
