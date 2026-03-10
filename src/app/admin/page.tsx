import Link from 'next/link';

const items = [
  {
    title: 'Content',
    description: 'Управление текстовыми блоками всех страниц (включая Главную)',
    href: '/admin/content',
  },
  {
    title: 'Projects',
    description: 'Projects page content',
    href: '/admin/pages/projects',
  },
  {
    title: 'Film reserve',
    description: 'Feedback form and page content',
    href: '/admin/pages/film-reserve',
  },
  {
    title: 'Home Carousel',
    description: 'Управление слайдами на главной странице',
    href: '/admin/home-carousel',
  },
  {
    title: 'Awards',
    description: 'Менеджер наград и кинофестивалей',
    href: '/admin/awards',
  },
  {
    title: 'Партнеры',
    description: 'Управление логотипами и ссылками партнеров',
    href: '/admin/partners',
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
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-sm transition"
          >
            <div className="text-lg font-medium text-blue-600">{item.title}</div>
            <div className="text-sm text-gray-600">{item.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}