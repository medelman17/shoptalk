"use client";

import * as React from "react";
import { FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplicableDocuments, type ApplicableDocuments } from "@/lib/union";

interface SupplementDisplayProps {
  localNumber?: string;
  className?: string;
}

/**
 * Displays the contract documents that apply to a selected Local union.
 *
 * Shows:
 * - Master Agreement (always)
 * - Regional supplement
 * - Any applicable riders
 */
export function SupplementDisplay({
  localNumber,
  className,
}: SupplementDisplayProps) {
  const documents = React.useMemo<ApplicableDocuments | null>(() => {
    if (!localNumber) return null;
    const num = parseInt(localNumber, 10);
    if (isNaN(num)) return null;
    return getApplicableDocuments(num);
  }, [localNumber]);

  if (!documents) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Contract Documents</CardTitle>
          <CardDescription>
            Select your Local union above to see which documents apply to you.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Check className="size-4 text-green-600" />
          Your Contract Documents
        </CardTitle>
        <CardDescription>
          Based on your Local, these contract documents apply to you:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {/* Master Agreement */}
          <DocumentItem
            name={documents.master.shortName}
            description={documents.master.description}
            type="master"
          />

          {/* Supplements */}
          {documents.supplements.map((supplement) => (
            <DocumentItem
              key={supplement.id}
              name={supplement.shortName}
              description={supplement.description}
              type="supplement"
            />
          ))}

          {/* Riders */}
          {documents.riders.map((rider) => (
            <DocumentItem
              key={rider.id}
              name={rider.shortName}
              description={rider.description}
              type="rider"
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface DocumentItemProps {
  name: string;
  description?: string;
  type: "master" | "supplement" | "rider";
}

function DocumentItem({ name, description, type }: DocumentItemProps) {
  const typeLabel = {
    master: "Primary",
    supplement: "Supplement",
    rider: "Rider",
  }[type];

  const typeBadgeClass = {
    master: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    supplement: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rider: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  }[type];

  return (
    <li className="flex items-start gap-3">
      <FileText className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-medium",
              typeBadgeClass
            )}
          >
            {typeLabel}
          </span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Compact version of SupplementDisplay for settings page.
 */
export function SupplementDisplayCompact({
  localNumber,
  className,
}: SupplementDisplayProps) {
  const documents = React.useMemo<ApplicableDocuments | null>(() => {
    if (!localNumber) return null;
    const num = parseInt(localNumber, 10);
    if (isNaN(num)) return null;
    return getApplicableDocuments(num);
  }, [localNumber]);

  if (!documents) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Select a Local to see applicable documents.
      </p>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {documents.all.map((doc) => (
        <div key={doc.id} className="flex items-center gap-2 text-sm">
          <Check className="size-3.5 text-green-600 shrink-0" />
          <span>{doc.shortName}</span>
        </div>
      ))}
    </div>
  );
}
