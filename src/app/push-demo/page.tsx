import Link from 'next/link';
import { PushDemo } from '@/components/push-demo';
export default function PushDemoPage() {
  return <main className="push-page"><Link className="text-button" href="/owner">← Owner dashboard</Link><div className="card padded"><PushDemo sender /></div></main>;
}
