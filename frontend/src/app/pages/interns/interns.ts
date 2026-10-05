import { MatDialog } from '@angular/material/dialog';
import { InternEditDialog } from './intern-edit-dialog';
import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { Batch } from '../../models/batch.model';
import { IdCardType, Intern } from '../../models/intern.model';
import { BatchService } from '../../services/batch.service';
import { InternService } from '../../services/intern.service';
import { toApiDate } from '../../utils/date.util';

@Component({
  selector: 'app-interns',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
  ],
  template: `
    <mat-card class="card">
      <mat-card-header>
        <mat-card-title>Register Intern</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" #formDir="ngForm" (ngSubmit)="save(formDir)" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" maxlength="100" />
            <mat-error>Name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (form.controls.email.hasError('required')) {
              <mat-error>Email is required</mat-error>
            } @else {
              <mat-error>Email format is invalid</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mobile number</mat-label>
            <input matInput formControlName="mobileNumber" maxlength="10" inputmode="numeric" />
            @if (form.controls.mobileNumber.hasError('required')) {
              <mat-error>Mobile number is required</mat-error>
            } @else {
              <mat-error>Must be exactly 10 digits</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>ID card type</mat-label>
            <mat-select formControlName="idCardType">
              <mat-option value="FREE">Free</mat-option>
              <mat-option value="PREMIUM">Premium</mat-option>
            </mat-select>
            <mat-error>ID card type is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date of joining</mat-label>
            <input matInput [matDatepicker]="joinPicker" formControlName="dateOfJoining" />
            <mat-datepicker-toggle matIconSuffix [for]="joinPicker" />
            <mat-datepicker #joinPicker />
            <mat-error>Date of joining is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Batch</mat-label>
            <mat-select formControlName="batchId">
              @for (b of batches(); track b.id) {
                <mat-option [value]="b.id">
                  #{{ b.id }} · {{ b.startDate | date: 'dd MMM yyyy' }} – {{ b.endDate | date: 'dd MMM yyyy' }}
                </mat-option>
              }
            </mat-select>
            <mat-error>Please assign a batch</mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-flat-button type="submit" [disabled]="saving()">Register intern</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>

    <mat-card class="card">
      <mat-card-header>
        <mat-card-title>Interns</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="filters" class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Search by name</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Batch</mat-label>
            <mat-select formControlName="batchId">
              <mat-option [value]="null">All batches</mat-option>
              @for (b of batches(); track b.id) {
                <mat-option [value]="b.id">#{{ b.id }} · {{ b.startDate | date: 'dd MMM yyyy' }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>ID card type</mat-label>
            <mat-select formControlName="idCardType">
              <mat-option value="">All types</mat-option>
              <mat-option value="FREE">Free</mat-option>
              <mat-option value="PREMIUM">Premium</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button type="button" (click)="clearFilters()">Clear</button>
        </form>

        <div class="table-wrap">
          <table mat-table [dataSource]="interns()">
            <ng-container matColumnDef="internId">
              <th mat-header-cell *matHeaderCellDef>Intern ID</th>
              <td mat-cell *matCellDef="let i">{{ i.internId }}</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let i">{{ i.name }}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let i">{{ i.email }}</td>
            </ng-container>
            <ng-container matColumnDef="mobileNumber">
              <th mat-header-cell *matHeaderCellDef>Mobile</th>
              <td mat-cell *matCellDef="let i">{{ i.mobileNumber }}</td>
            </ng-container>
            <ng-container matColumnDef="batch">
              <th mat-header-cell *matHeaderCellDef>Batch</th>
              <td mat-cell *matCellDef="let i">#{{ i.batchId }} ({{ i.batchStartDate | date: 'dd MMM yyyy' }})</td>
            </ng-container>
            <ng-container matColumnDef="idCardType">
              <th mat-header-cell *matHeaderCellDef>ID card</th>
              <td mat-cell *matCellDef="let i">{{ i.idCardType === 'PREMIUM' ? 'Premium' : 'Free' }}</td>
            </ng-container>
            <ng-container matColumnDef="dateOfJoining">
              <th mat-header-cell *matHeaderCellDef>Date of joining</th>
              <td mat-cell *matCellDef="let i">{{ i.dateOfJoining | date: 'dd MMM yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let i">
                <button mat-button (click)="edit(i)">Edit</button>
                <button mat-button color="warn" (click)="remove(i)">Delete</button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
            <tr *matNoDataRow>
              <td class="empty" [attr.colspan]="columns.length">No interns found</td>
            </tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .card { margin-bottom: 16px; }
      .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; padding-top: 16px; }
      .actions { grid-column: 1 / -1; }
      .filter-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; padding-top: 16px; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; }
      .empty { padding: 16px; text-align: center; }
    `,
  ],
})
export class Interns implements OnInit {
  private fb = inject(FormBuilder).nonNullable;
  private internService = inject(InternService);
  private batchService = inject(BatchService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  columns = ['internId', 'name', 'email', 'mobileNumber', 'batch', 'idCardType', 'dateOfJoining', 'actions'];
  interns = signal<Intern[]>([]);
  batches = signal<Batch[]>([]);
  saving = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    idCardType: ['' as IdCardType | '', Validators.required],
    dateOfJoining: [null as Date | null, Validators.required],
    batchId: [null as number | null, Validators.required],
  });

  filters = this.fb.group({
    name: [''],
    batchId: [null as number | null],
    idCardType: ['' as IdCardType | ''],
  });

  constructor() {
    this.filters.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.loadInterns());
  }

  ngOnInit(): void {
    this.loadBatches();
    this.loadInterns();
  }

  loadBatches(): void {
    this.batchService.getAll().subscribe({
      next: (data) => this.batches.set(data),
      error: () => this.snackBar.open('Could not load batches', 'Close', { duration: 5000 }),
    });
  }

  loadInterns(): void {
    this.internService.search(this.filters.getRawValue()).subscribe({
      next: (data) => this.interns.set(data),
      error: () => this.snackBar.open('Could not load interns. Is the backend running?', 'Close', { duration: 5000 }),
    });
  }

  clearFilters(): void {
    this.filters.reset({ name: '', batchId: null, idCardType: '' });
  }

  save(formDir: FormGroupDirective): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.internService
      .create({
        name: v.name.trim(),
        email: v.email.trim(),
        mobileNumber: v.mobileNumber,
        idCardType: v.idCardType as IdCardType,
        dateOfJoining: toApiDate(v.dateOfJoining!),
        batchId: v.batchId!,
      })
      .subscribe({
        next: (created) => {
          this.snackBar.open(`Registered. Intern ID: ${created.internId}`, 'Close', { duration: 6000 });
          formDir.resetForm();
          this.saving.set(false);
          this.loadInterns();
          this.loadBatches();
        },
        error: () => {
          this.snackBar.open('Failed to register intern', 'Close', { duration: 5000 });
          this.saving.set(false);
        },
      });
  }

    edit(intern: Intern): void {
    this.dialog
      .open(InternEditDialog, { data: intern, width: '420px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((updated) => {
        if (updated) this.loadInterns();
      });
  }

  remove(intern: Intern): void {
    if (!confirm(`Delete ${intern.name} (${intern.internId})?`)) return;
    this.internService.delete(intern.id).subscribe({
      next: () => {
        this.snackBar.open('Intern deleted', 'Close', { duration: 3000 });
        this.loadInterns();
        this.loadBatches();
      },
      error: () => this.snackBar.open('Failed to delete intern', 'Close', { duration: 5000 }),
    });
  }
}