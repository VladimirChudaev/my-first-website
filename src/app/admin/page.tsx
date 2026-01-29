// app/admin/page.tsx

import Link from 'next/link';

const items = [
  {
    title: 'Content',
    description: 'Manage page blocks and structured content',
    href: '/admin/content',
  },
  {
    title: 'Media',
    description: 'Images, videos and files',
    href: '/admin/media',
  },
  {
    title: 'News',
    description: 'Create and edit news posts',
    href: '/admin/news',
  },
  {
    title: 'Home page',
    description: 'Main page blocks and order',
    href: '/admin/pages/home',
  },
  {
    title: 'Projects',
    description: 'Projects page content',
    href: '/admin/pages/projects',
  },
  {
    title: 'Film reserve',
    description: 'Feedback form and page content',
    href: '/admin/film-reserve',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border rounded-lg p-4 hover:bg-muted transition"
          >
            <div className="text-lg font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">
              {item.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
