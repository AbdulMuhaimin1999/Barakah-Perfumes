import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function BackLink({ to = '/products', children = 'Back to perfumes' }) {
  return (
    <Link to={to} className="back-link">
      <HiArrowLeft className="h-4 w-4" aria-hidden />
      {children}
    </Link>
  );
}
