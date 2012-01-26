Ext.require([
    'Extensible.calendar.CalendarPanel',
    'Extensible.calendar.data.EventStore',
    'Extensible.calendar.data.CalendarModel',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.data.MemoryEventStore',
    'Extensible.example.calendar.data.Events',
    'Extensible.example.calendar.data.Calendars',
    'Extensible.example.calendar.data.EventsCustom',
    'Extensible.example.calendar.data.CalendarsCustom'
],
function() {
    /*
     * Namespaces
     */
    Ext.ensible        = Extensible;
    Ext.ensible.cal    = Extensible.calendar;
    Ext.ensible.sample = Extensible.example;
    
    /*
     * Data package
     */
    Ext.ensible.cal.CalendarMappings = Extensible.calendar.data.CalendarMappings;
    Ext.ensible.cal.EventMappings    = Extensible.calendar.data.EventMappings;
    Ext.ensible.cal.CalendarRecord   = Extensible.calendar.data.CalendarModel;
    Ext.ensible.cal.EventRecord      = Extensible.calendar.data.EventModel;
    Ext.ensible.cal.EventStore       = Extensible.calendar.data.EventStore;
    
    // These were moved from examples into the official data package
    Ext.ensible.sample.CalendarStore    = Extensible.calendar.data.MemoryCalendarStore;
    Ext.ensible.sample.MemoryEventStore = Extensible.calendar.data.MemoryEventStore;
    
    /*
     * Drag / drop
     */
    Ext.ensible.cal.DragZone        = Extensible.calendar.dd.DragZone;
    Ext.ensible.cal.DropZone        = Extensible.calendar.dd.DropZone;
    Ext.ensible.cal.DayViewDragZone = Extensible.calendar.dd.DayDragZone;
    Ext.ensible.cal.DayViewDropZone = Extensible.calendar.dd.DayDropZone;
    Ext.ensible.cal.StatusProxy     = Extensible.calendar.dd.StatusProxy;
    
    /*
     * Templates
     */
    Ext.ensible.cal.BoxLayoutTemplate = Extensible.calendar.template.BoxLayout;
    Ext.ensible.cal.DayBodyTemplate   = Extensible.calendar.template.DayBody;
    Ext.ensible.cal.DayHeaderTemplate = Extensible.calendar.template.DayHeader;
    Ext.ensible.cal.MonthViewTemplate = Extensible.calendar.template.Month;
    
    /*
     * Views
     */
    Ext.ensible.cal.CalendarView       = Extensible.calendar.view.AbstractCalendar;
    Ext.ensible.cal.DayBodyView        = Extensible.calendar.view.DayBody;
    Ext.ensible.cal.DayHeaderView      = Extensible.calendar.view.DayHeader;
    Ext.ensible.cal.DayView            = Extensible.calendar.view.Day;
    Ext.ensible.cal.MonthDayDetailView = Extensible.calendar.view.MonthDayDetail;
    Ext.ensible.cal.MonthView          = Extensible.calendar.view.Month;
    Ext.ensible.cal.MultiDayView       = Extensible.calendar.view.MultiDay;
    Ext.ensible.cal.MultiWeekView      = Extensible.calendar.view.MultiWeek;
    Ext.ensible.cal.WeekView           = Extensible.calendar.view.Week;
    
    /*
     * Widgets
     */
    Ext.ensible.cal.CalendarCombo    = Extensible.calendar.form.field.CalendarCombo;
    Ext.ensible.cal.ReminderField    = Extensible.calendar.form.field.ReminderCombo;
    Ext.ensible.cal.CalendarList     = Extensible.calendar.gadget.CalendarListPanel;
    Ext.ensible.cal.CalendarListMenu = Extensible.calendar.gadget.CalendarListMenu;
    Ext.ensible.cal.ColorPalette     = Extensible.calendar.util.ColorPicker;
    Ext.ensible.cal.EventContextMenu = Extensible.calendar.menu.Event;
    Ext.ensible.cal.DateRangeField   = Extensible.form.field.DateRange;
    Ext.ensible.cal.RecurrenceCombo  = Extensible.form.recurrence.Combo;
    Ext.ensible.cal.RecurrenceField  = Extensible.form.recurrence.Fieldset;
    
    /*
     * Forms
     */
    Ext.ensible.cal.EventEditForm     = Extensible.calendar.form.EventDetails;
    Ext.ensible.cal.EventEditWindow   = Extensible.calendar.form.EventWindow;
    Ext.ensible.cal.WeekEventRenderer = Extensible.calendar.util.WeekEventRenderer;
    
    /*
     * Example data. Actually create them, since they were defined statically in 1.0.
     * Now the data objects are returned by the constructors.
     */
    Ext.ensible.sample.EventData          = Ext.create('Extensible.example.calendar.data.Events');
    Ext.ensible.sample.EventDataCustom    = Ext.create('Extensible.example.calendar.data.EventsCustom');
    Ext.ensible.sample.CalendarData       = Ext.create('Extensible.example.calendar.data.Calendars');
    Ext.ensible.sample.CalendarDataCustom = Ext.create('Extensible.example.calendar.data.CalendarsCustom');
});