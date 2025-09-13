# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

LimoFlex is a static luxury transportation website built with vanilla HTML, CSS, and JavaScript. The site showcases premium transportation services in the DMV area with a modern, responsive design and integrated Google Forms booking system.

## Project Structure

This is a simple static website with three main files:
- `index.html` - Main website markup with all sections (hero, services, about, gallery, testimonials, contact)
- `styles.css` - Complete styling with responsive design, animations, and modern CSS techniques
- `script.js` - Interactive features including mobile navigation, form handling, animations, and Google Forms integration
- `CNAME` - GitHub Pages domain configuration for limoflex.us

## Common Development Commands

### Local Development
```bash
# Serve the website locally using Python
python -m http.server 8000

# Or using Node.js http-server (if installed globally)
http-server

# Or using PHP (if available)
php -S localhost:8000
```

### Code Quality
```bash
# Format HTML with prettier (if configured)
prettier --write index.html

# Format CSS
prettier --write styles.css

# Format JavaScript
prettier --write script.js

# Validate HTML using w3c validator (if installed)
html5validator index.html
```

### Deployment
```bash
# Push to GitHub for automatic GitHub Pages deployment
git add .
git commit -m "Update website content"
git push origin main
```

## Architecture & Key Features

### Single-Page Application Structure
- **Navigation**: Fixed navbar with smooth scrolling to sections
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Interactive Elements**: Hover effects, modal gallery, form validation
- **Performance**: Lazy loading, intersection observers for animations

### CSS Architecture
- **Design System**: Consistent color palette (`#d4af37` gold theme, dark backgrounds)
- **Typography**: Playfair Display for headings, Inter for body text
- **Layout**: Flexbox and Grid for responsive sections
- **Animations**: CSS transitions, keyframe animations, scroll-triggered effects

### JavaScript Functionality
- **Mobile Navigation**: Hamburger menu toggle with smooth transitions
- **Smooth Scrolling**: Enhanced navigation between sections
- **Form Integration**: Google Forms submission with client-side validation
- **Visual Effects**: Scroll progress indicator, intersection observers, modal gallery
- **User Experience**: Notification system, loading animations, keyboard navigation

### Google Forms Integration
- Form action URL: `https://docs.google.com/forms/d/e/1FAIpQLScJwAqcycNnyegx5ClkOPSKs5zfqokt5hxfX5CZsIycl9Qt2g/formResponse`
- Field mappings defined in HTML form elements
- Client-side validation before submission
- Success notifications and form reset handling

## Development Guidelines

### Making Content Changes
- **Contact Information**: Update phone, email, and business details in both the contact section and footer
- **Services**: Modify service cards in the services section
- **Testimonials**: Update customer reviews in the testimonials section
- **Google Forms**: Form field names (entry.XXXXXX) must match the connected Google Form

### Styling Updates
- **Brand Colors**: Primary gold (#d4af37) is used throughout - update consistently
- **Responsive Design**: Test changes on mobile, tablet, and desktop viewports
- **Animations**: Maintain consistent timing (0.3s transitions, 0.6s animations)
- **Typography**: Preserve font hierarchy and line height ratios

### JavaScript Enhancements
- **Event Listeners**: Use modern addEventListener syntax
- **Performance**: Leverage existing intersection observers for scroll-based features
- **Form Validation**: Extend existing validation system for new form fields
- **Accessibility**: Maintain keyboard navigation and screen reader support

## File Organization

### HTML Structure
- Semantic HTML5 elements with proper heading hierarchy
- Sections: hero, services, about, values, gallery, testimonials, contact, footer
- External resources: Google Fonts, Font Awesome icons
- Embedded Google Forms with hidden iframe target

### CSS Organization
- Reset and base styles first
- Component-based organization (navbar, hero, services, etc.)
- Responsive breakpoints defined with media queries
- CSS custom properties could be added for better maintainability

### JavaScript Modules
- Event handlers organized by functionality
- Reusable functions for notifications and animations
- DOM manipulation using modern JavaScript methods
- Error handling in form submission and API calls

## Domain & Hosting

- **Custom Domain**: limoflex.us (configured via CNAME file)
- **Hosting**: GitHub Pages with automatic deployment
- **SSL**: Automatic HTTPS via GitHub Pages
- **CDN**: External resources loaded from reliable CDNs (Google Fonts, Font Awesome)

## Performance Considerations

- **Loading**: Page opacity animation provides smooth initial load
- **Images**: Currently using icon placeholders - real images should be optimized
- **Scripts**: All JavaScript is bundled in a single file - consider splitting for larger features
- **Caching**: Static files benefit from browser caching via GitHub Pages
