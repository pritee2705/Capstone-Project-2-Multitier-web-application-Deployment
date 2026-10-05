import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Batch } from '../../models/batch.model';
import { BatchService } from '../../services/batch.service';

// Local-time yyyy-MM-dd (avoids the one-day shift that toISOString() causes in India)
function toApiDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Same rule as Java's plusMonths(6): clamps to the last day of the month (e.g. Aug 31 -> Feb 28)
function addSixMonths(d: Date | null): Date | null {
  if (!d) return null;
  const target = new Date(d.getFullYear(), d.getMonth() + 6, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), lastDay));
  return target;
}

@Component({
  selector: 'app-batches',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    RouterLink,
  ],
  template: `
    <mat-card class="card">
      <mat-card-header>
        <mat-card-title>Create Batch</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Start date</mat-label>
            <input matInput [matDatepicker]="picker" [formControl]="startDate" />
            <mat-datepicker-toggle matIconSuffix [for]="picker" />
            <mat-datepicker #picker />
            <mat-error>Start date is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>End date (automatic)</mat-label>
            <input
              matInput
              readonly
              [value]="endDatePreview() ? (endDatePreview() | date: 'dd MMM yyyy') : ''"
            />
            <mat-hint>6 months after start</mat-hint>
          </mat-form-field>

          <button mat-flat-button (click)="create()" [disabled]="saving()">Create batch</button>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="card">
      <mat-card-header>
        <mat-card-title>Batches</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-wrap">
          <table mat-table [dataSource]="batches()">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let b">{{ b.id }}</td>
            </ng-container>
            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef>Start date</th>
              <td mat-cell *matCellDef="let b">{{ b.startDate | date: 'dd MMM yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef>End date</th>
              <td mat-cell *matCellDef="let b">{{ b.endDate | date: 'dd MMM yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="totalInterns">
              <th mat-header-cell *matHeaderCellDef>Total interns</th>
              <td mat-cell *matCellDef="let b">{{ b.totalInterns }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Details</th>
              <td mat-cell *matCellDef="let b">
                <a mat-button [routerLink]="['/batches', b.id]">View interns</a>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
            <tr *matNoDataRow>
              <td class="empty" [attr.colspan]="columns.length">No batches yet</td>
            </tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .card { margin-bottom: 16px; }
      .form-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; padding-top: 16px; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; }
      .empty { padding: 16px; text-align: center; }
    `,
  ],
})
export class Batches implements OnInit {
  private batchService = inject(BatchService);
  private snackBar = inject(MatSnackBar);

  columns = ['id', 'startDate', 'endDate', 'totalInterns', 'actions'];
  batches = signal<Batch[]>([]);
  saving = signal(false);

  startDate = new FormControl<Date | null>(null, Validators.required);
  private startValue = toSignal(this.startDate.valueChanges, { initialValue: null });
  endDatePreview = computed(() => addSixMonths(this.startValue()));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.batchService.getAll().subscribe({
      next: (data) => this.batches.set(data),
      error: () => this.snackBar.open('Could not load batches. Is the backend running?', 'Close', { duration: 5000 }),
    });
  }

  create(): void {
    const date = this.startDate.value;
    if (!date) {
      this.startDate.markAsTouched();
      return;
    }
    this.saving.set(true);
    this.batchService.create({ startDate: toApiDate(date) }).subscribe({
      next: () => {
        this.snackBar.open('Batch created', 'Close', { duration: 3000 });
        this.startDate.reset();
        this.saving.set(false);
        this.load();
      },
      error: () => {
        this.snackBar.open('Failed to create batch', 'Close', { duration: 5000 });
        this.saving.set(false);
      },
    });
  }
}