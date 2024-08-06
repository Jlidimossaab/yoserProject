import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderbarVisitorComponent } from './siderbar-visitor.component';

describe('SiderbarVisitorComponent', () => {
  let component: SiderbarVisitorComponent;
  let fixture: ComponentFixture<SiderbarVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiderbarVisitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiderbarVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
