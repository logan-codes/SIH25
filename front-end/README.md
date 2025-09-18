# Authenticity Validator Front-End

This is the React front-end for the Authenticity Validator project. It provides a user interface for certificate verification, issuance, and admin management.

## Features

- Certificate verification and issuance
- Admin dashboard and login
- About, Contact, and Home pages
- Responsive navigation and footer
- Smooth scrolling and authentication helpers

## Project Structure

```
src/
  assets/           # Static assets (images, SVGs)
  components/       # Reusable UI components (Navbar, Footer, etc.)
    lib/            # Utility components (auth, scrollToTop)
  pages/            # Page components (Home, About, Admin, etc.)
    Admin/          # Admin-specific pages
  index.css         # Global styles (Tailwind or custom)
  main.jsx          # App entry point
public/             # Static files
index.html          # Main HTML template
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Build for production:**
   ```sh
   npm run build
   ```

4. **Preview production build:**
   ```sh
   npm run preview
   ```

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (if used)
- [ESLint](https://eslint.org/)

## Notes

- Update API endpoints in the code to match your backend server.
- For authentication logic, see `src/components/lib/auth.jsx`.
- For scroll helpers, see `src/components/lib/scrollToTop.jsx`.

---