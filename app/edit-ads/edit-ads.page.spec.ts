import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditAdsPage } from './edit-ads.page';

describe('EditAdsPage', () => {
  let component: EditAdsPage;
  let fixture: ComponentFixture<EditAdsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
