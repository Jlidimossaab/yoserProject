import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCircuitTabComponent } from './manage-circuit-tab.component';

describe('ManageCircuitTabComponent', () => {
  let component: ManageCircuitTabComponent;
  let fixture: ComponentFixture<ManageCircuitTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCircuitTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCircuitTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
