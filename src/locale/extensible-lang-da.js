/*
 * Default Danish (DK) locale
 * By Extensible, LLC
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Idag',
        defaultEventTitleText: '(Ingen titel)',
        ddCreateEventText: 'Opret begivenhed den {0}',
        ddMoveEventText: 'Flyt begivenhed til {0}',
        ddResizeEventText: 'Opdatér begivenhed til {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} flere...',
        detailsTitleDateFormat: 'd F'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Idag',
        dayText: 'Dag',
        weekText: 'Uge',
        monthText: 'Måned',
        jumpToText: 'Gå til:',
        goText: 'Gå',
        multiDayText: '{0} dage',
        multiWeekText: '{0} uger'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Tilføj begivenhed',
        titleTextEdit: 'Ret begivenhed',
        savingMessage: 'Gemmer ændringer...',
        deletingMessage: 'Sletter begivenhed...',
        detailsLinkText: 'Ret detaljer...',
        saveButtonText: 'Gem',
        deleteButtonText: 'Slet',
        cancelButtonText: 'Annulér',
        titleLabelText: 'Titel',
        datesLabelText: 'Hvornår',
        calendarLabelText: 'Kalender'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Begivenhed formular',
        titleTextAdd: 'Tilføj begivenhed',
        titleTextEdit: 'Ret begivenhed',
        saveButtonText: 'Gem',
        deleteButtonText: 'Slet',
        cancelButtonText: 'Annulér',
        titleLabelText: 'Title',
        datesLabelText: 'Hvornår',
        reminderLabelText: 'Påmindelse',
        notesLabelText: 'Noter',
        locationLabelText: 'Placering',
        webLinkLabelText: 'Web link',
        calendarLabelText: 'Kalender',
        recurrenceLabelText: 'Gentagelser'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'til',
        allDayText: 'Hele dagen'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Kalender'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Kalendere'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Vis kun denne kalender'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Gentagelser',
        recurrenceText: {
            none: 'Gentages ikke',
            daily: 'Daglig',
            weekly: 'Ugentlig',
            monthly: 'Månedlig',
            yearly: 'Årlig'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Påmindelse',
        noneText: 'Ingen',
        atStartTimeText: 'Ved start tidspunkt',
        minutesText: 'minutter',
        hourText: 'time',
        hoursText: 'timer',
        dayText: 'dag',
        daysText: 'dage',
        weekText: 'uge',
        weeksText: 'uger',
        reminderValueFormat: '{0} {1} før start' // f.eks. "2 timer før start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Ret detaljer',
        deleteText: 'Slet',
        moveToText: 'Flyt til...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd/m'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd/m'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D d',
        otherWeeksDateFormat: 'd',
        singleDayDateFormat: 'l d F Y',
        multiDayFirstDayFormat: 'd M Y',
        multiDayMonthStartFormat: 'd M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l d F Y'
    });
}
