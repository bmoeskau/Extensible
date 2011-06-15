/*
 * Chinese (Traditional)
 * By frank cheung v0.1
 * encoding: utf-8
 */

Ext.ensible.Date.use24HourTime = false;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 0,
        todayText: '今日',
        defaultEventTitleText: '(沒標題)',
        ddCreateEventText: '為{0}創建事件',
        ddMoveEventText: '移動事件到{0}',
        ddResizeEventText: '更新事件到{0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0}更多……',
        getMoreText: function(numEvents){
            return '+{0}更多……';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: '今日',
        dayText: '日',
        weekText: '星期',
        monthText: '月',
        jumpToText: '調到：',
        goText: '到 ',
        multiDayText: '{0}天',
        multiWeekText: '{0}星期',
        getMultiDayText: function(numDays){
            return '{0}天';
        },
        getMultiWeekText: function(numWeeks){
            return '{0}星期';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: '添加事件',
        titleTextEdit: '編輯事件',
        savingMessage: '保存更改……',
        deletingMessage: '刪除事件……',
        detailsLinkText: '編輯詳細……',
        saveButtonText: '保存',
        deleteButtonText: '刪除',
        cancelButtonText: '取消',
        titleLabelText: '標題',
        datesLabelText: '當在',
        calendarLabelText: '日曆'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: '事件來自',
        titleTextAdd: '添加事件',
        titleTextEdit: '編輯事件',
        saveButtonText: '保存',
        deleteButtonText: '刪除',
        cancelButtonText: '取消',
        titleLabelText: '標題',
        datesLabelText: '當在',
        reminderLabelText: '提醒器',
        notesLabelText: '便箋',
        locationLabelText: '位置',
        webLinkLabelText: 'Web鏈接',
        calendarLabelText: '日曆',
        repeatsLabelText: '重復'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: '到',
        allDayText: '全天'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: '日曆'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: '日曆'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: '只顯示該日曆'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: '重復',
        recurrenceText: {
            none: '不重復',
            daily: '每天',
            weekly: '每星期',
            monthly: '每月',
            yearly: '每年'
        }
    });
}

if(Extensible.calendar.ReminderField) {
    Ext.apply(Extensible.calendar.ReminderField.prototype, {
        fieldLabel: '提醒器',
        noneText: '沒有',
        atStartTimeText: '于啟動時間',
        getMinutesText: function(numMinutes){
            return '分鐘';
        },
        getHoursText: function(numHours){
            return '小時';
        },
        getDaysText: function(numDays){
            return '天';
        },
        getWeeksText: function(numWeeks){
            return '星期';
        },
        reminderValueFormat: '離開始還有{0} {1}' // e.g. "2 hours before start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: '編輯詳細',
        deleteText: '刪除',
        moveToText: '移動到……'
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