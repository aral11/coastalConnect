/**
 * Media Upload Gallery Component
 * Handles Haldi, Roce, Wedding, and other gallery uploads via Supabase Storage
 * Supports JPG, PNG, GIF, WebP, BMP up to 200MB each
 */

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase, trackEvent } from "@/lib/supabase";
import {
  Upload,
  X,
  Image as ImageIcon,
  Camera,
  Heart,
  Sparkles,
  Crown,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Share2,
  Trash2,
} from "lucide-react";

// Upload categories with beautiful icons and descriptions
const UPLOAD_CATEGORIES = [
  {
    id: "haldi",
    name: "Haldi Ceremony",
    description: "Pre-wedding turmeric ceremony photos",
    icon: Sparkles,
    color: "from-yellow-400 to-orange-500",
    bucket: "haldi-gallery",
  },
  {
    id: "roce",
    name: "Roce Ceremony", 
    description: "Traditional Mangalorean pre-wedding ritual",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bucket: "roce-gallery",
  },
  {
    id: "wedding",
    name: "Wedding",
    description: "Wedding ceremony and celebration photos",
    icon: Crown,
    color: "from-purple-400 to-pink-500",
    bucket: "wedding-gallery",
  },
  {
    id: "engagement",
    name: "Engagement",
    description: "Engagement ceremony photos",
    icon: Heart,
    color: "from-blue-400 to-purple-500",
    bucket: "engagement-gallery",
  },
  {
    id: "reception",
    name: "Reception",
    description: "Wedding reception and party photos",
    icon: Crown,
    color: "from-green-400 to-blue-500",
    bucket: "reception-gallery",
  },
];

// Supported file types and max size
const SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const MAX_FILES_PER_UPLOAD = 50;

interface MediaFile {
  id?: string;
  file: File;
  preview: string;
  category: string;
  title: string;
  description: string;
  uploadProgress: number;
  uploaded: boolean;
  error?: string;
  supabaseUrl?: string;
}

interface MediaUploadGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onUploadComplete?: (files: MediaFile[]) => void;
}

export default function MediaUploadGallery({
  isOpen,
  onClose,
  initialCategory = "wedding",
  onUploadComplete,
}: MediaUploadGalleryProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    photographer: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
  });

  // Event details for the gallery
  const handleEventDetailChange = (field: string, value: string) => {
    setEventDetails(prev => ({ ...prev, [field]: value }));
  };

  // File selection and validation
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: MediaFile[] = [];
    const errors: string[] = [];

    // Check total file count
    if (files.length + selectedFiles.length > MAX_FILES_PER_UPLOAD) {
      errors.push(`Maximum ${MAX_FILES_PER_UPLOAD} files allowed per upload`);
    }

    Array.from(selectedFiles).forEach((file, index) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 200MB limit`);
        return;
      }

      // Check file format
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
        errors.push(`${file.name}: Unsupported format. Use JPG, PNG, GIF, WebP, or BMP`);
        return;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        file,
        preview,
        category: selectedCategory,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: "",
        uploadProgress: 0,
        uploaded: false,
      });
    });

    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, [files.length, selectedCategory]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Update file metadata
  const updateFileMetadata = (index: number, field: 'title' | 'description', value: string) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index][field] = value;
      return newFiles;
    });
  };

  // Upload files to Supabase Storage
  const uploadFiles = async () => {
    if (!user) {
      alert('Please log in to upload files');
      return;
    }

    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    if (!eventDetails.eventName.trim()) {
      alert('Please enter event name');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const categoryConfig = UPLOAD_CATEGORIES.find(cat => cat.id === selectedCategory);
      const bucketName = categoryConfig?.bucket || 'general-gallery';

      // Create gallery record first
      const { data: gallery, error: galleryError } = await supabase
        .from('media_galleries')
        .insert([
          {
            user_id: user.id,
            category: selectedCategory,
            event_name: eventDetails.eventName,
            event_date: eventDetails.eventDate || null,
            location: eventDetails.location || null,
            photographer: eventDetails.photographer || null,
            contact_email: eventDetails.contactEmail || null,
            contact_phone: eventDetails.contactPhone || null,
            description: eventDetails.description || null,
            total_files: files.length,
            status: 'uploading',
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (galleryError) {
        throw new Error(galleryError.message);
      }

      // Upload files one by one with progress tracking
      const uploadedFiles: MediaFile[] = [];
      let completedUploads = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.file.name.split('.').pop();
        const fileName = `${gallery.id}/${Date.now()}-${i}-${file.title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;

        try {
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

          // Create media record
          const { data: mediaRecord, error: mediaError } = await supabase
            .from('media_files')
            .insert([
              {
                gallery_id: gallery.id,
                user_id: user.id,
                category: selectedCategory,
                title: file.title,
                description: file.description,
                file_name: fileName,
                file_size: file.file.size,
                file_type: file.file.type,
                storage_path: uploadData.path,
                public_url: publicUrl,
                upload_status: 'completed',
                created_at: new Date().toISOString(),
              }
            ])
            .select()
            .single();

          if (mediaError) {
            console.warn('Failed to create media record:', mediaError);
          }

          // Update file status
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i] = {
              ...newFiles[i],
              uploaded: true,
              uploadProgress: 100,
              supabaseUrl: publicUrl,
              id: mediaRecord?.id,
            };
            return newFiles;
          });

          uploadedFiles.push({
            ...file,
            uploaded: true,
            uploadProgress: 100,
            supabaseUrl: publicUrl,
            id: mediaRecord?.id,
          });

          completedUploads++;
          setUploadProgress((completedUploads / files.length) * 100);

        } catch (error: any) {
          console.error(`Failed to upload ${file.file.name}:`, error);
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i] = {
              ...newFiles[i],
              error: error.message,
              uploadProgress: 0,
            };
            return newFiles;
          });
        }
      }

      // Update gallery status
      await supabase
        .from('media_galleries')
        .update({
          status: 'completed',
          uploaded_files: completedUploads,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gallery.id);

      // Track upload event
      await trackEvent('media_gallery_uploaded', {
        gallery_id: gallery.id,
        category: selectedCategory,
        user_id: user.id,
        files_count: completedUploads,
        total_size: files.reduce((sum, f) => sum + f.file.size, 0),
      });

      alert(`Successfully uploaded ${completedUploads} of ${files.length} files!`);

      if (onUploadComplete) {
        onUploadComplete(uploadedFiles);
      }

      // Reset form after successful upload
      if (completedUploads === files.length) {
        setFiles([]);
        setEventDetails({
          eventName: "",
          eventDate: "",
          location: "",
          photographer: "",
          contactEmail: "",
          contactPhone: "",
          description: "",
        });
      }

    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const selectedCategoryConfig = UPLOAD_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-orange-600" />
            <span>Upload Media Gallery</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Event Category</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {UPLOAD_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white mx-auto mb-2`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-sm text-center">{category.name}</h3>
                    <p className="text-xs text-gray-600 text-center mt-1">{category.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    placeholder={`e.g., "Priya's ${selectedCategoryConfig?.name}"`}
                    value={eventDetails.eventName}
                    onChange={(e) => handleEventDetailChange('eventName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDetails.eventDate}
                    onChange={(e) => handleEventDetailChange('eventDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Udupi, Manipal"
                    value={eventDetails.location}
                    onChange={(e) => handleEventDetailChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="photographer">Photographer/Studio</Label>
                  <Input
                    id="photographer"
                    placeholder="Photographer or studio name"
                    value={eventDetails.photographer}
                    onChange={(e) => handleEventDetailChange('photographer', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Contact email"
                    value={eventDetails.contactEmail}
                    onChange={(e) => handleEventDetailChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="Contact phone number"
                    value={eventDetails.contactPhone}
                    onChange={(e) => handleEventDetailChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the event..."
                  value={eventDetails.description}
                  onChange={(e) => handleEventDetailChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Photos</CardTitle>
              <p className="text-sm text-gray-600">
                Supported formats: JPG, PNG, GIF, WebP, BMP • Max size: 200MB per file • Max files: {MAX_FILES_PER_UPLOAD}
              </p>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-600">
                  Select multiple files to upload to your {selectedCategoryConfig?.name.toLowerCase()} gallery
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Files ({files.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <img
                        src={file.preview}
                        alt={file.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Photo title"
                          value={file.title}
                          onChange={(e) => updateFileMetadata(index, 'title', e.target.value)}
                          disabled={file.uploaded}
                        />
                        <Input
                          placeholder="Photo description (optional)"
                          value={file.description}
                          onChange={(e) => updateFileMetadata(index, 'description', e.target.value)}
                          disabled={file.uploaded}
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                          {file.uploaded && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Uploaded
                            </Badge>
                          )}
                          {file.error && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </div>
                        {file.uploadProgress > 0 && file.uploadProgress < 100 && (
                          <Progress value={file.uploadProgress} className="w-full" />
                        )}
                        {file.error && (
                          <p className="text-sm text-red-600">{file.error}</p>
                        )}
                      </div>
                      {!file.uploaded && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading files...</span>
                    <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={files.length === 0 || isUploading || !eventDetails.eventName.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.length} File{files.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
