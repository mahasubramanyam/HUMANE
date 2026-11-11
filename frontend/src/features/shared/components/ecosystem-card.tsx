import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { EcosystemCardProps } from "../index";

export function EcosystemCard({
  title,
  badge,
  badgeVariant,
  description,
  principles,
}: EcosystemCardProps) {
  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-md border-border">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={badgeVariant}>{badge}</Badge>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-t pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Core Tenets
          </h4>
          <ul className="space-y-2">
            {principles.map((principle, index) => (
              <li key={index} className="flex items-start text-xs text-foreground/80 gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
