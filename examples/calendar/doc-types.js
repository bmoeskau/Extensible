Ext.onReady(function(){
    //
    // There's really nothing too interesting about this setup. This example is
    // solely to demo support of the different common HTML doc types.
    //
    this.doctypeStore = new Ext.data.ArrayStore({
        fields: ['name', 'dtd'],
        data : [
            ['None', ''],
            ['HTML 5', 'html5'],
            ['HTML 4.01', 'html4/strict'],
            ['HTML 4.01 Transitional', 'html4/loose'],
            ['HTML 4.01 Frameset', 'html4/frameset'],
            ['XHTML 1.0 Strict', 'xhtml1/DTD/xhtml1-strict'],
            ['XHTML 1.0 Transitional', 'xhtml1/DTD/xhtml1-transitional'],
            ['XHTML 1.0 Frameset', 'xhtml1/DTD/xhtml1-frameset']
        ]
    });
    
    this.doctypeCombo = new Ext.form.ComboBox({
        renderTo: 'doctypes',
        store: this.doctypeStore,
        displayField: 'name',
        valueField: 'dtd',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText: 'Select a doctype...',
        selectOnFocus: true,
        value: '',
        listeners: {
            'select': {
                fn: function(cbo, rec, idx){
                    window.location = 'doc-types.php?doctype='+rec.data.name+'&dtd='+rec.data.dtd;
                }
            }
        }
    });
    
    // set the combo selected value if the url contains a doctype param
    var search = window.location.search;
    if(search.length > 0){
        search = search.substring(1, search.length); // strip the ?
        var params = Ext.urlDecode(search);
        this.doctypeCombo.setValue(params.doctype);
    }
    
    new Ext.ensible.cal.CalendarPanel({
        eventStore: new Ext.ensible.sample.MemoryEventStore({
            data: Ext.ensible.sample.EventData
        }),
        calendarStore: new Ext.ensible.sample.CalendarStore({
            data: Ext.ensible.sample.CalendarData
        }),
        renderTo: 'cal',
        title: 'Doctype Tester',
        activeItem: 1,
        width: 800,
        height: 700
    });
});