import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <div className="navigation">
      <Link to="/">Portfolio</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/contact">Contact</Link>
    </div>
  );
}