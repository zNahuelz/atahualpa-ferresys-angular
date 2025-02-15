import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleModuleComponent } from './sale-module.component';

describe('SellModuleComponent', () => {
  let component: SaleModuleComponent;
  let fixture: ComponentFixture<SaleModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
