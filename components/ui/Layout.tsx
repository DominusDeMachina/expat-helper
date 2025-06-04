/**
 * Layout components for responsive grid system
 * Export all layout-related components and utilities
 */

export { Column } from './Column';
export { Container } from './Container';
export { Row } from './Row';

// Re-export responsive hook and utilities
export { useResponsive } from '@/hooks/useResponsive';
export type { UseResponsiveReturn } from '@/hooks/useResponsive';

// Re-export breakpoint constants and types
export {
    BREAKPOINTS,
    GRID,
    SPACING, getContainerMaxWidth,
    getContainerPadding, getCurrentBreakpoint, isBreakpointBetween, isBreakpointDown, isBreakpointUp
} from '@/constants/Breakpoints';

export type {
    Breakpoint,
    SpacingSize
} from '@/constants/Breakpoints';
