/*
 * Polish locale
 * By ma_gro
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Dzisiaj',
        defaultEventTitleText: '(Brak tytułu)',
        ddCreateEventText: 'Utwórz wydarzenie dla {0}',
        ddMoveEventText: 'Przenieś wydarzenie do {0}',
        ddResizeEventText: 'Aktualizuj wydarzenie do {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} więcej...',
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Dzisiaj',
        dayText: 'Dzień',
        weekText: 'Tydzień',
        monthText: 'Miesiąc',
        jumpToText: 'Przejdź do:',
        goText: 'Przejdź',
        multiDayText: '{0} Dni',
        multiWeekText: '{0} Tygodnie'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
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

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
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

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'do',
        allDayText: 'Cały dzień'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Kalendarz'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Kalendarze'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Wyświetlaj tylko ten kalendarz'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
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

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Reminder',
        noneText: 'Brak',
        atStartTimeText: 'W momencie startu',
        minutesText: 'minut',
        hourText: 'godzina',
        hoursText: 'godziny',
        dayText: 'dzień',
        daysText: 'dni',
        weekText: 'tydzień',
        weeksText: 'tygodni',
        reminderValueFormat: '{0} {1} przed startem' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Edycja szczegółów',
        deleteText: 'Usuń',
        moveToText: 'Przenieś do...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'n/j'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'n/j'
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
