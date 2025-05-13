
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-restaurant-green mb-2 sm:mb-0">
          AARKAY VAISHNO DHABA
        </h1>
        <Button asChild variant="outline" className="text-restaurant-green border-restaurant-green hover:bg-restaurant-green hover:text-white">
          <Link to="/admin/login" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Admin Access</span>
          </Link>
        </Button>
      </div>
      <p className="text-gray-600 text-sm mt-1">Delicious Food, Memorable Experience</p>
      <div className="h-1 bg-gradient-to-r from-restaurant-green to-restaurant-light-green mt-4 rounded-full" />
    </div>
  );
};

export default Header;
