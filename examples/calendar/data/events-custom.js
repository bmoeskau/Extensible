var today = new Date().clearTime();

// EventId and CalendarId are numeric by default, let's make sure strings work OK too.
// The cal_id values should match the ids in calendars-custom.js.

Ext.ensible.sample.EventDataCustom = {
    "evts":[{
        "evt_id":"A-1001",
        "cal_id":"C1",
        "evt_title":"Vacation",
        "start_dt":today.add(Date.DAY, -20).add(Date.HOUR, 10),
        "end_dt":today.add(Date.DAY, -10).add(Date.HOUR, 15),
        "full_desc":"Have fun",
        "created_by":"Brian"
    },{
        "evt_id":"A-1002",
        "cal_id":"C2",
        "evt_title":"Lunch with Matt",
        "start_dt":today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
        "end_dt":today.add(Date.HOUR, 13),
        "location":"Chuy's!",
        "link_url":"http://chuys.com",
        "full_desc":"Order the queso",
        "reminder":"15",
        "created_by":"Brian",
        "private": true
    },{
        "evt_id":"A-1003",
        "cal_id":"C3",
        "evt_title":"Project due",
        "start_dt":today.add(Date.HOUR, 15),
        "end_dt":today.add(Date.HOUR, 15),
        "created_by":"Brian"
    },{
        "evt_id":"A-1004",
        "cal_id":"C1",
        "evt_title":"Sarah's birthday",
        "start_dt":today,
        "end_dt":today,
        "full_desc":"Need to get a gift",
        "all_day":true,
        "created_by":"Brian"
    },{
        "evt_id":"A-1005",
        "cal_id":"C2",
        "evt_title":"A long one...",
        "start_dt":today.add(Date.DAY, -12),
        "end_dt":today.add(Date.DAY, 10).add(Date.SECOND, -1),
        "all_day":true,
        "created_by":"Brian",
        "private": true
    },{
        "evt_id":"A-1006",
        "cal_id":"C3",
        "evt_title":"School holiday",
        "start_dt":today.add(Date.DAY, 5),
        "end_dt":today.add(Date.DAY, 7).add(Date.SECOND, -1),
        "all_day":true,
        "reminder":"2880",
        "created_by":"Brian"
    },{
        "evt_id":"A-1007",
        "cal_id":"C1",
        "evt_title":"Haircut",
        "start_dt":today.add(Date.HOUR, 9),
        "end_dt":today.add(Date.HOUR, 9).add(Date.MINUTE, 30),
        "full_desc":"Get cash on the way",
        "created_by":"Brian"
    },{
        "evt_id":"A-1008",
        "cal_id":"C3",
        "evt_title":"An old event",
        "start_dt":today.add(Date.DAY, -30),
        "end_dt":today.add(Date.DAY, -28),
        "all_day":true,
        "created_by":"Brian"
    },{
        "evt_id":"A-1009",
        "cal_id":"C2",
        "evt_title":"Board meeting",
        "start_dt":today.add(Date.DAY, -2).add(Date.HOUR, 13),
        "end_dt":today.add(Date.DAY, -2).add(Date.HOUR, 18),
        "location":"ABC Inc.",
        "reminder":"60",
        "created_by":"Brian"
    },{
        "evt_id":"A-1010",
        "cal_id":"C3",
        "evt_title":"Jenny's final exams",
        "start_dt":today.add(Date.DAY, -2),
        "end_dt":today.add(Date.DAY, 3).add(Date.SECOND, -1),
        "all_day":true,
        "created_by":"Brian"
    },{
        "evt_id":"A-1011",
        "cal_id":"C1",
        "evt_title":"Movie night",
        "start_dt":today.add(Date.DAY, 2).add(Date.HOUR, 19),
        "end_dt":today.add(Date.DAY, 2).add(Date.HOUR, 23),
        "full_desc":"Don't forget the tickets!",
        "reminder":"60",
        "created_by":"Brian"
    },{
        "evt_id":"A-1012",
        "cal_id":"C4",
        "evt_title":"Gina's basketball tournament",
        "start_dt":today.add(Date.DAY, 8).add(Date.HOUR, 8),
        "end_dt":today.add(Date.DAY, 10).add(Date.HOUR, 17),
        "created_by":"Brian"
    },{
        "evt_id":"A-1013",
        "cal_id":"C4",
        "evt_title":"Toby's soccer game",
        "start_dt":today.add(Date.DAY, 5).add(Date.HOUR, 10),
        "end_dt":today.add(Date.DAY, 5).add(Date.HOUR, 12),
        "created_by":"Brian"
    }]
};
