#!/usr/bin/env node

/**
 * Cross-Browser Testing Automation Script
 * Helps validate the Expat Food Finder app across different browsers and viewports
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:19006',
  testRoutes: [
    '/',
    '/home', 
    '/component-demo',
    '/explore',
    '/profile'
  ],
  viewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 },
    { name: 'desktop-large', width: 1440, height: 900 }
  ],
  browsers: ['chrome', 'firefox', 'safari', 'edge'],
  outputDir: './docs/testing/screenshots'
};

// Ensure output directory exists
function ensureOutputDir() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
}

// Generate test report
function generateTestReport() {
  const timestamp = new Date().toISOString();
  
  const report = {
    testRun: {
      timestamp,
      baseUrl: config.baseUrl,
      routes: config.testRoutes,
      viewports: config.viewports,
      browsers: config.browsers
    },
    results: {
      chrome: generateBrowserTestResults('chrome'),
      firefox: generateBrowserTestResults('firefox'),
      safari: generateBrowserTestResults('safari'),
      edge: generateBrowserTestResults('edge')
    },
    summary: {
      totalTests: config.testRoutes.length * config.viewports.length * config.browsers.length,
      passedTests: 0,
      failedTests: 0,
      testCoverage: calculateTestCoverage()
    }
  };

  return report;
}

function generateBrowserTestResults(browser) {
  return {
    browser,
    status: 'pending',
    tests: config.testRoutes.map(route => ({
      route,
      viewports: config.viewports.map(viewport => ({
        name: viewport.name,
        width: viewport.width,
        height: viewport.height,
        status: 'pending',
        issues: [],
        screenshot: `${browser}-${viewport.name}-${route.replace('/', 'home')}.png`
      }))
    })),
    componentTests: generateComponentTests(),
    performanceMetrics: {
      lighthouse: null,
      loadTime: null,
      renderTime: null
    }
  };
}

function generateComponentTests() {
  return [
    {
      component: 'Button',
      variants: ['primary', 'secondary', 'text', 'destructive'],
      sizes: ['sm', 'md', 'lg'],
      states: ['normal', 'loading', 'disabled'],
      status: 'pending'
    },
    {
      component: 'Input', 
      variants: ['outlined', 'filled', 'default'],
      types: ['text', 'password', 'number'],
      states: ['normal', 'error', 'success', 'disabled'],
      status: 'pending'
    },
    {
      component: 'Typography',
      variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption'],
      features: ['alignment', 'color', 'weight'],
      status: 'pending'
    },
    {
      component: 'Card',
      variants: ['elevated', 'outlined', 'filled'],
      features: ['header', 'content', 'actions', 'image'],
      status: 'pending'
    },
    {
      component: 'Layout',
      components: ['Container', 'Row', 'Column'],
      features: ['responsive', 'breakpoints', 'gutters'],
      status: 'pending'
    }
  ];
}

function calculateTestCoverage() {
  return {
    components: 8,  // Total components to test
    browsers: config.browsers.length,
    viewports: config.viewports.length,
    routes: config.testRoutes.length,
    totalCombinations: 8 * config.browsers.length * config.viewports.length
  };
}

// Manual testing checklist generator
function generateTestingChecklist() {
  const checklist = [
    '# Manual Testing Checklist\n',
    '## Pre-Testing Setup',
    '- [ ] Expo development server is running (npm start --web)',
    '- [ ] App is accessible at http://localhost:19006',
    '- [ ] All target browsers are installed and updated',
    '- [ ] Developer tools are available for debugging\n',
    
    '## Chrome Desktop Testing',
    ...generateBrowserChecklist('Chrome'),
    
    '## Firefox Desktop Testing', 
    ...generateBrowserChecklist('Firefox'),
    
    '## Safari Desktop Testing',
    ...generateBrowserChecklist('Safari'),
    
    '## Edge Desktop Testing',
    ...generateBrowserChecklist('Edge'),
    
    '## Component-Specific Testing',
    ...generateComponentChecklist(),
    
    '## Performance Testing',
    ...generatePerformanceChecklist(),
    
    '## Accessibility Testing',
    ...generateAccessibilityChecklist()
  ];
  
  return checklist.join('\n');
}

function generateBrowserChecklist(browser) {
  const checks = [];
  
  config.testRoutes.forEach(route => {
    const routeName = route === '/' ? 'Landing Page' : route.substring(1);
    checks.push(`### ${routeName} (${route})`);
    
    config.viewports.forEach(viewport => {
      checks.push(`- [ ] **${viewport.name} (${viewport.width}x${viewport.height})**: Layout renders correctly`);
    });
    
    checks.push('- [ ] **Navigation**: All links and tabs work properly');
    checks.push('- [ ] **Interactions**: Buttons and forms respond correctly');
    checks.push('- [ ] **Styling**: Material Design components look correct');
    checks.push('- [ ] **Performance**: Page loads without noticeable delays\n');
  });
  
  return checks;
}

function generateComponentChecklist() {
  return [
    '### Button Component',
    '- [ ] All variants render with correct Material Design styling',
    '- [ ] Touch/click feedback works across all browsers',
    '- [ ] Loading states display spinners correctly',
    '- [ ] Disabled states show proper visual feedback',
    '- [ ] Icons display correctly in all positions\n',
    
    '### Input Component',
    '- [ ] All variants show proper Material Design styling',
    '- [ ] Floating labels animate correctly on focus',
    '- [ ] Error/success states display appropriate colors',
    '- [ ] Password toggle functionality works',
    '- [ ] Helper text displays correctly\n',
    
    '### Typography Component', 
    '- [ ] All heading variants display proper hierarchy',
    '- [ ] Body text is readable across all sizes',
    '- [ ] Color variants work with theme',
    '- [ ] Text alignment options function correctly',
    '- [ ] Responsive scaling works properly\n',
    
    '### Card Component',
    '- [ ] Elevation/shadows display correctly',
    '- [ ] Card content layouts properly',
    '- [ ] Interactive cards show touch feedback',
    '- [ ] Images display correctly within cards',
    '- [ ] Actions section works properly\n',
    
    '### Layout System',
    '- [ ] Container provides proper max-width constraints',
    '- [ ] Row creates proper horizontal layouts',
    '- [ ] Column responsive sizing works across breakpoints',
    '- [ ] Grid calculations are accurate',
    '- [ ] Gutters and spacing are consistent'
  ];
}

function generatePerformanceChecklist() {
  return [
    '### Lighthouse Metrics (Chrome)',
    '- [ ] Performance Score > 90',
    '- [ ] Accessibility Score > 90',
    '- [ ] Best Practices Score > 90',
    '- [ ] SEO Score > 80\n',
    
    '### Core Web Vitals',
    '- [ ] First Contentful Paint < 2 seconds',
    '- [ ] Largest Contentful Paint < 2.5 seconds', 
    '- [ ] Interaction to Next Paint < 200ms',
    '- [ ] Cumulative Layout Shift < 0.1\n',
    
    '### React Native Performance',
    '- [ ] Bundle size is reasonable for web deployment',
    '- [ ] No blocking renders during navigation',
    '- [ ] Animations run at 60fps',
    '- [ ] Memory usage remains stable'
  ];
}

function generateAccessibilityChecklist() {
  return [
    '### Screen Reader Testing',
    '- [ ] VoiceOver (Safari): Components announce correctly',
    '- [ ] Narrator (Edge): Windows screen reader support',
    '- [ ] NVDA: Third-party screen reader compatibility\n',
    
    '### Keyboard Navigation',
    '- [ ] Tab order follows logical sequence',
    '- [ ] Focus indicators are clearly visible',
    '- [ ] All interactive elements are keyboard accessible',
    '- [ ] Modal dialogs can be dismissed with Escape\n',
    
    '### Color Contrast',
    '- [ ] WCAG AA compliance (4.5:1 ratio) for all text',
    '- [ ] Interactive elements have sufficient contrast',
    '- [ ] Error states are clearly distinguishable',
    '- [ ] Focus indicators have high contrast'
  ];
}

// Testing instructions generator
function generateTestingInstructions() {
  return `
# Cross-Browser Testing Instructions

## Getting Started
1. Ensure the Expo development server is running:
   \`\`\`bash
   npm start --web
   \`\`\`

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

\`\`\`markdown
**Component**: [Component Name]
**Browser**: [Browser Name & Version]
**Viewport**: [Screen size]
**Issue**: [Description of problem]
**Expected**: [Expected behavior]
**Actual**: [Actual behavior]
**Severity**: [Critical/High/Medium/Low]
\`\`\`

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
`;
}

// Main execution
function main() {
  console.log('🧪 Cross-Browser Testing Automation Script');
  console.log('==========================================\n');
  
  // Ensure output directory exists
  ensureOutputDir();
  
  // Generate test report template
  const report = generateTestReport();
  fs.writeFileSync(
    path.join(config.outputDir, 'test-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('✅ Generated test report template: docs/testing/screenshots/test-report.json');
  
  // Generate testing checklist
  const checklist = generateTestingChecklist();
  fs.writeFileSync(
    path.join('./docs/testing', 'TestingChecklist.md'),
    checklist
  );
  console.log('✅ Generated testing checklist: docs/testing/TestingChecklist.md');
  
  // Generate testing instructions
  const instructions = generateTestingInstructions();
  fs.writeFileSync(
    path.join('./docs/testing', 'TestingInstructions.md'),
    instructions
  );
  console.log('✅ Generated testing instructions: docs/testing/TestingInstructions.md');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Start the Expo development server: npm start --web');
  console.log('2. Open browsers and navigate to: http://localhost:19006');
  console.log('3. Follow the testing checklist to validate all components');
  console.log('4. Document any issues in the testing results file');
  console.log('5. Update the test report with your findings\n');
  
  console.log('🎯 Testing Focus Areas:');
  console.log('- React Native Paper component consistency');
  console.log('- Responsive layout behavior across viewports');
  console.log('- Material Design 3 styling accuracy');
  console.log('- Touch/click interaction feedback');
  console.log('- Performance and accessibility compliance');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  config,
  generateTestReport,
  generateTestingChecklist,
  generateTestingInstructions
}; 