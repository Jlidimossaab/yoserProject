import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterLocationComponent } from './consulter-location.component';

describe('ConsulterLocationComponent', () => {
  let component: ConsulterLocationComponent;
  let fixture: ComponentFixture<ConsulterLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsulterLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulterLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
