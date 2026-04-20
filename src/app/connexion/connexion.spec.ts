import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Connexion } from './connexion';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Connexion', () => {
  let component: Connexion;
  let fixture: ComponentFixture<Connexion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connexion, FormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Connexion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher une erreur si les champs sont vides', () => {
    component.email = '';
    component.motDePasse = '';
    component.onSubmit();
    expect(component.erreur).toBe(true);

  });

  it('devrait masquer le mot de passe par défaut', () => {
    expect(component.showPassword).toBe(false);
  });
});
