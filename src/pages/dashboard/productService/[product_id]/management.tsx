import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { iNewProductResponse } from 'src/@types/productService';
import { getProductById } from 'src/service/productService';
import DashboardLayout from '../../../../layouts/dashboard';
import ManagementEditForm from '../../../../sections/@dashboard/user/ManagementEditForm';


ManagementItem.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;


export default function ManagementItem() {
  const [product, setProduct] = useState<iNewProductResponse>();

  const {
    query: { product_id },
  } = useRouter();

  useEffect(() => {
    if (product_id && typeof product_id === 'string') {
      const productById = async () => {
        try {
          const productData = await getProductById(product_id);
          setProduct(productData);
        } catch {
          console.error('erro teste');
        }
      };
      productById();
    }
  }, [product_id]);



  return (
    <>
      {product && <ManagementEditForm isEdit currentProduct={product} />}
    </>
  );
}
