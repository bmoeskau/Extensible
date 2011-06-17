/*
 * German (DE) locale
 * Contributors: 
 * - Tobias Uhlig, http://extthemes.com/
 * - Gunnar Beushausen
 */

Extensible.Date.use24HourTime = true;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 0,
        todayText: 'Heute',
        defaultEventTitleText: '(kein titel)',
        ddCreateEventText: 'Event erstellen für {0}',
        ddMoveEventText: 'Event verschieben nach {0}',
        ddResizeEventText: 'Event updaten nach {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} weitere...',
        getMoreText: function(numEvents){
            return '+{0} weitere...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: 'Heute',
        dayText: 'Tag',
        weekText: 'Woche',
        monthText: 'Monat',
        jumpToText: 'Springe zu:',
        goText: 'los',
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

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Event erstellen',
        titleTextEdit: 'Event editieren',
        savingMessage: 'Speichere Daten...',
        deletingMessage: 'Lösche events...',
        detailsLinkText: 'Editiere Details...',
        saveButtonText: 'speichern',
        deleteButtonText: 'Löschen',
        cancelButtonText: 'Abbrechen',
        titleLabelText: 'Titel',
        datesLabelText: 'Wann',
        calendarLabelText: 'Kalender'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Event Formular',
        titleTextAdd: 'Event hinzufügen',
        titleTextEdit: 'Event editieren',
        saveButtonText: 'Speichern',
        deleteButtonText: 'Löschen',
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

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'bis',
        allDayText: 'ganzer Tag'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Kalender'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Kalender'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Nur diesen Kalender anzeigen'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: 'Wiederholungen',
        recurrenceText: {
            none: 'keine Wiederholungen',
            daily: 'täglich',
            weekly: 'wöchentlich',
            monthly: 'monatlich',
            yearly: 'jährlich'
        }
    });
}

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
        fieldLabel: 'Erinnerung',
        noneText: 'keine',
        atStartTimeText: 'zur Startzeit',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minute' : 'minuten';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'stunde' : 'stunden';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'tag' : 'tage';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'woche' : 'wochen';
        },
        reminderValueFormat: '{0} {1} vor Terminbeginn' // e.g. "2 hours before start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'j.n.Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Details editieren',
        deleteText: 'Löschen',
        moveToText: 'verschieben nach...'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j.n'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j.n'
    });
}

if(Extensible.calendar.template.BoxLayout) {
    Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'M j, Y',
        multiDayMonthStartFormat: 'M j'
    });
}

if(Extensible.calendar.template.Month) {
    Ext.apply(Extensible.calendar.template.Month.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, F j, Y'
    });
}
