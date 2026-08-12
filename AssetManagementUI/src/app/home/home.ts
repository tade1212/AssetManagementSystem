import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { OrganizationService } from '../core/services/organization';
import { AssetService } from '../core/services/asset';

interface OrganizationNode {
  id: number;
  name: string;
  children?: OrganizationNode[];
}

interface Asset {
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
  // ==============================
  // Properties
  // ==============================

  userName: string | null = null;

  assets: Asset[] = [];

  displayedColumns: string[] = [
    'assetTag',
    'name',
    'categoryName',
    'organizationUnitName',
    'status',
  ];

  // ==============================
  // Organization Tree
  // ==============================

  treeControl = new NestedTreeControl<OrganizationNode>((node) => node.children);

  dataSource = new MatTreeNestedDataSource<OrganizationNode>();

  // ==============================
  // Constructor
  // ==============================

  constructor(
    private orgService: OrganizationService,
    private assetService: AssetService,
  ) {
    this.userName = localStorage.getItem('fullName');
  }

  // ==============================
  // Component Initialization
  // ==============================

  ngOnInit(): void {
    this.loadTree();
    this.loadAssets();
  }

  // ==============================
  // Tree
  // ==============================

  hasChild(_index: number, node: OrganizationNode): boolean {
    return !!node.children && node.children.length > 0;
  }

  loadTree(): void {
    this.orgService.getHierarchy().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },

      error: (error) => {
        console.error('Failed to load organization hierarchy:', error);
      },
    });
  }

  // ==============================
  // Assets
  // ==============================

  loadAssets(): void {
    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.assets = data;
      },

      error: (error) => {
        console.error('Failed to load assets:', error);
      },
    });
  }

  // ==============================
  // Logout
  // ==============================

  onLogout(): void {
    localStorage.clear();
    window.location.reload();
  }
  deleteAsset(id: number) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe(() => {
        this.loadAssets(); // Refresh the table
      });
    }
  }
}
