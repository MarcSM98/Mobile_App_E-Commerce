import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageReportsPage } from './manage-reports.page';

describe('ManageReportsPage', () => {
  let component: ManageReportsPage;
  let fixture: ComponentFixture<ManageReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
