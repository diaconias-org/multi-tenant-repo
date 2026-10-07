// eslint-disable-next-line @next/next/no-img-element
import Link from 'next/link';
import {
  Church, Users, Baby, BookOpen, Music2,
  CalendarDays, Clock, MapPin,
  Heart, ChevronRight, Coins,
  HandHeart, Mic2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SobreSection from '@/components/site/SobreSection';
import MemoriasSection from '@/components/site/MemoriasSection';
import { navLinkClass } from '@/components/site/PublicNav';
import { SectionContainer, SectionHeading } from '@/components/site/Section';

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

const INSTAGRAM_URL = 'https://www.instagram.com/diaconiasaoraimundononato/';
const YOUTUBE_URL = 'https://www.youtube.com/@diaconiadesaoraimundononato';

const heroBtnBase =
  'inline-flex items-center gap-2 rounded-full transition-all duration-250 hover:-translate-y-0.5';
const midiaCardClass =
  'flex min-w-0 items-center gap-[18px] rounded-[18px] border-[1.5px] border-border bg-secondary p-[22px] shadow-soft transition-all duration-250 hover:-translate-y-1 hover:border-accent hover:shadow-card';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-secondary">

      {/* NAV */}
      <nav className="sticky top-0 z-[100] border-b border-input bg-white/95 shadow-[0_2px_16px_rgb(80_40_10/0.07)]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-7 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo-diaconia.png" alt="Logo Diaconia" className="size-11 shrink-0 rounded-full border-2 border-input bg-secondary object-cover" />
            <div className="flex flex-col">
              <span className="text-[9.5px] font-bold uppercase leading-tight tracking-[2px] text-primary">Diaconia Territorial</span>
              <span className="text-sm font-bold leading-snug text-foreground">São Raimundo Nonato</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 max-[840px]:hidden">
            <Link href="/noticias" className={navLinkClass}>Notícias</Link>
            <a href="#pastorais" className={navLinkClass}>Pastorais</a>
            <a href="#agenda" className={navLinkClass}>Agenda</a>
            <a href="#equipe" className={navLinkClass}>Equipe</a>
            <a href="#midias" className={navLinkClass}>Mídias</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,var(--primary)_0%,var(--primary-dark)_55%,var(--primary-deep)_100%)] px-7 pb-[130px] pt-20 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,color-mix(in_oklab,var(--accent)_15%,transparent)_0%,transparent_70%)] max-[480px]:px-5 max-[480px]:pb-[120px] max-[480px]:pt-[60px]">
        <div className="relative z-[1] mx-auto flex max-w-[1100px] items-center justify-between gap-12 max-[840px]:flex-col-reverse max-[840px]:gap-8 max-[840px]:text-center">
          <div className="min-w-0 flex-1">
            <span className="mb-[18px] inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3.5 py-[5px] text-[11px] font-bold uppercase tracking-[3px] text-accent-light">
              <MapPin size={12} /> Curralinhos — PI &nbsp;·&nbsp; Arquidiocese de Teresina
            </span>
            <h1 className="mb-[22px] font-heading text-[clamp(36px,5vw,64px)] font-bold leading-[1.15] tracking-[-0.5px] text-white">
              Servindo com fé,<br />
              <em className="italic text-accent-light">construindo comunidade</em>
            </h1>
            <p className="mb-9 max-w-[480px] text-base leading-[1.75] text-white/80 max-[840px]:mx-auto max-[840px]:mb-[30px]">
              A Diaconia Territorial São Raimundo Nonato reúne as comunidades
              católicas de Curralinhos e região em torno da fé, da solidariedade
              e do serviço ao próximo.
            </p>
            <div className="flex flex-wrap gap-3.5 max-[840px]:justify-center">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(heroBtnBase, 'bg-accent px-[30px] py-3.5 text-[14.5px] font-bold text-accent-foreground shadow-[0_4px_18px_color-mix(in_oklab,var(--accent)_40%,transparent)] hover:bg-accent-light hover:shadow-[0_8px_28px_color-mix(in_oklab,var(--accent)_50%,transparent)]')}
              >
                <InstagramIcon size={18} /> Siga no Instagram
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(heroBtnBase, 'border-[1.5px] border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/50 hover:bg-white/20')}
              >
                <YoutubeIcon size={18} /> Canal no YouTube
              </a>
            </div>
          </div>
          <div className="relative flex size-80 shrink-0 items-center justify-center max-[840px]:size-[220px]">
            <div className="absolute -inset-5 animate-pulse-glow rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_30%,transparent)_0%,transparent_70%)]" />
            <img src="/logo-diaconia.png" alt="Brasão da Diaconia" className="relative z-[1] block size-[300px] animate-float rounded-full bg-secondary object-cover shadow-[0_20px_60px_rgb(0_0_0/0.4),0_0_0_4px_color-mix(in_oklab,var(--accent)_40%,transparent)] max-[840px]:size-[200px]" />
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-px h-[120px] leading-[0]" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="size-full">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="var(--secondary)" />
          </svg>
        </div>
      </section>

      {/* AGENDA */}
      <section className="bg-card py-20" id="agenda">
        <SectionContainer>
          <div className="grid grid-cols-2 items-center gap-[60px] max-[840px]:grid-cols-1 max-[840px]:gap-8">
            <SectionHeading
              eyebrow="Vida Litúrgica"
              title="Horários de Missas"
              desc="Venha celebrar conosco. As missas são abertas a todos e ocorrem na Igreja Matriz e nas comunidades rurais do território."
              descClassName="mb-0"
            />
            <div className="flex flex-col gap-4">
              {MISSAS.map((m) => (
                <div key={m.dia} className="flex items-start gap-[18px] rounded-[18px] border border-border bg-secondary px-6 py-[22px] transition-all duration-250 hover:-translate-y-[3px] hover:shadow-card">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
                    <CalendarDays size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <strong className="mb-1.5 block text-base font-bold text-foreground">{m.dia}</strong>
                    <span className="mb-1 flex items-center gap-[5px] text-[13px] text-soft">
                      <Clock size={13} /> {m.hora}
                    </span>
                    <span className="flex items-center gap-[5px] text-[12.5px] text-muted-foreground">
                      <MapPin size={13} /> {m.local}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* PASTORAIS */}
      <section className="bg-secondary pb-20 pt-[90px] max-[480px]:py-[60px]" id="pastorais">
        <SectionContainer>
          <SectionHeading
            eyebrow="Nossa atuação"
            title="Pastorais & Ministérios"
            desc="O território diocesano é animado por diversas pastorais que cuidam da formação, da liturgia e do serviço às comunidades."
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {PASTORAIS.map((p) => (
              <div
                key={p.nome}
                className="relative overflow-hidden rounded-[20px] border border-border bg-card px-6 py-[30px] shadow-soft transition-all duration-250 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-primary before:to-accent before:transition-transform before:duration-[350ms] hover:-translate-y-[5px] hover:border-accent-light hover:shadow-card hover:before:scale-x-100"
              >
                <div className="mb-3.5 text-[36px] leading-none text-primary">{ICON_MAP[p.icon]}</div>
                <h3 className="mb-2 text-base font-bold text-foreground">{p.nome}</h3>
                <p className="text-[13.5px] leading-[1.65] text-soft">{p.desc}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* DIZIMO CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark to-[color-mix(in_oklab,var(--primary)_35%,black)] px-7 py-[90px] max-[480px]:px-5 max-[480px]:py-[60px]" id="dizimo">
        <div className="relative z-[1] mx-auto flex max-w-[1100px] items-center gap-[60px] max-[840px]:flex-col max-[840px]:gap-9 max-[840px]:text-center">
          <div className="flex-1">
            <span className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[3px] text-accent-light">Participe</span>
            <h2 className="mb-4 font-heading text-[clamp(30px,3.5vw,48px)] font-bold tracking-[-0.3px] text-white">Devolva seu dízimo</h2>
            <p className="mb-[30px] max-w-[440px] text-[15px] leading-[1.75] text-white/80 max-[840px]:mx-auto">
              O dízimo sustenta as missões, ajuda famílias e anima as comunidades.
              Ele tem 4 dimensões: <strong>religiosa, missionária, eclesial e caritativa</strong>.
              Contribua via Pix e registre seu comprovante.
            </p>
            <Link
              href="/comprovante"
              className={cn(heroBtnBase, 'bg-accent px-8 py-3.5 text-[15px] font-bold text-accent-foreground shadow-[0_4px_18px_color-mix(in_oklab,var(--accent)_30%,transparent)] hover:bg-accent-light hover:shadow-[0_8px_28px_color-mix(in_oklab,var(--accent)_45%,transparent)]')}
            >
              <Coins size={18} /> Fazer minha contribuição <ChevronRight size={16} />
            </Link>
          </div>
          <div className="w-[300px] shrink-0 max-[840px]:mx-auto max-[840px]:w-full max-[840px]:max-w-[340px]">
            <div className="rounded-3xl border border-white/15 bg-white/10 px-7 py-9 text-center">
              <span className="mb-4 flex justify-center">
                <HandHeart size={44} strokeWidth={1.2} color="rgba(255,255,255,0.9)" />
              </span>
              <p className="mb-3.5 font-heading text-[17px] italic leading-[1.65] text-white/90">
                &ldquo;Trazei todos os dízimos à casa do tesouro, e haja mantimento na minha casa.&rdquo;
              </p>
              <span className="block text-xs font-bold uppercase tracking-[2px] text-accent-light">Malaquias 3:10</span>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="bg-card py-20" id="equipe">
        <SectionContainer>
          <SectionHeading
            eyebrow="Quem nos guia"
            title="Equipe Pastoral"
            desc="Conheça os pastores e diáconos que animam e celebram junto às comunidades de todo o território de São Raimundo Nonato."
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {EQUIPE.map((e) => (
              <div key={e.nome} className="rounded-3xl border border-border bg-secondary px-6 py-9 text-center transition-all duration-250 hover:-translate-y-[5px] hover:shadow-card">
                <div className="mx-auto mb-4 flex size-[72px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-heading text-[28px] font-bold text-primary-foreground">{e.inicial}</div>
                <strong className="mb-1.5 block text-base font-bold text-foreground">{e.nome}</strong>
                <span className="inline-flex items-center gap-[5px] text-[12.5px] text-muted-foreground">
                  <Mic2 size={13} /> {e.cargo}
                </span>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* LOCALIZACAO */}
      <section className="bg-secondary py-20" id="localizacao">
        <SectionContainer>
          <SectionHeading
            eyebrow="Onde estamos"
            title="Nossa Localização"
            desc="A Diaconia Territorial São Raimundo Nonato está sediada no município de Curralinhos, Piauí, atendendo às diversas comunidades urbanas e rurais da região."
          />
          <div className="mt-9 overflow-hidden rounded-[20px] border-[1.5px] border-border shadow-soft">
            <iframe
              src="https://maps.google.com/maps?q=Curralinhos,+Piau%C3%AD,+Brasil&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              className="border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Curralinhos, PI"
            ></iframe>
          </div>
        </SectionContainer>
      </section>

      {/* SOBRE A DIACONIA */}
      <SobreSection />

      {/* MEMORIAS */}
      <MemoriasSection />

      {/* MIDIAS */}
      <section className="bg-card py-20" id="midias">
        <SectionContainer>
          <SectionHeading
            eyebrow="Acompanhe"
            title="Esteja sempre conectado"
            desc="Acompanhe as missas ao vivo, os festejos, as ações pastorais e as novidades da Diaconia nas nossas redes."
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={midiaCardClass}>
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)]">
                <InstagramIcon size={32} color="#fff" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="mb-[3px] block text-base font-bold text-foreground">Instagram</strong>
                <p className="m-0 block truncate text-[12.5px] text-muted-foreground">@diaconiasaoraimundononato</p>
              </div>
              <span className="ml-auto shrink-0 text-primary"><ChevronRight size={18} /></span>
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={midiaCardClass}>
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#ff0000]">
                <YoutubeIcon size={32} color="#fff" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="mb-[3px] block text-base font-bold text-foreground">YouTube</strong>
                <p className="m-0 block truncate text-[12.5px] text-muted-foreground">@diaconiasaoraimundononato</p>
              </div>
              <span className="ml-auto shrink-0 text-primary"><ChevronRight size={18} /></span>
            </a>
          </div>
        </SectionContainer>
      </section>

      {/* FOOTER */}
      <footer className="bg-footer px-7 py-14 text-center text-white/70">
        <img src="/logo-diaconia.png" alt="Logo Diaconia" className="mx-auto mb-4 block size-[52px] rounded-full border-2 border-white/15 bg-secondary object-cover" />
        <p className="mb-1 text-base font-bold text-white">Diaconia Territorial São Raimundo Nonato</p>
        <p className="mb-7 text-[13px] text-white/50">Curralinhos — PI &nbsp;·&nbsp; Arquidiocese de Teresina | Forania Rural I</p>
        <div className="mb-7 flex flex-wrap items-center justify-center gap-7 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:text-[13px] [&_a]:text-white/60 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-accent-light">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={14} /> Instagram
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            <YoutubeIcon size={14} /> YouTube
          </a>
          <Link href="/comprovante">Devolução do Dízimo</Link>
          <Link href="/admin">Área Admin</Link>
        </div>
        <p className="text-[11.5px] text-white/30">
          <Heart size={12} fill="currentColor" className="inline text-primary opacity-60" />
          {' '}&copy; {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}
