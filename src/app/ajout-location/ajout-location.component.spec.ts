import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutLocationComponent } from './ajout-location.component';

describe('AjoutLocationComponent', () => {
  let component: AjoutLocationComponent;
  let fixture: ComponentFixture<AjoutLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
