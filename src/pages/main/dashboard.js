import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Stack,
  IconButton,
  Typography,
  Box,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Menu,
  Modal,
  Tooltip,
  Divider
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FavoriteBorder, Language } from '@mui/icons-material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined';
import { ExpandMore, ExpandLess, Check } from '@mui/icons-material';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';

import ProfileIcon from '../../assets/icons/profile.png';
import LogoutIcon from '../../assets/icons/logout.png';
import SearchIcon from '../../assets/icons/search.png';
import RefreshIcon from '../../assets/icons/refresh.png';
import SettingsIcon from '../../assets/icons/settings.png';
import LoginIcon from '../../assets/icons/login.png';

import DefaultAppImage from '../../assets/images/logo.png';
import LogoWithTitle from '../../assets/images/logo_title.png';
import ScreamingFrogIcon from "../../assets/images/screaming_frog.png";

import Loader from 'components/Loader';
import SimpleBarScroll from 'components/SimpleBar';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import useSnackbar from 'hooks/useSnackbar';
import useMain from 'hooks/useMain';
import useAuth from 'hooks/useAuth';

const Tabs = {
  Applications: 1,
  Favorites: 2,
  Recents: 3,
  "Screaming Frog": 4
};

const listItemButtonSx = {
  borderRadius: '8px',
  py: 0.25,
  borderLeft: '4px solid transparent',
  '&.Mui-selected': {
    backgroundColor: '#252731',
    color: 'white',
    borderLeft: '4px solid #1976d2',
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#252731'
  },
  '&:hover': {
    backgroundColor: '#2C3145'
  }
};

const listItemTextSx = {
  '& .MuiTypography-root': {
    fontSize: 14,
    color: 'white'
  }
};

const listItemIconSx = { color: 'white', minWidth: 32 };

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { logout } = useAuth();
  const { getAppList, checkHealth, appList, runApp, stopApp, searchPattern, setSearchPattern, setFavorite, setLog } = useMain();

  const { errorMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [runningStatus, setRunningStatus] = useState({}); // Map of id to boolean
  const [runningFlag, setRunningFlag] = useState(false);
  const [tryRunningStatus, setTryRunningStatus] = useState([]);
  const [sortOrder, setSortOrder] = useState('none'); // none | az | za
  const [selectedTab, setSelectedTab] = useState(Tabs.Applications); // all | favorites | recents

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const addOpen = Boolean(anchorElAdd);
  const handleOpenAdd = (e) => setAnchorElAdd(e.currentTarget);
  const handleCloseAdd = () => setAnchorElAdd(null);

  const [anchorElSort, setAnchorElSort] = useState(null);
  const sortOpen = Boolean(anchorElSort);
  const handleOpenSort = (e) => setAnchorElSort(e.currentTarget);
  const handleCloseSort = () => setAnchorElSort(null);

  const [openSetting, setOpenSetting] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const getItemTitle = (item) => item.title || item.description || '';
  const getItemImg = (item) => (item.logoPath ? 'https://admin.kloow.com/' + item.logoPath : DefaultAppImage);
  
  const getStatusForApp = (id) => {
    const s = appStatus?.[id];
    if (s) return s;
    const raw = serverHealth?.[id];
    if (raw === true) return "Operational";
    if (raw === false) return "Maintenance";
    return "Maintenance";
  };

  const statusColor = (status) => {
    if (!status) return "#E03E3E";
    const t = String(status).toLowerCase();
    if (t === "operational") return "#00C853"; // green
    if (t === "unstable") return "#FF9800"; // orange
    return "#E03E3E"; // maintenance red
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [serverSelection, setServerSelection] = useState({});
  const [serverHealth, setServerHealth] = useState({});
  const [appStatus, setAppStatus] = useState({}); // Map of id -> status string
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuAppId, setMenuAppId] = useState(null);

  const sidebarWidth = useMemo(() => (isMobile ? 60 : 240), [isMobile]);

  useEffect(() => {
    // initial health check
    const updateHealth = async () => {
      try {
        const healthStatuses = await checkHealth(serverSelection);
        if (healthStatuses) {
          setServerHealth(healthStatuses);
          // map healthStatuses values into readable state strings
          const mapped = Object.keys(healthStatuses).reduce((acc, id) => {
            const val = healthStatuses[id];
            let statusText = "Maintenance";
            if (val === true || String(val).toLowerCase() === "operational" || String(val).toLowerCase() === "up") {
              statusText = "Operational";
            } else if (String(val).toLowerCase() === "unstable" || String(val).toLowerCase() === "slow") {
              statusText = "Unstable";
            } else {
              statusText = "Maintenance";
            }
            acc[id] = statusText;
            return acc;
          }, {});
          setAppStatus(mapped);
        }
      } catch (err) {
        // ignore
      }
    };

    updateHealth();

    // poll every 60s to get near real-time updates from admin panel
    const interval = setInterval(updateHealth, 600000);
    return () => clearInterval(interval);
  }, [serverSelection]);

  useEffect(() => {
    checkHealth(serverSelection).then(healthStatuses => {
      if (healthStatuses) {
        setServerHealth(healthStatuses);
      }
    });
  }, [serverSelection]);

  useEffect(() => {
    const initialStatus = appList.reduce((acc, app) => {
      acc[app.id] = app.port;
      return acc;
    }, {});
    setRunningStatus(initialStatus);
  }, [appList]);

  // Hide the outer page scrollbar while Dashboard is mounted so only the
  // internal scroll (SimpleBar) is visible. Restore on unmount.
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow || '';
      document.body.style.overflow = prevBodyOverflow || '';
    };
  }, []);

  const run = async (id, url, proxyServer) => {
    try {
      setRunningFlag(true);
      setTryRunningStatus((prev) => [...prev, id]);
      const result = await runApp(id, url, proxyServer);
      if (!result.status) {
        errorMessage(result.message);
      } else {
        setLog(id);
        setRunningStatus((prev) => ({ ...prev, [id]: result.message }));
      }
      setTryRunningStatus((prev) => prev.filter((e) => e !== id));
      setRunningFlag(false);
    } catch (error) {
      setRunningFlag(false);
      errorMessage(`Failed to run the executable for id ${id}: ${error.message}`);
    }
  };

  const stop = async (id) => {
    try {
      setTryRunningStatus((prev) => [...prev, id]);
      const result = await stopApp(id);
      if (!result.status) {
        errorMessage(result.message);
      } else {
        setRunningStatus((prev) => ({ ...prev, [id]: 0 }));
      }
      setTryRunningStatus((prev) => prev.filter((e) => e !== id));
    } catch (error) {
      errorMessage(`Failed to stop the browser for id ${id}: ${error.message}`);
    }
  };

  const getSortedApps = () => {
    if (!Array.isArray(appList)) return [];
    if (selectedTab === Tabs.Recents) {
      return [...appList].filter((app) => !!app.lastAccessed).sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
    } else {
      if (sortOrder === 'none') return appList;
      const sorted = [...appList].sort((a, b) => {
        const at = (a.title || '').toLowerCase();
        const bt = (b.title || '').toLowerCase();
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      });
      return sortOrder === 'az' ? sorted : sorted.reverse();
    }
  };

  const pageTitle = useMemo(() => {
    switch (selectedTab) {
      case Tabs.Applications:
        return 'Application List';
      case Tabs.Favorites:
        return 'Favorites';
      case Tabs.Recents:
        return 'Recently Used';
      case Tabs["Screaming Frog"]:
        return "Screaming Frog";
      default:
        return 'Application List';
    }
  }, [selectedTab]);

  const pageDescription = useMemo(() => {
    switch (selectedTab) {
      case Tabs.Applications:
        return 'Pre-loaded, ready-to-use marketing tools for faster campaigns.';
      case Tabs.Favorites:
        return 'Your most-used applications for quick access.';
      case Tabs.Recents:
        return "Applications you've launched recently.";
      case Tabs["Screaming Frog"]:
        return "The Screaming Frog SEO Spider and Log File Analyser";
      default:
        return 'Pre-loaded, ready-to-use marketing tools for faster campaigns.';
    }
  }, [selectedTab]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          background: 'radial-gradient(30vw 30vw at 30vw 30vw, rgba(26, 66, 153, 1) 0%,  rgba(22, 23, 30, 1) 100%)'
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          background: 'radial-gradient(15vw 15vw at 70vw 15vw, rgba(78, 34, 41, 1) 0%,  rgba(22, 23, 30, 1) 100%)',
          opacity: 0.5
        }}
      />
      <Stack spacing={0} sx={{ width: '100%', zIndex: 2, maxWidth: '100%', mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ px: 3, height: 60, color: 'white' }}>
          <img src={LogoWithTitle} alt="logo" style={{ height: 24 }} />
          <OutlinedInput
            fullWidth
            size="small"
            value={searchPattern}
            onChange={(e) => setSearchPattern(e.target.value)}
            placeholder="Search applications..."
            startAdornment={
              <InputAdornment position="start">
                <img src={SearchIcon} alt="search_icon" style={{ width: 16, height: 16 }} />
              </InputAdornment>
            }
            sx={{
              color: 'white',
              background: '#252731',
              borderRadius: '8px',
              height: '34px',
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255,255,255,1)'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#343951'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#343951'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#343951'
              },
              width: isMobile ? 'calc(100% - 140px)' : '476px',
              maxWidth: '100%'
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              onClick={async () => {
                setLoading(true);
                await Promise.all(
                  appList.map(async (app) => {
                    if (runningStatus[app.id]) {
                      await stop(app.id);
                    }
                  })
                );
                getAppList().then((appList) => {
                  const initialStatus = appList.reduce((acc, app) => {
                    acc[app.id] = 0;
                    return acc;
                  }, {});
                  setRunningStatus(initialStatus);
                  setLoading(false);
                });
              }}
              sx={{ color: 'white', p: 0 }}
            >
              <img src={RefreshIcon} alt="refresh_icon" style={{ width: 34, height: 34 }} />
            </IconButton>
            {!isMobile && (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  aria-controls={menuOpen ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? 'true' : undefined}
                  sx={{ color: 'white', p: 0 }}
                >
                  <img src={ProfileIcon} alt="profile_icon" style={{ width: 34, height: 34 }} />
                </IconButton>
                <IconButton onClick={logout} sx={{ color: 'white', p: 0 }}>
                  <img src={LogoutIcon} alt="logout_icon" style={{ width: 34, height: 34 }} />
                </IconButton>
              </>
            )}
          </Stack>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: '#252834',
                  color: 'white',
                  border: 'solid 1px #343847',
                  borderRadius: '10px',
                  mt: 1,
                  width: 234
                }
              }
            }}
          >
            <Typography sx={{ color: 'white', px: 2, py: 1 }}>PROFILE SETTINGS</Typography>
            <MenuItem
              onClick={() => {
                setOpenSetting(true);
                handleMenuClose();
              }}
              sx={{ color: 'white', '&:hover': { backgroundColor: '#1976d2' } }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <img src={SettingsIcon} alt="settings_icon" style={{ width: 24, height: 24 }} />
                <Typography variant="body2">Account Settings</Typography>
              </Stack>
            </MenuItem>
            <MenuItem onClick={logout} sx={{ color: 'white', '&:hover': { backgroundColor: '#1976d2' } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <img src={LoginIcon} alt="login_icon" style={{ width: 24, height: 24 }} />
                <Typography variant="body2">Log Out</Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ px: 3, height: 50, color: 'white', bgcolor: '#252731' }}>
          <Typography sx={{ fontWeight: 500, color: 'white', fontSize: 16 }}>Favorites</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {appList
              ?.filter((app) => app?.isFavorite)
              .map((app, idx) => (
                <Box
                  key={`fav_${idx}`}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => run(app.id, app.initUrl, app.servers?.[0])}
                >
                  <img src={getItemImg(app)} alt="fav" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                </Box>
              ))}
            {appList?.filter((app) => !app?.isFavorite).length === 0 ? null : (
              <>
                <IconButton
                  size="small"
                  onClick={handleOpenAdd}
                  sx={{
                    color: 'white',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(51, 51, 51, 0.65)',
                    '&:hover': {
                      backgroundColor: 'rgba(51, 51, 51, 0.85)' // darker on hover
                    },
                    width: 30,
                    height: 30
                  }}
                >
                  {addOpen ? <CloseIcon sx={{ fontSize: 18 }} /> : <AddIcon sx={{ fontSize: 18 }} />}
                </IconButton>
                <Menu
                  anchorEl={anchorElAdd}
                  open={addOpen}
                  onClose={handleCloseAdd}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  slotProps={{
                    paper: {
                      sx: {
                        bgcolor: '#252834',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'solid 1px #343847',
                        mt: 1
                      }
                    }
                  }}
                >
                  <MenuItem sx={{ pointerEvents: 'none' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      ADD A FAVORITE
                    </Typography>
                  </MenuItem>
                  {appList
                    ?.filter((app) => !app?.isFavorite)
                    .map((app, idx) => (
                      <MenuItem
                        key={`add_${idx}`}
                        onClick={() => {
                          setFavorite(app?.id);
                          handleCloseAdd();
                        }}
                        sx={{ color: 'white', '&:hover': { backgroundColor: '#1976d2' } }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1
                          }}
                        >
                          <img
                            src={getItemImg(app)}
                            alt={getItemTitle(app)}
                            style={{
                              width: 24,
                              height: 24,
                              objectFit: 'contain'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {getItemTitle(app)}
                        </Typography>
                      </MenuItem>
                    ))}
                </Menu>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction={'row'}
        sx={{
          // height: '100vh',
          width: '100%',
          maxWidth: '100%',
          mx: 'auto',
          zIndex: 2
        }}
      >
        {isMobile ? (
            <Box
              sx={{
                width: sidebarWidth,
                transition: "width 0.25s ease",
                p: 1,
                overflow: 'hidden',
                pointerEvents: "auto",
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}
            >
              <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: 'white', background: 'rgba(255,255,255,0.04)', width: 44, height: 44 }}>
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Box>
        ) : (
          // Desktop fixed sidebar
          <Box sx={{ width: sidebarWidth, p: 2.5 }}>
            <List>
              {Object.keys(Tabs).map((key) => (
                <ListItem disablePadding key={key}>
                  <ListItemButton selected={selectedTab === Tabs[key]} onClick={() => setSelectedTab(Tabs[key])} sx={listItemButtonSx}>
                    <ListItemIcon sx={listItemIconSx}>
                      {key === 'Applications' && <Language />}
                      {key === 'Favorites' && <FavoriteBorder />}
                      {key === 'Recents' && <ScheduleIcon />}
                      {key === "Screaming Frog" && <img src={ScreamingFrogIcon} alt="frog" style={{ width: 24, height: 24 }} />}
                    </ListItemIcon>
                    <ListItemText primary={key} sx={listItemTextSx} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ width: `calc(100% - ${sidebarWidth}px)`, flexGrow: 1, p: 0 }}>
          {loading ? (
            <Loader />
          ) : (
            <Stack spacing={2.5} sx={{ width: '100%', minHeight: `calc(100vh - 110px)` }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={isMobile ? 'flex-start' : 'center'}
                justifyContent="space-between"
                sx={{ height: isMobile ? 'auto' : 60, width: '100%', px: 2.5, pt: 2.5 }}
              >
                <Stack sx={{ width: '100%' }}>
                  <Typography variant="h5" color="white" sx={{ fontWeight: 500, fontSize: 20, lineHeight: '24px' }}>
                    {pageTitle}
                  </Typography>
                  <Typography variant="body1" color="white" sx={{ fontSize: 14, lineHeight: '20px' }}>
                    {pageDescription}
                  </Typography>
                </Stack>
                {selectedTab === Tabs["Screaming Frog"] ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                  </Stack>
                ) : selectedTab !== Tabs.Recents && (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: isMobile ? 1 : 0 }}>
                    <Typography variant="body2" color="white">
                      Sort by:
                    </Typography>
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      spacing={1}
                      onClick={handleOpenSort}
                      sx={{
                        cursor: 'pointer',
                        height: 30,
                        background: '#252731',
                        borderRadius: '6px',
                        px: 1
                      }}
                    >
                      <Typography variant="body2" color="white">
                        {sortOrder === 'none' ? 'None' : sortOrder === 'az' ? 'A-Z' : 'Z-A'}
                      </Typography>
                      {sortOpen ? (
                        <ExpandLess sx={{ fontSize: 18, color: 'white' }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 18, color: 'white' }} />
                      )}
                    </Stack>
                    <Menu
                      anchorEl={anchorElSort}
                      open={sortOpen}
                      onClose={handleCloseSort}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            bgcolor: '#252834',
                            color: 'white',
                            borderRadius: '8px',
                            border: 'solid 1px #343847',
                            mt: 1
                          }
                        }
                      }}
                    >
                      {['none', 'az', 'za'].map((order) => (
                        <MenuItem
                          key={order}
                          onClick={() => {
                            setSortOrder(order);
                            handleCloseSort();
                          }}
                          sx={{
                            px: 1,
                            width: 154,
                            mx: 1,
                            borderRadius: '6px',
                            background: sortOrder === order ? '#3B4157!important' : 'inherit',
                            '&:hover': { background: '#1976d2!important' }
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
                            <Typography variant="body2" color="white">
                              {order === 'none' ? 'None' : order === 'az' ? 'Sorting A-Z' : 'Sorting Z-A'}
                            </Typography>
                            <Stack
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                width: 20,
                                height: 20,
                                background: '#EFEAFB',
                                borderRadius: '6px'
                              }}
                            >
                              {sortOrder === order && <Check sx={{ fontSize: 16, color: 'black' }} />}
                            </Stack>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Stack>
                )}
              </Stack>
              <SimpleBarScroll
                sx={{
                  maxHeight: `calc(100vh - 210px)`,
                  '& .simplebar-content': {
                    display: 'flex',
                    flexDirection: 'column'
                  },
                  px: 2.5
                }}
              >
              {selectedTab === Tabs["Screaming Frog"] ? (
                  <Stack sx={{color: 'white'}}>Screaming Frog support is offered exclusively through our application for the best possible experience.</Stack>
                ) : (
                <Grid container spacing={3}>
                  {getSortedApps()
                    .filter((app) => {
                      if (!searchPattern) return true;
                      const pattern = searchPattern.toLowerCase();
                      return (app.title || '').toLowerCase().includes(pattern) || (app.description || '').toLowerCase().includes(pattern);
                    })
                    .filter((app) => {
                      if (selectedTab === Tabs.Recents) {
                        return !!app.lastAccessed;
                      } else if (selectedTab === Tabs.Favorites) {
                        return app.isFavorite;
                      }
                      return true;
                    })
                    .map((app) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3, xxl: 2 }} key={`app_${app.id}`}>
                        <Stack
                          spacing={2}
                          sx={{
                            width: '100%',
                            bgcolor: '#2C3145',
                            color: 'white',
                            borderRadius: '20px',
                            p: 0.75,
                            objectFit: 'fill'
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              image={app.thumbPath !== '' ? 'https://admin.kloow.com' + app.thumbPath : LogoWithTitle}
                              alt="App"
                              sx={{
                                width: '100%',
                                height: 196,
                                objectFit: 'contain',
                                borderRadius: '16px'
                              }}
                            />
                            <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                              {/* <Box
                                sx={{ position: "absolute", top: 0, left: 0 }}
                              > */}
                              <IconButton
                                onClick={() => setFavorite(app?.id)}
                                sx={{
                                  backgroundColor: 'white',
                                  borderRadius: '8px',
                                  width: 28,
                                  height: 28,
                                  '&:hover': {
                                    backgroundColor: 'white'
                                  }
                                }}
                              >
                                {app.isFavorite ? (
                                  <FavoriteOutlinedIcon
                                    sx={{
                                      color: 'red',
                                      fontSize: 18
                                    }}
                                  />
                                ) : (
                                  <FavoriteOutlinedIcon
                                    sx={{
                                      color: '#aaa',
                                      fontSize: 18
                                    }}
                                  />
                                )}
                              </IconButton>
                            </Box>
                          </Box>
                          <Stack spacing={1.5} sx={{ p: 1.25 }}>
                            <Tooltip title={app.title} placement="bottom">
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  fontWeight: 'bold',
                                  fontSize: 20,
                                  lineHeight: '24px',
                                  width: 'inherit'
                                }}
                              >
                                {app.title}
                              </Typography>
                            </Tooltip>
                            <Tooltip title={app.description} placement="bottom">
                              <Typography
                                variant="body2"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: '#D9D9D9'
                                }}
                              >
                                {app.description}
                              </Typography>
                            </Tooltip>
                            <Box sx={{ height: 4 }}></Box>
                            {app.isAllowed ? (
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: statusColor(getStatusForApp(app.id)) }} />
                                      <Typography variant="caption" color="white">
                                        {getStatusForApp(app.id)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: runningStatus[app.id] !== 0 ? '50%' : '100%' }}>
                                    {runningStatus[app.id] ? (
                                      <Button
                                        disableElevation
                                        variant="contained"
                                        onClick={() => (stop(app.id))}
                                        disabled={tryRunningStatus.includes(app.id) || runningFlag}
                                        sx={{
                                          flex: 1,
                                          minHeight: 36,
                                          fontWeight: 'bold',
                                          borderRadius: '8px',
                                          backgroundColor: runningStatus[app.id] ? '#E03E3E' : '#3A71E1'
                                        }}
                                      >
                                        <>
                                          <PauseIcon sx={{ mr: 1 }} />
                                          STOP
                                        </>
                                      </Button>
                                    ) : (
                                      <>
                                        <Button
                                          fullWidth
                                          disableElevation
                                          variant="contained"
                                          onClick={() => run(app.id, app.initUrl, serverSelection[app.id] ?? app.servers?.[0])}
                                          disabled={tryRunningStatus.includes(app.id) || !serverHealth[app.id]}
                                          sx={{
                                            flex: 1,
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            backgroundColor: "#3A71E1",
                                          }}
                                        >
                                          <PlayArrowIcon sx={{ mr: 1 }} />
                                          RUN
                                        </Button>
                                        {app.servers && app.servers.length > 0 && (
                                          <>
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                setMenuAnchor(e.currentTarget);
                                                setMenuAppId(app.id);
                                              }}
                                              sx={{ ml: 1, color: 'white', background: '#1976d2', borderRadius: '8px', width: 44, height: 36, p: 0 }}
                                            >
                                              <ExpandMore sx={{ fontSize: 20 }} />
                                            </IconButton>
                                            <Menu
                                              anchorEl={menuAnchor}
                                              open={Boolean(menuAnchor) && menuAppId === app.id}
                                              onClose={() => {
                                                setMenuAnchor(null);
                                                setMenuAppId(null);
                                              }}
                                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                              slotProps={{
                                                paper: {
                                                  sx: {
                                                    bgcolor: '#252834',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    border: 'solid 1px #343847',
                                                    mt: 1
                                                  }
                                                }
                                              }}
                                            >
                                              {(app.servers || []).map((srv, idx) => {
                                                const label = `${app.title} - ${idx + 1}`;
                                                const sel = serverSelection[app.id];
                                                const isSelected = sel === srv || (sel && typeof sel !== 'string' && typeof srv !== 'string' && (sel.name === srv.name || sel.host === srv.host)) || (typeof sel === 'string' && sel === label);
                                                return (
                                                  <MenuItem
                                                    key={`srv_${app.id}_${idx}`}
                                                    onClick={() => {
                                                      setServerSelection((prev) => ({ ...prev, [app.id]: srv }));
                                                      setMenuAnchor(null);
                                                      setMenuAppId(null);
                                                    }}
                                                    sx={{ background: 'inherit', '&:hover': { backgroundColor: '#1976d2' } }}
                                                  >
                                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                                                      <Typography variant="body2" sx={{ color: 'white' }}>{label}</Typography>
                                                      {isSelected && <Check sx={{ fontSize: 16, color: 'white' }} />}
                                                    </Stack>
                                                  </MenuItem>
                                                );
                                              })}
                                            </Menu>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </Box>
                                </Box>
                                {runningStatus[app.id] !== 0 && (
                                  <Button
                                    disableElevation
                                    variant="contained"
                                    onClick={() => window.open(`https://www.kloow.com:${runningStatus[app.id]}`, '_blank')}
                                    color="primary"
                                    sx={{
                                      width: '50%',
                                      fontWeight: 'bold',
                                      borderRadius: '8px',
                                      backgroundColor: '#28A745'
                                    }}
                                    disabled={tryRunningStatus.includes(app.id) || runningFlag}
                                  >
                                    <AdsClickOutlinedIcon sx={{ mr: 1 }} />
                                    VIEW
                                  </Button>
                                )}
                              </Stack>
                            ) : (
                              <Button
                                fullWidth
                                disableElevation
                                variant="contained"
                                onClick={() => window.location.assign(`https://${app.domain}`, '_blank')}
                                disabled={runningFlag}
                                sx={{
                                  fontWeight: 'bold',
                                  borderRadius: '8px',
                                  backgroundColor: '#c74ad3'
                                }}
                              >
                                <UpgradeOutlinedIcon sx={{ mr: 1 }} />
                                UPGRADE
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Grid>
                    ))}
                  {getSortedApps()
                    .filter((app) => {
                      if (!searchPattern) return true;
                      const pattern = searchPattern.toLowerCase();
                      return (app.title || '').toLowerCase().includes(pattern) || (app.description || '').toLowerCase().includes(pattern);
                    })
                    .filter((app) => {
                      if (selectedTab === Tabs.Recents) {
                        return !!app.lastAccessed;
                      } else if (selectedTab === Tabs.Favorites) {
                        return app.isFavorite;
                      }
                      return true;
                    })?.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Typography color="white">Nothing to Show</Typography>
                    </Grid>
                  )}
                </Grid>
                )}
              </SimpleBarScroll>
            </Stack>
          )}
        </Box>
        <Modal open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <Box sx={{ position: 'fixed', inset: 0, zIndex: 2000, bgcolor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '100%', height: '100%', bgcolor: '#16171E', p: 3, overflow: 'auto' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <img src={LogoWithTitle} alt="logo" style={{ height: 28 }} />
                <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <List sx={{ mt: 3 }}>
                {Object.keys(Tabs).map((key) => (
                  <ListItem key={`mobtab_${key}`} disablePadding>
                    <ListItemButton onClick={() => { setSelectedTab(Tabs[key]); setMobileMenuOpen(false); }} sx={{ borderRadius: 2, mb: 1, background: selectedTab === Tabs[key] ? '#2C3145' : 'transparent' }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        {key === 'Applications' && <Language />}
                        {key === 'Favorites' && <FavoriteBorder />}
                        {key === 'Recents' && <ScheduleIcon />}
                        {key === "Screaming Frog" && <img src={ScreamingFrogIcon} alt="frog" style={{ width: 24, height: 24 }} />}
                      </ListItemIcon>
                      <ListItemText primary={key} sx={{ '& .MuiTypography-root': { color: 'white', fontSize: 18 } }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ borderColor: '#343951', my: 2 }} />
              <MenuItem onClick={() => { setOpenSetting(true); setMobileMenuOpen(false); }} sx={{ color: 'white' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={SettingsIcon} alt="settings_icon" style={{ width: 20, height: 20 }} />
                  <Typography>Account Settings</Typography>
                </Stack>
              </MenuItem>
              <MenuItem onClick={() => { logout(); setMobileMenuOpen(false); }} sx={{ color: 'white' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={LoginIcon} alt="login_icon" style={{ width: 20, height: 20 }} />
                  <Typography>Log Out</Typography>
                </Stack>
              </MenuItem>
            </Box>
          </Box>
        </Modal>
      </Stack>
      <Modal
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className="modal"
          sx={{
            width: '80vw',
            height: '80vh',
            backgroundColor: '#16171E',
            border: 'solid 1px #343951',
            borderRadius: '8px'
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" color="white">
              Account Settings
            </Typography>
            <Divider sx={{ borderColor: '#343951' }} />
            <Typography color="white" sx={{ fontSize: 16, lineHeight: '22px' }}>
              Overview
            </Typography>
            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography variant="body2" color="white">
                  E-mail
                </Typography>
                <Box
                  sx={{
                    borderRadius: '6px',
                    backgroundColor: '#252731',
                    border: 'solid 1px #343951',
                    py: 1,
                    px: 1,
                    width: 'max-content',
                    minWidth: '380px',
                    color: 'white'
                  }}
                >
                  {user.username || 'N/A'}
                </Box>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" color="white">
                  User role
                </Typography>
                <Box
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: '#3A71E1',
                    border: 'solid 1px #343951',
                    py: 0.5,
                    px: 2,
                    width: 'max-content',
                    color: 'white'
                  }}
                >
                  {user.role || 'N/A'}
                </Box>
              </Stack>
              <Typography variant="body2" color="white">
                Membership expires on {new Date(user.membership_expire_time).toLocaleDateString() || 'N/A'}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default Dashboard;
