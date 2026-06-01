const db = require('../config/db');
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────────────
// Real-data seeder for Kadmiel Tognon
// Source : CV (Mai 2026) + repos GitHub publics MielDev + sites client
// ─────────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    console.log('--- Starting Seeding Process ---');

    // 1. Admin user
    console.log('Seeding: users...');
    await db.execute('DELETE FROM users');
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD is required to seed the admin user');
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [adminUsername, hashedPassword]
    );

    // 2. About — données du CV
    console.log('Seeding: about...');
    await db.execute('DELETE FROM about');
    const aboutData = {
      name: 'Kadmiel TOGNON',
      title: 'Développeur Web & Mobile Full Stack',
      bio:
        "Étudiant en Certificat de Spécialisation – Services Numériques aux Organisations (SNO), " +
        "je finalise actuellement ma formation au Campus Saint-Charles Sainte-Croix au Mans. " +
        "Passionné par le développement web et mobile, je souhaite intégrer une formation universitaire " +
        "pour renforcer mes compétences techniques et théoriques. " +
        "Motivé, rigoureux et doté d'un bon esprit d'équipe, je suis déterminé à approfondir mes " +
        "connaissances et à développer des solutions numériques utiles et performantes.",
      email: 'kadmieltognon5@gmail.com',
      phone: '+33 7 58 44 01 42',
      location: '33 Rue des Sables d\'Or, 72100 Le Mans',
      nationality: 'béninoise',
      interests: JSON.stringify(['Roller & patinage', 'Jeux vidéo', 'Veille technologique']),
      social_links: JSON.stringify({
        github: 'https://github.com/MielDev',
        linkedin: 'https://www.linkedin.com/in/kadmiel-tognon-924644152/',
        email: 'mailto:kadmieltognon5@gmail.com'
      }),
    };
    await db.execute(
      'INSERT INTO about (name, title, bio, email, phone, location, nationality, interests, social_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        aboutData.name,
        aboutData.title,
        aboutData.bio,
        aboutData.email,
        aboutData.phone,
        aboutData.location,
        aboutData.nationality,
        aboutData.interests,
        aboutData.social_links,
      ]
    );

    // 3. Skills — compétences du CV
    console.log('Seeding: skills...');
    await db.execute('DELETE FROM skills');
    const skills = [
      [
        'Frontend',
        'Interfaces modernes, réactives et accessibles, avec une attention particulière à l\'expérience utilisateur.',
        JSON.stringify(['Angular', 'TypeScript', 'HTML', 'CSS', 'JavaScript']),
        'fas fa-bolt',
      ],
      [
        'Backend',
        'APIs REST robustes et architectures scalables pour des applications fiables et performantes.',
        JSON.stringify(['Node.js', 'Express', 'PHP', 'Python']),
        'fas fa-server',
      ],
      [
        'Mobile',
        'Applications mobiles cross-platform performantes avec Flutter (Dart).',
        JSON.stringify(['Flutter', 'Dart', 'iOS', 'Android']),
        'fas fa-mobile-alt',
      ],
      [
        'Bases de données',
        'Modélisation, gestion et optimisation de bases relationnelles et NoSQL.',
        JSON.stringify(['MySQL', 'MongoDB', 'SQL']),
        'fas fa-database',
      ],
      [
        'Conception',
        'Rédaction de cahiers des charges et conception fonctionnelle de solutions adaptées au besoin client.',
        JSON.stringify(['Cahier des charges', 'UML', 'Maquettage']),
        'fas fa-pencil-ruler',
      ],
      [
        'Accompagnement utilisateurs',
        'Formation, support et accompagnement des utilisateurs aux usages du numérique.',
        JSON.stringify(['Formation', 'Support', 'Documentation']),
        'fas fa-hands-helping',
      ],
    ];
    for (const skill of skills) {
      await db.execute(
        'INSERT INTO skills (title, description, technologies, icon) VALUES (?, ?, ?, ?)',
        skill
      );
    }

    // 4. Projects — vrais repos GitHub + sites client du CV
    console.log('Seeding: projects...');
    await db.execute('DELETE FROM projects');
    const projects = [
      [
        'Épicerie Solidaire Étudiante du Mans — App',
        "Application web Full-Stack pour la gestion de l'épicerie solidaire étudiante du Mans. Permet aux étudiants bénéficiaires de réserver leurs paniers, à l'équipe de gérer les stocks, les bénévoles et les distributions. Développée pendant mon stage SNO.",
        null,
        'https://github.com/MielDev/RESEAU-SOLIDARITE-FRANCE',
        'https://app.episoletudiantedumans.fr',
        JSON.stringify(['Angular', 'TypeScript', 'Node.js', 'MySQL']),
        'Application Web',
        'live',
        '2026',
      ],
      [
        'Épicerie Solidaire — Site vitrine',
        "Site institutionnel de l'Épicerie Solidaire Étudiante du Mans. Présentation des actions, dépôt de candidature bénéficiaire, contact et soutien.",
        null,
        null,
        'https://www.episoletudiantedumans.fr',
        JSON.stringify(['Angular', 'TypeScript', 'CSS']),
        'Site vitrine',
        'live',
        '2026',
      ],
      [
        'Épicerie Solidaire — API Backend',
        "API REST Node.js / Express dédiée à l'app de l'Épicerie Solidaire. Auth JWT, gestion stock, bénévoles, distributions et statistiques admin.",
        null,
        'https://github.com/MielDev/ES_Backend',
        null,
        JSON.stringify(['Node.js', 'Express', 'MySQL', 'JWT']),
        'API REST',
        'live',
        '2026',
      ],
      [
        'Sion Radio TV',
        "Site média réalisé chez EDS Télécom & Consulting : présentation de la radio/TV, programmes, articles, écoute en ligne.",
        null,
        null,
        'https://www.sionradiotv.com',
        JSON.stringify(['PHP', 'MySQL', 'JavaScript', 'HTML/CSS']),
        'Site média',
        'live',
        '2024',
      ],
      [
        'Cloud Expert Remote',
        "Site vitrine pour un prestataire de services cloud / accompagnement à distance. Réalisé en HTML/CSS/JS pur, mise en avant des offres et formulaire de contact.",
        null,
        'https://github.com/MielDev/cloud-expert-remote',
        null,
        JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        'Site vitrine',
        'live',
        '2026',
      ],
      [
        'Rencontre Magique — Front',
        "Front-end d'une plateforme de rencontre événementielle. Interface moderne, animations soignées, formulaires d'inscription.",
        null,
        'https://github.com/MielDev/rencontre-magique-front',
        null,
        JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        'Application Web',
        'live',
        '2026',
      ],
      [
        'Portfolio personnel (v1)',
        "Première version de mon portfolio personnel, déployée sur Vercel. Vitrine de mes compétences et projets de l'époque.",
        null,
        'https://github.com/MielDev/Kadmiel',
        'https://kadmiel.vercel.app',
        JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        'Portfolio',
        'archive',
        '2025',
      ],
      [
        'Send-Mail',
        "Petite utilitaire web pour envoyer des emails de notification depuis un formulaire de contact. Stack légère HTML/CSS/JS + backend SMTP.",
        null,
        'https://github.com/MielDev/send-mail',
        null,
        JSON.stringify(['HTML', 'JavaScript', 'SMTP']),
        'Outil',
        'live',
        '2026',
      ],
    ];
    for (const project of projects) {
      await db.execute(
        'INSERT INTO projects (title, description, image, github_url, demo_url, tags, cat, status, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        project
      );
    }

    // 5. Experiences — directement du CV
    console.log('Seeding: experiences...');
    await db.execute('DELETE FROM experiences');
    const experiences = [
      [
        'Stagiaire — Développeur Full-Stack',
        'Épicerie Solidaire Étudiante du Mans',
        'Le Mans, France',
        '2025-11-10',
        '2026-04-10',
        JSON.stringify([
          "Développement d'une application web Full-Stack (episoletudiantedumans.fr & app.episoletudiantedumans.fr)",
          "Participation à la gestion des services logiciels",
          "Accompagnement des utilisateurs aux usages du numérique",
        ]),
        0,
        'stage',
        'fa-solid fa-clipboard-list',
        '#FBBF24',
        null,
      ],
      [
        'Développeur Web & Mobile Full-Stack',
        'EDS Télécom & Consulting',
        'Cotonou, Bénin',
        '2024-02-01',
        '2025-02-28',
        JSON.stringify([
          "Développement d'applications web et mobile Full-Stack",
          "Création du site Sion Radio TV (https://www.sionradiotv.com)",
          "Maintenance d'applications web et mobile",
          "Montage de dossiers d'avis d'appel d'offres",
        ]),
        0,
        'work',
        'fa-solid fa-briefcase',
        '#FF3B3B',
        null,
      ],
      [
        'Stagiaire — Développeur Web & Mobile',
        'COSIT Bénin',
        'Cotonou, Bénin',
        '2022-08-01',
        '2023-06-30',
        JSON.stringify([
          "Développement d'applications web et mobile Full-Stack",
          "Maintenance d'applications existantes",
          "Première immersion en environnement professionnel et méthodes Agile",
        ]),
        0,
        'stage',
        'fa-solid fa-clipboard-list',
        '#FBBF24',
        null,
      ],
      [
        'Certificat de spécialisation — Services numériques aux organisations',
        'Campus Saint-Charles Sainte-Croix',
        'Le Mans, France',
        '2025-09-01',
        '2026-06-30',
        JSON.stringify([
          "Formation Services numériques aux organisations",
          "Conception, développement et accompagnement de solutions numériques en entreprise",
        ]),
        1,
        'edu',
        'fa-solid fa-graduation-cap',
        '#7C3AED',
        '/dossier-numerique-cs-sno',
      ],
      [
        'Licence professionnelle — Systèmes Informatiques & Logiciels',
        'École Supérieure Le Faucon',
        'Cotonou, Bénin',
        '2022-09-01',
        '2023-06-30',
        JSON.stringify([
          "Formation orientée systèmes d'information, programmation et bases de données",
        ]),
        0,
        'edu',
        'fa-solid fa-graduation-cap',
        '#7C3AED',
        null,
      ],
      [
        'Baccalauréat scientifique',
        'Complexe Scolaire La Jeunesse Ambition',
        'Bénin',
        '2019-09-01',
        '2020-07-31',
        JSON.stringify(['Série scientifique']),
        0,
        'edu',
        'fa-solid fa-graduation-cap',
        '#7C3AED',
        null,
      ],
    ];
    for (const exp of experiences) {
      await db.execute(
        'INSERT INTO experiences (title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        exp
      );
    }

    // 6. Testimonials (placeholders à valider/supprimer)
    console.log('Seeding: testimonials...');
    await db.execute('DELETE FROM testimonials');
    // On laisse vide volontairement — les vrais témoignages doivent venir de
    // collaborateurs/anciens managers via le système de token testimonial.

    // 7. Blog posts (placeholders)
    console.log('Seeding: blog_posts...');
    await db.execute('DELETE FROM blog_posts');
    // Vide volontairement : le blog sera rempli depuis l'admin avec de vrais articles.

    // 8. Settings — branding Kadmiel
    console.log('Seeding: settings...');
    await db.execute('DELETE FROM settings');
    const settings = [
      ['branding', JSON.stringify({
        logoType: 'text',
        logoText: 'KT.',
        logoSub: 'PORTFOLIO v2.2',
        logoImage: null,
        favicon: null,
        siteIcon: null,
        fullName: 'Kadmiel TOGNON',
        footerRights: 'Tous droits réservés.',
        location: 'Le Mans, France',
      })],
      ['display', JSON.stringify({
        customCursor: true,
        bgGrid: true,
        animations: true,
        floatingCv: true,
      })],
      ['colors', JSON.stringify({
        bg: '#070B14',
        primary: '#FF3B3B',
        secondary: '#7C3AED',
        text: '#FFFFFF',
      })],
      ['typography', JSON.stringify({
        titleFont: 'orbitron',
        bodyFont: 'syne',
      })],
      ['seo', JSON.stringify({
        title: 'Kadmiel TOGNON — Développeur Full Stack Web & Mobile',
        description:
          "Portfolio de Kadmiel Tognon, développeur Full Stack web & mobile basé au Mans. " +
          "Angular, Node.js, Flutter, PHP, MySQL. Disponible pour alternance / stage / CDI.",
        keywords:
          'Kadmiel Tognon, développeur full stack, Angular, Node.js, Flutter, Le Mans, alternance, stage, portfolio',
        ogTitle: 'Kadmiel TOGNON — Développeur Full Stack',
        ogImage: null,
        url: 'https://kadmiel.dev',
      })],
      ['social', JSON.stringify({
        linkedin: 'https://www.linkedin.com/in/kadmiel-tognon-924644152/',
        github: 'https://github.com/MielDev',
        whatsapp: 'https://wa.me/33758440142',
        twitter: '',
        instagram: '',
      })],
      ['allow_messages', 'true'],
    ];
    for (const set of settings) {
      await db.execute(
        'INSERT INTO settings (setting_key, value) VALUES (?, ?)',
        set
      );
    }

    // 9. Hero
    console.log('Seeding: hero...');
    await db.execute('DELETE FROM hero');
    await db.execute(
      'INSERT INTO hero (greeting, name, role, description, cv, projects_count, experience_years, passion_icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'SALUT, JE SUIS',
        'KADMIEL',
        'DÉVELOPPEUR FULL STACK',
        "Étudiant en SNO et développeur Full Stack web & mobile, je crée des applications modernes alliant performance, sécurité et expérience utilisateur. Disponible pour rejoindre une équipe ambitieuse en alternance, stage ou CDI.",
        '/uploads/cv-kadmiel-tognon.pdf',
        '8',
        '3',
        '∞',
      ]
    );

    // 10. Messages (vide volontairement)
    console.log('Seeding: messages...');
    await db.execute('DELETE FROM messages');

    // 11. Analytics (vide — seedé séparément via analyticsSeeder.js si voulu)
    console.log('Seeding: analytics...');
    await db.execute('DELETE FROM analytics');

    // 12. Technical levels — directement du CV
    console.log('Seeding: technical_levels...');
    await db.execute('DELETE FROM technical_levels');
    const technicalLevels = [
      // ─── Hard skills (langages & frameworks listés dans le CV) ───
      ['hard', 'Angular',              null, 85, 'fab fa-angular',       1],
      ['hard', 'Node.js & Express',    null, 82, 'fab fa-node-js',       2],
      ['hard', 'Flutter & Dart',       null, 75, 'fa-solid fa-mobile-screen', 3],
      ['hard', 'PHP',                  null, 78, 'fab fa-php',           4],
      ['hard', 'Python',               null, 70, 'fab fa-python',        5],
      ['hard', 'TypeScript',           null, 82, 'fa-brands fa-js',      6],
      ['hard', 'HTML, CSS, JavaScript', null, 90, 'fab fa-html5',        7],
      ['hard', 'SQL / MySQL',          null, 82, 'fa-solid fa-database', 8],
      ['hard', 'MongoDB',              null, 68, 'fa-solid fa-leaf',     9],
      ['hard', 'Rédaction de cahier des charges', null, 75, 'fa-solid fa-file-pen', 10],

      // ─── Soft skills (CV : Relation client, Gestion des priorités, Organisation & Rigueur, Travail en équipe) ───
      ['soft', 'Relation client', 'Écoute des besoins, reformulation et accompagnement tout au long du projet.', null, 'fa-solid fa-handshake', 1],
      ['soft', 'Gestion des priorités', 'Capacité à prioriser, organiser et tenir les délais sous contrainte.', null, 'fa-solid fa-list-check', 2],
      ['soft', 'Organisation & Rigueur', 'Méthodique, structuré, attentif aux détails et à la qualité du livrable.', null, 'fa-solid fa-bullseye', 3],
      ['soft', 'Travail en équipe', 'Communication fluide, partage des connaissances, esprit collaboratif en mode Agile.', null, 'fa-solid fa-users', 4],
      ['soft', 'Langues', 'Français (langue maternelle), Goun (Bénin), Anglais (lecture technique).', null, 'fa-solid fa-language', 5],
    ];
    for (const row of technicalLevels) {
      await db.execute(
        'INSERT INTO technical_levels (type, title, description, percent, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        row
      );
    }

    // 13. Availability
    console.log('Seeding: availability...');
    await db.execute('DELETE FROM availability');
    await db.execute(
      'INSERT INTO availability (badge_text, headline, description, tags, primary_cta_text, primary_cta_type, secondary_cta_text, secondary_cta_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'Disponible dès maintenant',
        "Je recherche une alternance, un stage ou un poste en développement Full Stack",
        "Étudiant en Certificat de Spécialisation SNO au Mans et développeur Full Stack (3 ans d'expérience cumulée au Bénin et en France), je souhaite rejoindre une équipe motivée pour continuer à monter en compétences sur des projets concrets et impactants.",
        JSON.stringify([
          { icon: 'fas fa-map-marker-alt', text: 'Le Mans ou remote France' },
          { icon: 'fas fa-code',            text: 'Web & Mobile Full Stack' },
          { icon: 'fas fa-bolt',            text: 'Disponible rapidement' },
          { icon: 'fas fa-briefcase',       text: 'Alternance / Stage / CDI' },
          { icon: 'fas fa-graduation-cap',  text: 'Ouvert à une formation universitaire' },
        ]),
        'Me contacter',
        'contact',
        'Voir mon CV',
        '/uploads/cv-kadmiel-tognon.pdf',
      ]
    );

    console.log('--- Seeding Process Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('--- Seeding Error ---');
    console.error(error);
    process.exit(1);
  }
};

seed();
