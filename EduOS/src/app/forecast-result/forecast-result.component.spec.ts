import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastResultComponent } from './forecast-result.component';

describe('ForecastResultComponent', () => {
  let component: ForecastResultComponent;
  let fixture: ComponentFixture<ForecastResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForecastResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
