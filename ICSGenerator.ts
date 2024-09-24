class ICSGenerator {
  private event: {
    title: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
  };

  constructor(event: {
    title: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
  }) {
    this.event = event;
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';
  }

  private calculateDuration(): string {
    const diff = this.event.endDateTime.getTime() - this.event.startDateTime.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `PT${hours}H${minutes}M`;
  }

  generate(): string {
    const timezone = 'Asia/Kolkata';
    const start = this.formatDate(this.event.startDateTime);
    const end = this.formatDate(this.event.endDateTime);
    console.log("Start Time within icsgen", start)
    console.log("end Time within icsgen", end)

    return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ICALENDER//ICSAPP//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:${timezone}
BEGIN:STANDARD
DTSTART:19701101T000000
TZOFFSETFROM:+0530
TZOFFSETTO:+0530
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:${new Date().getTime()}@workstation
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${this.event.title}
DESCRIPTION:${this.event.description}
LOCATION:${this.event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  }
}

export default ICSGenerator;
