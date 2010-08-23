App = function() {
    return {
        init : function() {
            Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.1.0/resources/images/default/s.gif';
            Ext.QuickTips.init();
    
            this.grid = this.createGrid();
            
            this.initGridEvents();
            this.initStoreEvents();
               
            this.grid.render(Ext.getBody());
        },
    
        onEventContextMenu : function(g, rec, e) {
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
        },
        
        // Don't show tooltip if editor is visible
        beforeTooltipShow : function(g, r) {
            return this.editor.collapsed;
        },
            
        initStoreEvents : function() {
            var g = this.grid;
            
            g.eventStore.on('update', function (store, bookingRecord, operation) {
                if (operation !== Ext.data.Record.EDIT) return;
                
                // Simulate server delay 1.5 seconds
                bookingRecord.commit.defer(1500, bookingRecord);
            });
        },
        
        initGridEvents : function() {
            var g = this.grid;
            
            g.on('eventcontextmenu', this.onEventContextMenu, this);
            g.on('beforetooltipshow', this.beforeTooltipShow, this);
        },
       
        renderer : function (item, resourceRec, row, col, ds) {
            var bookingStart = item.get('StartDate');
            
            return {
                headerText : bookingStart.format("G:i"),
                footerText : item.get('Title') || '&nbsp;'
            };
        },
        
        createGrid : function() {
                
            // Store holding all the resources
            var resourceStore = new Ext.data.JsonStore({
                sortInfo:{field: 'Id', direction: "ASC"},
                idProperty : 'Id',
                fields : [
                    'Id', 
                    'Name',
                    'Type'
                ]
            });
            
            resourceStore.loadData(schedulerResources); // from scheduler/resource-list.js
            
            // Store holding all the events
            var eventStore = new Ext.data.JsonStore({
                sortInfo:{field: 'ResourceId', direction: "ASC"},
                fields : [
                    {name: 'ResourceId'},
                    {name: 'Title'},
                    {name: 'StartDate', type : 'date'},
                    {name: 'EndDate', type : 'date'},
                    'Location'
                ]
            });
            
            var start = new Date();
            
            start.clearTime();
            start.setHours(6);
            
            var g = new Sch.EditorSchedulerPanel({
                width : 1000,
                height:300,
                clicksToEdit : 1,
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
                    renderer : this.renderer
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
                
                store : resourceStore,
                eventStore : eventStore,
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
                            g.setView(start, start.add(Date.HOUR, 12), 'hourAndDay', Sch.ViewBehaviour.HourView, this.renderer);
                        }
                    },
                    '            ',
                    {
                        id : 'span2',
                        enableToggle : true,
                        text: '1 week',
                        toggleGroup: 'span',
                        handler : function() {
                            g.setView(g.getStart(), g.getStart().add(Date.DAY, 7), 'dayAndWeeks', Sch.ViewBehaviour.DayView, this.renderer);
                        }
                    },
                    '            ',
                    {
                        id : 'span3',
                        enableToggle : true,
                        text: '6 weeks',
                        toggleGroup: 'span',
                        handler : function() {
                            g.setView(g.getStart(), g.getStart().add(Date.DAY, 42), 'weekAndMonths', Sch.ViewBehaviour.MonthView, this.renderer);
                        }
                    },
                    '->',
                    {
                        iconCls : 'icon-cleardatabase',
                        tooltip: 'Clear database',
                        scale : 'medium',
                        handler : function() {
                            g.eventStore.removeAll();
                        }
                    },
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
                        '<dt class="icon-earth">Location</dt><dd>{Location}&nbsp;</dd>',
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
                    dragcreateend : {
                        fn : function(p, data, e) {
                            var newRec = new this.grid.eventStore.recordType({
                                Title: 'New task', 
                                ResourceId : data.record.get('Id'),
                                Location : 'Local office',
                                StartDate : data.startDate,
                                EndDate : data.endDate
                            });
                            
                            this.grid.eventStore.add(newRec);
                            
                            // Enter edit mode right away
                            this.editor.show(newRec);
                        },
                        scope : this
                    }
                },
                
                trackMouseOver : false
            });
            
            return g;
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
