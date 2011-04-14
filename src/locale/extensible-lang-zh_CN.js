/*
 * Chinese (Simplified)
 * By frank cheung v0.1
 * encoding: utf-8
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: '今日',
        defaultEventTitleText: '(没标题)',
        ddCreateEventText: '为{0}创建事件',
        ddMoveEventText: '移动事件到{0}',
        ddResizeEventText: '更新事件到{0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0}更多……',
        getMoreText: function(numEvents){
            return '+{0}更多……';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: '今日',
        dayText: '日',
        weekText: '星期',
        monthText: '月',
        jumpToText: '调到：',
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

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: '添加事件',
        titleTextEdit: '编辑事件',
        savingMessage: '保存更改……',
        deletingMessage: '删除事件……',
        detailsLinkText: '编辑详细……',
        saveButtonText: '保存',
        deleteButtonText: '删除',
        cancelButtonText: '取消',
        titleLabelText: '标题',
        datesLabelText: '当在',
        calendarLabelText: '日历'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: '事件来自',
        titleTextAdd: '添加事件',
        titleTextEdit: '编辑事件',
        saveButtonText: '保存',
        deleteButtonText: '删除',
        cancelButtonText: '取消',
        titleLabelText: '标题',
        datesLabelText: '当在',
        reminderLabelText: '提醒器',
        notesLabelText: '便笺',
        locationLabelText: '位置',
        webLinkLabelText: 'Web链接',
        calendarLabelText: '日历',
        repeatsLabelText: '重复'
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
        fieldLabel: '日历'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: '日历'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: '只显示该日历'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: '重复',
        recurrenceText: {
            none: '不重复',
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
        noneText: '没有',
        atStartTimeText: '于启动时间',
        getMinutesText: function(numMinutes){
            return '分钟';
        },
        getHoursText: function(numHours){
            return '小时';
        },
        getDaysText: function(numDays){
            return '天';
        },
        getWeeksText: function(numWeeks){
            return '星期';
        },
        reminderValueFormat: '离开始还有{0} {1}' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: '编辑详细',
        deleteText: '删除',
        moveToText: '移动到……'
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