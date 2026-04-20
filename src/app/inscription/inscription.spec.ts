import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inscription } from './inscription';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Inscription', () => {
  let component: Inscription;
  let fixture: ComponentFixture<Inscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscription, FormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Inscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', () => {
    component.motDePasse = 'Password123!';
    component.confirmMotDePasse = 'autrechose';
    component.cgAcceptees = true;
    component.onSubmit();
    expect(component.erreur).toBe('Les mots de passe ne correspondent pas.');
  });

  it('devrait afficher une erreur si les CGU ne sont pas acceptées', () => {
    component.motDePasse = 'Password123!';
    component.confirmMotDePasse = 'Password123!';
    component.cgAcceptees = false;
    component.onSubmit();
    expect(component.erreur).toBe('Veuillez accepter les conditions générales.');
  });

  it('devrait masquer les mots de passe par défaut', () => {
    expect(component.showPassword).toBe(false);
    expect(component.showConfirm).toBe(false);
  });
});
