# All About Recurrence!

Recurrence is not easy to deal with in applications, and it is particularly tricky to offer as a feature of a general-purpose component. There are many different ways to implement it (with server integration being integral), and Calendar Pro's primary goal is to remain as flexible as possible. Thus I thought it would be worthwhile to provide an overview of some of the design decisions that went into the Extensible recurrence implementation and outline some strategies for integrating it into applications. Also, there simply aren't very many good resources available for tackling how to implement recurrence in general, so hopefully this will be a good resource for developers hoping to do so.

## Conceptual Design


To implement recurrence in an application, you need to consider all of the following:

- **Application Goals** &mdash; Define what "recurrence" really means to your application and what level of complexity your users require (hint: simpler is almost always better)
- **Recurrence Format** &mdash; Choose a recurrence format and supporting data to store with your events that makes it easy (or at least *possible*) to query against events with
- **Event Generation** &mdash; Parse the recurrence data format when retrieving events to generate recurring instances dynamically
- **Recurrence Editing** &mdash; Provide a mechanism in the UI for associating a recurrence pattern to an event and editing it later, and a way to uupdate events in application code (including a way to create exceptions to the recurrence pattern)

This is a pretty nontrivial list, so let's break it down piece by piece.

## Application Goals

It's important to decide up front what level of recurrence is required for your application. The Extensible recurrence widget takes a middle-ground approach out of the box, offering the most common calendar scheduling options of daily, weekly, monthly and yearly recurrence, with basic options for setting the repeat frequency and duration.

If your application does not require all of those options, it might make sense to customize or replace the default Extensible widget. For example, if your application can offer simpler options without the need to set frequency or duration, a simple combo box might meet your needs better.

Some applications may require more complexity than Extensible offers for managing recurring events. For example, some applications allow users to define *exclusion* recurrence patterns, that remove certain dates from an existing recurring event set. Use cases like this would have to be custom built.

## Recurrence Format

While you are certainly free to invent your own custom format for storing recurrence, it is **highly recommended** that you use the standard [RRULE format](http://www.kanzaki.com/docs/ical/rrule.html) as specified in the [RFC-2445 iCalendar specification](http://www.ietf.org/rfc/rfc2445.txt) (Calendar Pro uses this). However, under the umbrella of "recurrence" there are actually many different related properties in the spec:

- [DTSTART](http://www.kanzaki.com/docs/ical/dtstart.html) / [DTEND](http://www.kanzaki.com/docs/ical/dtend.html): The event start and end dates
- [DURATION](http://www.kanzaki.com/docs/ical/duration-t.html): The length of time of the event
- [RRULE](http://www.kanzaki.com/docs/ical/rrule.html): The basic rule for defining a recurrence pattern (which is of type [RECUR](http://www.kanzaki.com/docs/ical/recur.html))
- [RDATE](http://www.kanzaki.com/docs/ical/rdate.html): A list of discreet date/time values that can be aggregated with the RRULE to produce a union of event instances
- [EXRULE](http://www.kanzaki.com/docs/ical/exrule.html) / [EXDATE](http://www.kanzaki.com/docs/ical/exdate.html): Inverse of the "R" versions. These define exceptions to the recurrence pattern that are excluded when calculating the final set of discreet event instances
- [VTIMEZONE](http://www.kanzaki.com/docs/ical/vtimezone.html): A list of rules for Daylight Savings observance by timezone

Perusing these specs even for a few minutes might make your head spin. And these documents simply *define* the data formats &mdash; we haven't even begun implementing anything yet! In reality, the complexity is dependent on the requirements of your intended usage. Luckily most people can get by with only a subset of what the specs define.

Another thing to keep in mind is that one of the primary goals of the RFC is to define specifications for *interoperability* between calendaring systems, which necessarily increases complexity. In most cases (and certainly in all cases supported directly by Calendar Pro) we won't be sending iCal-formatted data packets from one system to another &mdash; you will simply be persisting and retrieving event data to and from your own servers. In the event that you need to interact with a third-party API, you would be more concerned with that API's specific implementation than with the RFC. As such, unless you are actually authoring a public calendaring API (and if you are, I wish you luck :) much of the complexity in the specs can be safely ignored.  Let's walk through the details of how Calendar Pro addresses implementation.

### Rule 0

Before we get started, let's get this out of the way right up front:

> **Do NOT store individual recurring event instances as rows in your database!**

You might wonder if anyone would actually do this, but I've seen many commenters on Stack Overflow (and used at least one production application) that stored recurring event instances as separate DB rows. After all, at first glance, it seems like a common sense approach that ironically does solve some of the complexity we'll discuss later (e.g. how to query for recurring events). Could it really be that bad?

*Storing recurring events as individual rows is a recipe for disaster.*

Imagine a typical recurring event like "Repeat every weekday for 10 weeks". Simple right? Translated into event *instances*, that single rule represents **50 unique events**. Throw a few of those into a multi-week UI view, and you'll likely run into rendering performance issues pretty quickly.

Now imagine another common recurrence pattern: "Repeat every Monday forever". Another very simple, and quite common rule. Note the absence of an end date &mdash; how many unique event instances will that rule generate? That depends on the system on which the code is running, but simply put you could potentially generate an event for every Monday between now and the system's maximum date (December 31, 9999 anyone?).

The best case scenario is that you must arbitrarily limit the recurrence range or instance count your users can select in the UI (e.g. "up to 10 instances") in which case you've severely crippled the usability of your application and made an already-complex process even more complicated to manage.

The worst case scenario is that you don't limit the possible range of recurrence, and a single event that recurs daily with no end date instantly exhausts your database's storage capacity and/or your application's RAM (whichever comes first) and your server crashes. I've seen this happen!

So, just to be clear, please repeat after me:

> I will always persist a recurrence *pattern*, not individual recurrence *instances*. **Event instances will be calculated at runtime.**

### Event Schema

To define a calendar event, technically all that is required is a start and end date/time range. Other common fields are title, unique id and, if supported, an "all day" flag to ignore time values. Aside from that, other data is purely application-driven. Here is an example of a basic event schema that includes recurrence and exceptions:

#### Event

| Column Name          | Type                 |
|----------------------|----------------------|
| EventId              | Unique id            |
| Title                | String               |
| StartDateUtc         | DateTime             |
| EndDateUtc           | DateTime             |
| IsAllDay             | Boolean              |
| Duration             | Integer              |
| IsRecurring          | Boolean              |
| RecurrencePattern    | String               |

#### EventException

| Column Name          | Type                 |
|----------------------|----------------------|
| EventExceptionId     | Unique id            |
| EventID (FK)         | Unique id            |
| ExceptionDateUtc     | DateTime             |

**This is not the only possible way to design your schema**, but it's a simple approach that should meet most basic needs. Here are some thoughts that went into it:

- `RecurrencePattern` is of course the iCal recurrence string, assuming that the iCal RFC is being followed (e.g., `FREQ=DAILY;INTERVAL=10;COUNT=5`). If some custom recurrence pattern scheme is in use then this might be different.
- `Duration` is strongly recommended in conjunction with recurrence, as explained in the next section. The duration is typically stored as a time value in the minimum resolution supported by your application (e.g. minutes).
- A separate boolean flag for `IsRecurring` is not strictly required, but is handy to avoid having to check that the recurrence pattern is not null or empty string throughout your code. You could also create a derived field for this in your data model without needing an extra column, if that makes sense for you (or just check the pattern for `NULL` in your queries).
- For exceptions, there are actually lots of different ways to approach storing them. Another simple option might be avoiding the separate table and storing a delimited string of exception dates as another column in the event table, although the separate table approach leaves open more flexibility for enhancing exception support in the future. We'll talk through this in much more detail below in the section specifically dealing with exceptions.

While Calendar Pro certainly does not mandate how you should design your database, this is a good starting point if you're unsure how to approach it. This will also be the assumed schema for the purposes of further talking through implementation details, so if you choose to store your data differently you may have to adjust some of the details appropriately.

#### UTC vs Local Time

You may have noticed the suffix *Utc* on the date/time columns in the above schema. It's not strictly required, but is *highly recommended* that you store all date/time values in UTC ([Coordinated Universal Time](http://en.wikipedia.org/wiki/Coordinated_Universal_Time)) format, and it's critical to do so in any sort of distributed system. There are multiple points in the processing of date-based data that require date/time arithmetic and/or comparison. If you are comparing a user-local date/time value to an environment-specific date variable (e.g., something like Date.now() which is quite common) in server code, the answer will only be correct if both user and server are in the same timezone. This would force you to track timezone separately, and include it in all date/time operations, excessively complicating your code. Even then, you would still be inviting obscure bugs around daylight savings boundary dates since user-local timezones may observe DST quite differently (or not at all).

The best practice is to convert all user-local date/time values to UTC for storage and processing, and only convert back to user-local time at the point of displaying back to the user. All operations and comparisons on the data should be done in UTC (meaning, for example, that date/time query parameters would also be converted to UTC when querying), which is guaranteed to be consistent and does not change in relation to locality or time of year (unlike local time). This does mean of course that you would have to store the user's timezone, and use it in the conversion between local and UTC time, but you would not have to send it along as part of the transactional event data (typically it would be retrieved once and stored in the user's session for server-side processing).

### Event Frequency

The iCal spec outlines support for recurrence frequencies as small as `SECONDLY`. However for practical reasons, Calendar Pro's minimum supported frequency out of the box is `DAILY`. Most typical calendar implementations do the same (see Google Calendar, for example), and given the layout constraints of the current calendar implementation, supporting frequencies smaller than daily would require a more granular view than what's currently available. If your application requires sub-daily recurrence support you may have to add your own custom view(s) to support it.

### Event Exceptions

According to the spec, support for exceptions is just as flexible as support for events. The spec supports creating full-blown exception recurrence ranges and patterns, in addition to individual exception instances. In practice, such support adds undue complexity to the user interface and is rarely required in applications. Most commonly exceptions are supported only as one-off instances, and that's the assumption that Extensible will make as well. This will be discussed in more detail in the section below on event editing.

### Storage and Retrieval

**NOTE**: Some platforms already provide a native event / recurrence API, with storage and retrieval abstracted for you. Microsoft, for example, offers such an API via [Exchange Web Services](http://msdn.microsoft.com/en-us/library/dd633694%28v=exchg.80%29.aspx) for integrating with an Exchange-based calendar system. The following section assumes that you do NOT have such an API handy and that you need to design your own solution for storing and retrieving recurring events.

According to the spec, "the DTSTART and DTEND property pair or DTSTART and DURATION property pair... defines the first instance of the recurrence." However, this choice only makes sense in terms of the interoperability use case of sending an event between systems. In that case, the two options are equivalent in terms of parseability.

When implementing recurrence for application-specific storage and retrieval, my recommendation is:

- Always store the start date and event duration
- For recurrence patterns that include an end date explicitly (via `UNTIL`), store it as the end date *of the range*
- For recurrence patterns that specify the number of instances (via `COUNT`), calculate the end date *of the range* and store that
- For recurrence patterns with no end date or count, store the end date as a distant future date, such as the database's "max date" property (e.g., '9999-12-31')
- Always store a non-null end date, even for events with no duration, like a "to-do"-style reminder (store the same date/time for start and end in that case)

**The primary reason for these design choices is optimal querying against the data.** Think about constructing a calendar view &mdash; your query will look something like "return all events between January 1 and January 31, 2016". Now assume that you have a one hour event that repeats every day at 09:00 for a year. Simply in terms of *storage*, one option might be to define the event like this:

| Start Date           | End Date             | Recurrence Pattern            |
|----------------------|----------------------|-------------------------------|
| Jan 1, 2016 at 09:00 | Jan 1, 2016 at 10:00 | Recur every Friday for 1 year |

As you can see, that's perfectly sufficient for describing the event accurately. The problem is that the start and end dates are only for the first *occurrence* of the pattern, so what happens when the view requests "all events between February 1 and February 29, 2016"? January 1 is not in that range, so in order to know *at query time* if that event should be returned, you would have to parse the recurrence pattern, *during the query*, for every recurring event in the database. The other option would be to always return *every single recurring event* in the database with a start date prior to the query date range, then process each one in code. Yikes.

While you can't avoid parsing recurrence rules at *some* point in the process, the goal is to filter out as many events as possible during the query, and without adding excessive query overhead. The basic rules are:

- Start date and end date should always contain valid date/time values (not null)
- The start/end combination should always represent the *entire possible range* of dates matching the recurrence range

This means that if an event has recurrence, the stored end date will always be the end date for the recurrence pattern, even when no end date is explicitly specified, which is why we need a separate duration field that tells us how long each event instance should be. Note that you could alternately add a recurrence-specific end date instead of duration, or even store additional columns calculated from the recurrence pattern if needed. Again, there are many possible ways to solve it, but the takeaway is:

> You must be able to distinguish between the recurrence pattern end date and the end date of each event instance to enable practical querying

To return to our example, if we implemented it using to the basic schema recommendation from before we would store the event like so:

| Start Date           | End Date             | Duration | Recurrence Pattern            |
|----------------------|----------------------|----------|-------------------------------|
| Jan 1, 2016 at 09:00 | Jan 1, 2017 at 10:00 | 1 hour   | Recur every Friday for 1 year |

With this data, you can trivially query as expected for any events beginning or ending between (or spanning) the stored start and end dates. More importantly, for a query like "return all events for June 2017" the query can immediately exclude this event row based on the end date, with no extra processing necessary. Contrast to the original approach above, in which case this event would still have to be returned and processed (or the query would have extra work to do) before we could determine that it is not a match.

## Event Generation

Once you have successfully queried your event table and returned a set of event **rows** from the DB, the next step is to have server-side logic that generates recurring event **instances** before returning the event data to the client. There are many ways to do this, and for most platforms there are existing libraries for parsing the iCal format (certainly something you won't want to write from scratch). The specifics of this parsing logic are beyond the scope of this document, but the general flow is something like this:

- Loop over all event rows
- For each event, if `isRecurring == true` parse `RecurrencePattern`
- For each recurring event, generate new event instances (using the same `Event` model) that exist between the query start and end dates and match the recurrence pattern
- For each recurring event, if exception dates are supported, exclude those from the result set
- Return the final set of non-recurring events + recurring event instances

This is definitely non-trivial, and the part that is most variable depending on your platform and application needs.

## Recurrence Editing

Recurrence editing can get a little tricky. While the UI interactions are mostly handled by the calendar components, the logic for updating the data models on the server must be handled by the developer in application code. Note that these are not the only possible editing options, but they are the most common, and the ones supported out of the box by the Extensible Calendar:

### Update/delete **all** instances of an event

This is the simplest one to implement since editing all instances means simply updating the start date, duration and/or recurrence pattern of the existing event, and that's it. Deleting means simply deleting the row in the database that represent the event.

### Update/delete only **future** event instances while keeping past instances

This option is still relatively easy to handle, as you can simply split the original event into two separate events, each with its own distinct recurrence data. The original event is updated with a new end date and/or recurrence pattern, and the new event is a complete copy of the original (new row in the database) with a different event id and a different start date + recurrence pattern combination.

### Update/delete only a **single** selected event instance

This is the trickiest scenario to handle. To delete an instance you have to create an event exception (e.g. a new entry in the EventExceptions table). To update a single instance, you not only need an exception entry, you'll also need a new non-recurring event stored that contains the data unique to that instance.

## Example Code

Again, there are many different ways to handle all of this, and the details will depend on your application's event schema and how you've chosen to implement recurrence in general. To see one example of how this logic is implemented look in the Extensible examples folder at the file `examples/server/php/api/events-recurrence.php`. Unfortunately this is the only example available, so apologies if PHP is not your chosen language. However any developer should be able to follow the flow of logic and comments and see what's generally required to implement recurrence in the application server layer. The goal was to provide an example that could be ported to other languages with minimal effort.

# Resources

Here are a few additional references for dealing with recurrence that you might find helpful. They are not specific to Extensible but might provide additional information on how to implement the concepts of recurrence in your application:

- [Later.js](http://bunkat.github.io/later/) - a JavaScript recurrence library
- [StackOverflow search](http://stackoverflow.com/search?q=recurring+events) (in particular [this answer](http://stackoverflow.com/questions/85699/whats-the-best-way-to-model-recurring-events-in-a-calendar-application))
- [recurring_events_for](https://github.com/bakineggs/recurring_events_for) - Example SQL for dealing with recurrence
- [Calendar Tutorial: Recurring Events](http://www.daypilot.org/calendar-tutorial-recurrent-events.html) - Dealing with recurrence in .NET
- [Understanding Telerik's Scheduler Recurrence](http://dotnetslackers.com/articles/aspnet/Understanding-Teleriks-Scheduler-Recurrence.aspx) - Another .NET example
