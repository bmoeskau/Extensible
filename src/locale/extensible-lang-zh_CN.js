/*
 * Chinese (Simplified)
 * By frank cheung v0.1
 * encoding: utf-8
 */
Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Extensible.Date.use24HourTime = false;
    
    if (exists('Extensible.calendar.view.AbstractCalendar')) {
        Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: '今日',
            defaultEventTitleText: '(没标题)',
            ddCreateEventText: '为{0}创建事件',
            ddMoveEventText: '移动事件到{0}',
            ddResizeEventText: '更新事件到{0}'
        });
    }
    
    if (exists('Extensible.calendar.view.Month')) {
        Ext.apply(Extensible.calendar.view.Month.prototype, {
            moreText: '+{0}更多……',
            getMoreText: function(numEvents) {
                return '+{0}更多……';
            },
            detailsTitleDateFormat: 'F j'
        });
    }
    
    if (exists('Extensible.calendar.CalendarPanel')) {
        Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
            todayText: '今日',
            dayText: '日',
            weekText: '星期',
            monthText: '月',
            jumpToText: '调到：',
            goText: '到 ',
            multiDayText: '{0}天',
            multiWeekText: '{0}星期',
            getMultiDayText: function(numDays) {
                return '{0}天';
            },
            getMultiWeekText: function(numWeeks) {
                return '{0}星期';
            }
        });
    }
    
    if (exists('Extensible.calendar.form.EventWindow')) {
        Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
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
    
    if (exists('Extensible.calendar.form.EventDetails')) {
        Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
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
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            toText: '到',
            allDayText: '全天'
        });
    }
    
    if (exists('Extensible.calendar.form.field.CalendarCombo')) {
        Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: '日历'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
            title: '日历'
        });
    }
    
    if (exists('Extensible.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: '只显示该日历'
        });
    }
    
    if (exists('Extensible.form.recurrence.Combo')) {
        Ext.apply(Extensible.form.recurrence.Combo.prototype, {
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
    
    if (exists('Extensible.calendar.form.field.ReminderCombo')) {
        Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
            fieldLabel: '提醒器',
            noneText: '没有',
            atStartTimeText: '于启动时间',
            getMinutesText: function(numMinutes) {
                return '分钟';
            },
            getHoursText: function(numHours) {
                return '小时';
            },
            getDaysText: function(numDays) {
                return '天';
            },
            getWeeksText: function(numWeeks) {
                return '星期';
            },
            reminderValueFormat: '离开始还有{0} {1}' // e.g. "2 hours before start"
        });
    }
    
    if (exists('Extensible.form.field.DateRange')) {
        Ext.apply(Extensible.form.field.DateRange.prototype, {
            dateFormat: 'n/j/Y'
        });
    }
    
    if (exists('Extensible.calendar.menu.Event')) {
        Ext.apply(Extensible.calendar.menu.Event.prototype, {
            editDetailsText: '编辑详细',
            deleteText: '删除',
            moveToText: '移动到……'
        });
    }
    
    if (exists('Extensible.calendar.dd.DropZone')) {
        Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'n/j'
        });
    }
    
    if (exists('Extensible.calendar.dd.DayDropZone')) {
        Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'n/j'
        });
    }
    
    if (exists('Extensible.calendar.template.BoxLayout')) {
        Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D j',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'l, F j, Y',
            multiDayFirstDayFormat: 'M j, Y',
            multiDayMonthStartFormat: 'M j'
        });
    }
    
    if (exists('Extensible.calendar.template.Month')) {
        Ext.apply(Extensible.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'l, F j, Y'
        });
    }
});