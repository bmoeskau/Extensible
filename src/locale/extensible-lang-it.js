/*
 * Italian (IT) locale
 * By Stefano Perinetti - www.slweb.it
 */

Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Extensible.Date.use24HourTime = true;
    
    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: 'Oggi',
            defaultEventTitleText: '(Nessun titolo)',
            ddCreateEventText: 'Crea evento per {0}',
            ddMoveEventText: 'Sposta evento su {0}',
            ddResizeEventText: 'Aggiorna evento su {0}'
        });
    }
    
    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0} di più...',
            getMoreText: function(numEvents){
                return '+{0} di più...';
            },
            detailsTitleDateFormat: 'j F'
        });
    }
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: 'Oggi',
            dayText: 'Giorno',
            weekText: 'Settimana',
            monthText: 'Mese',
            jumpToText: 'Vai a:',
            goText: 'Go',
            multiDayText: '{0} Giorni',
            multiWeekText: '{0} Settimane',
            getMultiDayText: function(numDays){
                return '{0} Giorni';
            },
            getMultiWeekText: function(numWeeks){
                return '{0} Settimane';
            }
        });
    }
    
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
            width: 620,
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
    
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'Al',
            allDayText: 'Giornata'
        });
    }
    
    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'Calendario'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'Calendari'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'Mostra solo questo calendario'
        });
    }
    
    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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
    
    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
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
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'j/n/Y'
        });
    }
    
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'Modifica dettagli',
            deleteText: 'Elimina',
            moveToText: 'Sposta su...'
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
            multiDayMonthStartFormat: 'j M'
        });
    }
    
    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, j F Y'
        });
    }
});