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
import { DealWithDetails, ProductWithDetails } from "@/types";
import { Plus, Edit, TrendingDown, ExternalLink, Calendar } from "lucide-react";

interface DealFormData {
  title: string;
  description: string;
  productId: string;
  originalPrice: string;
  dealPrice: string;
  discountPercent: number;
  couponCode: string;
  affiliateLink: string;
  store: string;
  isActive: boolean;
  isFeatured: boolean;
  startDate: string;
  endDate: string;
}

export default function DealManager() {
  const [editingDeal, setEditingDeal] = useState<DealWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DealFormData>({
    title: "",
    description: "",
    productId: "",
    originalPrice: "",
    dealPrice: "",
    discountPercent: 0,
    couponCode: "",
    affiliateLink: "",
    store: "",
    isActive: true,
    isFeatured: false,
    startDate: "",
    endDate: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deals, isLoading } = useQuery<DealWithDetails[]>({
    queryKey: ["/api/deals"],
  });

  const { data: products } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: DealFormData) => {
      const submitData = {
        ...data,
        originalPrice: parseFloat(data.originalPrice),
        dealPrice: parseFloat(data.dealPrice),
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      };
      return apiRequest("POST", "/api/admin/deals", submitData);
    },
    onSuccess: () => {
      toast({
        title: "Deal created successfully",
        description: "The deal has been created and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
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
        title: "Failed to create deal",
        description: "Please check your data and try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DealFormData> }) => {
      const submitData = {
        ...data,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        dealPrice: data.dealPrice ? parseFloat(data.dealPrice) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      };
      return apiRequest("PUT", `/api/admin/deals/${id}`, submitData);
    },
    onSuccess: () => {
      toast({
        title: "Deal updated successfully",
        description: "The deal has been updated and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      resetForm();
      setIsDialogOpen(false);
      setEditingDeal(null);
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
        title: "Failed to update deal",
        description: "Please check your data and try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      productId: "",
      originalPrice: "",
      dealPrice: "",
      discountPercent: 0,
      couponCode: "",
      affiliateLink: "",
      store: "",
      isActive: true,
      isFeatured: false,
      startDate: "",
      endDate: "",
    });
  };

  const openEditDialog = (deal: DealWithDetails) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description || "",
      productId: deal.productId || "",
      originalPrice: deal.originalPrice,
      dealPrice: deal.dealPrice,
      discountPercent: deal.discountPercent,
      couponCode: deal.couponCode || "",
      affiliateLink: deal.affiliateLink,
      store: deal.store,
      isActive: deal.isActive,
      isFeatured: deal.isFeatured,
      startDate: deal.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : "",
      endDate: deal.endDate ? new Date(deal.endDate).toISOString().split('T')[0] : "",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingDeal(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const calculateDiscount = () => {
    const original = parseFloat(formData.originalPrice);
    const deal = parseFloat(formData.dealPrice);
    
    if (original && deal && original > deal) {
      const discount = Math.round(((original - deal) / original) * 100);
      setFormData({ ...formData, discountPercent: discount });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a deal title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.originalPrice || !formData.dealPrice) {
      toast({
        title: "Prices are required",
        description: "Please enter both original and deal prices.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.affiliateLink.trim()) {
      toast({
        title: "Affiliate link is required",
        description: "Please enter an affiliate link.",
        variant: "destructive",
      });
      return;
    }

    if (editingDeal) {
      updateMutation.mutate({ id: editingDeal.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusBadge = (isActive: boolean, isFeatured: boolean) => {
    if (!isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (isFeatured) return <Badge variant="default">Featured</Badge>;
    return <Badge variant="outline">Active</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Manage Deals</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDeal ? "Edit Deal" : "Create New Deal"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Deal Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Amazing deal on product X"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="store">Store *</Label>
                    <Input
                      id="store"
                      value={formData.store}
                      onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                      placeholder="Amazon, Kabum, etc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the deal"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="productId">Product</Label>
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Original Price (R$) *</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      onBlur={calculateDiscount}
                      placeholder="1299.99"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dealPrice">Deal Price (R$) *</Label>
                    <Input
                      id="dealPrice"
                      type="number"
                      step="0.01"
                      value={formData.dealPrice}
                      onChange={(e) => setFormData({ ...formData, dealPrice: e.target.value })}
                      onBlur={calculateDiscount}
                      placeholder="999.99"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountPercent">Discount %</Label>
                    <Input
                      id="discountPercent"
                      type="number"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                      placeholder="23"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="couponCode">Coupon Code</Label>
                    <Input
                      id="couponCode"
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                      placeholder="SAVE20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="affiliateLink">Affiliate Link *</Label>
                    <Input
                      id="affiliateLink"
                      value={formData.affiliateLink}
                      onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                      placeholder="https://affiliate-link.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
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
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
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
                    {editingDeal ? "Update Deal" : "Create Deal"}
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
        ) : deals && deals.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Deal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Store</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Discount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Clicks</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1">{deal.title}</div>
                        {deal.product && (
                          <div className="text-sm text-gray-500">{deal.product.name}</div>
                        )}
                        {deal.endDate && (
                          <div className="flex items-center text-xs text-red-600 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Ends {new Date(deal.endDate).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{deal.store}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">
                          R$ {parseFloat(deal.dealPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-gray-500 line-through">
                          R$ {parseFloat(deal.originalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="font-medium text-orange-600">
                          {deal.discountPercent}% OFF
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(deal.isActive, deal.isFeatured)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        {deal.clickCount} clicks
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(deal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(deal.affiliateLink, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
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
            <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No deals found. Create your first deal to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
