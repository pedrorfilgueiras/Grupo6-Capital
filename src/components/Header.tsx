
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-g6-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G6</span>
            </div>
            <span className="text-xl font-bold text-g6-blue">Grupo6 Capital</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-g6-blue transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-g6-blue transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/due-diligence" 
              className="text-gray-600 hover:text-g6-blue transition-colors"
            >
              Due Diligence
            </Link>
            <Link 
              to="/data-integration" 
              className="text-gray-600 hover:text-g6-blue transition-colors"
            >
              Dados Integrados
            </Link>
            <Link 
              to="/inefficiency-logs" 
              className="text-gray-600 hover:text-g6-blue transition-colors"
            >
              Log de Ineficiências
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
