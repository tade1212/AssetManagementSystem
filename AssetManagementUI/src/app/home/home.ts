import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { OrganizationService } from '../core/services/organization';

interface FoodNode {
  id: number;
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  userName: string | null = '';

  // Tree Control Logic
  treeControl = new NestedTreeControl<any>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  constructor(private orgService: OrganizationService) {
    this.userName = localStorage.getItem('fullName');
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.loadTree();
  }

  loadTree() {
    this.orgService.getHierarchy().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  onLogout() {
    localStorage.clear();
    window.location.reload(); // Simple way to go back to login
  }
}
