export const API_CONFIG = {
    baseUrl: 'http://100.30.46.199:7000',
    endpoints: {

        login: '/api/auth/login',
        register: '/api/auth/register',
        registerAbogado: '/api/auth/register/abogado',
        me: '/api/usuarios/me',

        estados: '/api/estados',
        municipios: '/api/municipios',

        consultas: '/api/consultas',
        misConsultas: '/api/consultas/mis-consultas',
        respuestas: '/api/respuestas',

        abogados: '/api/abogados',
        abogadosFiltro: '/api/abogados/filtro',

        bufetes: '/api/bufetes',
        misBufetes: '/api/bufetes/mis-bufetes',
        solicitudesBufete: '/api/solicitudes-bufete',

        chats: '/api/chats',
        mensajes: '/api/chats',

        calificaciones: '/api/calificaciones',
        calificacionesBufete: '/api/calificaciones-bufete',

        reportes: '/api/reportes',
        motivosReporte: '/api/motivos-reporte',
    }
};

