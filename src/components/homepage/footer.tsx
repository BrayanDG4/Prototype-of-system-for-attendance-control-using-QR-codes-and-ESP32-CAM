import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import checkIcon from "../../assets/homepage/check-white.png";
import Image from "next/image";

const productLinks = [
  { title: "Overview", href: "/overview" },
  { title: "Pricing", href: "/pricing" },
  { title: "Marketplace", href: "/marketplace" },
  { title: "Features", href: "/features" },
];

const companyLinks = [
  { title: "About", href: "/about" },
  { title: "Team", href: "/team" },
  { title: "Blog", href: "/blog" },
  { title: "Careers", href: "/careers" },
];

const resourceLinks = [
  { title: "Help", href: "/help" },
  { title: "Sales", href: "/sales" },
  { title: "Advertise", href: "/advertise" },
  { title: "Privacy", href: "/privacy" },
];

const socialLinks = [
  { icon: Instagram, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t bg-black text-white dark:bg-background dark:text-foreground"
    >
      <div className="container mx-12 px-4 py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src={checkIcon} alt="Attendify" width={30} height={30} />

              <span className="hidden font-bold sm:inline-block text-2xl">
                Attendify
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 dark:text-gray-400">
              Optimiza el registro de asistencias en tiempo real y obtén
              reportes detallados con solo unos clics. Simplifica la gestión y
              toma decisiones informadas.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={i}
                    href={social.href}
                    className="text-gray-400 hover:text-white dark:hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.icon.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {/* <div>
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {productLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white dark:hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white dark:hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {resourceLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white dark:hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © 2025 Attendify. Todos los derechos reservados.
            </p>
            {/* <div className="flex gap-4 mr-8">
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-white dark:hover:text-foreground"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white dark:hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div> */}
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src={checkIcon} alt="Attendify" width={30} height={30} />

              <span className="hidden font-bold sm:inline-block text-2xl">
                Attendify
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
