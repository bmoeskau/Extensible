App = function() {
    return {
        init : function() {
            Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.1.0/resources/images/default/s.gif';
            Ext.QuickTips.init();
            
            this.initStores();
            this.createScheduler();
            this.createCalendar();
        },
        
        initStores : function(){
            this.eventStore = new Ext.ensible.ux.MemoryEventStore({
                fields : [
                    {name: 'ResourceId'},
                    {name: 'Title'},
                    {name: 'StartDate', type : 'date'},
                    {name: 'EndDate', type : 'date'},
                    'Location'
                ]                
            });
            this.resourceStore = new Ext.data.JsonStore({
                sortInfo:{field: 'Id', direction: "ASC"},
                idProperty : 'Id',
                fields : [
                    'Id', 
                    'Name',
                    'Type',
                    'ColorId'
                ],
                data: [
                    {Id : '1', Name : 'Rob', Type : 'Sales', ColorId : 1},
                    {Id : '2', Name : 'Mike', Type : 'Sales', ColorId : 11},
                    {Id : '3', Name : 'Kate', Type : 'Product manager', ColorId : 21}
//                    {id : '4', Name : 'Lisa', Type : 'Developer'},
//                    {id : '5', Name : 'Dave', Type : 'Developer'},
//                    {id : '6', Name : 'Arnold', Type : 'Developer'},
//                    {id : '7', Name : 'Lee', Type : 'Marketing'},
//                    {id : '8', Name : 'Jong', Type : 'Marketing'}
                ]
            });
        },
        
        createScheduler : function() {
            
            this.eventStore.on('update', function (store, bookingRecord, operation) {
                if (operation !== Ext.data.Record.EDIT) return;
                // Simulate server delay 1.5 seconds
                bookingRecord.commit.defer(1500, bookingRecord);
            });
            
            var renderer = function (item, resourceRec, row, col, ds) {
                var bookingStart = item.get('StartDate');
                return {
                    headerText : bookingStart.format("G:i"),
                    footerText : item.get('Title') || '&#160;'
                };
            };
            
            var onEventContextMenu = function(g, rec, e) {
                e.stopEvent();
                
                if (!g.gCtx) {
                    g.gCtx = new Ext.menu.Menu({
                        items : [
                            {
                                id : 'context-delete',
                                text : 'Delete event',
                                iconCls : 'icon-delete'
                            }
                        ]
                    });
                    
                    g.gCtx.on('itemclick', function(item, e) {
                        switch (item.id) {
                            case 'context-delete':
                                g.eventStore.remove(g.gCtx.rec);
                            break;
                            
                            default:
                                throw item.id + ' is not a valid menu action';
                            break;
                        }
                    }, this);
                }
                g.gCtx.rec = rec;
                g.gCtx.showAt(e.getXY());
            };
            
            // Don't show tooltip if editor is visible
            var beforeTooltipShow = function(g, r) {
                return this.editor.collapsed;
            };
            
            var start = new Date();
            
            start.clearTime();
            start.setHours(6);
            
            var g = new Sch.EditorSchedulerPanel({
                width: 1000,
                //height: 300,
                height: 200,
                clicksToEdit: 1,
                renderTo: Ext.getBody(),
                
                columns : [
                    {header : 'Staff', sortable:true, width:130, dataIndex : 'Name', editor : new Ext.form.TextField()},
                    {header : 'Type', sortable:true, width:140, dataIndex : 'Type', editor : new Ext.form.ComboBox({
                        store: ['Sales', 'Developer', 'Marketing', 'Product manager'],
                        typeAhead: true,
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus:true
                    })}
                ],
                
                 // Setup view configuration
                viewModel : {
                    start : start,
                    end : start.add(Date.HOUR, 12),
                    columnType : 'hourAndDay',
                    viewBehaviour : Sch.ViewBehaviour.HourView,
                    renderer : renderer
                },     
                
                // Specialized template with header and footer
                eventTemplate : new Ext.Template(
                    '<div id="{id}" style="width:{width}px;left:{leftOffset}px" class="sch-event {cls}">' +
                        '<div class="sch-event-inner">' + 
                           '<span class="sch-event-header">{headerText}</span>' + 
                           '<div class="sch-event-footer">{footerText}</div>' + 
                       '</div>' + 
                        String.format(Sch.SchedulerPanel.prototype.resizeHandleHtml, 'east'),
                    '</div>').compile(),
                        
                viewConfig: {
                    forceFit:true
                },
                
                store : this.resourceStore,
                eventStore : this.eventStore,
                border : true,
                tbar : [
                    {
                        iconCls : 'icon-prev',
                        scale : 'medium',
                        handler : function() {
                            var start = g.getStart(), end=g.getEnd();
                            
                            if (Ext.getCmp('span3').pressed) {
                                start = start.add(Date.WEEK, -6);
                                end = end.add(Date.WEEK, -6);
                            } else {
                                var days = Math.max(Date.getDurationInDays(start, end), 1);
                                start = start.add(Date.DAY, -days);
                                end = end.add(Date.DAY, -days);
                            }
                                
                            g.setView(start, end);
                        }
                    },
                    {
                        id : 'span1',
                        pressed: true,
                        text: '1 Day',
                        enableToggle : true,
                        toggleGroup: 'span',
                        inputValue: 'red',
                        handler : function() {
                            var start = g.getStart();
                            start.clearTime();
                            start.setHours(6);
                            g.setView(start, start.add(Date.HOUR, 12), 'hourAndDay', Sch.ViewBehaviour.HourView, renderer);
                        }
                    },
                    '            ',
                    {
                        id : 'span2',
                        enableToggle : true,
                        text: '1 week',
                        toggleGroup: 'span',
                        handler : function() {
                            g.setView(g.getStart(), g.getStart().add(Date.DAY, 7), 'dayAndWeeks', Sch.ViewBehaviour.DayView, renderer);
                        }
                    },
                    '            ',
                    {
                        id : 'span3',
                        enableToggle : true,
                        text: '6 weeks',
                        toggleGroup: 'span',
                        handler : function() {
                            g.setView(g.getStart(), g.getStart().add(Date.DAY, 42), 'weekAndMonths', Sch.ViewBehaviour.MonthView, renderer);
                        }
                    },
//                    {
//                        iconCls : 'icon-cleardatabase',
//                        tooltip: 'Clear database',
//                        scale : 'medium',
//                        handler : function() {
//                            g.eventStore.removeAll();
//                        }
//                    },
                    {
                        iconCls : 'icon-next',
                        scale : 'medium',
                        handler : function() {
                            var start = g.getStart(), end=g.getEnd();
                            
                            if (Ext.getCmp('span3').pressed) {
                                start = start.add(Date.WEEK, 6);
                                end = end.add(Date.WEEK, 6);
                            } else {
                                var days = Math.max(Date.getDurationInDays(start, end), 1);
                                start = start.add(Date.DAY, days);
                                end = end.add(Date.DAY, days);
                            }
                                
                            g.setView(start,end);
                        }
                    }
                ],
                
                tooltipTpl : new Ext.XTemplate(
                    '<dl class="eventTip">', 
                        '<dt class="icon-clock">Time</dt><dd>{[values.StartDate.format("Y-m-d G:i")]}</dd>',
                        '<dt class="icon-task">Task</dt><dd>{Title}</dd>',
                        '<dt class="icon-earth">Location</dt><dd>{Location}&#160;</dd>',
                    '</dl>').compile(),
                
                plugins : [
                    this.editor = new Sch.plugins.EventEditor({
                        height : 180,
                        width : 270,
                        buttonAlign : 'left',
                        saveHandler : this.onSave,
                        saveHandlerScope : this,
                        fieldsPanelConfig : {
                            layout : 'form',
                            style:'background:#fff',
                            border : false,
                            cls : 'editorpanel',
                            labelAlign : 'top',
                            defaults : {
                                width : 135
                            },
                            items : [
                                titleField = new Ext.form.TextField({
                                    name : 'Title',
                                    fieldLabel : 'Task'
                                }),
                                
                                locationField = new Ext.form.TextField({
                                    name : 'Location',
                                    fieldLabel : 'Location'
                                })
                            ]
                        },
                        listeners : {
                            expand : function() {
                                titleField.focus(true);
                            }
                        }
                    })
                ],
                listeners : {
                    'dragcreateend' : {
                        fn : function(p, data, e) {
                            var newRec = new this.eventStore.recordType({
                                Title: 'New task', 
                                ResourceId : data.record.get('Id'),
                                Location : 'Local office',
                                StartDate : data.startDate,
                                EndDate : data.endDate
                            });
                            
                            this.eventStore.add(newRec);
                            
                            // Enter edit mode right away
                            this.editor.show(newRec);
                        },
                        scope : this
                    },
                    'eventcontextmenu' : onEventContextMenu.createDelegate(this),
                    'beforetooltipshow' : beforeTooltipShow.createDelegate(this)
                },
                
                trackMouseOver : false
            });
        },
        
        createCalendar : function(){
            Ext.ensible.cal.EventMappings.CalendarId.name = 'ResourceId';
            Ext.ensible.cal.EventRecord.reconfigure();
            
            Ext.ensible.cal.CalendarMappings.CalendarId.name = 'Id';
            Ext.ensible.cal.CalendarMappings.Title.name = 'Name';
            Ext.ensible.cal.CalendarRecord.reconfigure();
            
            new Ext.ensible.cal.CalendarPanel({
                eventStore: this.eventStore,
                calendarStore: this.resourceStore,
                renderTo: Ext.getBody(),
                width: 1000,
                height: 600
            });
        },
        
        onSave : function(formPanel, newStart, newEnd, record) {
            var values = formPanel.getForm().getValues();
            
            record.beginEdit();
            record.set('StartDate', newStart);
            record.set('EndDate', newEnd);
            record.set('Title', values.Title);
            record.set('Location', values.Location);
            record.endEdit();
            formPanel.collapse();
        }
    }
}();

Ext.onReady(App.init, App);
