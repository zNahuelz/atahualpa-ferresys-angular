import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellModuleComponent } from './sell-module.component';

describe('SellModuleComponent', () => {
  let component: SellModuleComponent;
  let fixture: ComponentFixture<SellModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
