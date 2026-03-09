import { createEl } from '../../../../shared/dom';
import './theory-btn-popover.scss';

type TopicData = Record<string, string>;
export function createPopover(topicData: TopicData, baseUrl: string) {
  const popover = createEl('div', { className: 'theory-btn-popover' });
  Object.keys(topicData).forEach((topic) => {
    const link = createEl('a', {
      text: topic,
      className: 'theory-link',
    });
    const value = topicData[topic as keyof TopicData];
    const path = value
      .split('_')[0]
      .match(/html|css/g)
      ?.join('');
    (link as HTMLAnchorElement).href = `${baseUrl}${path}/${value}.asp`;
    popover.append(link);
  });
  const theoryBtnContainer = document.querySelector('.theory-btn-container');
  theoryBtnContainer?.append(popover);
}
