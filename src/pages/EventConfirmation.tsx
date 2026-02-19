import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";

const EventConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "there";
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <div className="text-center space-y-6 bg-card rounded-lg border border-border p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-black text-foreground">You're In!</h1>
          <p className="text-muted-foreground">
            Hey <span className="text-foreground font-medium">{decodeURIComponent(name)}</span>, your registration is confirmed!
          </p>
          {email && (
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to <strong className="text-foreground">{decodeURIComponent(email)}</strong>.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to={`/events/${id}`}>
              <Button variant="outline">Back to Event</Button>
            </Link>
            <Link to="/events">
              <Button>Browse Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventConfirmation;
