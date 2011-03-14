/*
* Czech locale
* By Martin Kusyn (2011/03/09)
*/

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Dnes',
        defaultEventTitleText: '(Bez názvu)',
        ddCreateEventText: 'Vytvořit událost v čase {0}',
        ddMoveEventText: 'Přenést událost na {0}',
        ddResizeEventText: 'Aktualizovat událost v čase {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        detailsTitleDateFormat: 'j. F',
        getMoreText: function(numEvents){
            return numEvents < 5 ? '+{0} další...' : '+{0} dalších...';
        }
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Dnes',
        dayText: 'Den',
        weekText: 'Týden',
        monthText: 'Měsíc',
        jumpToText: 'Přejít na:',
        goText: 'Přejít',
        getMultiDayText: function(numDays){
            return numDays < 5 ? '{0} Dny' : '{0} Dní';
        },
        getMultiWeekText: function(numWeeks){
            return numWeeks < 5 ? '{0} Týdny' : '{0} Týdnů';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
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

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Událost',
        titleTextAdd: 'Přidat událost',
        titleTextEdit: 'Upravit událost',
        saveButtonText: 'Uložiz',
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

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'do',
        allDayText: 'Celý den'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Kalendář'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Kalendáře'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Zobrazit pouze tento kalendář'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
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

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Připomínka',
        noneText: 'Žádná',
        atStartTimeText: 'Na začátku',
        getMinutesText: function(numMinutes){
            if(numMinutes === 1){
                return 'minuta';
            }
            return numMinutes < 5 ? 'minuty' : 'minut';
        },
        getHoursText: function(numHours){
            if(numHours === 1){
                return 'hodina';
            }
            return numHours < 5 ? 'hodiny' : 'hodin';
        },
        getDaysText: function(numDays){
            if(numDays === 1){
                return 'den';
            }
            return numDays < 5 ? 'dny' : 'dní';
        },
        getWeeksText: function(numWeeks){
            if(numWeeks === 1){
                return 'týden';
            }
            return numWeeks < 5 ? 'týdny' : 'týdnů';
        },
        reminderValueFormat: '{0} {1} před začátkem' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'j. n. Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Upravit detaily',
        deleteText: 'Smazat',
        moveToText: 'Přesunout...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j.n.'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j.n'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j.',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, j. F Y',
        multiDayFirstDayFormat: 'j. M, Y',
        multiDayMonthStartFormat: 'j. M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, j. F Y'
    });
}