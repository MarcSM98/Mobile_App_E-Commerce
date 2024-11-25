import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageSpecialEventPage } from './manage-special-event.page';

describe('ManageSpecialEventPage', () => {
  let component: ManageSpecialEventPage;
  let fixture: ComponentFixture<ManageSpecialEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSpecialEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageSpecialEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
