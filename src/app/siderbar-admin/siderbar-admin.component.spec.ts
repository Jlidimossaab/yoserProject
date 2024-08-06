import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderbarAdminComponent } from './siderbar-admin.component';

describe('SiderbarAdminComponent', () => {
  let component: SiderbarAdminComponent;
  let fixture: ComponentFixture<SiderbarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiderbarAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiderbarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
