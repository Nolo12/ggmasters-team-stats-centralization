
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDatabase } from "@/hooks/useDatabase";
import { Upload, Image } from "lucide-react";

const TeamBrandingManager = () => {
  const { teamBranding, uploadTeamLogo, loading } = useDatabase();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      await uploadTeamLogo(file);
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Team Logo Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Logo Display */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {teamBranding?.logo_url ? (
                <img 
                  src={teamBranding.logo_url} 
                  alt="Team Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Image className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No logo uploaded</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">{teamBranding?.team_name || 'GG Masters FC'}</h3>
              <p className="text-gray-600">Current team logo</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="border-t pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Logo
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Button disabled={uploading} variant="outline">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Max size: 2MB
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Logo Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Recommended size: 256x256 pixels or larger</li>
                  <li>• Square format works best</li>
                  <li>• Use transparent background for PNG files</li>
                  <li>• High contrast colors for better visibility</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamBrandingManager;
