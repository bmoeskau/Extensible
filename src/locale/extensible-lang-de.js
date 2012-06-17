/*
 * German (DE) locale
 * Contributors: 
 * - Tobias Uhlig, http://extthemes.com/
 * - Gunnar Beushausen
 * - Joern Heid
 */

Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Extensible.Date.use24HourTime = true;
    
    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: 'Heute',
            defaultEventTitleText: '(kein titel)',
            ddCreateEventText: 'Termin erstellen f\u00FCr {0}',
            ddMoveEventText: 'Termin verschieben nach {0}',
            ddResizeEventText: 'Termin updaten nach {0}'
        });
    }
    
    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0} weitere...',
            getMoreText: function(numEvents){
                return '+{0} weitere...';
            },
            detailsTitleDateFormat: 'F j'
        });
    }
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: 'Heute',
            dayText: 'Tag',
            weekText: 'Woche',
            monthText: 'Monat',
            agendaText: 'Agenda',
            listText: 'Liste',
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
    
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
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
    
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'bis',
            allDayText: 'ganzer Tag'
        });
    }
    
    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'Kalender'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'Kalender'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'Nur diesen Kalender anzeigen'
        });
    }
    
    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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
    
    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
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
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'j.n.Y'
        });
    }
    
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'Einzelheiten bearbeiten',
            deleteText: 'L\u00F6schen',
            moveToText: 'Verschieben nach...'
        });
    }
    
    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'j.n'
        });
    }
    
    if (exists('Extensible.calendar.dd.DayDropZone')) {
        Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'j.n'
        });
    }
    
    if (exists('Extensible.calendar.template.BoxLayout')) {
        Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D j',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'l, F j, Y',
            multiDayFirstDayFormat: 'M j, Y',
            multiDayMonthStartFormat: 'M j'
        });
    }
    
    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, F j, Y'
        });
    }

    if (exists('Extensible.calendar.template.AgendaBody')) {
        Ext.apply(Extensible.calendar.template.AgendaBody.prototype, {
            dayDateFormat: 'D. j. M.',
            hourFormat: 'G:i',
            allDayText: 'Ganzer Tag',
            locationText: 'Ort',
            webLinkText: 'Web Link',
            notesText: 'Bemerkung',
            noEventsText: 'Für den gewählten Datumsbereich existieren keine Termine.',
            prevLinkText: 'Zurück',
            nextLinkText: 'Weiter',
            reminderTooltip: 'Erinnerung ist aktiviert',
            recurringTooltip: 'Wiederkehrender Termin'
        });
    }

    if (exists('Extensible.calendar.view.AgendaHeader')) {
        Ext.apply(Extensible.calendar.view.AgendaHeader.prototype, {
            dateRangeOneDay: 'Ein Tag',
            dateRangeOneWeek: 'Eine Woche',
            dateRangeOneMonth: 'Ein Monat',
            dateRangeThreeMonths: 'Drei Monate',
            dateRangeOneYear: 'Ein Jahr',
            dateRangeText: 'Datumsbereich',
            groupByMonths: 'Monat',
            groupByWeek: 'Woche',
            groupByNone: 'Nichts',
            groupByText: 'Gruppieren nach',
            showDetailsText: 'Details zeigen',
            addBtnText: 'Neuer Termin',
            resetBtnText: 'Zurücksetzen'
        });
    }

});