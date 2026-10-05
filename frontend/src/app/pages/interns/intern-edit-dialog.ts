import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Intern } from '../../models/intern.model';
import { InternService } from '../../services/intern.service';

@Component({
  selector: 'app-intern-edit-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Edit intern</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <p>Intern ID: <strong>{{ data.internId }}</strong> (cannot be changed)</p>

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
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button type="submit" [disabled]="saving()">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`mat-form-field { display: block; width: 100%; }`],
})
export class InternEditDialog {
  data = inject<Intern>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<InternEditDialog>);
  private internService = inject(InternService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder).nonNullable;

  saving = signal(false);

  form = this.fb.group({
    name: [this.data.name, [Validators.required, Validators.maxLength(100)]],
    email: [this.data.email, [Validators.required, Validators.email, Validators.maxLength(150)]],
    mobileNumber: [this.data.mobileNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.internService
      .update(this.data.id, { name: v.name.trim(), email: v.email.trim(), mobileNumber: v.mobileNumber })
      .subscribe({
        next: (updated) => {
          this.snackBar.open('Intern updated', 'Close', { duration: 3000 });
          this.dialogRef.close(updated);
        },
        error: () => {
          this.snackBar.open('Failed to update intern', 'Close', { duration: 5000 });
          this.saving.set(false);
        },
      });
  }
}