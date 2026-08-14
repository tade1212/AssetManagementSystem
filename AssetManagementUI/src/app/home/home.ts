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
import { UserManagerComponent } from '../auth/user-manager/user-manager';


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
  categoryId: number;
  organizationUnitName: string;
  organizationUnitId: number;
  status: string;
  description?: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  allAssets: Asset[] = []; // To keep the original list
  filteredAssets: Asset[] = []; // This is what the table shows
  selectedUnitName: string = 'All Departments';
  userName: string | null = null;
  userRole: string | null = null;
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
    this.userRole = localStorage.getItem('role');
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
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Tree load error:', error),
    });
  }

  loadAssets(): void {
    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.allAssets = data; // Store original
        this.filteredAssets = data; // Default to show all
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Asset load error:', error),
    });
  }

  // 1. Helper to get all IDs in a branch (e.g., IT + Software Team + Infrastructure)
  private getAllUnitIds(node: OrganizationNode): number[] {
    let ids = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids = ids.concat(this.getAllUnitIds(child));
      });
    }
    return ids;
  }

  // 2. Updated Filter Function
  filterByUnit(node: OrganizationNode) {
    console.log('Filtering by Node:', node);
    this.selectedUnitName = node.name;

    const targetUnitIds = this.getAllUnitIds(node);

    // Safety check: Handles both lowercase 'organizationUnitId' and PascalCase 'OrganizationUnitId'
    this.filteredAssets = this.allAssets.filter((asset: any) => {
      const unitId = asset.organizationUnitId || asset.OrganizationUnitId;
      return targetUnitIds.includes(unitId);
    });

    this.cdr.detectChanges();
    console.log(
      `Filter results: Found ${this.filteredAssets.length} assets for IDs:`,
      targetUnitIds,
    );
  }

  // 3. Reset function
  clearFilter() {
    this.selectedUnitName = 'All Departments';
    this.filteredAssets = [...this.allAssets]; // Reset to full list
    this.cdr.detectChanges();
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

  deleteUnit(id: number) {
    if (confirm('Delete this department?')) {
      this.orgService.deleteUnit(id).subscribe(() => this.loadTree());
    }
  }

  openAddAssetForm() {
    const dialogRef = this.dialog.open(AssetForm, { width: '550px', data: null });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assetService.createAsset(result).subscribe(() => this.loadAssets());
      }
    });
  }

  editAsset(asset: Asset) {
    const dialogRef = this.dialog.open(AssetForm, { width: '550px', data: asset });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assetService.updateAsset(asset.id, result).subscribe(() => this.loadAssets());
      }
    });
  }

  viewAsset(id: number) {
    this.router.navigate(['/assets', id]);
  }

  deleteAsset(id: number) {
    if (confirm('Delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe(() => this.loadAssets());
    }
  }

  manageCategories() {
    this.dialog.open(CategoryManagerComponent, { width: '500px' });
  }

  manageUsers() {
    this.router.navigate(['/users']);
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
} // <--- Class MUST end here
