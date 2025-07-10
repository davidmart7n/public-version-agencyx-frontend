import { Box, Drawer } from '@mui/material';
import { useBreakpoints } from 'providers/useBreakPoint';
import SimpleBar from 'simplebar-react';
import SidebarBanner from './SidebarBanner';
import SidebarItems from './SidebarItems';
import SidebarLogo from './SidebarLogo';

interface SideNavProps {
  onDrawerClose: () => void;
  onDrawerTransitionEnd: () => void;
  mobileOpen: boolean;
}
const Sidebar = ({ onDrawerClose, onDrawerTransitionEnd, mobileOpen }: SideNavProps) => {
  const { up } = useBreakpoints();
  const upLg = up('lg');

  if (upLg) {
    return (
      <Box
        sx={{
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open
          variant="permanent"
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{
              height: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: 'common.white',
                px: 3,
                boxShadow: 9,
              }}
            >
              <SidebarLogo />
            </Box>

            <SimpleBar style={{ height: 'calc(100% - 68px)' }}>
              <Box
                sx={{
                  borderRight: 1,
                  borderColor: 'text.disabled',
                }}
              >
                <SidebarItems />
                <SidebarBanner />
              </Box>
            </SimpleBar>
          </Box>
        </Drawer>
      </Box>
    );
  }
  {
    /* Sidebar For Mobile */
  }

  return (
    <Drawer
      anchor="left"
      onTransitionEnd={onDrawerTransitionEnd}
      open={mobileOpen}
      onClose={onDrawerClose}
      variant="temporary"
      ModalProps={{
        keepMounted: false, // Better open performance on mobile.
        // BackdropProps: {
        //   invisible: true, // ✅ el backdrop no se ve, pero mantiene foco y eventos bien
        // }
        
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'common.white',
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[2],
        },
      }}
    >
      {/* ------------------------------------------- */}
      <Box
        sx={{
          bgcolor: 'common.white',
          px: 3,
        }}
      >
        <SidebarLogo />
      </Box>

      {/* ------------------------------------------- */}
      <SimpleBar style={{ height: 'calc(100% - 68px)' }}>
        <>
          <SidebarItems  onItemClick={upLg ? undefined : onDrawerClose}/>
          <SidebarBanner />
        </>
      </SimpleBar>
    </Drawer>
  );
};

export default Sidebar;