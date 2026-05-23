import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBestResourcesComponent } from './view-best-resources.component';

describe('ViewBestResourcesComponent', () => {
  let component: ViewBestResourcesComponent;
  let fixture: ComponentFixture<ViewBestResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBestResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBestResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
