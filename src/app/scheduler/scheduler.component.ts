import { Component, AfterViewInit, ViewEncapsulation, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SchedulerEvent, EventStyleArgs, EventClickEvent } from '@progress/kendo-angular-scheduler';
import { sampleData, displayDate } from "../event-utc";

interface CustomSchedulerEvent extends SchedulerEvent {
  nameId: number;
  ownerID: number;
  isNew: boolean;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SchedulerComponent {
  @ViewChild('schedulerRef', { static: false }) schedulerRef!: ElementRef;

  public selectedDate: Date = displayDate;
  public events: CustomSchedulerEvent[] = sampleData as CustomSchedulerEvent[];
  public selectedTaskIDs: number[] = [];
  public dialogOpened = false;
  public invalidFields: Set<string> = new Set();

  public group: any = {
    resources: ["Name"],
    orientation: "vertical",
  };

  public resources: any[] = [
    {
      name: "Name",
      data: [
        { text: "1-1", value: 1 },
        { text: "1-2", value: 2 },
        { text: "1-3", value: 3 },
        { text: "1-4", value: 4 },
        { text: "1-5", value: 5 },
        { text: "2-1", value: 6 },
        { text: "2-2", value: 7 },
        { text: "2-3", value: 8 },
        { text: "2-4", value: 9 },
        { text: "2-5", value: 10 },
      ],
      field: "nameId",
      valueField: "value",
      textField: "text",
    },
  ];

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    if (this.schedulerRef && this.schedulerRef.nativeElement) {
      const schedulerElement = this.schedulerRef.nativeElement;

      this.renderer.listen(schedulerElement, 'click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('k-slot-cell')) {
          this.onCellClick(target);
        }
      });
    }
  }

  public onEventClick(event: EventClickEvent): void {
    const taskId = event.event.id;

    const index = this.selectedTaskIDs.indexOf(taskId);
    if (index === -1) {
      this.selectedTaskIDs.push(taskId);
    } else {
      this.selectedTaskIDs.splice(index, 1);
    }
  }

  public getEventStyles = (args: EventStyleArgs) => {
    if (args.event.isNew) {
      return { backgroundColor: "yellow", color: "black", border: ".5px solid black", borderRadius: "0px" };
    }

    if (this.selectedTaskIDs.includes(args.event.id)) {
      return { backgroundColor: "rgb(0, 255, 255)", color: "black", border: ".5px solid black", borderRadius: "0px" };
    } else {
      return { backgroundColor: "orange", color: "black", border: ".5px solid black", borderRadius: "0px" };
    }
  };

  public handleSchedulerClick(event: Event): void {
    let target = event.target as HTMLElement;

    while (target && !target.classList.contains('k-slot-cell')) {
      target = target.parentElement as HTMLElement;
    }

    if (target && target.classList.contains('k-slot-cell')) {
      this.onCellClick(target);
    }
  }

  public onCellClick(cell: HTMLElement): void {
    const resourceValue = cell.textContent?.trim();

    if (resourceValue) {
      const eventsInCell = this.events.filter((evt) => {
        return this.resources[0].data.some(resource => resource.text === resourceValue && resource.value === evt.nameId);
      });

      const taskIDsInCell = eventsInCell.map(evt => evt.id);

      const allSelected = taskIDsInCell.every(taskId => this.selectedTaskIDs.includes(taskId));

      if (allSelected) {
        this.selectedTaskIDs = this.selectedTaskIDs.filter(taskId => !taskIDsInCell.includes(taskId));
      } else {
        taskIDsInCell.forEach(taskId => {
          if (!this.selectedTaskIDs.includes(taskId)) {
            this.selectedTaskIDs.push(taskId);
          }
        });
      }
    }
  }

  public newEvent: Partial<CustomSchedulerEvent> = {
    nameId: null,
    start: null,
    end: null,
    title: 'Blockout'
  };

  public addTask(): void {
    this.invalidFields.clear();
    const { nameId, start, end } = this.newEvent;

    if (!nameId) this.invalidFields.add('nameId');
    if (!start) this.invalidFields.add('start');
    if (!end) this.invalidFields.add('end');

    if (this.invalidFields.size > 0) {
      return;
    }

    const newTask: CustomSchedulerEvent = {
      id: this.events.length + 1,
      start: new Date(start!),
      end: new Date(end!),
      isAllDay: true,
      title: 'Blockout',
      nameId: Number(nameId!),
      ownerID: Number(nameId!),
      isNew: true
    };

    const existingTaskIndex = this.events.findIndex(task => task.nameId === newTask.nameId);

    if (existingTaskIndex !== -1) {
      const updatedData = [...this.events];

      updatedData.splice(existingTaskIndex, 0, newTask);

      this.events = updatedData;
    } else {
      this.events = [...this.events, newTask];
    }

    this.cdr.detectChanges();
    this.newEvent = { nameId: null, start: null, end: null, title: 'Blockout' };
    this.dialogOpened = false;
  }

  public openDialog(): void {
    this.dialogOpened = true;
  }

  public closeDialog(): void {
    this.dialogOpened = false;
  }

  public isFieldInvalid(field: string): boolean {
    return this.invalidFields.has(field);
  }
}
