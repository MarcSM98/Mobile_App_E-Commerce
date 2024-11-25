import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageProductsPage } from './manage-products.page';

describe('ManageProductsPage', () => {
  let component: ManageProductsPage;
  let fixture: ComponentFixture<ManageProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
