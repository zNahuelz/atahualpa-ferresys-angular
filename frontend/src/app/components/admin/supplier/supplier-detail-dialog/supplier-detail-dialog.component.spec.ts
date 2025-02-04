import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDetailDialogComponent } from './supplier-detail-dialog.component';

describe('SupplierDetailDialogComponent', () => {
  let component: SupplierDetailDialogComponent;
  let fixture: ComponentFixture<SupplierDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
