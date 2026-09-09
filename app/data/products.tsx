import AsyncStorage from "@react-native-async-storage/async-storage";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: string;
  discount?: string;
  sizes: string[];
  image: string | { uri: string };
};

const saveViewedProduct = async (product: Product) => {
  const storedViewed = await AsyncStorage.getItem("recentlyViewed");
  let viewed: Product[] = storedViewed ? JSON.parse(storedViewed) : [];

  // Remove duplicates
  viewed = viewed.filter(p => p.id !== product.id);

  // Add product at the top
  viewed.unshift(product);

  // Keep only 20 items
  if (viewed.length > 20) viewed.pop();

  await AsyncStorage.setItem("recentlyViewed", JSON.stringify(viewed));
};

export const products = [
  {
    id: 1,
    name: "Summer Dress",
    brand: "ONLY",
    price: "1299",
    discount: "50% OFF",
    sizes: ["S", "M", "L", "XL"],
    image: {
      uri: "https://th.bing.com/th/id/OIP.m0ILJn17bBKGJ2KWtf9azAHaHa?w=194&h=194&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
    },
  },

  {
    id: 2,
    name: "Classic Sneakers",
    brand: "Nike",
    price: "3499",
    discount: "30% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Womens Jean",
    brand: "DressBerry",
    price: "1599",
    discount: "25% OFF",
    sizes: ["One Size"],
    image:
      "https://th.bing.com/th/id/OIP.VzHXDecYdTo15bjlC1GRrAHaKA?w=193&h=260&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
  },
  {
    id: 4,
    name: "Men Jeans",
    brand: "Levis",
    price: "1999",
    discount: "30% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://media.istockphoto.com/id/1132154377/photo/jeans.webp?b=1&s=170667a&w=0&k=20&c=tZASI7kn4G8LG-XQnu4i4yxDy_Ix-3G-SKUzWV9qa-w=",
  },
  {
    id: 5,
    name: "Kurti",
    brand: "Anouk",
    price: "899",
    discount: "15% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1760287363750-1c888c75578f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGt1cnRpfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
  },
  {
    id: 6,
    name: "Sneakers",
    brand: "Adidas",
    price: "2499",
    discount: "20% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://th.bing.com/th/id/OIP.b_9hj8vi9AJeqLysj2UJXgHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
  },
  {
    id: 7,
    name: "Kids Jacket",
    brand: "U.S. Polo Kids",
    price: "1299",
    discount: "10% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://img.freepik.com/premium-photo/kids-jacket_1059430-73415.jpg",
  },
  {
    id: 8,
    name: "Perfume",
    brand: "Calvin Klein",
    price: "699",
    discount: "5% OFF",
   sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1615160460524-432433ba1b8f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlcmZ1bWUlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 9,
    name: "Saree",
    brand: "Sangria",
    price: "2999",
    discount: "35% OFF",
    sizes: ["One Size"],
    image:
      "https://media.istockphoto.com/id/1402583520/photo/closeup-view-of-stacked-colours-saris-or-sarees-in-display-of-indian-retail-shop-textile-shop.webp?b=1&s=170667a&w=0&k=20&c=KI123lKpRC5bEoZ0et3SO3SfUrOaFPHPF92Wdqnz768=",
  },
  {
    id: 10,
    name: "Formal Shirt",
    brand: "Arrow",
    price: "1499",
    discount: "20% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://plus.unsplash.com/premium_photo-1723925110801-110c00d392a3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9ybWFsJTIwc2hpcnRzfGVufDB8fDB8fHww",
  },
  {
    id: 11,
    name: "Kids Shorts",
    brand: "H&M Kids",
    price: "499",
    discount: "10% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://i5.walmartimages.com/seo/Reduce-Herrnalise-Toddler-Boys-Formal-Suit-Shorts-Dress-Pants-Baby-Clothes-Solid-Color-School-Uniform-Suit-Kids-Fashion-Cute-Casual-Shorts-Navy-A_73af338d-4958-4302-a21b-ac8754f806c9.166f4df07395060c4255185474093a98.jpeg",
  },
  {
    id: 12,
    name: "Lipstick",
    brand: "Maybelline",
    price: "₹399",
    discount: "15% OFF",
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1542452255191-c85a98f2c5d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGxpcHN0aWNrfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
  },
  {
    id: 13,
    name: "Sandals",
    brand: "Catwalk",
    price: "1199",
    discount: "20% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1595970487296-8818e128ac4b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbmRhbHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 14,
    name: "Watch",
    brand: "Fossil",
    price: "3499",
    discount: "25% OFF",
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1619134778706-7015533a6150?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdhdGNoZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 15,
    name: "Backpack",
    brand: "Puma Kids",
    price: "799",
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1589966781848-056f1d039519?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 16,
    name: "Face Cream",
    brand: "Nivea",
    price: "599",
    discount: "5% OFF",
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1591134608223-67005960e763?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjaWFsJTIwY3JlYW18ZW58MHx8MHx8fDA%3Dp",
  },
  {
    id: 17,
    name: "Women Top",
    brand: "Forever 21",
    price: "699",
    discount: "15% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://plus.unsplash.com/premium_photo-1682095661711-f5d67d0e75a9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFzaGlvbiUyMHdvbWFufGVufDB8fDB8fHww ",
  },
  {
    id: 18,
    name: "Track Pants",
    brand: "Adidas",
    price: "999",
    discount: "20% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "http://www.clothingindia.co/cdn/shop/collections/FN07_d13bb78f-b002-4aa9-a852-c4c586c14c41.jpg?v=1750339858",
  },
  {
    id: 19,
    name: "Women Kurti",
    brand: "Biba",
    price: "1299",
    discount: "25% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1741847639057-b51a25d42892?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGt1cnRpfGVufDB8fDB8fHww",
  },
  {
    id: 20,
    name: "Men Hoodie",
    brand: "Roadster",
    price: "1799",
    discount: "30% OFF",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvb2RpZXN8ZW58MHx8MHx8fDA%3D",
  },
];