import { db } from '@/config/firebase';
import { MOCK_PRODUCTS } from '@/constants/mock';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';

// Product interface matching your current structure
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available?: boolean;
}

// Order interface matching your current structure
export interface FirebaseOrder {
  id?: string;
  orderId: string;
  items: any[];
  totalPrice: number;
  orderDate: Timestamp;
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  addressNotes: string;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered';
  userId?: string;
}

// Products Collection Functions
export const productsService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Add new product (admin function)
  async add(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product (admin function)
  async update(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (admin function)
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Clear all products (admin function)
  async clearAll(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('All products cleared successfully');
    } catch (error) {
      console.error('Error clearing products:', error);
      throw error;
    }
  }
};

// Orders Collection Functions
export const ordersService = {
  // Add new order
  async add(order: Omit<FirebaseOrder, 'id' | 'orderDate'>): Promise<string> {
    try {
      const orderData = {
        ...order,
        orderDate: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Get orders for a user (you can add userId parameter when you implement auth)
  async getUserOrders(userId?: string): Promise<FirebaseOrder[]> {
    try {
      let q;
      if (userId) {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('orderDate', 'desc')
        );
      } else {
        // For now, get all orders (you'll want to filter by user later)
        q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseOrder));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(orderId: string, status: FirebaseOrder['status']): Promise<void> {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Helper function to seed initial products using mock data
export const seedProducts = async (forceClear: boolean = false) => {
  try {
    // Check if products already exist
    const existingProducts = await productsService.getAll();
    console.log(`Found ${existingProducts.length} existing products`);
    
    if (forceClear || existingProducts.length > 0) {
      console.log('Clearing existing products...');
      await productsService.clearAll();
    }

    console.log('Seeding products from mock data...');
    console.log(`Mock products to seed: ${MOCK_PRODUCTS.length}`);
    
    // Convert mock products to Firebase format with proper image handling
    const productsToSeed = MOCK_PRODUCTS.map(mockProduct => {
      // Convert the require() to a string path that React Native can resolve
      let imageUri: string;
      
      // Map product names to asset paths
      const assetMap: { [key: string]: string } = {
        'Double Apple': 'double apple.png',
        'Grape & Mint': 'grape and mint.png', 
        'Lemon & Mint': 'lemon and mint.png',
        'Blueberry Passion': 'blueberry passion.png'
      };
      
      // Use the asset file name for the imageUrl
      const assetFileName = assetMap[mockProduct.name];
      if (assetFileName) {
        // Store the asset file name, which we'll resolve in the app
        imageUri = assetFileName;
      } else {
        imageUri = 'default.png'; // fallback
      }
      
      return {
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        imageUrl: imageUri, // Store the asset file name
        category: mockProduct.category,
        available: true
      };
    });

    console.log('Products to seed:', productsToSeed.map(p => `${p.name} -> ${p.imageUrl}`));

    for (const product of productsToSeed) {
      const productId = await productsService.add(product);
      console.log(`✅ Added product: ${product.name} with image: ${product.imageUrl} (ID: ${productId})`);
    }
    
    console.log(`🎉 All ${productsToSeed.length} products seeded successfully from mock data!`);
    
    // Verify seeding
    const newProducts = await productsService.getAll();
    console.log(`✅ Verification: ${newProducts.length} products now in database`);
    console.log('Product details:', newProducts.map(p => `${p.name} -> ${p.imageUrl}`));
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}; 