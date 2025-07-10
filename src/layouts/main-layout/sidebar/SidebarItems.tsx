import { Box, List } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Menuitems from './MenuItems';
import NavItemGroup from './NavItemGroup';
import NavMenuItem from './NavMenuItem';
import { useUsers } from 'providers/UsersProvider';


interface SidebarItemsProps {
  onItemClick?: () => void; // 👈 Aquí defines que SidebarItems puede recibir onItemClick
}

const SidebarItems = ({ onItemClick }: SidebarItemsProps) => {
  const {currentUser} =useUsers()
  const location = useLocation();
  const { pathname } = location;

  return (
    <Box sx={{ p: 2, pb:0 }}>
      <List sx={{ pt: 0 }}>
        {Menuitems(currentUser).map((item) => {
          if (item.subheader) {
            return <NavItemGroup subheader={item.subheader} key={item.subheader} />;
          } else {
            return <NavMenuItem pathTo={pathname} item={item} key={item.id}  onItemClick={onItemClick} />;
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;