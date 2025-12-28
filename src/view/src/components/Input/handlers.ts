import type { ConvoStore } from '@/store/type';

export function handleGrow(ref: React.RefObject<HTMLTextAreaElement | null>) {
  const el = ref.current;
  if (!el) {
    return;
  }
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

export function handleSend(
  loading: boolean,
  ref: React.RefObject<HTMLTextAreaElement | null>,
  sendQuery: ConvoStore['sendQuery'],
) {
  if (loading) {
    return;
  }
  sendQuery();
  if (!ref.current) {
    return;
  }
  ref.current.style.height = 'auto';
  ref.current.focus();
}
