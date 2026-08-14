import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '../../core/services/asset';

@Component({
  selector: 'app-asset-details',
  standalone: false, // Required for your AppModule setup
  templateUrl: './asset-details.html',
  styleUrl: './asset-details.scss',
})
export class AssetDetailsComponent implements OnInit {
  // Properties to hold asset data and file upload state
  asset: any = null;
  selectedFile: File | null = null;
  userRole: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private router: Router,
    private cdr: ChangeDetectorRef, // Used to force UI refresh
  ) { this.userRole = localStorage.getItem('role');}

  ngOnInit(): void {
    this.refreshData();
  }

  /**
   * Fetches the asset details from the backend based on the ID in the URL
   */
  refreshData(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      console.log('Fetching details for Asset ID:', id);

      this.assetService.getAssetById(Number(id)).subscribe({
        next: (data) => {
          this.asset = data;
          console.log('Asset Data Received:', data);

          // Force Angular to stop showing the spinner and show the card
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API Error:', err);
          alert('Could not load asset details. Redirecting to home.');
          this.router.navigate(['/home']);
        },
      });
    }
  }

  /**
   * Captures the file when a user selects it from their computer
   */
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('File selected:', this.selectedFile?.name);
    }
  }

  /**
   * Sends the selected file to the .NET API
   */
  uploadDocument(): void {
    if (!this.selectedFile || !this.asset) {
      alert('Please select a file first.');
      return;
    }

    // Define the type of document (e.g., Invoice, Manual, Warranty)
    const docType = 'General Document';

    this.assetService.uploadDocument(this.asset.id, this.selectedFile, docType).subscribe({
      next: (res) => {
        console.log('Upload Success:', res);
        alert('Document uploaded successfully!');

        // Reset the selection and refresh the list to show the new file
        this.selectedFile = null;
        this.refreshData();
      },
      error: (err) => {
        console.error('Upload Failed:', err);
        alert('Upload failed: ' + (err.error || 'Check server connection'));
      },
    });
  }

  /**
   * Navigation back to the main dashboard
   */
  goBack(): void {
    this.router.navigate(['/home']);
  }
  showDocuments: boolean = false; // Hidden by default

  toggleDocuments(): void {
    this.showDocuments = !this.showDocuments;
  }
}
