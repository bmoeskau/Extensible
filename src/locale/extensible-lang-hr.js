/*
 * Default Croatian (hr_HR) locale
 * By Grgur Grisogono
 */

Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Extensible.Date.use24HourTime = false;
    
    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: 'Today',
            defaultEventTitleText: '(Bez naziva)',
            ddCreateEventText: 'Novi dogadaj za {0}',
            ddMoveEventText: 'Premjesti dogadaj za {0}',
            ddResizeEventText: 'Promijeni vrijeme dogadaja na {0}'
        });
    }
    
    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0} više...',
            getMoreText: function(numEvents) {
                return '+{0} više...';
            },
            detailsTitleDateFormat: 'F d'
        });
    }
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: 'Danas',
            dayText: 'Dan',
            weekText: 'Tjedan',
            monthText: 'Mjesec',
            jumpToText: 'Pokaži datum:',
            goText: 'Pokaži',
            multiDayText: '{0} dana',
            multiWeekText: '{0} tjedana',
            getMultiDayText: function(numDays) {
                return '{0} dana';
            },
            getMultiWeekText: function(numWeeks) {
                return '{0} tjedana';
            }
        });
    }
    
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
            width: 660,
            labelWidth: 60,
            titleTextAdd: 'Novi unos',
            titleTextEdit: 'Izmjeni unos',
            savingMessage: 'Spremam promjene...',
            deletingMessage: 'Brišem unos...',
            detailsLinkText: 'Izmjena detalja unosa...',
            saveButtonText: 'Spremi',
            deleteButtonText: 'Briši',
            cancelButtonText: 'Odustani',
            titleLabelText: 'Naziv',
            datesLabelText: 'Vrijeme',
            calendarLabelText: 'Kalendar'
        });
    }
    
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
            labelWidth: 65,
            labelWidthRightCol: 90,
            title: 'Obrada unosa',
            titleTextAdd: 'Novi unos',
            titleTextEdit: 'Izmjena unosa',
            saveButtonText: 'Spremi',
            deleteButtonText: 'Briši',
            cancelButtonText: 'Odustani',
            titleLabelText: 'Naziv',
            datesLabelText: 'Vrijeme',
            reminderLabelText: 'Podsjetnik',
            notesLabelText: 'Bilješke',
            locationLabelText: 'Lokacija',
            webLinkLabelText: 'Internet adresa',
            calendarLabelText: 'Kalendar',
            repeatsLabelText: 'Ponavljanje'
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: 'do',
            allDayText: 'Cjelodnevni događaj'
        });
    }
    
    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: 'Kalendar'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: 'Kalendari'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: 'Prikaži samo ovaj kalendar'
        });
    }
    
    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
            fieldLabel: 'Ponavljanje',
            recurrenceText: {
                none: 'Ne ponavlja se',
                daily: 'Dnevno',
                weekly: 'Tjedno',
                monthly: 'Mjesečno',
                yearly: 'Godišnje'
            }
        });
    }
    
    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
            fieldLabel: 'Podsjetnik',
            noneText: 'Nema',
            atStartTimeText: 'Na početku',
            getMinutesText: function(numMinutes) {
                return 'minuta';
            },
            getHoursText: function(numHours) {
                return numHours === 1 ? 'sat' : 'sati';
            },
            getDaysText: function(numDays) {
                return numDays === 1 ? 'dan' : 'dana';
            },
            getWeeksText: function(numWeeks) {
                return numWeeks === 1 ? 'tjedan' : 'tjedana';
            },
            reminderValueFormat: '{0} {1} prije početka' // e.g. "2 hours before start"
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'd.m.Y.'
        });
    }
    
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: 'Izmjena unosa',
            deleteText: 'Briši',
            moveToText: 'Premjesti...'
        });
    }
    
    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'd.m.'
        });
    }
    
    if (exists('Extensible.calendar.dd.DayDropZone')) {
        Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'd.m.'
        });
    }
    
    if (exists('Extensible.calendar.template.BoxLayout')) {
        Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D m',
            otherWeeksDateFormat: 'm',
            singleDayDateFormat: 'l, m. F, Y',
            multiDayFirstDayFormat: 'd. M, Y',
            multiDayMonthStartFormat: 'd. M'
        });
    }
    
    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, m. F, Y'
        });
    }
});