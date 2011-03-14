/*
 * Catalan/Spain locale
 * By Alberto López Doñaque, <lopezdonaque@gmail.com>
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Avui',
        defaultEventTitleText: '(Sense t&iacute;tol)',
        ddCreateEventText: 'Crear event desde {0}',
        ddMoveEventText: 'Moure event a {0}',
        ddResizeEventText: 'Actualitzar event a {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} m&eacute;s...',
        getMoreText: function(numEvents){
            return '+{0} m&eacute;s...';
        },
        detailsTitleDateFormat: 'j \\de F'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Avui',
        dayText: 'Dia',
        weekText: 'Setmana',
        monthText: 'Mes',
        jumpToText: 'Anar a:',
        goText: 'Anar',
        multiDayText: '{0} dies',
        multiWeekText: '{0} setmanes',
        getMultiDayText: function(numDays){
            return '{0} dies';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} setmanes';
        }
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Afegir event',
        titleTextEdit: 'Editar event',
        savingMessage: 'Guardant canvis...',
        deletingMessage: 'Borrant event...',
        detailsLinkText: 'Editar detalls...',
        saveButtonText: 'Guardar',
        deleteButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'T&iacute;tol',
        datesLabelText: 'Quan',
        calendarLabelText: 'Calendari'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Formulari de vent',
        titleTextAdd: 'Afegir event',
        titleTextEdit: 'Editar event',
        saveButtonText: 'Guardar',
        deleteButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'T&iacute;tol',
        datesLabelText: 'Quan',
        reminderLabelText: 'Recordatori',
        notesLabelText: 'Notes',
        locationLabelText: 'Localitzaci&oacute;',
        webLinkLabelText: 'Enlla&ccedil; Web',
        calendarLabelText: 'Calendari',
        repeatsLabelText: 'Repetir'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'a',
        allDayText: 'Tot el dia'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendari'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendaris'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostrar nom&eacute;s aquest calendari'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Repeats',
        recurrenceText: {
            none: 'No repetir',
            daily: 'Diari',
            weekly: 'Setmanal',
            monthly: 'Mensual',
            yearly: 'Anual'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Recordatori',
        noneText: 'Cap',
        atStartTimeText: 'Al començament',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minut' : 'minuts';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'hora' : 'hores';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dia' : 'dies';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'setmana' : 'setmanes';
        },
        reminderValueFormat: '{0} {1} abans de començar' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Editar detalls',
        deleteText: 'Borrar',
        moveToText: 'Moure a...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd/m' // e.g. "25/12"
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd/m' // e.g. "25/12"
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D d', // e.g. "Lun 01"
        otherWeeksDateFormat: 'd',
        singleDayDateFormat: 'l, d \\de F \\de Y', // e.g. "Lunes, 12 de Enero de 2011"
        multiDayFirstDayFormat: 'd M, Y', // e.g. "09 Ene, 2011"
        multiDayMonthStartFormat: 'd M' // e.g. "01 Ene"
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, d \\de F \\de Y', // e.g. "Lunes, 12 de Enero de 2011"
    });
}
