'use client';

import Link from 'next/link';

export default function SidebarLogoMinimized() {
  return (
    <div className="flex h-14 shrink-0 items-center justify-center border-b-2 px-2">
      <Link href="/admin" className="flex items-center justify-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/330px-Flag_of_Kenya.svg.png"
          alt="Kenya Flag"
          className="h-6 w-8 rounded-none object-cover"
        />
      </Link>
    </div>
  );
}
