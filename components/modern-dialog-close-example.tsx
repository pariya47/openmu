import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  ModernDialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Settings } from 'lucide-react';

export const ModernDialogCloseExample = () => {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Modern DialogClose Examples</h2>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog Examples</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modern DialogClose Variants</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            
            {/* Default Close Button (already built into DialogContent) */}
            <div className="space-y-2">
              <h3 className="font-semibold">Default Built-in Close (Top Right)</h3>
              <p className="text-sm text-muted-foreground">
                The default close button is automatically included in DialogContent
              </p>
            </div>

            {/* Custom Close Buttons */}
            <div className="space-y-4">
              <h3 className="font-semibold">Custom Close Button Variants</h3>
              
              <div className="flex flex-wrap gap-3">
                {/* Primary Close */}
                <ModernDialogClose variant="default" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Close
                </ModernDialogClose>

                {/* Secondary Close */}
                <ModernDialogClose variant="secondary" size="sm">
                  Close
                </ModernDialogClose>

                {/* Outline Close */}
                <ModernDialogClose variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </ModernDialogClose>

                {/* Ghost Close */}
                <ModernDialogClose variant="ghost" size="sm">
                  Dismiss
                </ModernDialogClose>

                {/* Destructive Close */}
                <ModernDialogClose variant="destructive" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Close & Delete
                </ModernDialogClose>

                {/* Link Style Close */}
                <ModernDialogClose variant="link" size="sm">
                  Close Dialog
                </ModernDialogClose>
              </div>
            </div>

            {/* Icon Only Variants */}
            <div className="space-y-2">
              <h3 className="font-semibold">Icon Only Variants</h3>
              <div className="flex gap-3">
                <ModernDialogClose variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </ModernDialogClose>

                <ModernDialogClose variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </ModernDialogClose>

                <ModernDialogClose variant="secondary" size="icon">
                  <Settings className="h-4 w-4" />
                </ModernDialogClose>
              </div>
            </div>

            {/* Custom Styled Close */}
            <div className="space-y-2">
              <h3 className="font-semibold">Custom Styled Close</h3>
              <ModernDialogClose 
                variant="outline"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Fancy Close
              </ModernDialogClose>
            </div>

            {/* Floating Action Close */}
            <div className="space-y-2">
              <h3 className="font-semibold">Floating Action Style</h3>
              <ModernDialogClose 
                variant="default"
                size="icon"
                className="rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </ModernDialogClose>
            </div>

            {/* Different Sizes */}
            <div className="space-y-2">
              <h3 className="font-semibold">Different Sizes</h3>
              <div className="flex items-center gap-3">
                <ModernDialogClose variant="outline" size="sm">
                  Small
                </ModernDialogClose>
                <ModernDialogClose variant="outline" size="default">
                  Default
                </ModernDialogClose>
                <ModernDialogClose variant="outline" size="lg">
                  Large
                </ModernDialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
