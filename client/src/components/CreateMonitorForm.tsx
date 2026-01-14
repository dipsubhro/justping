import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Input } from './ui/input';
import { ChevronDown, Calendar } from 'lucide-react';

interface CreateMonitorFormProps {
  selector: string;
  url: string;
  websiteName: string;
  onSubmit: (config: MonitorConfig) => void;
  onCancel: () => void;
}

export interface MonitorConfig {
  selector: string;
  url: string;
  websiteName: string;
  frequency: {
    value: number;
    unit: string;
  };
  duration: {
    type: 'forever' | 'until_date' | 'first_change';
    endDate?: string;
  };
  alertsEnabled: boolean;
  notificationMethod: string;
  detectionMode: string;
}

const FREQUENCY_OPTIONS = [
  { label: '5 minutes', value: 5, unit: 'minutes' },
  { label: '15 minutes', value: 15, unit: 'minutes' },
  { label: '1 hour', value: 1, unit: 'hours' },
  { label: '6 hours', value: 6, unit: 'hours' },
  { label: '24 hours', value: 24, unit: 'hours' },
];

const DURATION_OPTIONS = [
  { label: 'Run forever', value: 'forever' },
  { label: 'Stop on specific date', value: 'until_date' },
  { label: 'Stop after first change', value: 'first_change' },
];

export default function CreateMonitorForm({
  selector,
  url,
  websiteName,
  onSubmit,
  onCancel,
}: CreateMonitorFormProps) {
  const [frequency, setFrequency] = useState<{ value: number; unit: string }>({
    value: 1,
    unit: 'hours',
  });
  const [durationType, setDurationType] = useState<'forever' | 'until_date' | 'first_change'>('forever');
  const [endDate, setEndDate] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [detectionMode, setDetectionMode] = useState('text');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: MonitorConfig = {
      selector,
      url,
      websiteName,
      frequency,
      duration: {
        type: durationType,
        ...(durationType === 'until_date' && endDate ? { endDate } : {}),
      },
      alertsEnabled,
      notificationMethod,
      detectionMode,
    };

    onSubmit(config);
  };

  const handleFrequencyChange = (value: string) => {
    const option = FREQUENCY_OPTIONS.find((opt) => `${opt.value}-${opt.unit}` === value);
    if (option) {
      setFrequency({ value: option.value, unit: option.unit });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Configure Monitor</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Set up monitoring for <span className="font-semibold text-foreground">{websiteName}</span>
        </p>
        <div className="p-3 bg-muted/50 rounded-md border">
          <div className="text-xs text-muted-foreground mb-1">Selected Element</div>
          <code className="text-xs font-mono break-all text-foreground">{selector}</code>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Check Frequency */}
        <div className="space-y-2">
          <Label htmlFor="frequency" className="text-sm font-medium">
            Check Frequency
          </Label>
          <Select
            value={`${frequency.value}-${frequency.unit}`}
            onValueChange={handleFrequencyChange}
          >
            <SelectTrigger id="frequency" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={`${option.value}-${option.unit}`} value={`${option.value}-${option.unit}`}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">How often should we check for changes?</p>
        </div>

        {/* Alerts Toggle */}
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="space-y-0.5">
            <Label htmlFor="alerts" className="text-sm font-medium cursor-pointer">
              Enable Alerts
            </Label>
            <p className="text-xs text-muted-foreground">
              Receive notifications when changes are detected
            </p>
          </div>
          <Switch
            id="alerts"
            checked={alertsEnabled}
            onCheckedChange={setAlertsEnabled}
          />
        </div>

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-9 px-3 hover:bg-muted/50" 
              type="button"
            >
              <span className="text-sm font-medium">Advanced Options</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-3">
            {/* Monitoring Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Monitoring Duration
              </Label>
              <Select
                value={durationType}
                onValueChange={(value: any) => setDurationType(value)}
              >
                <SelectTrigger id="duration" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {durationType === 'until_date' && (
                <div className="mt-2 space-y-2">
                  <Label htmlFor="endDate" className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="h-10"
                  />
                </div>
              )}
            </div>

            {/* Notification Method */}
            {alertsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="notification" className="text-sm font-medium">
                  Notification Method
                </Label>
                <Select value={notificationMethod} onValueChange={setNotificationMethod}>
                  <SelectTrigger id="notification" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="webhook" disabled>
                      Webhook (Coming soon)
                    </SelectItem>
                    <SelectItem value="slack" disabled>
                      Slack (Coming soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Detection Mode */}
            <div className="space-y-2">
              <Label htmlFor="detection" className="text-sm font-medium">
                Change Detection Mode
              </Label>
              <Select value={detectionMode} onValueChange={setDetectionMode}>
                <SelectTrigger id="detection" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text only</SelectItem>
                  <SelectItem value="visual" disabled>
                    Visual (Coming soon)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how to detect changes in the selected element
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 h-10 font-semibold">
            Start Monitoring
          </Button>
        </div>
      </form>
    </div>
  );
}
