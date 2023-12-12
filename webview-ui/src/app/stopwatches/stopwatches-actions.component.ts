import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDivider } from "@vscode/webview-ui-toolkit";
import { startWith } from "rxjs";
import { CheckboxComponent } from "../ui/components/checkbox.component";
import { StopwatchFilter, defaultFilter } from "./stopwatch.model";

provideVSCodeDesignSystem().register(vsCodeDivider, vsCodeButton);

@Component({
  template: `
    <div>
      <section class="actions">
        <vscode-button (click)="pauseAll.emit()" appearance="secondary"> Pause All </vscode-button>
        <vscode-button (click)="resumeAll.emit()" appearance="secondary">
          Resume All
        </vscode-button>
        <vscode-button (click)="stopAll.emit()" appearance="secondary"> Stop All </vscode-button>
        <vscode-button (click)="removeAll.emit()" appearance="secondary"> Clear All </vscode-button>
      </section>
      <section class="filters">
        <div>
          <form [formGroup]="filterGroup">
            <app-checkbox
              label="Running"
              formControlName="running"
              [checked]="getControlVal('running')"
            >
            </app-checkbox>
            <app-checkbox
              label="Paused"
              formControlName="paused"
              [checked]="getControlVal('paused')"
            >
            </app-checkbox>
            <app-checkbox
              label="Stopped"
              formControlName="stopped"
              [checked]="getControlVal('stopped')"
            >
            </app-checkbox>
          </form>
        </div>
      </section>
    </div>
    <vscode-divider></vscode-divider>
  `,
  styles: [
    `
      div {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
      }

      vscode-button {
        margin: 3px;
      }
    `,
  ],
  imports: [ReactiveFormsModule, CheckboxComponent],
  selector: "app-stopwatches-actions",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesActionsComponent implements OnInit {
  @Output() readonly pauseAll = new EventEmitter<void>();
  @Output() readonly resumeAll = new EventEmitter<void>();
  @Output() readonly stopAll = new EventEmitter<void>();
  @Output() readonly removeAll = new EventEmitter<void>();
  @Output() readonly filterChange = new EventEmitter<any>();

  readonly filterGroup = new FormGroup({
    running: new FormControl(false),
    paused: new FormControl(false),
    stopped: new FormControl(false),
  });

  ngOnInit(): void {
    //todo: get from user settings once we have user settings :)
    this.filterGroup.setValue(defaultFilter);
    this.filterGroup.valueChanges
      .pipe(startWith(defaultFilter))
      .subscribe((vals) => this.filterChange.emit(vals as StopwatchFilter));
  }

  getControlVal(key: string): boolean {
    return this.filterGroup.get(key)?.value;
  }
}
