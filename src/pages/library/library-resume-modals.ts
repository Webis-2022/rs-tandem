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

export async function confirmRestartActiveTopic(
  difficulty: Difficulty | null | undefined,
  topicTitle: string
): Promise<boolean> {
  const result = await showModal({
    title: 'Start topic from the beginning?',
    messageHtml: `
      <p>You already have unfinished progress in:</p>
      <p><strong>${topicTitle}</strong> (${difficulty ?? 'another difficulty'})</p>
      <p>Starting again will reset your current progress for this topic.</p>
    `,
    showConfirm: true,
    confirmText: 'Start over',
    cancelText: 'Cancel',
  });

  return result.confirmed;
}
