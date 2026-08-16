import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { FloatingSparks } from "@/components/FloatingSparks";
import { SparkButton } from "@/components/SparkButton";
import { ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import giftbox from "@/assets/giftbox.png";
import { useServicesSettings } from "@/lib/appSettings";
import { useServices } from "@/hooks/useServices";
import { Icon } from "@/lib/iconMap";

const Services = () => {
  const s = useServicesSettings();
  const { services } = useServices();

  return (
    <Layout>
      <section className="relative section-pad !pt-10">
        <FloatingSparks count={16} />
        <div className="container-festive relative">
          {s.header.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              {s.header.badge && (
                <span className="text-primary font-semibold text-sm">{s.header.badge}</span>
              )}
              <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 mb-3">
                {s.header.title}{" "}
                <span className="text-gradient-festive">{s.header.titleHighlight}</span>
              </h1>
              <p className="text-muted-foreground">{s.header.description}</p>
            </motion.div>
          )}

          {services.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {services.map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-3xl p-7 group relative overflow-hidden"
                >
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
                    style={{ background: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))" }}
                  />
                  <div
                    className="w-16 h-16 rounded-2xl grid place-items-center mb-5 group-hover:animate-wiggle relative"
                    style={{
                      background: i % 2 === 0 ? "hsl(var(--primary) / 0.12)" : "hsl(var(--secondary) / 0.12)",
                    }}
                  >
                    <Wrench
                      className="w-8 h-8"
                      style={{ color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))" }}
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{svc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{svc.description}</p>
                  {svc.price > 0 && (
                    <span className="font-display text-lg font-bold text-primary">
                      ₹{svc.price.toLocaleString("en-IN")}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {s.items.show && s.items.list.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {s.items.list.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-3xl p-7 group relative overflow-hidden"
                >
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
                    style={{ background: `hsl(${it.colorHue} 90% 65%)` }}
                  />
                  {it.image ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mb-5 group-hover:animate-wiggle relative shadow-soft">
                      <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-2xl grid place-items-center mb-5 group-hover:animate-wiggle relative"
                      style={{
                        background: `hsl(${it.colorHue} 95% 92%)`,
                        boxShadow: `0 0 30px hsl(${it.colorHue} 90% 70% / 0.5)`,
                      }}
                    >
                      <Icon name={it.icon} className="w-8 h-8" style={{ color: `hsl(${it.colorHue} 80% 50%)` }} />
                    </div>
                  )}
                  <h3 className="font-display text-xl font-semibold mb-2">{it.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{it.desc}</p>
                  <Link
                    to={it.link || "/contact"}
                    className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {s.cta.show && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-festive p-8 md:p-12 grid md:grid-cols-2 gap-6 items-center text-white shadow-soft"
            >
              <FloatingSparks count={10} />
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{s.cta.title}</h2>
                <p className="opacity-90 mb-5">{s.cta.description}</p>
                <Link to={s.cta.buttonLink || "/contact"}>
                  <SparkButton variant="outline" className="!bg-white !text-primary !border-white">
                    {s.cta.buttonLabel}
                  </SparkButton>
                </Link>
              </div>
              <div className="relative z-10 flex justify-center">
                <img
                  src={s.cta.image || giftbox}
                  alt="Gift box"
                  loading="lazy"
                  width={768}
                  height={768}
                  className="w-56 md:w-72 drop-shadow-2xl"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
