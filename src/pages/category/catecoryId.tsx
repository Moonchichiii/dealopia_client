// pages/category/[id].tsx
import { useCategoryDeals } from '@/hooks/useDeals';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: categoryDeals, isLoading } = useCategoryDeals(id);
  
  // Rest of component
}