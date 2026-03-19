const db = require('../config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    console.log('--- Starting Seeding Process ---');

    // 1. Seed User (Admin)
    console.log('Seeding: users...');
    await db.execute('DELETE FROM users');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );

    // 2. Seed About
    console.log('Seeding: about...');
    await db.execute('DELETE FROM about');
    const aboutData = {
      name: 'Kadmiel Portfolio',
      title: 'Full Stack Developer',
      bio: 'I am a passionate developer with experience in Node.js, Express, and MySQL.',
      email: 'contact@example.com',
      phone: '+33 6 00 00 00 00',
      location: 'Paris, France',
      nationality: 'béninoise',
      interests: JSON.stringify(['Voyages', 'Photographie', 'Jeux Vidéo', 'Cinéma']),
      social_links: JSON.stringify({
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      })
    };
    await db.execute(
      'INSERT INTO about (name, title, bio, email, phone, location, nationality, interests, social_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [aboutData.name, aboutData.title, aboutData.bio, aboutData.email, aboutData.phone, aboutData.location, aboutData.nationality, aboutData.interests, aboutData.social_links]
    );

    // 3. Seed Skills
    console.log('Seeding: skills...');
    await db.execute('DELETE FROM skills');
    const skills = [
      ['Frontend', 'Interfaces modernes, réactives et accessibles.', JSON.stringify(['Angular', 'React', 'TypeScript', 'HTML/CSS']), 'fas fa-bolt'],
      ['Backend', 'APIs robustes et architectures scalables.', JSON.stringify(['Node.js', 'Laravel', 'PHP', 'Express']), 'fas fa-wrench'],
      ['Bases de données', 'Gestion et optimisation de bases relationnelles & NoSQL.', JSON.stringify(['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle']), 'fas fa-database'],
      ['DevOps', 'Déploiement continu et orchestration de conteneurs.', JSON.stringify(['Docker', 'Kubernetes', 'CI/CD']), 'fas fa-whale'],
      ['Sécurité', 'Protection des apps et APIs selon les meilleures pratiques.', JSON.stringify(['JWT', 'OAuth', 'Cybersécurité']), 'fas fa-lock'],
      ['Mobile', 'Applications mobiles cross-platform performantes.', JSON.stringify(['Flutter', 'React Native', 'iOS/Android']), 'fas fa-mobile-alt'],
      ['UI/UX Design', 'Designs modernes et intuitifs centrés utilisateur.', JSON.stringify(['Figma', 'Adobe XD']), 'fas fa-palette'],
      ['Gestion de projets', 'Organisation Agile/Scrum pour livraisons efficaces.', JSON.stringify(['JIRA', 'Trello', 'Notion', 'Scrum']), 'fas fa-tasks'],
      ['Analytics', 'Suivi et optimisation des performances applicatives.', JSON.stringify(['Google Analytics', 'Hotjar', 'Mixpanel']), 'fas fa-chart-line']
    ];
    for (const skill of skills) {
      await db.execute(
        'INSERT INTO skills (title, description, technologies, icon) VALUES (?, ?, ?, ?)',
        skill
      );
    }

    // 4. Seed Projects
    console.log('Seeding: projects...');
    await db.execute('DELETE FROM projects');
    const projects = [
      [
        'E-commerce API',
        'A full-featured e-commerce backend with auth and payments.',
        'https://images.unsplash.com/photo-1557821552-17105176677c',
        'https://github.com/example/ecommerce',
        'https://ecommerce-demo.com',
        JSON.stringify(['Node.js', 'Express', 'MySQL'])
      ],
      [
        'Portfolio Website',
        'Personal portfolio for showcasing projects and skills.',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
        'https://github.com/example/portfolio',
        'https://myportfolio.com',
        JSON.stringify(['React', 'Tailwind CSS'])
      ]
    ];
    for (const project of projects) {
      await db.execute(
        'INSERT INTO projects (title, description, image, github_url, demo_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
        project
      );
    }

    // 5. Seed Experiences
    console.log('Seeding: experiences...');
    await db.execute('DELETE FROM experiences');
    const experiences = [
      [
        'Développeur Web Full-Stack — SNO',
        'Épicerie Solidaire Étudiante du Mans',
        'Le Mans, France',
        '2025-10-01',
        '2026-04-30',
        JSON.stringify([
          'Développement de l\'application web Full-Stack (episoletudiantedumans.fr / app.episoletudiantedumans.fr)',
          'Participation à la gestion des services logiciels',
          'Accompagnement des utilisateurs aux usages du numérique',
          'Contribution à la présence en ligne de l\'organisation'
        ]),
        0
      ],
      [
        'Développeur Web & Mobile Full-Stack',
        'EDS Télécom & Consulting',
        'Cotonou, Bénin',
        '2024-02-01',
        '2025-02-28',
        JSON.stringify([
          'Développement d\'applications web et mobile Full-Stack',
          'Maintenance et évolution d\'applications existantes'
        ]),
        0
      ],
      [
        'Stagiaire — Développeur Web & Mobile',
        'COSIT Bénin',
        'Cotonou, Bénin',
        '2022-08-01',
        '2023-06-30',
        JSON.stringify([
          'Développement de l\'application MyMonto pour garagistes',
          'Développement et maintenance d\'applications web et mobile Full-Stack',
          'Initiation au monde professionnel et aux méthodes Agile'
        ]),
        0
      ]
    ];
    for (const exp of experiences) {
      await db.execute(
        'INSERT INTO experiences (title, company, location, start_date, end_date, description, current) VALUES (?, ?, ?, ?, ?, ?, ?)',
        exp
      );
    }

    // 6. Seed Testimonials
    console.log('Seeding: testimonials...');
    await db.execute('DELETE FROM testimonials');
    const testimonials = [
      ['John Doe', 'CEO', 'Global Tech', 'Amazing work! Very professional and efficient.', null, 'published'],
      ['Jane Smith', 'Product Manager', 'Innovate', 'Highly recommended for any full stack project.', null, 'published']
    ];
    for (const test of testimonials) {
      await db.execute(
        'INSERT INTO testimonials (name, role, company, content, photo, status) VALUES (?, ?, ?, ?, ?, ?)',
        test
      );
    }

    // 7. Seed Blog Posts
    console.log('Seeding: blog_posts...');
    await db.execute('DELETE FROM blog_posts');
    const posts = [
      [
        'Getting Started with Node.js',
        'getting-started-node-js',
        'Node.js is a powerful runtime for building scalable network applications...',
        6,
        null,
        JSON.stringify(['Node.js', 'JavaScript']),
        'published'
      ],
      [
        'Mastering Express.js',
        'mastering-express-js',
        'Express.js is the most popular web framework for Node.js...',
        7,
        null,
        JSON.stringify(['Express', 'Backend']),
        'published'
      ]
    ];
    for (const post of posts) {
      await db.execute(
        'INSERT INTO blog_posts (title, slug, content, read_minutes, image, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        post
      );
    }

    // 8. Seed Settings
    console.log('Seeding: settings...');
    await db.execute('DELETE FROM settings');
    const settings = [
      ['site_name', 'Kadmiel Portfolio'],
      ['theme', 'dark'],
      ['allow_messages', 'true']
    ];
    for (const set of settings) {
      await db.execute(
        'INSERT INTO settings (setting_key, value) VALUES (?, ?)',
        set
      );
    }

    // 9. Seed Hero
    console.log('Seeding: hero...');
    await db.execute('DELETE FROM hero');
    await db.execute(
      'INSERT INTO hero (greeting, name, role, description, cv, projects_count, experience_years, passion_icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        '👋 SALUT, JE SUIS',
        'KADMIEL',
        'DÉVELOPPEUR FULL STACK',
        'Passionné par la création d\'applications web & mobiles modernes alliant performance, sécurité et expérience utilisateur.',
        'mon-cv.pdf',
        '5+',
        '3',
        '∞'
      ]
    );

    // 10. Seed Messages
    console.log('Seeding: messages...');
    await db.execute('DELETE FROM messages');
    const messages = [
      ['Alice Smith', 'alice@example.com', 'Project Inquiry', 'Hi, I would like to discuss a potential project with you.', 'unread'],
      ['Bob Johnson', 'bob@example.com', 'Job Opportunity', 'We are looking for a full stack developer for our team.', 'read'],
      ['Charlie Brown', 'charlie@example.com', 'Hello', 'Just wanted to say hi and great portfolio!', 'archived']
    ];
    for (const msg of messages) {
      await db.execute(
        'INSERT INTO messages (name, email, subject, content, status) VALUES (?, ?, ?, ?, ?)',
        msg
      );
    }

    // 11. Seed Analytics
    console.log('Seeding: analytics...');
    await db.execute('DELETE FROM analytics');
    const analytics = [
      ['home', 'direct', 'France', 'Desktop'],
      ['projects', 'google', 'USA', 'Mobile'],
      ['blog', 'twitter', 'Canada', 'Tablet'],
      ['about', 'linkedin', 'Germany', 'Desktop'],
      ['home', 'direct', 'UK', 'Mobile']
    ];
    for (const data of analytics) {
      await db.execute(
        'INSERT INTO analytics (page, source, country, device) VALUES (?, ?, ?, ?)',
        data
      );
    }

    console.log('Seeding: technical_levels...');
    await db.execute('DELETE FROM technical_levels');
    const technicalLevels = [
      ['hard', 'Angular / React', null, 85, 'fas fa-bolt', 1],
      ['hard', 'Node.js / Express', null, 82, 'fas fa-bolt', 2],
      ['hard', 'Laravel / PHP', null, 78, 'fas fa-bolt', 3],
      ['hard', 'MySQL / PostgreSQL', null, 82, 'fas fa-bolt', 4],
      ['hard', 'Docker / DevOps', null, 70, 'fas fa-bolt', 5],
      ['hard', 'Sécurité / JWT / OAuth', null, 75, 'fas fa-bolt', 6],
      ['hard', 'UI/UX — Figma', null, 72, 'fas fa-bolt', 7],
      ['soft', 'Autonomie & Proactivité', 'Capable de gérer un projet de A à Z, de la conception au déploiement.', null, 'fas fa-bullseye', 1],
      ['soft', 'Esprit d’équipe', 'Collaboration efficace en mode Agile/Scrum, communication claire.', null, 'fas fa-users', 2],
      ['soft', 'Curiosité technique', 'Veille technologique constante, toujours en train d’apprendre.', null, 'fas fa-search', 3],
      ['soft', 'Créativité & Innovation', 'Apporter des idées nouvelles et des solutions originales aux problèmes.', null, 'fas fa-lightbulb', 4],
      ['soft', 'Gestion du temps', 'Respect des délais, priorisation des tâches sous pression.', null, 'fas fa-clock', 5]
    ];
    for (const row of technicalLevels) {
      await db.execute(
        'INSERT INTO technical_levels (type, title, description, percent, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        row
      );
    }

    console.log('Seeding: availability...');
    await db.execute('DELETE FROM availability');
    await db.execute(
      'INSERT INTO availability (badge_text, headline, description, tags, primary_cta_text, primary_cta_type, secondary_cta_text, secondary_cta_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'Disponible dès maintenant',
        'Je recherche une alternance ou un stage en développement Full Stack',
        'Développeur passionné avec 3 ans d’expérience, je suis à la recherche d’une opportunité pour continuer à évoluer dans un environnement stimulant, apporter mes compétences et apprendre de projets concrets.',
        JSON.stringify([
          { icon: 'fas fa-map-marker-alt', text: 'Le Mans ou remote' },
          { icon: 'fas fa-code', text: 'Web & Mobile Full Stack' },
          { icon: 'fas fa-bolt', text: 'Disponible rapidement' },
          { icon: 'fas fa-medal', text: 'Motivé & sérieux' },
          { icon: 'fas fa-briefcase', text: 'Alternance / Stage / CDI' }
        ]),
        'Me contacter',
        'contact',
        'Voir mon CV',
        'mon-cv.pdf'
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
