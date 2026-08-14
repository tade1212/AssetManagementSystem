import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Added ChangeDetectorRef
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '../../core/services/asset';

@Component({
  selector: 'app-asset-details',
  standalone: false,
  templateUrl: './asset-details.html',
  styleUrl: './asset-details.scss',
})
export class AssetDetailsComponent implements OnInit {
  asset: any = null;

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private router: Router,
    private cdr: ChangeDetectorRef, // 2. Inject it here
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.assetService.getAssetById(Number(id)).subscribe({
        next: (data) => {
          this.asset = data;
          console.log('Asset Loaded Successfully:', data);

          // 3. This is the fix: Manually tell Angular to update the screen
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API Error:', err);
          alert('Asset not found.');
          this.router.navigate(['/home']);
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
