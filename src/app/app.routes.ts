import { Routes } from '@angular/router';
import { Header} from './header/header'; 

export const routes: Routes = [
  {
    path: '',
    component: Header,
    children: [
      { path: '', redirectTo: '/usuario/comentarios', pathMatch: 'full' },

      {
        path: 'abogado',
        children: [
          { path: 'ayuda', loadComponent: () => import('./abog_pages/ayuda-abog/ayuda-abog').then(m => m.AyudaAbog) },
          { path: 'consultas', loadComponent: () => import('./abog_pages/consul-resp/consul-resp').then(m => m.ConsulResp) },
          { path: 'estadisticas', loadComponent: () => import('./abog_pages/estadistica-abogado/estadistica-abogado').then(m => m.EstadisticaAbogado) },
          { path: 'foro', loadComponent: () => import('./abog_pages/foro/foro').then(m => m.Foro) },
          { path: 'materias', loadComponent: () => import('./abog_pages/materia-cards-abog/materia-cards-abog').then(m => m.MateriaCardsAbog) },
          { path: 'mis-respuestas', loadComponent: () => import('./abog_pages/mis-respuestas/mis-respuestas').then(m => m.MisRespuestas) },
          { path: 'perfil', loadComponent: () => import('./abog_pages/perfil-abogado/perfil-abogado').then(m => m.PerfilAbogado) },
          { path: 'reporte', loadComponent: () => import('./abog_pages/reporte/reporte').then(m => m.Reporte) },
          { path: 'respuesta', loadComponent: () => import('./abog_pages/respuesta/respuesta').then(m => m.Respuesta) },
        ]
      },
      {
        path: 'admin',
        children: [
          { path: 'inactivos', loadComponent: () => import('./admin/inactivos/inactivos').then(m => m.Inactivos) },
          { path: 'reportes', loadComponent: () => import('./admin/reportes/reportes').then(m => m.Reportes) },
        ]
      },
      {
        path: 'login',
        children: [
          { path: '', loadComponent: () => import('./login_pages/login/login').then(m => m.Login) },
          { path: 'registro-abogado', loadComponent: () => import('./login_pages/registro-abo/registro-abo').then(m => m.RegistroAbo) },
          { path: 'registro-usuario', loadComponent: () => import('./login_pages/registro-user/registro-user').then(m => m.RegistroUser) },
          { path: 'seleccion', loadComponent: () => import('./login_pages/selection.html/selection.html').then(m => m.SelectionHtml) },
        ]
      },
      {
        path: 'usuario',
        children: [
          { path: 'comentarios', loadComponent: () => import('./user_pages/comentarios-pregunta/comentarios-pregunta').then(m => m.ComentariosPregunta) },
          { path: 'contactar', loadComponent: () => import('./user_pages/contactar-abogado/contactar-abogado').then(m => m.ContactarAbogado) },
          { path: 'home', loadComponent: () => import('./user_pages/home/home').then(m => m.Home) },
          { path: 'mis-preguntas', loadComponent: () => import('./user_pages/mis-preguntas/mis-preguntas').then(m => m.MisPreguntas) },
          { path: 'faq', loadComponent: () => import('./user_pages/preguntas-frecuentes/preguntas-frecuentes').then(m => m.PreguntasFrecuentes) },
          { path: 'publicar', loadComponent: () => import('./user_pages/publicar-pregunta/publicar-pregunta').then(m => m.PublicarPregunta) },
          { path: 'ayuda', loadComponent: () => import('./user_pages/user-ayuda/user-ayuda').then(m => m.UserAyuda) },
        ]
      }
    ]
  }
];
