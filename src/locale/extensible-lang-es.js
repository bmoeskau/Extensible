/*
 * Spanish/Spain locale
 * By Alberto López Doñaque, <lopezdonaque@gmail.com>
 */

Ext.ensible.Date.use24HourTime = true;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 1,
        todayText: 'Hoy',
        defaultEventTitleText: '(Sin título)',
        ddCreateEventText: 'Crear evento desde {0}',
        ddMoveEventText: 'Mover evento a {0}',
        ddResizeEventText: 'Actualizar evento a {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} más...',
        detailsTitleDateFormat: 'j de F'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Hoy',
        dayText: 'Día',
        weekText: 'Semana',
        monthText: 'Mes',
        jumpToText: 'Ir a:',
        goText: 'Ir',
        multiDayText: '{0} días',
        multiWeekText: '{0} semanas'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Añadir evento',
        titleTextEdit: 'Editar evento',
        savingMessage: 'Guardando cambios...',
        deletingMessage: 'Borrando evento...',
        detailsLinkText: 'Editar detalles...',
        saveButtonText: 'Guardar',
        deleteButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'Título',
        datesLabelText: 'Cuando',
        calendarLabelText: 'Calendario'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 75,
        title: 'Formulario de evento',
        titleTextAdd: 'Añadir evento',
        titleTextEdit: 'Editar evento',
        saveButtonText: 'Guardar',
        deleteButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'Título',
        datesLabelText: 'Cuando',
        reminderLabelText: 'Recordatorio',
        notesLabelText: 'Notas',
        locationLabelText: 'Localización',
        webLinkLabelText: 'Enlace Web',
        calendarLabelText: 'Calendario',
        recurrenceLabelText: 'Repetir'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'a',
        allDayText: 'Todo el día'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calendario'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calendarios'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostrar solo este calendario'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Repeats',
        recurrenceText: {
            none: 'No repetir',
            daily: 'Diario',
            weekly: 'Semanal',
            monthly: 'Mensual',
            yearly: 'Anual'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Recordatorio',
        noneText: 'Ninguno',
        atStartTimeText: 'Al inicio',
        minutesText: 'minutos',
        hourText: 'hora',
        hoursText: 'horas',
        dayText: 'día',
        daysText: 'días',
        weekText: 'semana',
        weeksText: 'semanas',
        reminderValueFormat: '{0} {1} antes de empezar' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Editar detalles',
        deleteText: 'Borrar',
        moveToText: 'Mover a...'
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
        singleDayDateFormat: 'l, d de F de Y', // e.g. "Lunes, 12 de Enero de 2011"
        multiDayFirstDayFormat: 'd M, Y', // e.g. "09 Ene, 2011"
        multiDayMonthStartFormat: 'd M' // e.g. "01 Ene"
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, d de F de Y', // e.g. "Lunes, 12 de Enero de 2011"
    });
}
