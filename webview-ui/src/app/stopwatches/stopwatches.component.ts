import { CommonModule } from "@angular/common";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnInit,
    inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { provideVSCodeDesignSystem, vsCodeDivider } from "@vscode/webview-ui-toolkit";
import { Observable, Subject, switchMap, take, tap } from "rxjs";
import { StopwatchListComponent } from "./stopwatch-list.component";
import { Stopwatch, StopwatchFilter } from "./stopwatch.model";
import { StopwatchStatusService } from "./stopwatch/stopwatch-status.service";
import { UpsertStopwatchComponent } from "./stopwatch/stopwatch-upsert.component";
import { StopwatchesActionsComponent } from "./stopwatches-actions.component";
import { StopwatchesStatsComponent } from "./stopwatches-stats.component";
import { StopwatchesService } from "./stopwatches.service";

provideVSCodeDesignSystem().register(vsCodeDivider);

@Component({
  template: `
    <mat-drawer-container [hasBackdrop]="false">
      <mat-drawer #drawer mode="side" opened>
        <div class="left">
          <app-upsert-stopwatch></app-upsert-stopwatch>
        </div>
      </mat-drawer>
      <mat-drawer-content>
        <vscode-button appearance="icon" (click)="drawer.toggle()">
          @if(drawer.opened){
          <span class="icon"><i [class]="'codicon codicon-chevron-left'"></i></span>
          } @else{
          <span class="icon"><i [class]="'codicon codicon-chevron-right'"></i></span>
          }
        </vscode-button>

        @if ({ stopwatches: filteredStopwatches$ | async }; as value) {
        <div>
          <div>
            <app-stopwatches-stats [stopwatches]="value.stopwatches ?? []"></app-stopwatches-stats>
          </div>
          <div>
            <app-stopwatches-actions
              (stopAll)="onStopAll()"
              (resumeAll)="onResumeAll()"
              (pauseAll)="onPauseAll()"
              (removeAll)="onRemoveAll()"
              (filterChange)="onFilterChange($event)"
            ></app-stopwatches-actions>
          </div>
          @if (value.stopwatches && value.stopwatches.length) {
          <div class="stopwatches__list">
            <app-stopwatch-list [stopwatches]="value.stopwatches"></app-stopwatch-list>
          </div>
          } @else {
          <h3>empty</h3>
          }
          <ng-template #empty>
            <h3>empty</h3>
          </ng-template>
        </div>
        }
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [
    `
      :host,
      mat-drawer-container,
      app-stopwatch-list {
        width: 100%;
        height: 100%;
      }

      mat-drawer-content,
      mat-drawer {
        background-color: var(--background);
        color: var(--foreground);
      }

      mat-drawer {
        padding: 10px;
        width: 30%;
      }

      mat-drawer-content > * {
        margin: 1rem;
      }

      .stopwatches__list {
        word-break: break-all;
        max-height: 80vh;
        overflow: scroll;
      }
    `,
  ],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    StopwatchesStatsComponent,
    StopwatchesActionsComponent,
    CommonModule,
    ReactiveFormsModule,
    StopwatchListComponent,
    UpsertStopwatchComponent,
  ],
  selector: "app-stopwatches",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesComponent implements OnInit {
  private readonly swService = inject(StopwatchesService);
  private readonly swStatusService = inject(StopwatchStatusService);

  private readonly _stopwatches$: Observable<Stopwatch[]> = this.swService.stopwatches$;
  filteredStopwatches$ = new Subject<Stopwatch[]>();

  filterChange$ = new Subject<StopwatchFilter>();

  ngOnInit() {
    this.filterChange$
      .pipe(
        switchMap((filter) =>
          this.swService.get$().pipe(
            switchMap(() =>
              this._stopwatches$.pipe(
                tap((stopwatches) => {
                  const filtered = stopwatches.filter(
                    (sw) =>
                      (filter.paused && sw.isPaused) ||
                      (filter.stopped && sw.isStopped) ||
                      (filter.running && !sw.isStopped && !sw.isPaused)
                  );
                  this.filteredStopwatches$.next(filtered);
                })
              )
            )
          )
        )
      )
      .subscribe();
  }

  onFilterChange(filter: StopwatchFilter) {
    this.filterChange$.next(filter);
  }

  @HostListener("window:keydown.alt.backspace")
  onRemoveAll() {
    this.swService.remove$().subscribe();
  }

  @HostListener("window:keydown.alt.p")
  onPauseAll() {
    this._stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(
            this.swStatusService.pause(
              s.filter((toPause) => !toPause.isPaused && !toPause.isStopped)
            )
          )
        )
      )
      .subscribe();
  }

  @HostListener("window:keydown.alt.s")
  onStopAll() {
    this._stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(this.swStatusService.stop(s.filter((toStop) => !toStop.isStopped)))
        )
      )
      .subscribe();
  }

  @HostListener("window:keydown.alt.r")
  onResumeAll() {
    this._stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(
            this.swStatusService.resume(s.filter((toResume) => toResume.isPaused))
          )
        )
      )
      .subscribe();
  }
}
