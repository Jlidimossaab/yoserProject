import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerDescriptionComponent } from './marker-description.component';

describe('MarkerDescriptionComponent', () => {
  let component: MarkerDescriptionComponent;
  let fixture: ComponentFixture<MarkerDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkerDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
