import React from "react";
import { GalleryVerticalEnd } from "lucide-react";

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Acme Inc.
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              {/* <LoginForm /> */}
              {children}
            </div>
          </div>
        </div>
        <div className="h-full w-full bg-[#18181b]">
          <div className="w-full h-full text-white text-xl font-bold flex items-center justify-center">
            <h3>HOLA MUNDO</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutAuth;
