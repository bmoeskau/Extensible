/*
 * Chinese (Traditional)
 * By frank cheung v0.1
 * encoding: utf-8
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: '今日',
        defaultEventTitleText: '(沒標題)',
        ddCreateEventText: '為{0}創建事件',
        ddMoveEventText: '移動事件到{0}',
        ddResizeEventText: '更新事件到{0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0}更多……',
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: '今日',
        dayText: '日',
        weekText: '星期',
        monthText: '月',
        jumpToText: '調到：',
        goText: '到 ',
        multiDayText: '{0}天',
        multiWeekText: '{0}星期'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
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

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
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

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: '到',
        allDayText: '全天'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: '日曆'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: '日曆'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: '只顯示該日曆'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
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

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: '提醒器',
        noneText: '沒有',
        atStartTimeText: '于啟動時間',
        minutesText: '分鐘',
        hourText: '小時',
        hoursText: '小時',
        dayText: '天',
        daysText: '天',
        weekText: '星期',
        weeksText: '星期',
        reminderValueFormat: '離開始還有{0} {1}' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: '編輯詳細',
        deleteText: '刪除',
        moveToText: '移動到……'
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