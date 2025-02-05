import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUnitTypeComponent } from './new-unit-type.component';

describe('NewUnitTypeComponent', () => {
  let component: NewUnitTypeComponent;
  let fixture: ComponentFixture<NewUnitTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUnitTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUnitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
