import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dashboardImage1 from "../../assets/homepage/dashboard1.png";
import dashboardImage2 from "../../assets/homepage/dashboard2.png";
import dashboardImage3 from "../../assets/homepage/dashboard3.png";
import img1 from "../../assets/homepage/img1.png";
import img2 from "../../assets/homepage/img2.png";


export default function ShowcaseGrid() {
  const showcaseItems = [
    {
      title: "Settings Panel",
      description: "Customizable user preferences",
      imageUrl: dashboardImage2,
      width: 500,
      height: 500,
      className: "md:col-span-2",
    },

    {
      title: "Quick Actions",
      description: "Efficient workflow with one-click actions",
      imageUrl: dashboardImage3,
      width: 600,
      height: 600,
      className: "md:col-span-2",
    },
    {
      title: "Data Tables",
      description: "Powerful data management and filtering",
      imageUrl: img1,
      width: 500,
      height: 500,
      className: "md:col-span-1",
    },
    {
      title: "Analytics Charts",
      description: "Beautiful data visualization",
      imageUrl: img2,
      width: 500,
      height: 500,
      className: "md:col-span-1 flex items-center justify-center",
    },
    {
      title: "Dashboard Overview",
      description:
        "Complete analytics dashboard with real-time data visualization",
      imageUrl: dashboardImage1,
      width: 600,
      height: 600,
      className: "md:col-span-2",
    },
  ];

  return (
    <div id="about" className="container px-4 py-12 mx-auto">
      <div className="text-center mb-12 py-5">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Descubre nuestra plataforma
        </h2>
        <p className="text-lg text-muted-foreground">
          Explora las diferentes características y funcionalidades que ofrecemos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {showcaseItems.map((item, index) => (
          <Card
            key={index}
            className={cn(
              "group relative overflow-hidden transition-all hover:shadow-lg",
              item.className
            )}
          >
            <div className="relative overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={item.width}
                height={item.height}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
