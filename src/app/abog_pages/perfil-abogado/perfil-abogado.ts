import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AbogadoService } from '../../services/abogado.service';
import { RespuestaConsultaService } from '../../services/respuesta-consulta.service';
import { AuthState } from '../../state/auth.state';
import { AbogadoState } from '../../state/abogado.state';
import { Abogado } from '../../models';

@Component({
  selector: 'app-perfil-abogado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-abogado.html',
  styleUrls: ['./perfil-abogado.css']
})
export class PerfilAbogado implements OnInit, OnDestroy {
  abogado: Abogado | null = null;
  isLoading: boolean = true;
  errorMensaje: string | null = null;

  nombreAbogado: string = '';
  especializacionAbogado: string = '';
  descripcionAbogado: string = '';
  totalRespuestas: number = 0;

  private subscriptions = new Subscription();
  private abogadoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private abogadoService: AbogadoService,
    private respuestaService: RespuestaConsultaService,
    private authState: AuthState,
    private abogadoState: AbogadoState
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.abogadoId = id;
      } else {
        this.abogadoId = this.authState.currentUser?.idUsuario || '';
      }

      if (this.abogadoId) {
        this.cargarPerfil();
      } else {
        this.errorMensaje = 'No se pudo identificar el abogado.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarPerfil(): void {
    this.isLoading = true;
    this.errorMensaje = null;

    const abogadoSub = this.abogadoService.getById(this.abogadoId).subscribe({
      next: (abogado) => {
        this.abogado = abogado;
        this.abogadoState.setAbogadoActual(abogado);

        this.nombreAbogado = abogado.usuario?.nombre || 'Abogado';
        this.descripcionAbogado = abogado.biografia || 'Sin descripción disponible.';

        if (abogado.especialidades && abogado.especialidades.length > 0) {
          this.especializacionAbogado = abogado.especialidades.map(e => e.nombreMateria).join(', ');
        } else {
          this.especializacionAbogado = 'No especificado';
        }

        this.cargarEstadisticas();
      },
      error: (error) => {
        console.error('Error al cargar abogado:', error);
        this.errorMensaje = 'No se pudo cargar el perfil del abogado.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(abogadoSub);
  }

  cargarEstadisticas(): void {
    const respuestasSub = this.respuestaService.getTotalByAbogado(this.abogadoId).subscribe({
      next: (data) => {
        this.totalRespuestas = data.total || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.isLoading = false;
      }
    });

    this.subscriptions.add(respuestasSub);
  }

  volver(): void {
    this.router.navigate(['/abogado/foro']);
  }
}