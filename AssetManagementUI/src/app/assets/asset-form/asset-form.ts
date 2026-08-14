import { Component, OnInit, Inject } from '@angular/core'; // Added Inject
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Added MAT_DIALOG_DATA
import { CategoryService } from '../../core/services/category';
import { OrganizationService } from '../../core/services/organization';

@Component({
  selector: 'app-asset-form',
  standalone: false,
  templateUrl: './asset-form.html',
})
export class AssetForm implements OnInit {
  assetForm: FormGroup;
  categories: any[] = [];
  departments: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private orgService: OrganizationService,
    public dialogRef: MatDialogRef<AssetForm>,
    @Inject(MAT_DIALOG_DATA) public data: any, // This receives the asset to edit
  ) {
    this.isEditMode = !!data;

    this.assetForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      assetTag: [data?.assetTag || '', Validators.required],
      description: [data?.description || ''],
      status: [data?.status || 'Available', Validators.required], // Added status
      categoryId: [data?.categoryId || null, Validators.required],
      organizationUnitId: [data?.organizationUnitId || null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res) => (this.categories = res));
    this.orgService
      .getHierarchy()
      .subscribe((res) => (this.departments = this.flattenDepartments(res)));
  }

  flattenDepartments(nodes: any[]): any[] {
    let result: any[] = [];
    nodes.forEach((node) => {
      result.push({ id: node.id, name: node.name });
      if (node.children) result = result.concat(this.flattenDepartments(node.children));
    });
    return result;
  }

  onSave() {
    if (this.assetForm.valid) {
      this.dialogRef.close(this.assetForm.value);
    }
  }
}
