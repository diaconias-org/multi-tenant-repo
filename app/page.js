// eslint-disable-next-line @next/next/no-img-element
import Link from 'next/link';
import {
  Church, Users, Baby, BookOpen, Music2,
  CalendarDays, Clock, MapPin,
  Heart, ChevronRight, Coins,
  HandHeart, Mic2,
} from 'lucide-react';

function InstagramIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill={color} stroke="none" />
    </svg>
  );
}
import styles from './home.module.css';
import SobreSection from '@/components/site/SobreSection';
import MemoriasSection from '@/components/site/MemoriasSection';

export const metadata = {
  title: 'Diaconia Territorial São Raimundo Nonato — Curralinhos, PI',
  description:
    'A Diaconia Territorial São Raimundo Nonato serve as comunidades católicas de Curralinhos e região, promovendo a fé, a solidariedade e o serviço ao próximo. Arquidiocese de Teresina | Forania Rural I.',
};

const PASTORAIS = [
  {
    icon: 'church',
    nome: 'Liturgia & Eucaristia',
    desc: 'Celebrações dominicais, festejos nas comunidades rurais e animação litúrgica de todo o território.',
  },
  {
    icon: 'book',
    nome: 'Pastoral da Catequese',
    desc: 'Formação na fé para crianças, jovens e adultos que desejam se aprofundar no caminho cristão.',
  },
  {
    icon: 'users',
    nome: 'Pastoral da Juventude',
    desc: 'Espaço de encontro, missão e protagonismo para os jovens das comunidades de Curralinhos.',
  },
  {
    icon: 'baby',
    nome: 'Pastoral do Batismo',
    desc: 'Acolhida e preparação de famílias para o sacramento do Batismo, a porta da vida cristã.',
  },
  {
    icon: 'coins',
    nome: 'Pastoral do Dízimo',
    desc: 'Formação e conscientização sobre o dízimo em suas 4 dimensões: religiosa, missionária, eclesial e caritativa.',
  },
  {
    icon: 'music',
    nome: 'Coroinhas & Ministérios',
    desc: 'Formação de acólitos, leitores e demais ministérios que animam a liturgia nas comunidades.',
  },
];

const EQUIPE = [
  { nome: 'Padre Rafael', cargo: 'Pároco', inicial: 'R' },
  { nome: 'Diácono Gilberto Penha', cargo: 'Diácono Permanente', inicial: 'G' },
  { nome: 'Diácono Dione Moreira', cargo: 'Diácono Permanente', inicial: 'D' },
];

const MISSAS = [
  { dia: 'Domingos', hora: '17h00', local: 'Igreja Matriz — Curralinhos' },
  { dia: 'Festejos', hora: 'Varia por comunidade', local: 'Comunidades rurais do território' },
];

const ICON_MAP = {
  church: <Church size={28} strokeWidth={1.5} />,
  book: <BookOpen size={28} strokeWidth={1.5} />,
  users: <Users size={28} strokeWidth={1.5} />,
  baby: <Baby size={28} strokeWidth={1.5} />,
  coins: <Coins size={28} strokeWidth={1.5} />,
  music: <Music2 size={28} strokeWidth={1.5} />,
};

export default function HomePage() {
  return (
    <div className={styles.page}>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>
            <img src="/logo-diaconia.png" alt="Logo Diaconia" className={styles.navLogo} />
            <div>
              <span className={styles.navEyebrow}>Diaconia Territorial</span>
              <span className={styles.navName}>São Raimundo Nonato</span>
            </div>
          </div>
          <div className={styles.navLinks}>
            <a href="#pastorais" className={styles.navLink}>Pastorais</a>
            <a href="#agenda" className={styles.navLink}>Agenda</a>
            <a href="#equipe" className={styles.navLink}>Equipe</a>
            <a href="#midias" className={styles.navLink}>Mídias</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.heroEyebrow}>
              <MapPin size={12} /> Curralinhos — PI &nbsp;·&nbsp; Arquidiocese de Teresina
            </span>
            <h1 className={styles.heroTitle}>
              Servindo com fé,<br />
              <em>construindo comunidade</em>
            </h1>
            <p className={styles.heroDesc}>
              A Diaconia Territorial São Raimundo Nonato reúne as comunidades
              católicas de Curralinhos e região em torno da fé, da solidariedade
              e do serviço ao próximo.
            </p>
            <div className={styles.heroBtns}>
              <a
                href="https://www.instagram.com/diaconiasaoraimundononato/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                <InstagramIcon size={18} /> Siga no Instagram
              </a>
              <a
                href="https://www.youtube.com/@diaconiadesaoraimundononato"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                <YoutubeIcon size={18} /> Canal no YouTube
              </a>
            </div>
          </div>
          <div className={styles.heroLogo}>
            <div className={styles.logoGlow} />
            <img src="/logo-diaconia.png" alt="Brasão da Diaconia" className={styles.logoImg} />
          </div>
        </div>
        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      {/* AGENDA */}
      <section className={styles.agenda} id="agenda">
        <div className={styles.sectionInner}>
          <div className={styles.agendaGrid}>
            <div className={styles.agendaText}>
              <span className={styles.sectionEyebrow}>Vida Litúrgica</span>
              <h2 className={styles.sectionTitle}>Horários de Missas</h2>
              <p className={styles.sectionDesc}>
                Venha celebrar conosco. As missas são abertas a todos e ocorrem
                na Igreja Matriz e nas comunidades rurais do território.
              </p>
            </div>
            <div className={styles.agendaCards}>
              {MISSAS.map((m) => (
                <div key={m.dia} className={styles.agendaCard}>
                  <div className={styles.agendaCardIcon}>
                    <CalendarDays size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <strong className={styles.agendaCardDia}>{m.dia}</strong>
                    <span className={styles.agendaCardHora}>
                      <Clock size={13} /> {m.hora}
                    </span>
                    <span className={styles.agendaCardLocal}>
                      <MapPin size={13} /> {m.local}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PASTORAIS */}
      <section className={styles.pilares} id="pastorais">
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Nossa atuação</span>
          <h2 className={styles.sectionTitle}>Pastorais & Ministérios</h2>
          <p className={styles.sectionDesc}>
            O território diocesano é animado por diversas pastorais que cuidam da
            formação, da liturgia e do serviço às comunidades.
          </p>
          <div className={styles.pilaresGrid}>
            {PASTORAIS.map((p) => (
              <div key={p.nome} className={styles.pilarCard}>
                <div className={styles.pilarIcon}>{ICON_MAP[p.icon]}</div>
                <h3 className={styles.pilarTitulo}>{p.nome}</h3>
                <p className={styles.pilarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIZIMO CTA */}
      <section className={styles.dizimoCta} id="dizimo">
        <div className={styles.dizimoInner}>
          <div className={styles.dizimoText}>
            <span className={styles.dizimoEyebrow}>Participe</span>
            <h2 className={styles.dizimoTitle}>Devolva seu dízimo</h2>
            <p className={styles.dizimoDesc}>
              O dízimo sustenta as missões, ajuda famílias e anima as comunidades.
              Ele tem 4 dimensões: <strong>religiosa, missionária, eclesial e caritativa</strong>.
              Contribua via Pix e registre seu comprovante.
            </p>
            <Link href="/comprovante" className={styles.dizimoBtnLink}>
              <Coins size={18} /> Fazer minha contribuição <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.dizimoCard}>
            <div className={styles.dizimoCardInner}>
              <span className={styles.dizimoCardIcon}>
                <HandHeart size={44} strokeWidth={1.2} color="rgba(255,255,255,0.9)" />
              </span>
              <p className={styles.dizimoCardText}>
                &ldquo;Trazei todos os dízimos à casa do tesouro, e haja mantimento na minha casa.&rdquo;
              </p>
              <span className={styles.dizimoCardRef}>Malaquias 3:10</span>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section className={styles.equipe} id="equipe">
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Quem nos guia</span>
          <h2 className={styles.sectionTitle}>Equipe Pastoral</h2>
          <p className={styles.sectionDesc}>
            Conheça os pastores e diáconos que animam e celebram junto às comunidades
            de todo o território de São Raimundo Nonato.
          </p>
          <div className={styles.equipeGrid}>
            {EQUIPE.map((e) => (
              <div key={e.nome} className={styles.equipeCard}>
                <div className={styles.equipeAvatar}>{e.inicial}</div>
                <strong className={styles.equipeNome}>{e.nome}</strong>
                <span className={styles.equipeCargo}>
                  <Mic2 size={13} /> {e.cargo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCALIZACAO */}
      <section className={styles.localizacao} id="localizacao">
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Onde estamos</span>
          <h2 className={styles.sectionTitle}>Nossa Localização</h2>
          <p className={styles.sectionDesc}>
            A Diaconia Territorial São Raimundo Nonato está sediada no município de Curralinhos, Piauí,
            atendendo às diversas comunidades urbanas e rurais da região.
          </p>
          <div className={styles.mapCard}>
            <iframe
              src="https://maps.google.com/maps?q=Curralinhos,+Piau%C3%AD,+Brasil&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Curralinhos, PI"
            ></iframe>
          </div>
        </div>
      </section>

      {/* SOBRE A DIACONIA */}
      <SobreSection />

      {/* MEMORIAS */}
      <MemoriasSection />

      {/* MIDIAS */}
      <section className={styles.midias} id="midias">
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Acompanhe</span>
          <h2 className={styles.sectionTitle}>Esteja sempre conectado</h2>
          <p className={styles.sectionDesc}>
            Acompanhe as missas ao vivo, os festejos, as ações pastorais e as
            novidades da Diaconia nas nossas redes.
          </p>
          <div className={styles.midiasGrid}>
            <a
              href="https://www.instagram.com/diaconiasaoraimundononato/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.midiaCard}
            >
              <div className={styles.midiaCardIcon} style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                <InstagramIcon size={32} color="#fff" />
              </div>
              <div className={styles.midiaCardBody}>
                <strong className={styles.midiaCardTitulo}>Instagram</strong>
                <p className={styles.midiaCardDesc}>@diaconiasaoraimundononato</p>
              </div>
              <span className={styles.midiaCardArrow}><ChevronRight size={18} /></span>
            </a>
            <a
              href="https://www.youtube.com/@diaconiadesaoraimundononato"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.midiaCard}
            >
              <div className={styles.midiaCardIcon} style={{ background: '#ff0000' }}>
                <YoutubeIcon size={32} color="#fff" />
              </div>
              <div className={styles.midiaCardBody}>
                <strong className={styles.midiaCardTitulo}>YouTube</strong>
                <p className={styles.midiaCardDesc}>@diaconiadesaoraimundononato</p>
              </div>
              <span className={styles.midiaCardArrow}><ChevronRight size={18} /></span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <img src="/logo-diaconia.png" alt="Logo Diaconia" className={styles.footerLogo} />
        <p className={styles.footerName}>Diaconia Territorial São Raimundo Nonato</p>
        <p className={styles.footerSub}>Curralinhos — PI &nbsp;·&nbsp; Arquidiocese de Teresina | Forania Rural I</p>
        <div className={styles.footerLinks}>
          <a href="https://www.instagram.com/diaconiasaoraimundononato/" target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={14} /> Instagram
          </a>
          <a href="https://www.youtube.com/@diaconiadesaoraimundononato" target="_blank" rel="noopener noreferrer">
            <YoutubeIcon size={14} /> YouTube
          </a>
          <Link href="/comprovante">Devolução do Dízimo</Link>
          <Link href="/admin">Área Admin</Link>
        </div>
        <p className={styles.footerCopy}>
          <Heart size={12} fill="currentColor" style={{ color: 'var(--bordo)', opacity: 0.6 }} />
          {' '}&copy; {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}

