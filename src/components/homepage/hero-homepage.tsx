import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Cover } from "../ui/cover";
import checkIcon from "../../assets/homepage/check-icon.png";

const HeroHomepage = () => {
  return (
    <section className="relative overflow-hidden py-10">
      <div className="container">
        <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="z-10 flex flex-col items-center gap-6 text-center h-full">
            {/* <Image
              src={checkIcon}
              alt="logo"
              width={46}
              height={46}
              className="h-auto"
            />
            <Badge variant="outline">Asistencias Inteligentes</Badge> */}
            <div>
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 pb-8 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                Controla la asistencia de forma eficiente y{" "}
                <Cover>¡Automatizada!</Cover>
              </h1>
              <p className="text-muted-foreground lg:text-xl">
                Optimiza el registro de asistencias en tiempo real y obtén
                reportes detallados con solo unos clics. Simplifica la gestión y
                toma decisiones informadas.
              </p>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button>Comenzar ahora</Button>
              <Button variant="outline">
                Ver más <ExternalLink className="ml-2 h-4" />
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <p className="text-center: text-muted-foreground lg:text-left">
                Potenciado por tecnologías open-source
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/shadcn-ui-icon.svg"
                    alt="company logo"
                    width={24}
                    height={24}
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/typescript-small.svg"
                    alt="company logo"
                    width={24}
                    height={24}
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/react-icon.svg"
                    alt="company logo"
                    width={24}
                    height={24}
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/tailwind-small.svg"
                    alt="company logo"
                    width={16}
                    height={16}
                    className="h-4 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHomepage;
