
import navigationData from "./data/navigation.json";

export interface MenuItem {
    label: string;
    path: string;
}

export const mainNavigation: MenuItem[] = navigationData as MenuItem[];
