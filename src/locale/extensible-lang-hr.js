/*
 * Default Croatian (hr_HR) locale
 * By Grgur Grisogono
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Today',
        defaultEventTitleText: '(Bez naziva)',
        ddCreateEventText: 'Novi dogadaj za {0}',
        ddMoveEventText: 'Premjesti dogadaj za {0}',
        ddResizeEventText: 'Promijeni vrijeme dogadaja na {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} više...',
        getMoreText: function(numEvents){
            return '+{0} više...';
        },
        detailsTitleDateFormat: 'F d'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Danas',
        dayText: 'Dan',
        weekText: 'Tjedan',
        monthText: 'Mjesec',
        jumpToText: 'Pokaži datum:',
        goText: 'Pokaži',
        multiDayText: '{0} dana',
        multiWeekText: '{0} tjedana',
        getMultiDayText: function(numDays){
            return '{0} dana';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} tjedana';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
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

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
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

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'do',
        allDayText: 'Cjelodnevni događaj'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Kalendar'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Kalendari'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Prikaži samo ovaj kalendar'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
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

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Podsjetnik',
        noneText: 'Nema',
        atStartTimeText: 'Na početku',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minut' : 'minuta';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'sat' : 'sati';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dan' : 'dana';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'tjedan' : 'tjedana';
        },
        reminderValueFormat: '{0} {1} prije početka' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd.m.Y.'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Izmjena unosa',
        deleteText: 'Briši',
        moveToText: 'Premjesti...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd.m.'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd.m.'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D m',
        otherWeeksDateFormat: 'm',
        singleDayDateFormat: 'l, m. F, Y',
        multiDayFirstDayFormat: 'd. M, Y',
        multiDayMonthStartFormat: 'd. M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, m. F, Y'
    });
}
