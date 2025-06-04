
import UserSettingsForm from "@/components/features/UserSettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Account Settings</CardTitle>
          <CardDescription>Manage your profile information and application preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserSettingsForm />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">API Key Management</CardTitle>
          <CardDescription>Manage your API keys for accessing Quantum GPT features programmatically. (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This feature is under development.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Subscription Status</CardTitle>
          <CardDescription>View and manage your Quantum GPT subscription. (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Currently on the <span className="font-semibold text-primary">Free Plan</span>. Subscription management is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
