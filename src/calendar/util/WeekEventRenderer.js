/** @private
 * This is an internal helper class for the calendar views and should not be overridden.
 * It is responsible for the base event rendering logic underlying all views based on a
 * box-oriented layout that supports day spanning (MonthView, MultiWeekView, DayHeaderView).
 */
Ext.define('Extensible.calendar.util.WeekEventRenderer', {
    
    requires: ['Ext.DomHelper'],
    
    statics: {
        /**
         * Retrieve the event layout table row for the specified week and row index. If
         * the row does not already exist it will get created and appended to the DOM.
         * This method does not check against the max allowed events -- it is the responsibility
         * of calling code to ensure that an event row at the specified index is really needed.
         */
        getEventRow: function(viewId, weekIndex, rowIndex) {
            var indexOffset = 1, //skip the first row with date #'s
                weekRow = Ext.get(viewId + '-wk-' + weekIndex),
                eventRow,
                weekTable;
            
            if (weekRow) {
                weekTable = weekRow.child('.ext-cal-evt-tbl', true);
                eventRow = weekTable.tBodies[0].childNodes[rowIndex + indexOffset];
                
                if (!eventRow) {
                    eventRow = Ext.DomHelper.append(weekTable.tBodies[0], '<tr></tr>');
                }
            }
            return Ext.get(eventRow);
        },
        
        /**
         * Render an individual event
         * @private
         */
        renderEvent: function(event, weekIndex, dayIndex, eventIndex, dayCount, currentDate, renderConfig) {
            var eventMappings = Extensible.calendar.data.EventMappings,
                eventData = event.data || event.event.data,
                startOfWeek = Ext.Date.clone(currentDate),
                endOfWeek = Extensible.Date.add(startOfWeek, {days: dayCount - dayIndex, millis: -1}),
                eventRow = this.getEventRow(renderConfig.viewId, weekIndex, eventIndex),
                eventEndDate = (event.event || event).getEndDate(),
                daysToEventEnd = Extensible.Date.diffDays(currentDate, eventEndDate) + 1,
                // Restrict the max span to the current week only since this is for the cuurent week's markup
                colspan = Math.min(daysToEventEnd, dayCount - dayIndex);
            
            // The view passes a template function to use when rendering the events.
            // These are special data values that get passed back to the template.
            eventData._weekIndex = weekIndex;
            eventData._renderAsAllDay = eventData[eventMappings.IsAllDay.name] || event.isSpanStart;
            eventData.spanLeft = eventData[eventMappings.StartDate.name].getTime() < startOfWeek.getTime();
            eventData.spanRight = eventEndDate.getTime() > endOfWeek.getTime();
            eventData.spanCls = (eventData.spanLeft ? (eventData.spanRight ?
                'ext-cal-ev-spanboth' : 'ext-cal-ev-spanleft') : (eventData.spanRight ? 'ext-cal-ev-spanright' : ''));
            
            var cellConfig = {
                tag: 'td',
                cls: 'ext-cal-ev',
                // This is where the passed template gets processed and the markup returned
                cn: renderConfig.tpl.apply(renderConfig.templateDataFn(eventData))
            };
            
            if (colspan > 1) {
                cellConfig.colspan = colspan;
            }
            Ext.DomHelper.append(eventRow, cellConfig);
        },
        
        /**
         * Events are collected into a big multi-dimensional array in the view, then passed here
         * for rendering. The event grid consists of an array of weeks (1-n), each of which contains an
         * array of days (1-7), each of which contains an array of events and span placeholders (0-n).
         * @param {Object} o An object containing all of the supported config options (see
         * Extensible.calendar.view.Month.renderItems() to see what gets passed).
         * @private
         */
        render: function(config) {
            // var-apalooza ;) since we're looping a lot, minimize initial declarations
            var me = this,
                spaceChar = '&#160;',
                weekIndex = 0,
                eventGrid = config.eventGrid,
                currentDate = Ext.Date.clone(config.viewStart),
                currentDateString = '',
                eventTpl = config.tpl,
                maxEventsPerDay = config.maxEventsPerDay !== undefined ? config.maxEventsPerDay : 999,
                weekCount = config.weekCount < 1 ? 6 : config.weekCount,
                dayCount = config.weekCount === 1 ? config.dayCount : 7,
                eventRow,
                dayIndex,
                weekGrid,
                eventIndex,
                skippedEventCount,
                dayGrid,
                eventCount,
                currentEvent,
                cellConfig,
                eventData;
            
            // Loop through each week in the overall event grid
            for (; weekIndex < weekCount; weekIndex++) {
                dayIndex = 0;
                weekGrid = eventGrid[weekIndex];
                
                // Loop through each day in the current week grid
                for (; dayIndex < dayCount; dayIndex++) {
                    currentDateString = Ext.Date.format(currentDate, 'Ymd');
                    
                    // Make sure there is actually a day to process events for first
                    if (weekGrid && weekGrid[dayIndex]) {
                        eventIndex = 0;
                        skippedEventCount = 0;
                        dayGrid = weekGrid[dayIndex];
                        eventCount = dayGrid.length;
                        
                        // Loop through each event in the current day grid. Note that this grid can
                        // also contain placeholders representing segments of spanning events, though
                        // for simplicity's sake these will all be referred to as "events" in comments.
                        for (; eventIndex < eventCount; eventIndex++) {
                            if (!dayGrid[eventIndex]) {
                                // There is no event at the current index
                                if (eventIndex >= maxEventsPerDay) {
                                    // We've already hit the max count of displayable event rows, so
                                    // skip adding any additional empty row markup. In this case, since
                                    // there is no event we don't track it as a skipped event as below.
                                    continue;
                                }
                                // Insert an empty TD since there is no event at this index
                                eventRow = me.getEventRow(config.viewId, weekIndex, eventIndex);
                                Ext.DomHelper.append(eventRow, {
                                    tag: 'td',
                                    cls: 'ext-cal-ev',
                                    html: spaceChar,
                                    //style: 'outline: 1px solid red;', // helpful for debugging
                                    id: config.viewId + '-empty-' + eventCount + '-day-' + currentDateString
                                });
                            }
                            else {
                                if (eventIndex >= maxEventsPerDay) {
                                    // We've hit the max count of displayable event rows, but since there
                                    // is an event at the current index we have to track the count of events
                                    // that aren't being rendered so that we can provide the proper count
                                    // when displaying the "more events" link below.
                                    skippedEventCount++;
                                    continue;
                                }
                                currentEvent = dayGrid[eventIndex];
                                
                                // We only want to insert the markup for an event that does not span days, or
                                // if it does span, only for the initial instance (not any of its placeholders
                                // in the event grid, which are there only to reserve the space in the layout).
                                if (!currentEvent.isSpan || currentEvent.isSpanStart) {
                                    me.renderEvent(currentEvent, weekIndex, dayIndex, eventIndex,
                                        dayCount, currentDate, config);
                                }
                            }
                        }
                        
                        // We're done processing all of the events for the current day. Time to insert the
                        // "more events" link or the last empty TD for the day, if needed.
                        
                        if (skippedEventCount > 0) {
                            // We hit one or more events in the grid that could not be displayed since the max
                            // events per day count was exceeded, so add the "more events" link.
                            eventRow = me.getEventRow(config.viewId, weekIndex, maxEventsPerDay);
                            Ext.DomHelper.append(eventRow, {
                                tag: 'td',
                                cls: 'ext-cal-ev-more',
                                //style: 'outline: 1px solid blue;', // helpful for debugging
                                id: 'ext-cal-ev-more-' + Ext.Date.format(currentDate, 'Ymd'),
                                cn: {
                                    tag: 'a',
                                    html: Ext.String.format(config.getMoreText(skippedEventCount), skippedEventCount)
                                }
                            });
                        }
                        else if (eventCount < config.evtMaxCount[weekIndex]) {
                            // We did NOT hit the max event count, meaning that we are now left with a gap in
                            // the layout table which we need to fill with one last empty TD.
                            eventRow = me.getEventRow(config.viewId, weekIndex, eventCount);
                            if (eventRow) {
                                cellConfig = {
                                    tag: 'td',
                                    cls: 'ext-cal-ev',
                                    html: spaceChar,
                                    //style: 'outline: 1px solid green;', // helpful for debugging
                                    id: config.viewId + '-empty-' + (eventCount + 1) + '-day-' + currentDateString
                                };
                                
                                // It's easy to determine at this point how many extra rows are needed, so
                                // just add a rowspan rather than multiple dummy TDs if needed.
                                var rowspan = config.evtMaxCount[weekIndex] - eventCount;
                                if (rowspan > 1) {
                                    cellConfig.rowspan = rowspan;
                                }
                                Ext.DomHelper.append(eventRow, cellConfig);
                            }
                        }
                        // Else the event count for the current day equals the max event count, so the current
                        // day is completely filled up with no additional placeholder markup needed.
                    }
                    else {
                        // There are no events for the current day, so no need to go through all the logic
                        // above -- simply append an empty TD spanning the total row count for the week.
                        eventRow = me.getEventRow(config.viewId, weekIndex, 0);
                        if (eventRow) {
                            cellConfig = {
                                tag: 'td',
                                cls: 'ext-cal-ev',
                                html: spaceChar,
                                //style: 'outline: 1px solid purple;', // helpful for debugging
                                id: config.viewId + '-empty-day-' + currentDateString
                            };
                            
                            if (config.evtMaxCount[weekIndex] > 1) {
                                cellConfig.rowspan = config.evtMaxCount[weekIndex];
                            }
                            Ext.DomHelper.append(eventRow, cellConfig);
                        }
                    }
                    
                    // Move to the next date and restart the loop
                    currentDate = Extensible.Date.add(currentDate, {days: 1});
                }
            }
        }
    }
});