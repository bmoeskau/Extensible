/*
* Czech locale
* By Martin Kusyn (2011/03/09)
*/

Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Extensible.Date.use24HourTime = true;
    
    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 1,
            todayText: 'Dnes',
            defaultEventTitleText: '(Bez názvu)',
            ddCreateEventText: 'Vytvořit událost v čase {0}',
            ddMoveEventText: 'Přenést událost na {0}',
            ddResizeEventText: 'Aktualizovat událost v čase {0}'
        });
    }
    
    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            detailsTitleDateFormat: 'j. F',
            getMoreText: function(numEvents) {
                return numEvents < 5 ? '+{0} další...' : '+{0} dalších...';
            }
        });
    }
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: 'Dnes',
            dayText: 'Den',
            weekText: 'Týden',
            monthText: 'Měsíc',
            jumpToText: 'Přejít na:',
            goText: 'Přejít',
            getMultiDayText: function(numDays) {
                return numDays < 5 ? '{0} Dny' : '{0} Dní';
            },
            getMultiWeekText: function(numWeeks) {
                return numWeeks < 5 ? '{0} Týdny' : '{0} Týdnů';
            }
        });
    }
    
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
            width: 600,
            labelWidth: 65,
            titleTextAdd: 'Přidat událost',
            titleTextEdit: 'Upravit událost',
            savingMessage: 'Ukládání změn...',
            deletingMessage: 'Smazat událost...',
            detailsLinkText: 'Upravit detaily...',
            saveButtonText: 'Uložit',
            deleteButtonText: 'Smazat',
            cancelButtonText: 'Storno',
            titleLabelText: 'Název',
            datesLabelText: 'Kdy',
            calendarLabelText: 'Kalendář'
        });
    }
    
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
            labelWidth: 65,
            labelWidthRightCol: 65,
            title: 'Událost',
            titleTextAdd: 'Přidat událost',
            titleTextEdit: 'Upravit událost',
            saveButtonText: 'Uložit',
            deleteButtonText: 'Smazat',
            cancelButtonText: 'Storno',
            titleLabelText: 'Název',
            datesLabelText: 'Kdy',
            reminderLabelText: 'Upomínka',
            notesLabelText: 'Poznámky',
            locationLabelText: 'Kde',
            webLinkLabelText: 'Odkaz',
            calendarLabelText: 'Kalendář',
            repeatsLabelText: 'Opakování'
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'do',
            allDayText: 'Celý den'
        });
    }
    
    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'Kalendář'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'Kalendáře'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'Zobrazit pouze tento kalendář'
        });
    }
    
    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
            fieldLabel: 'Opakování',
            recurrenceText: {
                none: 'Neopakovat',
                daily: 'Denně',
                weekly: 'Týdně',
                monthly: 'Mesíčně',
                yearly: 'Ročně'
            }
        });
    }
    
    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
            fieldLabel: 'Připomínka',
            noneText: 'Žádná',
            atStartTimeText: 'Na začátku',
            getMinutesText: function(numMinutes) {
                if(numMinutes === 1) {
                    return 'minuta';
                }
                return numMinutes < 5 ? 'minuty' : 'minut';
            },
            getHoursText: function(numHours) {
                if(numHours === 1) {
                    return 'hodina';
                }
                return numHours < 5 ? 'hodiny' : 'hodin';
            },
            getDaysText: function(numDays) {
                if(numDays === 1) {
                    return 'den';
                }
                return numDays < 5 ? 'dny' : 'dní';
            },
            getWeeksText: function(numWeeks) {
                if(numWeeks === 1) {
                    return 'týden';
                }
                return numWeeks < 5 ? 'týdny' : 'týdnů';
            },
            reminderValueFormat: '{0} {1} před začátkem' // e.g. "2 hours before start"
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'j. n. Y'
        });
    }
    
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'Upravit detaily',
            deleteText: 'Smazat',
            moveToText: 'Přesunout...'
        });
    }
    
    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'j.n.'
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
            firstWeekDateFormat: 'D j.',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'l, j. F Y',
            multiDayFirstDayFormat: 'j. M, Y',
            multiDayMonthStartFormat: 'j. M'
        });
    }
    
    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, j. F Y'
        });
    }
    
    if(Ext.form.TimeField) {
        Ext.apply(Ext.form.TimeField.prototype, {
            minText : "Čas v tomto poli musí být stejný nebo pozdější než {0}",
            maxText : "Čas v tomto poli musí být stejný nebo dřívější než {0}",
            invalidText : "{0} není platný čas",
            format : "H:i",
            altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
        });
    }
});