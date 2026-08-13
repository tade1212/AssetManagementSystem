import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetails } from './asset-details';

describe('AssetDetails', () => {
  let component: AssetDetails;
  let fixture: ComponentFixture<AssetDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
