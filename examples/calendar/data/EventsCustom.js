Ext.define('Extensible.example.calendar.data.EventsCustom', {
    constructor: function() {
        var today = Ext.Date.clearTime(new Date),
            makeDate = function(d, h, m, s){
                d = d * 86400;
                h = (h || 0) * 3600;
                m = (m || 0) * 60;
                s = (s || 0);
                return Ext.Date.add(today, Ext.Date.SECOND, d + h + m + s);
            };
            
        return {
            // EventId and CalendarId are numeric by default, let's make sure strings work OK too.
            // The cal_id values should match the ids in calendars-custom.js.
            "evts":[{
                "evt_id"     : "A-1001",
                "cal_id"     : "C1",
                "evt_title"  : "Vacation",
                "start_dt"   : makeDate(-20, 10),
                "end_dt"     : makeDate(-10, 15),
                "full_desc"  : "Have fun",
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1002",
                "cal_id"     : "C2",
                "evt_title"  : "Lunch with Matt",
                "start_dt"   : makeDate(0, 11, 30),
                "end_dt"     : makeDate(0, 13),
                "location"   : "Chuy's!",
                "link_url"   :"http://chuys.com",
                "full_desc"  : "Order the queso",
                "reminder"   : "15",
                "created_by" : "Brian",
                "private"    : true
            },{
                "evt_id"     : "A-1003",
                "cal_id"     : "C3",
                "evt_title"  : "Project due",
                "start_dt"   : makeDate(0, 15),
                "end_dt"     : makeDate(0, 15),
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1004",
                "cal_id"     : "C1",
                "evt_title"  : "Sarah's birthday",
                "start_dt"   : Ext.Date.clone(today),
                "end_dt"     : Ext.Date.clone(today),
                "full_desc"  : "Need to get a gift",
                "all_day"    : true,
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1005",
                "cal_id"     : "C2",
                "evt_title"  : "A long one...",
                "start_dt"   : makeDate(-12),
                "end_dt"     : makeDate(10, 0, 0, -1),
                "all_day"    : true,
                "created_by" : "Brian",
                "private"    : true
            },{
                "evt_id"     : "A-1006",
                "cal_id"     : "C3",
                "evt_title"  : "School holiday",
                "start_dt"   : makeDate(5),
                "end_dt"     : makeDate(5),
                "all_day"    : true,
                "reminder"   : "2880",
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1007",
                "cal_id"     : "C1",
                "evt_title"  : "Haircut",
                "start_dt"   : makeDate(0, 9),
                "end_dt"     : makeDate(0, 9, 0, 30),
                "full_desc"  : "Get cash on the way",
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1008",
                "cal_id"     : "C3",
                "evt_title"  : "An old event",
                "start_dt"   : makeDate(-30),
                "end_dt"     : makeDate(-28),
                "all_day"    : true,
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1009",
                "cal_id"     : "C2",
                "evt_title"  : "Board meeting",
                "start_dt"   : makeDate(-2, 13),
                "end_dt"     : makeDate(-2, 18),
                "location"   : "ABC Inc.",
                "reminder"   : "60",
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1010",
                "cal_id"     : "C3",
                "evt_title"  : "Jenny's final exams",
                "start_dt"   : makeDate(-2),
                "end_dt"     : makeDate(3, 0, 0, -1),
                "all_day"    : true,
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1011",
                "cal_id"     : "C1",
                "evt_title"  : "Movie night",
                "start_dt"   : makeDate(2, 19),
                "end_dt"     : makeDate(2, 23),
                "full_desc"  : "Don't forget the tickets!",
                "reminder"   : "60",
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1012",
                "cal_id"     : "C4",
                "evt_title"  : "Gina's basketball tournament",
                "start_dt"   : makeDate(8, 8),
                "end_dt"     : makeDate(10, 17),
                "created_by" : "Brian"
            },{
                "evt_id"     : "A-1013",
                "cal_id"     : "C4",
                "evt_title"  : "Toby's soccer game",
                "start_dt"   : makeDate(5, 10),
                "end_dt"     : makeDate(5, 12),
                "created_by" : "Brian"
            }]
        }
    }
});