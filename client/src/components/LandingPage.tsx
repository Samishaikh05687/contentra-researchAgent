import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Twitter, Linkedin, Github, User2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import {
  
  Rocket,
  PenTool,
  MessageSquare,
  
  Zap,
  ArrowRight,
  Globe,
  CheckCircle2,
  Cpu,
  LayoutDashboard,
  MousePointerClick,
  BookOpen
} from "lucide-react";

// Props to toggle login view from the landing page





const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "how", label: "How it Works" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
];

const SectionHeader: React.FC<{ eyebrow?: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="text-center max-w-3xl mx-auto mb-10">
    {eyebrow && (
      <div className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm tracking-wider uppercase text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
      </div>
    )}
    <h2 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight">{title}</h2>
    {subtitle && <p className="mt-4 px-20 text-muted-foreground leading-relaxed">{subtitle}</p>}
  </div>
);

const GlassNav: React.FC<{ } & React.HTMLAttributes<HTMLDivElement>> = () => {
    const navigate = useNavigate();
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1040px,90vw)]">
      <div className="backdrop-blur-xl bg-background/60 border rounded-2xl shadow-xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>Contentra</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button key={item.id} variant="ghost" size="sm" className="rounded-xl" onClick={() => handleClick(item.id)}>
              {item.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-xl hover:scale-105 transition-all ease-in-out" onClick={() => navigate("/app")}>
            Sign In <User2 className=" h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const BackgroundDecor: React.FC = () => {
  // Simple parallax glow using scroll progress
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.15, 0.25, 0.15]);

  return (
    <>
      {/* Grid overlay */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,theme(colors.muted.DEFAULT)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08]" />

      {/* Subtle vignette */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_10%,theme(colors.primary)/12%,transparent_60%)]" />

      {/* Animated glow blob */}
      <motion.div
        aria-hidden
        style={{ y: glowY, opacity: glowOpacity }}
        className="pointer-events-none fixed -z-10 top-20 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full blur-3xl"
      >
        <div className="h-full w-full bg-primary/30 animate-pulse rounded-full" />
      </motion.div>
    </>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; }> = ({ icon, title, desc }) => (
  <Card className="rounded-2xl border-muted/40 hover:border-muted transition-colors">
    <CardHeader className="space-y-2">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">{icon}</div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </CardContent>
  </Card>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-normal">{value}</div>
    <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
  </div>
);

const Step: React.FC<{ index: number; title: string; desc: string; icon: React.ReactNode }> = ({ index, title, desc, icon }) => (
  <div className="relative">
    <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 hidden md:block">
      <div className="h-10 w-10 rounded-full bg-primary/15 border grid place-items-center text-primary font-medium">{index}</div>
    </div>
    <Card className="rounded-2xl border-muted/40">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        </div>
      </CardHeader>
    </Card>
  </div>
);

const Testimonial: React.FC<{ quote: string; author: string; role: string }> = ({ quote, author, role }) => (
  <Card className="rounded-2xl h-full border-muted/40">
    <CardContent className="pt-6">
      <p className="italic leading-relaxed">“{quote}”</p>
      <div className="mt-6">
        <div className="font-semibold">{author}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
    </CardContent>
  </Card>
);
const CTA: React.FC = () => (
  <div className="relative overflow-hidden rounded-3xl border bg-slate-50 bg-opacity-10  text-primary-foreground">
    <div className="relative p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
      {/* Left Section: Content */}
      <div className="space-y-6">
        <h3 className="text-3xl md:text-4xl font-medium leading-tight">
          Supercharge Your Workflow with AI 🚀
        </h3>
        <p className="text-md opacity-90">
          Build intelligent chatbots, automate tasks, and scale your business.  
          Our platform makes AI adoption simple, powerful, and cost-effective.
        </p>

        {/* Mini Feature Points */}
        <ul className="space-y-2 text-sm">
          <li>✅ No coding required</li>
          <li>✅ Plug & Play integration</li>
          <li>✅ Secure & reliable</li>
        </ul>

        {/* Button */}
        <Button className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg hover:scale-105 transition">
          Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Right Section: Illustration */}
      <div className="flex justify-center md:justify-end">
        {/* <Image
          src=""
          alt="AI Illustration"
          width={400}
          height={300}
          className="drop-shadow-xl"
        /> */}
      </div>
    </div>
  </div>
);

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-12 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </span>
              Contantra
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              A sleek AI workspace for faster writing, smarter research, 
              and delightful collaboration.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#how" className="hover:text-foreground">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="#faqs" className="hover:text-foreground">FAQs</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#blog" className="hover:text-foreground">Blog</a></li>
              <li><a href="#case-studies" className="hover:text-foreground">Case Studies</a></li>
              <li><a href="#docs" className="hover:text-foreground">Documentation</a></li>
              <li><a href="#community" className="hover:text-foreground">Community</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:hello@chat-ai.app" className="hover:text-foreground">hello@chat-ai.app</a></li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Privacy-first
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-foreground"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-xs text-muted-foreground mt-10 border-t pt-6 text-center">
          © {new Date().getFullYear()} Contantra. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const LandingPage: React.FC = () => {

const navigate = useNavigate();

  useEffect(() => {
    // enable smooth scroll on hash links
    const handler = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = target.getAttribute("href")!.slice(1);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <BackgroundDecor />
        <GlassNav />

        {/* HERO */}
        <section id="hero" className="min-h-[92vh] pt-28 pb-16 flex items-center">
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-sans tracking-tight"
              >
                Write faster.<br/> Research smarter. <span className="text-primary">Collaborate beautifully.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="mt-5 text-lg text-muted-foreground max-w-xl"
              >
                A unified AI canvas for drafting content, searching the web, and sharing ideas with your team—without leaving your flow.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button className="rounded-xl h-12 px-6 hover:scale-105 transition-all ease-in-out"  onClick={() => navigate("/app")}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button className="rounded-xl h-12 px-6" variant="secondary" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore Features
                </Button>
              </motion.div>

              <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
                <Stat label="Writers onboard" value="12k+" />
                <Stat label="Avg. time saved" value="6.2h/wk" />
                <Stat label="Teams" value="2.1k" />
              </div>
            </div>

            {/* Mock preview card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/25 to-transparent blur-2xl" />
              <Card className="relative rounded-3xl overflow-hidden border-muted/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <LayoutDashboard className="h-4 w-4" /> Live Workspace
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border bg-muted/10 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Cpu className="h-4 w-4"/> Command Palette
                    </div>
                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border p-3 bg-background/60">
                        <div className="text-sm font-medium flex items-center gap-2"><PenTool className="h-4 w-4"/> Draft assistant</div>
                        <p className="text-xs text-muted-foreground mt-1">Outline, expand, rephrase with style presets.</p>
                      </div>
                      <div className="rounded-xl border p-3 bg-background/60">
                        <div className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4"/> Web insights</div>
                        <p className="text-xs text-muted-foreground mt-1">Curate sources and cite automatically.</p>
                      </div>
                      <div className="rounded-xl border p-3 bg-background/60">
                        <div className="text-sm font-medium flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Team threads</div>
                        <p className="text-xs text-muted-foreground mt-1">Discuss edits inline with your crew.</p>
                      </div>
                      <div className="rounded-xl border p-3 bg-background/60">
                        <div className="text-sm font-medium flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Safe by default</div>
                        <p className="text-xs text-muted-foreground mt-1">Your data stays private and exportable.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader
              eyebrow="About"
              title="Built for modern creators and teams"
              subtitle="From solo writers to product squads, Chat AI streamlines ideation, drafting and research into a single elegant flow."
            />
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard icon={<Zap className="h-5 w-5" />} title="Speed-first" desc="Fluid editing and instant AI actions with minimal friction." />
              <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Private by design" desc="Projects are encrypted at rest with granular sharing controls." />
              <FeatureCard icon={<Rocket className="h-5 w-5" />} title="Grows with you" desc="Powerful enough for teams, delightful for individuals." />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader
              eyebrow="Features"
              title="Everything you need to go from idea to publish"
              subtitle="No tab overload. Research, write, review, and ship in one place."
            />

            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                <FeatureCard
                  icon={<PenTool className="h-5 w-5" />}
                  title="AI Writing Modes"
                  desc="Outline, brainstorm, paraphrase, and tone-matching with reusable presets."
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} viewport={{ once: true }}>
                <FeatureCard
                  icon={<Globe className="h-5 w-5" />}
                  title="Live Web Search"
                  desc="Pull fresh facts, compare sources, and auto-generate citations."
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
                <FeatureCard
                  icon={<MessageSquare className="h-5 w-5" />}
                  title="Team Comments"
                  desc="Threaded suggestions and approvals with role-based access."
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                <FeatureCard
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  title="Project Boards"
                  desc="Organize docs by goals, milestones, and publish status."
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} viewport={{ once: true }}>
                <FeatureCard
                  icon={<Cpu className="h-5 w-5" />}
                  title="Command Palette"
                  desc="Slash-commands and quick actions for peak flow state."
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
                <FeatureCard
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Style Library"
                  desc="Train reusable voice profiles for consistent brand tone."
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader
              eyebrow="How it Works"
              title="From prompt to publish in three steps"
              subtitle="Bring your topic, we’ll handle the rest." />

            <div className="grid md:grid-cols-3 gap-6 relative">
              <Step index={1} title="Create a space" desc="Start a project with your goal, audience, and style." icon={<LayoutDashboard className="h-5 w-5"/>} />
              <Step index={2} title="Draft with context" desc="Blend AI writing with live web citations and your notes." icon={<PenTool className="h-5 w-5"/>} />
              <Step index={3} title="Share & ship" desc="Collaborate with comments, approvals, and exports." icon={<MousePointerClick className="h-5 w-5"/>} />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS + METRICS */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader
              eyebrow="Loved by teams"
              title="A craft-grade editor with AI superpowers"
              subtitle="Join thousands of creators saving hours every week."
            />
            <div className="grid md:grid-cols-3 gap-6">
              <Testimonial quote="The best balance of control and speed I’ve used. It feels like a real writing partner." author="Ana R." role="Content Lead @ Studio" />
              <Testimonial quote="Research with citations is a game changer. No more tab chaos or copy/paste." author="Marcus T." role="PM @ SaaSCo" />
              <Testimonial quote="Our team ships release notes twice as fast with higher quality." author="Priya S." role="Eng Lead @ Fintech" />
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="py-24">
          <div className="max-w-3xl mx-auto px-4">
            <SectionHeader eyebrow="FAQ" title="Answers at a glance" />
            <Accordion type="single" collapsible className="rounded-2xl px-3 border">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is Chat AI free to use?</AccordionTrigger>
                <AccordionContent>We offer a generous free plan for individuals and paid plans for teams who need advanced collaboration and governance.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do you handle my data?</AccordionTrigger>
                <AccordionContent>Your data is encrypted at rest and never sold. You control sharing per project. See our privacy page for full details.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I bring my own API keys or models?</AccordionTrigger>
                <AccordionContent>Yes. Configure model providers in settings to use your own keys and preferences.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <CTA />
          </div>
        </section>

        <Footer />
      </div>
    </MotionConfig>
  );
};

export default LandingPage;
