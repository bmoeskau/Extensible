/*
* Portuguese/Portugal (pt_PT) locale
* Original credits to Wemerson Januario <wemerson.januario@gmail.com> Goiânia GO, Brazil
* Update to PT by Rui Monteiro <rmonteiro@opensoft.pt> Amoreiras, Portugal
*/

Ext.ensible.Date.use24HourTime = false;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 0,
        todayText: 'Hoje',
        defaultEventTitleText: '(Sem T&iacute;tulo)',
        ddCreateEventText: 'Criar Evento para {0}',
        ddMoveEventText: 'Mover Evento para {0}',
        ddResizeEventText: 'Alterar Evento para {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} mais...',
        getMoreText: function(numEvents){
            return '+{0} mais...';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: 'Hoje',
        dayText: 'Dia',
        weekText: 'Semana',
        monthText: 'M&ecirc;s',
        jumpToText: 'Ir para:',
        goText: 'Prosseguir',
        multiDayText: '{0} Dias',
        multiWeekText: '{0} Semanas',
        getMultiDayText: function(numDays){
            return '{0} Dias';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} Semanas';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
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

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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
        repeatsLabelText: 'Repeti&ccedil;oes'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'para',
        allDayText: 'Dia todo'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Calend&aacute;rio'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Calend&aacute;rios'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'Mostrar apenas esse Calend&aacute;rio'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
        fieldLabel: 'Lembrete',
        noneText: 'Nenhum',
        atStartTimeText: 'Há hora de início',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minuto' : 'minutos';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'hora' : 'horas';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'dia' : 'dias';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'semana' : 'semanas';
        },
        reminderValueFormat: '{0} {1} antes do programado'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'j/n/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Alterar detalhes',
        deleteText: 'Remover',
        moveToText: 'Mover para...'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'j/n'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'j/n'
    });
}

if(Extensible.calendar.template.BoxLayout) {
    Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, j F , Y',
        multiDayFirstDayFormat: 'j M , Y',
        multiDayMonthStartFormat: 'j M'
    });
}

if(Extensible.calendar.template.Month) {
    Ext.apply(Extensible.calendar.template.Month.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, j F , Y'
    });
}