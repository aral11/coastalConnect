import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, TrendingUp, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Coupon {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  discount_type: 'percentage' | 'amount';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  category: string;
  usage_limit?: number;
  usage_per_user: number;
  current_usage: number;
  is_active: boolean;
  is_popular: boolean;
  is_limited_time: boolean;
  gradient_class: string;
  text_color_class: string;
  icon_type: string;
  created_at: string;
}

interface CouponFormData {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  validFrom: string;
  validUntil: string;
  category: string;
  usageLimit: number;
  usagePerUser: number;
  isPopular: boolean;
  isLimitedTime: boolean;
  gradientClass: string;
  textColorClass: string;
  iconType: string;
}

const defaultFormData: CouponFormData = {
  code: '',
  title: '',
  subtitle: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  category: 'All Services',
  usageLimit: 100,
  usagePerUser: 1,
  isPopular: false,
  isLimitedTime: false,
  gradientClass: 'from-orange-400 to-red-500',
  textColorClass: 'text-white',
  iconType: '🎁'
};

const categories = [
  'All Services',
  'Homestays',
  'Restaurants',
  'Transport',
  'Creators',
  'Events'
];

const gradientOptions = [
  { value: 'from-orange-400 to-red-500', label: 'Orange to Red' },
  { value: 'from-blue-400 to-purple-500', label: 'Blue to Purple' },
  { value: 'from-green-400 to-teal-500', label: 'Green to Teal' },
  { value: 'from-yellow-400 to-orange-500', label: 'Yellow to Orange' },
  { value: 'from-purple-400 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-indigo-400 to-blue-500', label: 'Indigo to Blue' },
  { value: 'from-red-400 to-pink-500', label: 'Red to Pink' },
  { value: 'from-cyan-400 to-blue-500', label: 'Cyan to Blue' }
];

const iconOptions = ['🎁', '💯', '⏰', '⚡', '🔥', '💰', '⭐'];

export default function AdminCouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons/admin/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch coupons');
      }
      
      const data = await response.json();
      if (data.success) {
        setCoupons(data.data);
      } else {
        throw new Error(data.message || 'Failed to load coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError(error instanceof Error ? error.message : 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const response = await fetch('/api/coupons/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create coupon');
      }

      const result = await response.json();
      if (result.success) {
        setShowCreateDialog(false);
        setFormData(defaultFormData);
        fetchCoupons(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert(error instanceof Error ? error.message : 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCoupon = async (couponId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/coupons/admin/${couponId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle coupon');
      }

      fetchCoupons(); // Refresh the list
    } catch (error) {
      console.error('Error toggling coupon:', error);
      alert('Failed to toggle coupon status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Create a new coupon for customers to use on bookings
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="WELCOME100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Welcome Back!"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="FLAT ₹100 OFF"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="On orders above ₹499"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(value: 'percentage' | 'amount') => setFormData({...formData, discountType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minOrderAmount">Min Order Amount (₹)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({...formData, minOrderAmount: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDiscountAmount">Max Discount (₹)</Label>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({...formData, maxDiscountAmount: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimit">Total Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="usagePerUser">Usage Per User</Label>
                  <Input
                    id="usagePerUser"
                    type="number"
                    value={formData.usagePerUser}
                    onChange={(e) => setFormData({...formData, usagePerUser: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({...formData, isPopular: checked})}
                  />
                  <Label htmlFor="isPopular">Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isLimitedTime"
                    checked={formData.isLimitedTime}
                    onCheckedChange={(checked) => setFormData({...formData, isLimitedTime: checked})}
                  />
                  <Label htmlFor="isLimitedTime">Limited Time</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchCoupons}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className={`${!coupon.is_active ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{coupon.code}</CardTitle>
                  <p className="text-sm text-gray-600">{coupon.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {coupon.is_popular && <Badge variant="secondary">Popular</Badge>}
                  {coupon.is_limited_time && <Badge variant="outline">Limited</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">{coupon.subtitle}</p>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{coupon.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Usage:</span>
                    <p className="font-medium">
                      {coupon.current_usage}{coupon.usage_limit ? `/${coupon.usage_limit}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500">Valid: {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}</p>
                  {coupon.min_order_amount && (
                    <p className="text-gray-500">Min order: {formatCurrency(coupon.min_order_amount)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={coupon.is_active ? "default" : "secondary"}>
                    {coupon.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleCoupon(coupon.id, coupon.is_active)}
                    >
                      {coupon.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coupons.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No coupons found. Create your first coupon to get started!</p>
        </div>
      )}
    </div>
  );
}
