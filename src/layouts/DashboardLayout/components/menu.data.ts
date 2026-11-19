import { Home, Package, ShoppingBasket, ShoppingCart, } from "lucide-react";

export const menuData = [
   {
        id: 1,
        title: "Dashboard",
        link: "/dashboard",
        Icon: Home,
   },
   {
        id: 2,
        title: "Productos",
        link: "/products",
        Icon: Package, // Productos
   },
   {
        id: 3,
        title: "Compras",
        link: "/purchases",
        Icon: ShoppingBasket, //Compras
   },
   {
        id: 4,
        title: "Ventas", 
        link: "/sales",
        Icon: ShoppingCart,  //Ventas
   }    
]