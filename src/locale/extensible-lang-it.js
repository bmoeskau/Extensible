/*
 * Italian (IT) locale
 * By Stefano Perinetti - www.slweb.it
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Oggi',
        defaultEventTitleText: '(Nessun titolo)',
        ddCreateEventText: 'Crea evento per {0}',
        ddMoveEventText: 'Sposta evento su {0}',
        ddResizeEventText: 'Aggiorna evento su {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} di più...', // deprecated
        getMoreText: function(numEvents){
            return '+{0} di più...';
        },
        detailsTitleDateFormat: 'j F'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Oggi',
        dayText: 'Giorno',
        weekText: 'Settimana',
        monthText: 'Mese',
        jumpToText: 'Vai a:',
        goText: 'Go',
        multiDayText: '{0} Giorni', // deprecated
        multiWeekText: '{0} Settimane', // deprecated
        getMultiDayText: function(numDays){
            return '{0} Giorni';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Settimane';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Nuovo Evento',
        titleTextEdit: 'Modifica Evento',
        savingMessage: 'Salvo i cambiamenti...',
        deletingMessage: 'Elimino l\'evento...',
        detailsLinkText: 'Modifica Dettagli...',
        saveButtonText: 'Salva',
        deleteButtonText: 'Elimina',
        cancelButtonText: 'Cancella',
        titleLabelText: 'Titolo',
        datesLabelText: 'Quando',
        calendarLabelText: 'Calendario'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Evento',
        titleTextAdd: 'Nuovo Evento',
        titleTextEdit: 'Modifica Evento',
        saveButtonText: 'Salva',
        deleteButtonText: 'Elimina',
        cancelButtonText: 'Cancella',
        titleLabelText: 'Titolo',
        datesLabelText: 'Quando',
        reminderLabelText: 'Ricorda',
        notesLabelText: 'Note',
        locationLabelText: 'Località',
        webLinkLabelText: 'Web Link',
        calendarLabelText: 'Calendario',
        repeatsLabelText: 'Ripetizioni'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'Al',
        allDayText: 'Giornata'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendario'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendari'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostra solo questo calendario'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Ripeti',
        recurrenceText: {
            none: 'Non ripetere',
            daily: 'Giornalmente',
            weekly: 'Settimanalmente',
            monthly: 'Mensilmente',
            yearly: 'Annualmente'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Allarme',
        noneText: 'Nessuno',
        atStartTimeText: 'All\'inizio',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minuto' : 'minuti';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'ora' : 'ore';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'giorno' : 'giorni';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'settimana' : 'settimane';
        },
        reminderValueFormat: '{0} {1} prima' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'j/n/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Modifica dettagli',
        deleteText: 'Elimina',
        moveToText: 'Sposta su...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j/n'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j/n'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, j F Y',
        multiDayFirstDayFormat: 'j M Y',
        multiDayMonthStartFormat: 'j M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, j F Y'
    });
}
