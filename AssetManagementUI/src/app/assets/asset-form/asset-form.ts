import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../core/services/category';
import { OrganizationService } from '../../core/services/organization';

@Component({
  selector: 'app-asset-form',
  standalone: false, // CRITICAL: This must be false
  templateUrl: './asset-form.html',
})
export class AssetForm implements OnInit {
  assetForm: FormGroup;
  categories: any[] = [];
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private orgService: OrganizationService,
    public dialogRef: MatDialogRef<AssetForm>,
  ) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      assetTag: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      organizationUnitId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => (this.categories = data));
    this.orgService.getHierarchy().subscribe((data) => {
      this.departments = this.flattenDepartments(data);
    });
  }

  flattenDepartments(nodes: any[]): any[] {
    let result: any[] = [];
    nodes.forEach((node) => {
      result.push({ id: node.id, name: node.name });
      if (node.children) {
        result = result.concat(this.flattenDepartments(node.children));
      }
    });
    return result;
  }

  onSave() {
    if (this.assetForm.valid) {
      this.dialogRef.close(this.assetForm.value);
    }
  }
}
