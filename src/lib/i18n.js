const LANGS = ['es', 'en', 'fr'];
const D = {
  es: {
    brand: 'Marketplace Global', by: 'por Asmyne Group', home: 'Inicio', categories: 'Categorías', search: 'Buscar',
    searchPh: 'Buscar productos, marcas y más…', sell: 'Vender', login: 'Ingresar', signup: 'Crear cuenta', logout: 'Salir',
    dashboard: 'Mi panel', messages: 'Mensajes', admin: 'Administración',
    heroKicker: 'Bienvenido a', heroTitle: 'Marketplace Global', heroText: 'Compra y vende con confianza. Publica tus productos en minutos y llega a clientes en todo el mundo.',
    heroCta: 'Explorar productos', heroSell: 'Empezar a vender',
    featured: 'Destacados', latest: 'Recién publicados', allCats: 'Todas las categorías', seeAll: 'Ver todo',
    results: 'resultados', noResults: 'No encontramos productos con esos filtros.', filters: 'Filtros', category: 'Categoría',
    priceMin: 'Precio mín.', priceMax: 'Precio máx.', condition: 'Estado', any: 'Cualquiera', new: 'Nuevo', used: 'Usado', refurbished: 'Reacondicionado',
    sort: 'Ordenar', sortNew: 'Más recientes', sortPriceAsc: 'Menor precio', sortPriceDesc: 'Mayor precio', apply: 'Aplicar', clear: 'Limpiar',
    prev: 'Anterior', next: 'Siguiente', page: 'Página', of: 'de',
    stock: 'Disponibles', seller: 'Vendedor', memberSince: 'Miembro desde', contactSeller: 'Contactar al vendedor', send: 'Enviar',
    msgPh: 'Hola, ¿sigue disponible?', loginToContact: 'Ingresa para contactar al vendedor.', msgSent: 'Mensaje enviado al vendedor.',
    buyNow: 'Comprar ahora', paySoon: 'Pagos en línea muy pronto (Stripe). Por ahora, coordina con el vendedor.',
    demo: 'DEMO', demoNote: 'Publicación de demostración', email: 'Correo electrónico', password: 'Contraseña', name: 'Nombre',
    accountType: 'Tipo de cuenta', buyer: 'Comprador', sellerRole: 'Vendedor', haveAccount: '¿Ya tienes cuenta?', noAccount: '¿No tienes cuenta?',
    pwHint: 'Mínimo 8 caracteres.', welcome: 'Hola', myListings: 'Mis publicaciones', newListing: 'Nueva publicación', edit: 'Editar', delete: 'Eliminar',
    confirmDelete: '¿Eliminar esta publicación?', title: 'Título', description: 'Descripción', price: 'Precio', currency: 'Moneda', photos: 'Fotos',
    photosHint: 'Hasta 6 fotos JPG, PNG o WebP, máx. 5 MB cada una.', status: 'Estado de publicación', active: 'Activa', paused: 'Pausada',
    pending: 'En revisión', removed: 'Retirada', save: 'Guardar', cancel: 'Cancelar', keepPhotos: 'Fotos actuales (marca para quitar)',
    becomeSeller: 'Activar cuenta de vendedor', becomeSellerText: 'Tu cuenta es de comprador. Actívala como vendedor para publicar.',
    inbox: 'Bandeja', noMessages: 'Aún no tienes mensajes.', from: 'De', to: 'Para', about: 'Sobre', reply: 'Responder',
    users: 'Usuarios', listings: 'Publicaciones', approve: 'Aprobar', remove: 'Retirar', restore: 'Restaurar', ban: 'Suspender', unban: 'Reactivar',
    role: 'Rol', actions: 'Acciones', views: 'Vistas', empty: 'Nada por aquí todavía.', footer: 'Un servicio de Asmyne Group.',
    backToSite: 'Volver a asmynegroup.com', invalidLogin: 'Correo o contraseña incorrectos.', emailTaken: 'Ese correo ya está registrado.',
    invalidInput: 'Revisa los datos del formulario.', tooMany: 'Demasiados intentos. Intenta más tarde.', saved: 'Guardado.', deleted: 'Eliminado.',
    notFound: 'Página no encontrada', notFoundText: 'El producto o la página que buscas no existe.', suspended: 'Tu cuenta está suspendida.',
    errForbiddenT: 'No pudimos procesar tu solicitud', errForbidden: 'Por seguridad bloqueamos este envío. Recarga la página e inténtalo de nuevo.',
    errServerT: 'Algo salió mal', errServer: 'Tuvimos un problema temporal. Intenta de nuevo en unos segundos.',
    errTooLargeT: 'Archivo demasiado grande', errTooLarge: 'Las fotos deben pesar máximo 5 MB cada una.', retry: 'Volver atrás',
    profile: 'Mi perfil', currentPw: 'Contraseña actual', newPw: 'Nueva contraseña (opcional)', wrongPw: 'La contraseña actual no es correcta.',
    deleteUser: 'Eliminar usuario', confirmDeleteUser: '¿Eliminar este usuario y todas sus publicaciones y mensajes?',
    moderationNote: 'Las publicaciones nuevas pueden ser revisadas por el equipo de Asmyne.', stats: 'Resumen', language: 'Idioma',
  },
  en: {
    brand: 'Marketplace Global', by: 'by Asmyne Group', home: 'Home', categories: 'Categories', search: 'Search',
    searchPh: 'Search products, brands and more…', sell: 'Sell', login: 'Sign in', signup: 'Create account', logout: 'Sign out',
    dashboard: 'My dashboard', messages: 'Messages', admin: 'Admin',
    heroKicker: 'Welcome to', heroTitle: 'Marketplace Global', heroText: 'Buy and sell with confidence. List your products in minutes and reach customers worldwide.',
    heroCta: 'Explore products', heroSell: 'Start selling',
    featured: 'Featured', latest: 'Just listed', allCats: 'All categories', seeAll: 'See all',
    results: 'results', noResults: 'No products match those filters.', filters: 'Filters', category: 'Category',
    priceMin: 'Min price', priceMax: 'Max price', condition: 'Condition', any: 'Any', new: 'New', used: 'Used', refurbished: 'Refurbished',
    sort: 'Sort', sortNew: 'Newest', sortPriceAsc: 'Lowest price', sortPriceDesc: 'Highest price', apply: 'Apply', clear: 'Clear',
    prev: 'Previous', next: 'Next', page: 'Page', of: 'of',
    stock: 'Available', seller: 'Seller', memberSince: 'Member since', contactSeller: 'Contact seller', send: 'Send',
    msgPh: 'Hi, is this still available?', loginToContact: 'Sign in to contact the seller.', msgSent: 'Message sent to the seller.',
    buyNow: 'Buy now', paySoon: 'Online payments coming soon (Stripe). For now, arrange with the seller.',
    demo: 'DEMO', demoNote: 'Demo listing', email: 'Email', password: 'Password', name: 'Name',
    accountType: 'Account type', buyer: 'Buyer', sellerRole: 'Seller', haveAccount: 'Already have an account?', noAccount: "Don't have an account?",
    pwHint: 'At least 8 characters.', welcome: 'Hi', myListings: 'My listings', newListing: 'New listing', edit: 'Edit', delete: 'Delete',
    confirmDelete: 'Delete this listing?', title: 'Title', description: 'Description', price: 'Price', currency: 'Currency', photos: 'Photos',
    photosHint: 'Up to 6 JPG, PNG or WebP photos, 5 MB max each.', status: 'Listing status', active: 'Active', paused: 'Paused',
    pending: 'Under review', removed: 'Removed', save: 'Save', cancel: 'Cancel', keepPhotos: 'Current photos (tick to remove)',
    becomeSeller: 'Activate seller account', becomeSellerText: 'Your account is a buyer account. Activate selling to publish.',
    inbox: 'Inbox', noMessages: 'No messages yet.', from: 'From', to: 'To', about: 'About', reply: 'Reply',
    users: 'Users', listings: 'Listings', approve: 'Approve', remove: 'Remove', restore: 'Restore', ban: 'Suspend', unban: 'Reactivate',
    role: 'Role', actions: 'Actions', views: 'Views', empty: 'Nothing here yet.', footer: 'A service by Asmyne Group.',
    backToSite: 'Back to asmynegroup.com', invalidLogin: 'Wrong email or password.', emailTaken: 'That email is already registered.',
    invalidInput: 'Please check the form.', tooMany: 'Too many attempts. Try again later.', saved: 'Saved.', deleted: 'Deleted.',
    notFound: 'Page not found', notFoundText: "The product or page you're looking for doesn't exist.", suspended: 'Your account is suspended.',
    errForbiddenT: "We couldn't process your request", errForbidden: 'For security we blocked this submission. Reload the page and try again.',
    errServerT: 'Something went wrong', errServer: 'We had a temporary problem. Please try again in a few seconds.',
    errTooLargeT: 'File too large', errTooLarge: 'Photos must be 5 MB max each.', retry: 'Go back',
    profile: 'My profile', currentPw: 'Current password', newPw: 'New password (optional)', wrongPw: 'Current password is incorrect.',
    deleteUser: 'Delete user', confirmDeleteUser: 'Delete this user and all their listings and messages?',
    moderationNote: 'New listings may be reviewed by the Asmyne team.', stats: 'Overview', language: 'Language',
  },
  fr: {
    brand: 'Marketplace Global', by: 'par Asmyne Group', home: 'Accueil', categories: 'Catégories', search: 'Rechercher',
    searchPh: 'Rechercher des produits, marques et plus…', sell: 'Vendre', login: 'Connexion', signup: 'Créer un compte', logout: 'Déconnexion',
    dashboard: 'Mon espace', messages: 'Messages', admin: 'Administration',
    heroKicker: 'Bienvenue sur', heroTitle: 'Marketplace Global', heroText: 'Achetez et vendez en toute confiance. Publiez vos produits en quelques minutes et touchez des clients partout dans le monde.',
    heroCta: 'Explorer les produits', heroSell: 'Commencer à vendre',
    featured: 'À la une', latest: 'Nouveautés', allCats: 'Toutes les catégories', seeAll: 'Tout voir',
    results: 'résultats', noResults: 'Aucun produit ne correspond à ces filtres.', filters: 'Filtres', category: 'Catégorie',
    priceMin: 'Prix min.', priceMax: 'Prix max.', condition: 'État', any: 'Tous', new: 'Neuf', used: 'Occasion', refurbished: 'Reconditionné',
    sort: 'Trier', sortNew: 'Plus récents', sortPriceAsc: 'Prix croissant', sortPriceDesc: 'Prix décroissant', apply: 'Appliquer', clear: 'Effacer',
    prev: 'Précédent', next: 'Suivant', page: 'Page', of: 'sur',
    stock: 'Disponibles', seller: 'Vendeur', memberSince: 'Membre depuis', contactSeller: 'Contacter le vendeur', send: 'Envoyer',
    msgPh: 'Bonjour, est-ce toujours disponible ?', loginToContact: 'Connectez-vous pour contacter le vendeur.', msgSent: 'Message envoyé au vendeur.',
    buyNow: 'Acheter', paySoon: 'Paiement en ligne bientôt disponible (Stripe). Pour l’instant, arrangez-vous avec le vendeur.',
    demo: 'DÉMO', demoNote: 'Annonce de démonstration', email: 'E-mail', password: 'Mot de passe', name: 'Nom',
    accountType: 'Type de compte', buyer: 'Acheteur', sellerRole: 'Vendeur', haveAccount: 'Déjà un compte ?', noAccount: 'Pas encore de compte ?',
    pwHint: '8 caractères minimum.', welcome: 'Bonjour', myListings: 'Mes annonces', newListing: 'Nouvelle annonce', edit: 'Modifier', delete: 'Supprimer',
    confirmDelete: 'Supprimer cette annonce ?', title: 'Titre', description: 'Description', price: 'Prix', currency: 'Devise', photos: 'Photos',
    photosHint: 'Jusqu’à 6 photos JPG, PNG ou WebP, 5 Mo max chacune.', status: 'Statut de l’annonce', active: 'Active', paused: 'En pause',
    pending: 'En révision', removed: 'Retirée', save: 'Enregistrer', cancel: 'Annuler', keepPhotos: 'Photos actuelles (cochez pour retirer)',
    becomeSeller: 'Activer le compte vendeur', becomeSellerText: 'Votre compte est acheteur. Activez la vente pour publier.',
    inbox: 'Boîte de réception', noMessages: 'Aucun message pour le moment.', from: 'De', to: 'À', about: 'Concernant', reply: 'Répondre',
    users: 'Utilisateurs', listings: 'Annonces', approve: 'Approuver', remove: 'Retirer', restore: 'Restaurer', ban: 'Suspendre', unban: 'Réactiver',
    role: 'Rôle', actions: 'Actions', views: 'Vues', empty: 'Rien pour le moment.', footer: 'Un service d’Asmyne Group.',
    backToSite: 'Retour à asmynegroup.com', invalidLogin: 'E-mail ou mot de passe incorrect.', emailTaken: 'Cet e-mail est déjà utilisé.',
    invalidInput: 'Vérifiez le formulaire.', tooMany: 'Trop de tentatives. Réessayez plus tard.', saved: 'Enregistré.', deleted: 'Supprimé.',
    notFound: 'Page introuvable', notFoundText: 'Le produit ou la page que vous cherchez n’existe pas.', suspended: 'Votre compte est suspendu.',
    errForbiddenT: 'Impossible de traiter votre demande', errForbidden: 'Par sécurité, cet envoi a été bloqué. Rechargez la page et réessayez.',
    errServerT: 'Une erreur est survenue', errServer: 'Problème temporaire. Réessayez dans quelques secondes.',
    errTooLargeT: 'Fichier trop volumineux', errTooLarge: 'Les photos doivent faire 5 Mo maximum chacune.', retry: 'Retour',
    profile: 'Mon profil', currentPw: 'Mot de passe actuel', newPw: 'Nouveau mot de passe (facultatif)', wrongPw: 'Mot de passe actuel incorrect.',
    deleteUser: 'Supprimer l’utilisateur', confirmDeleteUser: 'Supprimer cet utilisateur ainsi que ses annonces et messages ?',
    moderationNote: 'Les nouvelles annonces peuvent être vérifiées par l’équipe Asmyne.', stats: 'Vue d’ensemble', language: 'Langue',
  },
};

function detect(req) {
  const c = req.cookies && req.cookies.lang;
  if (LANGS.includes(c)) return c;
  const al = String(req.headers['accept-language'] || '').toLowerCase();
  for (const part of al.split(',')) {
    const code = part.trim().slice(0, 2);
    if (LANGS.includes(code)) return code;
  }
  return 'es';
}

function middleware(req, res, next) {
  const lang = detect(req);
  req.lang = lang;
  res.locals.lang = lang;
  res.locals.LANGS = LANGS;
  res.locals.t = (k) => D[lang][k] ?? D.es[k] ?? k;
  next();
}

module.exports = { LANGS, D, middleware };
