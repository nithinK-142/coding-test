import Grid from '@mui/material/Grid';
import type { ComponentProps, ReactNode } from 'react';

type BreakpointSize = number | 'auto';

type LegacyGridProps = Omit<ComponentProps<typeof Grid>, 'size'> & {
  item?: boolean;
  xs?: BreakpointSize;
  sm?: BreakpointSize;
  md?: BreakpointSize;
  lg?: BreakpointSize;
  xl?: BreakpointSize;
  children?: ReactNode;
};

const LegacyGrid = ({
  item,
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  ...props
}: LegacyGridProps) => {
  const size = { xs, sm, md, lg, xl };
  const hasSize = item || Object.values(size).some((value) => value !== undefined);

  return (
    <Grid {...props} size={hasSize ? size : undefined}>
      {children}
    </Grid>
  );
};

export default LegacyGrid;
