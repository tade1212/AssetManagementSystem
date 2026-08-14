import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../core/services/category';

@Component({
  selector: 'app-category-manager',
  standalone: false,
  templateUrl: './category-manager.html',
  styleUrl: './category-manager.scss',
})
export class CategoryManagerComponent implements OnInit {
  categories: any[] = [];
  newCategoryName: string = '';

  constructor(
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryManagerComponent>,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => (this.categories = data));
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      this.categoryService.createCategory(this.newCategoryName).subscribe(() => {
        this.newCategoryName = '';
        this.loadCategories(); // Refresh list
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error || 'Error deleting category'),
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
