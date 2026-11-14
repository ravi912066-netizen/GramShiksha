import React from "react";
import { Link } from "react-router-dom";
import { WifiOff, RefreshCw, BookOpen, Compass } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8 space-y-6 border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Connection Lost
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            GramShiksha is in offline mode. If you have previously opened notes and syllabi, they remain readable. Video streaming requires an active internet connection.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
          <p className="font-semibold text-slate-900">Offline Tips for Rural Learners:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>Keep this app installed via your browser menu (PWA)</li>
            <li>Study downloaded PDFs and offline course outlines</li>
            <li>Reconnect to 2G/3G/4G or Wi-Fi to sync completion progress</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            fullWidth
            onClick={handleReload}
            icon={RefreshCw}
          >
            Check Connection
          </Button>
          <Link to="/my-learning" className="w-full">
            <Button variant="primary" fullWidth icon={BookOpen}>
              My Learning
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
