import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-organization-form',
  standalone: false,
  templateUrl: './organization-form.html',
})
export class OrganizationForm {
  unitName: string = '';

  constructor(
    public dialogRef: MatDialogRef<OrganizationForm>,
    @Inject(MAT_DIALOG_DATA) public data: { parentName: string },
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.unitName.trim()) {
      this.dialogRef.close(this.unitName); // Send the name back to the dashboard
    }
  }
}
