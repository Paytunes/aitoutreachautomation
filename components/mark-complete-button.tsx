"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { getUnifiedItems, getUnifiedItemById } from "@/lib/mock-api";
import type { UnifiedItem } from "@/lib/types";

interface MarkCompleteButtonProps {
	currentId: string;
	currentUserId: string;
}

export function MarkCompleteButton({ currentId, currentUserId }: MarkCompleteButtonProps) {
	const router = useRouter();
	const [currentItem, setCurrentItem] = useState<UnifiedItem | null>(null);
	const [nextItem, setNextItem] = useState<UnifiedItem | null>(null);
	const [isCompleting, setIsCompleting] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			const result = await getUnifiedItems(1, 1000, {
				employee_id: currentUserId,
			});
			// Sort by created_at ascending (oldest first) - but getUnifiedItems already sorts descending
			// So we need to reverse it to get oldest first
			const sortedItems = [...result.data].reverse();

			// Get current item to check if it's a task
			const current = await getUnifiedItemById(currentId);
			setCurrentItem(current);

			// Find next item
			const currentIndex = sortedItems.findIndex((item) => item.id === currentId);
			const next = currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : null;
			setNextItem(next);

			setLoading(false);
		};
		loadData();
	}, [currentUserId, currentId]);

	const handleMarkCompleteAndNext = async () => {
		if (!nextItem) return;

		setIsCompleting(true);
		// TODO: Replace with actual API call to update task status
		console.log("[v0] Marking task as complete:", currentId);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		setIsCompleting(false);
		// Navigate to next task
		router.push(`/tasks/${nextItem.id}`);
	};

	// Only show for tasks (not call audits) and if task is not already completed
	const isTask = currentItem?.type === "task";
	const isTaskCompleted = isTask && currentItem?.task?.task_status === "completed";
	const showButton = !loading && isTask && !isTaskCompleted && nextItem;

	if (!showButton) {
		return null;
	}

	return (
		<Button
			variant="default"
			size="lg"
			onClick={handleMarkCompleteAndNext}
			disabled={isCompleting}
			className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
		>
			<CheckCircle2 className="w-5 h-5 mr-2" />
			{isCompleting ? "Completing..." : "Mark Complete & Next"}
		</Button>
	);
}

