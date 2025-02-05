import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTypeManagementComponent } from './unit-type-management.component';

describe('UnitTypeManagementComponent', () => {
  let component: UnitTypeManagementComponent;
  let fixture: ComponentFixture<UnitTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitTypeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
