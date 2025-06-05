
# Cross-Browser Testing Instructions

## Getting Started
1. Ensure the Expo development server is running:
   ```bash
   npm start --web
   ```

2. Open each browser and navigate to: http://localhost:19006

3. Use browser developer tools to test different viewport sizes:
   - Chrome: DevTools > Device Toolbar (Ctrl+Shift+M)
   - Firefox: Developer Tools > Responsive Design Mode (Ctrl+Shift+M)
   - Safari: Develop > Enter Responsive Design Mode
   - Edge: DevTools > Device Emulation (Ctrl+Shift+M)

## Testing Workflow
1. **Landing Page Testing**: Test responsive layout and navigation
2. **Home Screen Testing**: Test product grid and search functionality  
3. **Component Demo Testing**: Validate all component variants
4. **Cross-Browser Consistency**: Compare visual appearance
5. **Performance Testing**: Run Lighthouse audits
6. **Accessibility Testing**: Test with screen readers

## Viewport Testing Sizes
- **Mobile**: 375x667 (iPhone 8)
- **Tablet**: 768x1024 (iPad)  
- **Desktop**: 1200x800 (Standard desktop)
- **Large Desktop**: 1440x900 (MacBook Pro)

## Issue Reporting
Document any issues found using this template:

```markdown
**Component**: [Component Name]
**Browser**: [Browser Name & Version]
**Viewport**: [Screen size]
**Issue**: [Description of problem]
**Expected**: [Expected behavior]
**Actual**: [Actual behavior]
**Severity**: [Critical/High/Medium/Low]
```

## Performance Targets
- Lighthouse Performance Score: > 90
- First Contentful Paint: < 2 seconds
- Largest Contentful Paint: < 2.5 seconds
- Interaction to Next Paint: < 200ms
- Cumulative Layout Shift: < 0.1

## Success Criteria
- ✅ All components render correctly across browsers
- ✅ Responsive layout works at all breakpoints
- ✅ Material Design styling is consistent
- ✅ Performance meets target metrics
- ✅ Accessibility compliance verified
- ✅ No critical or high severity issues
