import { Box } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, type Location } from "react-router-dom";

interface PageFadeProps {
  children: (location: Location) => ReactNode;
}

export function PageFade ({ children }: PageFadeProps) {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.key !== displayedLocation.key) {
      const id = setTimeout(() => setVisible(false), 0);
      return () => clearTimeout(id);
    }
  }, [location, displayedLocation]);

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '100%',
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return;
        if (!visible) {
          setDisplayedLocation(location);
          setVisible(true);
        }
      }}
    >
      {children(displayedLocation)}
    </Box>
  );
}
