/*
 * German (DE) locale
 * Contributors: 
 * - Tobias Uhlig, http://extthemes.com/
 * - Gunnar Beushausen
 * - Joern Heid
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Heute',
        defaultEventTitleText: '(kein titel)',
        ddCreateEventText: 'Termin erstellen f\u00FCr {0}',
        ddMoveEventText: 'Termin verschieben nach {0}',
        ddResizeEventText: 'Termin updaten nach {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} weitere...',
        getMoreText: function(numEvents){
            return '+{0} weitere...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Heute',
        dayText: 'Tag',
        weekText: 'Woche',
        monthText: 'Monat',
        jumpToText: 'Springe zu:',
        goText: 'Los',
        multiDayText: '{0} Tage',
        multiWeekText: '{0} Wochen',
        getMultiDayText: function(numDays){
            return '{0} Tage';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Wochen';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 640,
        labelWidth: 65,
        titleTextAdd: 'Termin erstellen',
        titleTextEdit: 'Termin editieren',
        savingMessage: 'Speichere Daten...',
        deletingMessage: 'L\u00F6sche Termin...',
        detailsLinkText: 'Einzelheiten bearbeiten...',
        saveButtonText: 'Speichern',
        deleteButtonText: 'L\u00F6schen',
        cancelButtonText: 'Abbrechen',
        titleLabelText: 'Titel',
        datesLabelText: 'Wann',
        calendarLabelText: 'Kalender'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Termin Formular',
        titleTextAdd: 'Termin hinzuf\u00FCgen',
        titleTextEdit: 'Termin editieren',
        saveButtonText: 'Speichern',
        deleteButtonText: 'L\u00F6schen',
        cancelButtonText: 'Abbrechen',
        titleLabelText: 'Titel',
        datesLabelText: 'Wann',
        reminderLabelText: 'Erinnerung',
        notesLabelText: 'Notizen',
        locationLabelText: 'Ort',
        webLinkLabelText: 'Web Link',
        calendarLabelText: 'Kalender',
        repeatsLabelText: 'Wiederholungen'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'bis',
        allDayText: 'ganzer Tag'
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
            none: 'keine Wiederholungen',
            daily: 't\u00E4glich',
            weekly: 'w\u00F6chentlich',
            monthly: 'monatlich',
            yearly: 'j\u00E4hrlich'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Erinnerung',
        noneText: 'keine',
        atStartTimeText: 'zur Startzeit',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'Minute' : 'Minuten';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'Stunde' : 'Stunden';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'Tag' : 'Tage';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'Woche' : 'Wochen';
        },
        reminderValueFormat: '{0} {1} vor Terminbeginn' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'j.n.Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Einzelheiten bearbeiten',
        deleteText: 'L\u00F6schen',
        moveToText: 'Verschieben nach...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j.n'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j.n'
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
