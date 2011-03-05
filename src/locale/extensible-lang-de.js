/*
 * German (DE) locale
 * By Tobias Uhlig, http://extthemes.com/
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Today',
        defaultEventTitleText: '(Kein Titel)',
        ddCreateEventText: 'Erstelle Termin für {0}',
        ddMoveEventText: 'Verschiebe Termin nach {0}',
        ddResizeEventText: 'Ändere Termin auf {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} mehr...',
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Heute',
        dayText: 'Tag',
        weekText: 'Woche',
        monthText: 'Monat',
        jumpToText: 'Gehe zu:',
        goText: 'Go',  // maybe 'Los'
        multiDayText: '{0} Tage',
        multiWeekText: '{0} Wochen'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Termin hinzufügen',
        titleTextEdit: 'Termin bearbeiten',
        savingMessage: 'Änderungen werden gespeichert...',
        deletingMessage: 'Der Termin wird gelöscht...',
        detailsLinkText: 'Details bearbeiten...',
        saveButtonText: 'Speichern',
        deleteButtonText: 'Entfernen',  // or more directly 'Löschen'
        cancelButtonText: 'Abbrechen',
        titleLabelText: 'Titel',
        datesLabelText: 'Wann',  // not sure if the context matches
        calendarLabelText: 'Kalender'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Termin vom',
        titleTextAdd: 'Termin hinzufügen',
        titleTextEdit: 'Termin bearbeiten',
        saveButtonText: 'Speichern',
        deleteButtonText: 'Entfernen',  // or more directly 'Löschen'
        cancelButtonText: 'Abbrechen',
        titleLabelText: 'Titel',
        datesLabelText: 'Wann',  // not sure if the context matches
        reminderLabelText: 'Reminder',  // or 'Erinnerung'
        notesLabelText: 'Notizen',
        locationLabelText: 'Ort',
        webLinkLabelText: 'Weblink',
        calendarLabelText: 'Kalender',
        repeatsLabelText: 'Wiederholungen'  // or 'Serie' -> series
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'bis', // not sure if the context matches
        allDayText: 'Ganztägig'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Kalender'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Kalender'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Nur diesen Kalender anzeigen'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Wiederholungen',
        recurrenceText: {
            none: 'Keine Wiederholungen',
            daily: 'Täglich',
            weekly: 'Wöchentlich',
            monthly: 'Monatlich',
            yearly: 'Jährlich'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Reminder', // or 'Erinnerung'
        noneText: 'Keine',  // depends on context
        atStartTimeText: 'Zur Startzeit',
        minutesText: 'Minuten',
        hourText: 'Stunde',
        hoursText: 'Stunden',
        dayText: 'Tag',
        daysText: 'Tage',
        weekText: 'Woche',
        weeksText: 'Wochen',
        reminderValueFormat: '{0} {1} vor dem Start' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd.m.Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Details bearbeiten',
        deleteText: 'Löschen',
        moveToText: 'Verschieben nach...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd.m.'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd.m.'
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
