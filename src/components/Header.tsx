
import React from 'react';
import { ChartBarIcon, ClipboardIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="w-full bg-g6-blue text-white py-3 px-4 md:px-8 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="font-bold text-2xl">Grupo6 Capital</h1>
          </div>
          
          <Tabs 
            defaultValue={currentPath === "/" ? "form" : "dashboard"} 
            className="w-full md:w-auto"
            onValueChange={(value) => {
              if (value === "form") navigate("/");
              if (value === "dashboard") navigate("/dashboard");
            }}
          >
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="form" className="flex items-center gap-2">
                <ClipboardIcon className="h-4 w-4" />
                <span>Formulário</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
};

export default Header;
