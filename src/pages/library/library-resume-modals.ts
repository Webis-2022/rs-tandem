import { showModal } from '../../components/ui/modal/modal';
import type { Difficulty } from '../../types';

export async function confirmReplaceActiveTopic(
  difficulty: Difficulty | null | undefined,
  topicTitle: string
): Promise<boolean> {
  const result = await showModal({
    title: 'Start new topic?',
    messageHtml: `
        <p>You already have an unfinished topic:</p>
        <p><strong>${topicTitle}</strong> (${difficulty ?? 'another difficulty'})</p>
        <p>Starting a new topic will replace your current progress.</p>
  `,
    showConfirm: true,
    confirmText: 'Start new topic',
    cancelText: 'Cancel',
  });

  return result.confirmed;
}

export async function confirmContinueSameTopic(
  difficulty: Difficulty | null | undefined,
  topicTitle: string
): Promise<boolean> {
  const result = await showModal({
    title: 'Continue previous topic?',
    messageHtml: `
        <p>You already have an unfinished topic:</p>
        <p><strong>${topicTitle}</strong> (${difficulty ?? 'another difficulty'})</p>
        <p>Do you want to continue your previous progress?</p>
  `,
    showConfirm: true,
    confirmText: 'Continue topic',
    cancelText: 'Cancel',
  });

  return result.confirmed;
}
