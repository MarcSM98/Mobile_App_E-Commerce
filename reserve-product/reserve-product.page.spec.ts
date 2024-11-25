import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReserveProductPage } from './reserve-product.page';

describe('ReserveProductPage', () => {
  let component: ReserveProductPage;
  let fixture: ComponentFixture<ReserveProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReserveProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
