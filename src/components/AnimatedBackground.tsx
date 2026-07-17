"use client";

export default function AnimatedBackground() {
  return (
    <div className="bg-mesh print:hidden" aria-hidden>
      <div className="bg-mesh__orb bg-mesh__orb--1" />
      <div className="bg-mesh__orb bg-mesh__orb--2" />
      <div className="bg-mesh__orb bg-mesh__orb--3" />
      <div className="bg-mesh__orb bg-mesh__orb--4" />
    </div>
  );
}
