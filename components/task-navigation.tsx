"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUnifiedItems, getUnifiedItemById } from "@/lib/mock-api";
import type { UnifiedItem } from "@/lib/types";

interface TaskNavigationProps {
	currentId: string;
	currentUserId: string;
}

export function TaskNavigation({ currentId, currentUserId }: TaskNavigationProps) {
	const router = useRouter();
	const [items, setItems] = useState<UnifiedItem[]>([]);
	const [currentItem, setCurrentItem] = useState<UnifiedItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		const loadItems = async () => {
			setLoading(true);
			const result = await getUnifiedItems(1, 1000, {
				employee_id: currentUserId,
			});
			// Sort by created_at ascending (oldest first) - but getUnifiedItems already sorts descending
			// So we need to reverse it to get oldest first
			const sortedItems = [...result.data].reverse();
			setItems(sortedItems);

			// Get current item to check if it's a task
			const current = await getUnifiedItemById(currentId);
			setCurrentItem(current);

			setLoading(false);
		};
		loadItems();
	}, [currentUserId, currentId]);

	// Find index in the sorted items (oldest first, so index 0 is the first item)
	const currentIndex = items.findIndex((item) => item.id === currentId);
	const hasPrevious = currentIndex > 0;
	const hasNext = currentIndex < items.length - 1;
	const previousItem = hasPrevious ? items[currentIndex - 1] : null;
	const nextItem = hasNext ? items[currentIndex + 1] : null;

	const handlePrevious = () => {
		if (previousItem && !isNavigating) {
			setIsNavigating(true);
			router.push(`/tasks/${previousItem.id}`);
			// Reset navigation state after a short delay
			setTimeout(() => setIsNavigating(false), 300);
		}
	};

	const handleNext = () => {
		if (nextItem && !isNavigating) {
			setIsNavigating(true);
			router.push(`/tasks/${nextItem.id}`);
			// Reset navigation state after a short delay
			setTimeout(() => setIsNavigating(false), 300);
		}
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger if user is typing in an input/textarea
			if (
				(e.target as HTMLElement).tagName === "INPUT" ||
				(e.target as HTMLElement).tagName === "TEXTAREA" ||
				(e.target as HTMLElement).isContentEditable
			) {
				return;
			}

			if (e.key === "ArrowLeft" && hasPrevious && !isNavigating) {
				e.preventDefault();
				handlePrevious();
			} else if (e.key === "ArrowRight" && hasNext && !isNavigating) {
				e.preventDefault();
				handleNext();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [hasPrevious, hasNext, isNavigating]); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return null;
	}

	// Get item name for display
	const getItemName = (item: UnifiedItem | null) => {
		if (!item) return null;
		if (item.type === "task" && item.task) {
			return item.task.actionable.name;
		} else if (item.type === "call_audit" && item.call_audit) {
			return item.call_audit.lead.name;
		}
		return null;
	};

	const previousItemName = getItemName(previousItem);
	const nextItemName = getItemName(nextItem);
	const currentItemName = getItemName(currentItem);

	return (
		<div className="flex items-center gap-4 px-1">
			{/* Previous Button - Enhanced styling */}
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={hasPrevious ? "outline" : "ghost"}
						size="default"
						onClick={handlePrevious}
						disabled={!hasPrevious || isNavigating}
						className={`
							border-border text-foreground h-10 px-4 flex-shrink-0 min-w-[160px] max-w-[160px] 
							justify-start transition-all duration-200 ease-in-out
							${
								hasPrevious
									? "hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:shadow-sm active:scale-[0.98]"
									: "opacity-50 cursor-not-allowed"
							}
							${isNavigating ? "opacity-70 cursor-wait" : ""}
						`}
					>
						<ChevronLeft
							className={`w-4 h-4 mr-2 flex-shrink-0 transition-transform ${
								hasPrevious && !isNavigating ? "group-hover:-translate-x-0.5" : ""
							}`}
						/>
						<span className="text-sm font-medium truncate text-left flex-1">
							{previousItemName || "Previous"}
						</span>
					</Button>
				</TooltipTrigger>
				{previousItemName && hasPrevious && (
					<TooltipContent side="top" className="max-w-xs">
						<p className="font-medium">Previous: {previousItemName}</p>
						<p className="text-xs text-muted-foreground mt-0.5">Press ← to navigate</p>
					</TooltipContent>
				)}
			</Tooltip>

			{/* Position indicator - Enhanced */}
			<div className="flex items-center justify-center min-w-[100px] px-3 py-1.5 rounded-md bg-muted/50">
				{currentIndex >= 0 && (
					<span className="text-sm text-foreground font-semibold whitespace-nowrap">
						<span className="text-primary">{currentIndex + 1}</span>
						<span className="text-muted-foreground mx-1">/</span>
						<span className="text-muted-foreground">{items.length}</span>
					</span>
				)}
			</div>

			{/* Next Button - Enhanced styling */}
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={hasNext ? "outline" : "ghost"}
						size="default"
						onClick={handleNext}
						disabled={!hasNext || isNavigating}
						className={`
							border-border text-foreground h-10 px-4 flex-shrink-0 min-w-[160px] max-w-[160px] 
							justify-end transition-all duration-200 ease-in-out
							${
								hasNext
									? "hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:shadow-sm active:scale-[0.98]"
									: "opacity-50 cursor-not-allowed"
							}
							${isNavigating ? "opacity-70 cursor-wait" : ""}
						`}
					>
						<span className="text-sm font-medium truncate text-right flex-1">{nextItemName || "Next"}</span>
						<ChevronRight
							className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${
								hasNext && !isNavigating ? "group-hover:translate-x-0.5" : ""
							}`}
						/>
					</Button>
				</TooltipTrigger>
				{nextItemName && hasNext && (
					<TooltipContent side="top" className="max-w-xs">
						<p className="font-medium">Next: {nextItemName}</p>
						<p className="text-xs text-muted-foreground mt-0.5">Press → to navigate</p>
					</TooltipContent>
				)}
			</Tooltip>
		</div>
	);
}
