/*
 * Polish locale
 * By ma_gro
 */

Ext.ensible.Date.use24HourTime = true;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 0,
        todayText: 'Dzisiaj',
        defaultEventTitleText: '(Brak tytułu)',
        ddCreateEventText: 'Utwórz wydarzenie dla {0}',
        ddMoveEventText: 'Przenieś wydarzenie do {0}',
        ddResizeEventText: 'Aktualizuj wydarzenie do {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} więcej...',
        getMoreText: function(numEvents){
            return '+{0} więcej...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: 'Dzisiaj',
        dayText: 'Dzień',
        weekText: 'Tydzień',
        monthText: 'Miesiąc',
        jumpToText: 'Przejdź do:',
        goText: 'Przejdź',
        multiDayText: '{0} Dni',
        multiWeekText: '{0} Tygodnie',
        getMultiDayText: function(numDays){
            return '{0} Dni';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Tygodnie';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Tworzenie wydarzenia',
        titleTextEdit: 'Edycja wydarzenia',
        savingMessage: 'Zapisywanie zmian...',
        deletingMessage: 'Usuwanie wydarzenia...',
        detailsLinkText: 'Edycja szczegółów...',
        saveButtonText: 'Zapisz',
        deleteButtonText: 'Usuń',
        cancelButtonText: 'Anuluj',
        titleLabelText: 'Tytuł',
        datesLabelText: 'Kiedy',
        calendarLabelText: 'Kalendarz'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Formularz wydarzenia',
        titleTextAdd: 'Tworzenie wydarzenia',
        titleTextEdit: 'Edycja wydarzenia',
        saveButtonText: 'Zapisz',
        deleteButtonText: 'Usuń',
        cancelButtonText: 'Anuluj',
        titleLabelText: 'Tytuł',
        datesLabelText: 'Kiedy',
        reminderLabelText: 'Przypomnij',
        notesLabelText: 'Notatki',
        locationLabelText: 'Lokalizacja',
        webLinkLabelText: 'Adres web',
        calendarLabelText: 'Kalendarz',
        repeatsLabelText: 'Powtarzaj'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'do',
        allDayText: 'Cały dzień'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Kalendarz'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Kalendarze'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Wyświetlaj tylko ten kalendarz'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: 'Powtarzaj',
        recurrenceText: {
            none: 'Nie powtarzaj',
            daily: 'Codziennie',
            weekly: 'Cotygodniowo',
            monthly: 'Raz na miesiąc',
            yearly: 'Raz na rok'
        }
    });
}

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
        fieldLabel: 'Reminder',
        noneText: 'Brak',
        atStartTimeText: 'W momencie startu',
        getMinutesText: function(numMinutes){
            return 'minut';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'godzina' : 'godziny';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dzień' : 'dni';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'tydzień' : 'tygodni';
        },
        reminderValueFormat: '{0} {1} przed startem' // e.g. "2 hours before start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Edycja szczegółów',
        deleteText: 'Usuń',
        moveToText: 'Przenieś do...'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'n/j'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'n/j'
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
