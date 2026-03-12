import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from '../utils/gsapConfig';
import { Briefcase, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";

const experiences = [
    {
        company: "Socium",
        role: "Development Partner",
        location: "Remote",
        dates: "2024 – Present",
        summary: "We led the end-to-end technical architecture and full-stack development for high-stakes enterprise clients. Engineered highly resilient, compliance-heavy banking systems (HBL, Finastra, Fusion Tech Innova) using Angular and Node.js. Built secure integrations with Finastra's core banking architecture to handle complex B2B financial workflows, ensuring high availability and zero-downtime deployments via AWS."
    },
    {
        company: "iVisionGate",
        role: "Lead Technical Partner",
        location: "Onsite",
        dates: "2022 – 2024",
        summary: "We architected the backend and logic engine for Swifpack (associated with Tanzania Posts Corporation). Built a comprehensive digital mobility and logistics platform that integrated ride-sharing, real-time fleet tracking, courier delivery, and corporate fleet management into a single, seamless ecosystem using Flutter, Next.js, Angular, Node.js, Firebase, MQTT, and AWS."
    }
];

export const WorkExperience = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.exp-card', {
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="work-experience" className="py-24 bg-darkNavy relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Work
                            <span className="gradient-text ml-3">Experience</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center md:justify-end"
                    >
                        <a
                            href="https://docs.google.com/document/d/16UjVpveS0x3j9AfnSakfU2l2kjfoMC8t7d_sHEuZLg8/edit?tab=t.0#heading=h.bexukqdrxvy7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-sm text-textSecondary hover:text-mint transition-colors"
                        >
                            <span>VIEW FULL RESUME</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>

                <div className="space-y-6">
                    {experiences.map((exp) => (
                        <div
                            key={exp.company}
                            className="exp-card bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-mint/30 transition-all duration-300 hover:bg-white/10"
                        >
                            <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
                                <div className="lg:w-1/4">
                                    <div className="flex items-center gap-2 text-mint font-mono text-sm mb-3">
                                        <Briefcase className="w-4 h-4" />
                                        {exp.dates}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{exp.company}</h3>
                                    <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80 uppercase tracking-wider">
                                        {exp.location}
                                    </span>
                                </div>

                                <div className="lg:w-3/4">
                                    <h4 className="text-xl font-semibold text-royalBlue mb-3">{exp.role}</h4>
                                    <p className="text-white/70 leading-relaxed max-w-3xl">
                                        {exp.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-mint/30 transition-all"
                    >
                        <div className="absolute top-8 right-8 text-mint/20 group-hover:text-mint/40 transition-colors">
                            <Zap className="w-16 h-16" />
                        </div>
                        <h4 className="text-sm font-semibold text-mint mb-2 uppercase tracking-wider">Core Principle</h4>
                        <h3 className="text-3xl font-bold text-white mb-4">Scalability</h3>
                        <p className="text-white/70 max-w-xs">
                            Architecting systems that grow seamlessly with global demand and user base.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-mint/30 transition-all"
                    >
                        <div className="absolute top-8 right-8 text-royalBlue/20 group-hover:text-royalBlue/40 transition-colors">
                            <ShieldCheck className="w-16 h-16" />
                        </div>
                        <h4 className="text-sm font-semibold text-royalBlue mb-2 uppercase tracking-wider">Global Vision</h4>
                        <h3 className="text-3xl font-bold text-white mb-4">Resilience</h3>
                        <p className="text-white/70 max-w-xs">
                            Building reliable software that transcends borders, maintaining uptime gracefully.
                        </p>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default WorkExperience;
