Ext.define('Extensible.example.calendar.data.Events', {
    constructor :  function() {
        var today = Ext.Date.clearTime(new Date()),
            makeDate = function(d, h, m, s){
                d = d * 86400;
                h = (h || 0) * 3600;
                m = (m || 0) * 60;
                s = (s || 0);
                return Ext.Date.add(today, Ext.Date.SECOND, d + h + m + s);
            };
            
        return {
            "evts" : [{
                "id"    : 1001,
                "cid"   : 1,
                "title" : "Vacation",
                "start" : makeDate(-20, 10),
                "end"   : makeDate(-10, 15),
                "notes" : "Have fun"
            },{
                "id"    : 1002,
                "cid"   : 2,
                "title" : "Lunch with Matt",
                "start" : makeDate(0, 11, 30),
                "end"   : makeDate(0, 13),
                "loc"   : "Chuy's!",
                "url"   : "http://chuys.com",
                "notes" : "Order the queso",
                "rem"   : "15"
            },{
                "id"    : 1003,
                "cid"   : 3,
                "title" : "Project due",
                "start" : makeDate(0, 15),
                "end"   : makeDate(0, 15,30)
            },{
                "id"    : 1004,
                "cid"   : 1,
                "title" : "Sarah's birthday",
                "start" : today,
                "end"   : makeDate(1,0,-1), //calling here the today function is not ok, today returns date component with time set to 00:00:00; end MUST contain time 23:59:00 (talking about allday events)
                "notes" : "Need to get a gift",
                "ad"    : true
            },{
                "id"    : 1005,
                "cid"   : 2,
                "title" : "A long one...",
                "start" : makeDate(-12),
                "end"   : makeDate(10, 0, 0, -1),
                "ad"    : true
            },{
                "id"    : 1006,
                "cid"   : 3,
                "title" : "School holiday",
                "start" : makeDate(5),
                "end"   : makeDate(7, 0, 0, -1),
                "ad"    : true,
                "rem"   : "2880"
            },{
                "id"    : 1007,
                "cid"   : 1,
                "title" : "Haircut",
                "start" : makeDate(0, 9),
                "end"   : makeDate(0, 9, 30),
                "notes" : "Get cash on the way"
            },{
                "id"    : 1008,
                "cid"   : 3,
                "title" : "An old event",
                "start" : makeDate(-30),
                "end"   : makeDate(-28),
                "ad"    : true
            },{
                "id"    : 1009,
                "cid"   : 2,
                "title" : "Board meeting",
                "start" : makeDate(-2, 13),
                "end"   : makeDate(-2, 18),
                "loc"   : "ABC Inc.",
                "rem"   : "60"
            },{
                "id"    : 1010,
                "cid"   : 3,
                "title" : "Jenny's final exams",
                "start" : makeDate(-2),
                "end"   : makeDate(3, 0, 0, -1),
                "ad"    : true
            },{
                "id"    : 1011,
                "cid"   : 1,
                "title" : "Movie night",
                "start" : makeDate(2, 19),
                "end"   : makeDate(2, 23),
                "notes" : "Don't forget the tickets!",
                "rem"   : "60"
            },{
                "id"    : 1012,
                "cid"   : 4,
                "title" : "Gina's basketball tournament",
                "start" : makeDate(8, 8),
                "end"   : makeDate(10, 17)
            },{
                "id"    : 1013,
                "cid"   : 4,
                "title" : "Toby's soccer game",
                "start" : makeDate(5, 10),
                "end"   : makeDate(5, 12)
            },{
                "id"    : 1014,
                "cid"   : 3,
                "title" : "Visit Museum",
                "start" : makeDate(0, 13, 00),
                "end"   : makeDate(0, 13, 45),
                "loc"   : "Modern Art Museum",
                "notes" : "Check the renaissance painters exhibition!",
                "rem"   : "10"
            },{
                "id"    : 1015,
                "cid"   : 3,
                "title" : "Take photos at museum ",
                "start" : makeDate(0, 13,15),
                "end"   : makeDate(0, 14),
                "loc"   : "Modern Art Museum",
                "rem"   : "5"
            },{
                "id"    : 1016,
                "cid"   : 3,
                "title" : "Buy souvenir for Ann",
                "start" : makeDate(0, 13, 30),
                "end"   : makeDate(0, 14),
                "loc"   : "Modern Art Museum",
            },{
                "id"    : 1017,
                "cid"   : 1,
                "title" : "Buy milk, bread and cookies",
                "start" : makeDate(0, 10, 30),
                "end"   : makeDate(0, 11),
                "loc"   : "Joey's Groceries",
                "notes" : "Take 1 gallon of milk and half kilo of cookies",
                "rem"   : "10"
            },{
                "id"    : 1018,
                "cid"   : 1,
                "title" : "Get Time magazine for Dad",
                "start" : makeDate(0, 09, 30),
                "end"   : makeDate(0, 09, 45),
                "loc"   : "Joey's Groceries"
            },{
                "id"    : 1019,
                "cid"   : 1,
                "title" : "Buy The New York Times",
                "start" : makeDate(0, 09, 30),
                "end"   : makeDate(0, 09, 45)
            },{
                "id"    : 1020,
                "cid"   : 3,
                "title" : "Buy greeting cards",
                "start" : makeDate(0, 09, 30),
                "end"   : makeDate(0, 10, 45)
            },{
                "id"    : 1021,
                "cid"   : 1,
                "title" : "Return books to library",
                "start" : makeDate(0, 09, 00),
                "end"   : makeDate(0, 09, 30),
                "loc"   : "Chuy's!",
                "url"   : "http : //chuys.com",
                "notes" : "Order the queso",
                "rem"   : "15"
            },{
                "id"    : 1022,
                "cid"   : 3,
                "title" : "Meet Jenny's school principal",
                "start" : makeDate(0, 11, 00),
                "end"   : makeDate(0, 11, 30),
                "loc"   : "Jenny's School",
                "rem"   : "15"
            },{
                "id"    : 1023,
                "cid"   : 2,
                "title" : "Prepare report for Bill",
                "start" : makeDate(0, 15),
                "end"   : makeDate(0, 16),
                "loc"   : "New York Stock Exchange",
                "url"   : "https://www.nyse.com/",
                "rem"   : "5"
            },{
                "id"    : 1024,
                "cid"   : 2,
                "title" : "Collect money for Bill's Party",
                "start" : makeDate(0, 15),
                "end"   : makeDate(0, 17),
                "loc"   : "New York Stock Exchange",
                "url"   : "https://www.nyse.com/",
                "rem"   : "15"
            },{
                "id"    : 1025,
                "cid"   : 1,
                "title" : "Call grandpa!",
                "start" : makeDate(0, 15, 30),
                "end"   : makeDate(0, 16, 00),
                "loc"   : "New York Stock Exchange",
                "url"   : "https://www.nyse.com",
                "rem"   : "10"
            },{
                "id"    : 1026,
                "cid"   : 2,
                "title" : "Print report for Bill",
                "start" : makeDate(0, 15, 30),
                "end"   : makeDate(0, 15, 45),
                "loc"   : "New York Stock Exchange",
                "url"   : "https://www.nyse.com"
            }]
        };
    }
});