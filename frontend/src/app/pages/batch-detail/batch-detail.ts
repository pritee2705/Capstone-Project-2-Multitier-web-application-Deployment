import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Batch } from '../../models/batch.model';
import { Intern } from '../../models/intern.model';
import { BatchService } from '../../services/batch.service';

@Component({
  selector: 'app-batch-detail',
  imports: [DatePipe, RouterLink, MatCardModule, MatButtonModule, MatTableModule],
  template: `
    <a mat-button routerLink="/batches">← Back to batches</a>

    @if (notFound()) {
      <mat-card class="card">
        <mat-card-content>Batch not found.</mat-card-content>
      </mat-card>
    } @else if (batch(); as b) {
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Batch #{{ b.id }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="summary">
            <div><span class="label">Start date</span>{{ b.startDate | date: 'dd MMM yyyy' }}</div>
            <div><span class="label">End date</span>{{ b.endDate | date: 'dd MMM yyyy' }}</div>
            <div><span class="label">Total interns</span>{{ b.totalInterns }}</div>
            <div><span class="label">Premium</span>{{ premiumCount() }}</div>
            <div><span class="label">Free</span>{{ freeCount() }}</div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Interns in this batch</mat-card-title>
        </mat-card-header>
        <mat-card-content>
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
              <ng-container matColumnDef="idCardType">
                <th mat-header-cell *matHeaderCellDef>ID card</th>
                <td mat-cell *matCellDef="let i">{{ i.idCardType === 'PREMIUM' ? 'Premium' : 'Free' }}</td>
              </ng-container>
              <ng-container matColumnDef="dateOfJoining">
                <th mat-header-cell *matHeaderCellDef>Date of joining</th>
                <td mat-cell *matCellDef="let i">{{ i.dateOfJoining | date: 'dd MMM yyyy' }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns"></tr>
              <tr *matNoDataRow>
                <td class="empty" [attr.colspan]="columns.length">No interns in this batch</td>
              </tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .card { margin: 16px 0; }
      .summary { display: flex; flex-wrap: wrap; gap: 32px; padding-top: 16px; }
      .label { display: block; font-size: 12px; opacity: 0.7; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; }
      .empty { padding: 16px; text-align: center; }
    `,
  ],
})
export class BatchDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private batchService = inject(BatchService);

  columns = ['internId', 'name', 'email', 'mobileNumber', 'idCardType', 'dateOfJoining'];
  batch = signal<Batch | null>(null);
  interns = signal<Intern[]>([]);
  notFound = signal(false);

  premiumCount = computed(() => this.interns().filter((i) => i.idCardType === 'PREMIUM').length);
  freeCount = computed(() => this.interns().filter((i) => i.idCardType === 'FREE').length);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.batchService.getOne(id).subscribe({
      next: (b) => this.batch.set(b),
      error: () => this.notFound.set(true),
    });
    this.batchService.getInterns(id).subscribe({
      next: (data) => this.interns.set(data),
      error: () => this.interns.set([]),
    });
  }
}