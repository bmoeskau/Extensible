<?php
    // This file supports recurring events, so has a lot of recurrence-specific
    // business logic (read: complexity). If you do not require recurrence, look
    // instead at the much simpler example code in events-basic.php.
    
    require(dirname(__FILE__).'/events-common.php');
    
    // This is a third-party lib that parses the RRULE and generates event instances.
    // See the file header for details.
    require(dirname(__FILE__).'/recur.php');
    
    // This is the maximum number of event instances per master recurring event to generate and return
    // when recurrence is in use. Generally the recurrence pattern defined on each event, in combination
    // with the supplied query date range, should already limit the instances returned to a reasonable
    // range. This value is a saftey check in case something is not specified correctly to avoid the
    // recurrence parser looping forever (e.g., no end date is supplied). This value should accommodate
    // the max realistic combination of events for the supported views and event frequency. For example,
    // by default the maximum frequency is daily, so given a maximum view range of 6 weeks and one
    // instance per day, the minimum required value would be 42. The default of 99 will handle any
    // views supported by Extensible out of the box, but if some custom view range was implemented
    // (e.g. year view) or if the recurrence resolution was increased (e.g., hourly) then you would
    // have to increase this value accordingly.
    $max_event_instances = 99;
    
    $date_format = 'Y-m-d\TH:i:s';
    
    //=================================================================================================
    //
    // Event property mappings. The default values match the property names as used in the example
    // data (e.g. Extensible.example.calendar.data.Events) so if you customize the EventModel and/or
    // mappings being used you'd also want to update these properties so that the PHP matches. You
    // should only have to change the string values -- the $ variables are referenced in the PHP code
    // and should not need to be changed.
    //
    //=================================================================================================
    $mappings = array(
        // Basic event properties. This is not all properties, only those needed explicitly
        // while processing recurrence. The others are read and set generically.
        event_id   => 'id',
        start_date => 'start',
        end_date   => 'end',
        duration   => 'duration',
        
        // Recurrence-specific properties needed for processing recurring events:
        rrule                => 'rrule',
        orig_event_id        => 'origid',
        recur_instance_id    => 'rid',
        recur_edit_mode      => 'redit',
        recur_instance_start => 'ristart'
    );
    
    function generateInstances($event, $viewStartDate, $viewEndDate) {
        global $mappings, $date_format, $max_event_instances;
        
        $rrule = $event->$mappings['rrule'];
        $instances = array();
        $counter = 0;
        
        if ($rrule) {
            $duration = $event->$mappings['duration'];
            
            if (!isset($duration)) {
                // Duration is required to calculate the end date of each instance. You could raise
                // an error here if appropriate, but we'll just be nice and default it to 0 (i.e.
                // same start and end dates):
                $duration = 0;
            }
            
            // Start parsing at the later of event start or current view start:
            $rangeStart = max($viewStartDate, $event->$mappings['start_date']);
            //$rangeStart = self::adjustRecurrenceRangeStart($rangeStart, $event);
            $rangeStartTime = strtotime($rangeStart);
            
            // Stop parsing at the earlier of event end or current view end:
            $rangeEnd = min($viewEndDate, $event->$mappings['end_date']);
            $rangeEndTime = strtotime($rangeEnd);
            
            // Third-party recurrence parser -- see recur.php
            $recurrence = new When();
            
            // TODO: Using the event start date here is the correct approach, but is inefficient
            // based on the current recurrence library in use, which does not accept a starting
            // date other than the event start date. The farther in the future the view range is,
            // the more processing is required and the slower performance will be. If you can parse
            // only relative to the current view range, parsing speed is much faster, but it
            // introduces a lot more complexity to ensure that the returned dates are valid for the
            // recurrence pattern. For now we'll sacrifice performance to ensure validity, but this
            // may need to be revisited in the future.
            //$rdates = $recurrence->recur($rangeStart)->rrule($rrule);
            $rdates = $recurrence->recur($event->$mappings['start_date'])->rrule($rrule);
            
            // Counter used for generating simple unique instance ids below
            $idx = 1;
            
            // Loop through all valid recurrence instances as determined by the parser
            // and validate that they are within the valid view range (and not exceptions).
            while ($rdate = $rdates->next()) {
                $rtime = strtotime($rdate->format('c'));
                
                // When there is no end date or maximum count as part of the recurrence RRULE
                // pattern, the parser by default will simply loop until the end of time. For
                // this reason it is critical to have these boundary checks in place:
                if ($rtime < $rangeStartTime) {
                    // Instance falls before the range: skip, but keep trying
                    continue;
                }
                if ($rtime > $rangeEndTime) {
                    // Instance falls after the range: the returned set is sorted in date
                    // order, so we can now exit and return the current event set
                    break;
                }
                
                // if (self::exceptionMatch($event->$mappings['event_id'], $rdate)) {
                    // // The current instance falls on an exception date so skip it
                    // continue;
                // }
                
                // Make a copy of the original event and add the needed recurrence-specific stuff:
                $copy = clone $event;
                
                // On the client side, Ext stores will require a unique id for all returned events.
                // The specific id format doesn't really matter ($mappings['orig_event_id will be used
                // to tie them together) but all ids must be unique:
                $copy->$mappings['event_id'] = $event->$mappings['event_id'].'-rid-'.$idx++;
                
                // Associate the instance to its master event for later editing:
                $copy->$mappings['orig_event_id'] = $event->$mappings['event_id'];
                // Save the duration in case it wasn't already set:
                $copy->$mappings['duration'] = $duration;
                // Replace the series start date with the current instance start date:
                $copy->$mappings['start_date'] = $rdate->format($date_format);
                // By default the master event's end date will be the end date of the entire series.
                // For each instance, we actually want to calculate a proper instance end date from
                // the duration value so that the view can simply treat them as standard events:
                $copy->$mappings['end_date'] = $rdate->add(new DateInterval('PT'.$duration.'M'))->format($date_format);
                
                // Add the instance to the set to be returned:
                array_push($instances, $copy);
                
                if (++$counter > $max_event_instances) {
                    // Should never get here, but it's our safety valve against infinite looping.
                    // You'd probably want to raise an application error if this happens.
                    break;
                }
            }
        }
        return $instances;
    };
    
    
    //********************************************************************************
    //
    // Finally, process the request
    //
    //********************************************************************************
    
    switch ($action) {
        case 'load':
            $start_dt = isset($_REQUEST['startDate']) ? strtolower($_REQUEST['startDate']) : null;
            $end_dt = isset($_REQUEST['endDate']) ? strtolower($_REQUEST['endDate']) : null;
            
            if (isset($start_dt) && isset($end_dt)) {
                // Query by date range for displaying a calendar view
                $sql = 'SELECT * FROM events WHERE app_id = :app_id'.
                        ' AND ((start >= :start AND start <= :end)'. // starts in range
                        ' OR (end >= :start AND end <= :end)'.        // ends in range
                        ' OR (start <= :start AND end >= :end))';      // spans range
                
                $events = $db->querySql($sql, array(
                    ':app_id' => $app_id,
                    ':start'  => $start_dt,
                    ':end'    => $end_dt
                ));
                
                $matches = array();
                
                foreach ($events as $event) {
                    $matches = array_merge($matches, generateInstances($event, $start_dt, $end_dt));
                }
                out($matches);
            }
            else {
                out(null, 'You must supply a valid start and end date');
            }
            break;

        case 'add':
            if (isset($event)) {
                $result = $db->insert($table, $event);
            }
            out($result);
            break;
        
        case 'update':
            if (isset($event)) {
                $result = $db->update($table, $event);
            }
            out($result);
            break;
        
        case 'delete':
            if (isset($event)) {
                $result = $db->delete($table, $event['id']);
            }
            if ($result === 1) {
                // Return the deleted id instead of row count
                $result = $event['id'];
            }
            out($result);
            break;
    }
