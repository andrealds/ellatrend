import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ProductWithDetails, CategoryWithDetails } from "@/types";
import { Plus, Edit, Star, Package } from "lucide-react";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  model: string;
  sku: string;
  images: string[];
  specifications: any;
  currentPrice: string;
  originalPrice: string;
  affiliateLinks: any;
  isActive: boolean;
  featured: boolean;
  rating: string;
  availabilityStatus: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
}

export default function ProductManager() {
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [affiliateLinkInput, setAffiliateLinkInput] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    model: "",
    sku: "",
    images: [],
    specifications: {},
    currentPrice: "",
    originalPrice: "",
    affiliateLinks: {},
    isActive: true,
    featured: false,
    rating: "",
    availabilityStatus: "AVAILABLE",
    brandId: "",
    categoryId: "",
    subcategoryId: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<CategoryWithDetails[]>({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const submitData = {
        ...data,
        currentPrice: data.currentPrice ? parseFloat(data.currentPrice) : null,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        rating: data.rating ? parseFloat(data.rating) : null,
      };
      return apiRequest("POST", "/api/admin/products", submitData);
    },
    onSuccess: () => {
      toast({
        title: "Product created successfully",
        description: "The product has been created and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to create product",
        description: "Please check your data and try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      const submitData = {
        ...data,
        currentPrice: data.currentPrice ? parseFloat(data.currentPrice) : null,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        rating: data.rating ? parseFloat(data.rating) : null,
      };
      return apiRequest("PUT", `/api/admin/products/${id}`, submitData);
    },
    onSuccess: () => {
      toast({
        title: "Product updated successfully",
        description: "The product has been updated and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      setIsDialogOpen(false);
      setEditingProduct(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to update product",
        description: "Please check your data and try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      model: "",
      sku: "",
      images: [],
      specifications: {},
      currentPrice: "",
      originalPrice: "",
      affiliateLinks: {},
      isActive: true,
      featured: false,
      rating: "",
      availabilityStatus: "AVAILABLE",
      brandId: "",
      categoryId: "",
      subcategoryId: "",
    });
    setImageInput("");
    setAffiliateLinkInput("");
  };

  const openEditDialog = (product: ProductWithDetails) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      model: product.model || "",
      sku: product.sku || "",
      images: Array.isArray(product.images) ? product.images : [],
      specifications: product.specifications || {},
      currentPrice: product.currentPrice || "",
      originalPrice: product.originalPrice || "",
      affiliateLinks: product.affiliateLinks || {},
      isActive: product.isActive,
      featured: product.featured,
      rating: product.rating || "",
      availabilityStatus: product.availabilityStatus,
      brandId: product.brandId || "",
      categoryId: product.categoryId || "",
      subcategoryId: product.subcategoryId || "",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addAffiliateLink = () => {
    if (affiliateLinkInput.trim()) {
      try {
        const { store, url } = JSON.parse(affiliateLinkInput);
        setFormData({
          ...formData,
          affiliateLinks: {
            ...formData.affiliateLinks,
            [store]: url,
          },
        });
        setAffiliateLinkInput("");
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Please enter valid JSON format: {\"store\": \"url\"}",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a product name.",
        variant: "destructive",
      });
      return;
    }

    // Generate slug from name if not provided
    const slug = formData.slug || formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const dataToSubmit = { ...formData, slug };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const getAvailabilityBadge = (status: string) => {
    const variants = {
      AVAILABLE: "default",
      OUT_OF_STOCK: "destructive",
      DISCONTINUED: "secondary",
      PRE_ORDER: "outline",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Manage Products</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Create New Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="product-slug (auto-generated if empty)"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Product model"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="Stock keeping unit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currentPrice">Current Price (R$)</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      step="0.01"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                      placeholder="999.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (R$)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="1299.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availabilityStatus">Availability</Label>
                    <Select value={formData.availabilityStatus} onValueChange={(value) => setFormData({ ...formData, availabilityStatus: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                        <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                        <SelectItem value="PRE_ORDER">Pre Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Product Images</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Image URL"
                    />
                    <Button type="button" onClick={addImage}>Add</Button>
                  </div>
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm truncate">{image}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Affiliate Links</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={affiliateLinkInput}
                      onChange={(e) => setAffiliateLinkInput(e.target.value)}
                      placeholder='{"store": "url"}'
                    />
                    <Button type="button" onClick={addAffiliateLink}>Add</Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.affiliateLinks).map(([store, url]) => (
                      <div key={store} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">
                          <strong>{store}:</strong> {url as string}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : null}
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.model}</div>
                          {product.featured && (
                            <Badge variant="secondary" className="mt-1">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.currentPrice && (
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            R$ {parseFloat(product.currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          {product.originalPrice && product.originalPrice !== product.currentPrice && (
                            <div className="text-gray-500 line-through">
                              R$ {parseFloat(product.originalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getAvailabilityBadge(product.availabilityStatus)}
                    </td>
                    <td className="px-4 py-3">
                      {product.rating && (
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          {parseFloat(product.rating).toFixed(1)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found. Create your first product to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
