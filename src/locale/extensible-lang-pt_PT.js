/*
* Portuguese/Portugal (pt_PT) locale
* Original credits to Wemerson Januario <wemerson.januario@gmail.com> Goiânia GO, Brazil
* Update to PT by Rui Monteiro <rmonteiro@opensoft.pt> Amoreiras, Portugal
*/

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: 'Hoje',
        defaultEventTitleText: '(Sem T&iacute;tulo)',
        ddCreateEventText: 'Criar Evento para {0}',
        ddMoveEventText: 'Mover Evento para {0}',
        ddResizeEventText: 'Alterar Evento para {0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0} mais...',
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: 'Hoje',
        dayText: 'Dia',
        weekText: 'Semana',
        monthText: 'M&ecirc;s',
        jumpToText: 'Ir para:',
        goText: 'Prosseguir',
        multiDayText: '{0} Dias',
        multiWeekText: '{0} Semanas'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: 'Adicionar Evento',
        titleTextEdit: 'Alterar Evento',
        savingMessage: 'A Guardar...',
        deletingMessage: 'A Remover Evento...',
        detailsLinkText: 'Alterar Detalhes...',
        saveButtonText: 'Guardar',
        deleteButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'T&iacute;tulo',
        datesLabelText: 'Quando',
        calendarLabelText: 'Calend&aacute;rio'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: 'Formul&aacute;rio de Evento',
        titleTextAdd: 'Adicionar Evento',
        titleTextEdit: 'Alterar Evento',
        saveButtonText: 'Guardar',
        deleteButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        titleLabelText: 'T&iacute;tulo',
        datesLabelText: 'Quando',
        reminderLabelText: 'Lembrete',
        notesLabelText: 'Observa&ccedil;&atilde;o',
        locationLabelText: 'Local',
        webLinkLabelText: 'Site',
        calendarLabelText: 'Calend&aacute;rio',
        recurrenceLabelText: 'Repeti&ccedil;oes'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: 'para',
        allDayText: 'Dia todo'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: 'Calend&aacute;rio'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: 'Calend&aacute;rios'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostrar apenas esse Calend&aacute;rio'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: 'Repeti&ccedil;oes',
        recurrenceText: {
            none: 'N&atilde;o repetir',
            daily: 'Diariamente',
            weekly: 'Semanalmente',
            monthly: 'Mensalmente',
            yearly: 'Anualmente'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: 'Lembrete',
        noneText: 'Nenhum',
        atStartTimeText: 'H&aacute; hora de in&iacute;cio',
        minutesText: 'minutos',
        hourText: 'hora',
        hoursText: 'horas',
        dayText: 'dia',
        daysText: 'dias',
        weekText: 'semana',
        weeksText: 'semanas',
        reminderValueFormat: '{0} {1} antes do programado'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'j/n/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: 'Alterar detalhes',
        deleteText: 'Remover',
        moveToText: 'Mover para...'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j/n'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j/n'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, j F , Y',
        multiDayFirstDayFormat: 'j M , Y',
        multiDayMonthStartFormat: 'j M'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, j F , Y'
    });
}