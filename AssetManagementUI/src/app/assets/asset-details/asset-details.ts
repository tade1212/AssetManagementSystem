import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '../../core/services/asset';

@Component({
  selector: 'app-asset-details',
  standalone: false, // REQUIRED
  templateUrl: './asset-details.html',
  styleUrl: './asset-details.scss',
})
export class AssetDetailsComponent implements OnInit {
  asset: any = null;

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assetService.getAssets().subscribe((assets) => {
        // We find the asset by ID
        this.asset = assets.find((a: any) => a.id === Number(id));

        if (!this.asset) {
          console.error('Asset not found in database!');
          // Don't redirect yet, let's see the error
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
