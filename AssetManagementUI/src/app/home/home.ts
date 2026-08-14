import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Services
import { OrganizationService } from '../core/services/organization';
import { AssetService } from '../core/services/asset';
import { CategoryService } from '../core/services/category';

// Components
import { OrganizationForm } from '../organization/organization-form/organization-form';
import { AssetForm } from '../assets/asset-form/asset-form';
import { CategoryManagerComponent } from '../assets/category-manager/category-manager';

interface OrganizationNode {
  id: number;
  name: string;
  children?: OrganizationNode[];
}
interface Asset {
  id: number;
  assetTag: string;
  name: string;
  categoryName: string;
  organizationUnitName: string;
  status: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  userName: string | null = null;
  assets: Asset[] = [];
  displayedColumns: string[] = [
    'assetTag',
    'name',
    'categoryName',
    'organizationUnitName',
    'status',
    'actions',
  ];

  treeControl = new NestedTreeControl<OrganizationNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<OrganizationNode>();

  constructor(
    private orgService: OrganizationService,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.userName = localStorage.getItem('fullName');
  }

  ngOnInit(): void {
    this.loadTree();
    this.loadAssets();
  }

  hasChild = (_: number, node: OrganizationNode) => !!node.children && node.children.length > 0;

  loadTree(): void {
    this.orgService.getHierarchy().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.cdr.detectChanges(); // Fix for UI timing
      },
      error: (error) => console.error('Tree load error:', error),
    });
  }

  loadAssets(): void {
    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.assets = data;
        this.cdr.detectChanges(); // Fix for UI timing
      },
      error: (error) => console.error('Asset load error:', error),
    });
  }

  addUnit(node: OrganizationNode) {
    const dialogRef = this.dialog.open(OrganizationForm, {
      width: '400px',
      data: { parentName: node.name },
    });

    dialogRef.afterClosed().subscribe((newName) => {
      if (newName && node) {
        this.orgService.createUnitAsync(newName, node.id).subscribe(() => {
          setTimeout(() => this.loadTree(), 150);
        });
      }
    });
  }

  viewAsset(id: number) {
    this.router.navigate(['/assets', id]);
  }

  deleteAsset(id: number) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe(() => this.loadAssets());
    }
  }

  deleteUnit(id: number) {
    if (confirm('Delete this department? This will fail if it has assets.')) {
      this.orgService.deleteUnit(id).subscribe({
        next: () => this.loadTree(),
        error: (err) => alert('Cannot delete: Unit is not empty.'),
      });
    }
  }

  manageCategories() {
    this.dialog.open(CategoryManagerComponent, { width: '500px' });
  }

  openAddAssetForm() {
    const dialogRef = this.dialog.open(AssetForm, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assetService.createAsset(result).subscribe(() => this.loadAssets());
      }
    });
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
