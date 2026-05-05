import { useSearchParams, Link } from 'react-router-dom';
import { CHILDREN } from '../data/seed';

export default function Join() {
  const [params] = useSearchParams();
  const childId  = params.get('child');
  const child    = childId ? CHILDREN.find((c) => c.id === childId) : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 pb-10"
      style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #fef9c3 45%, #fffbeb 100%)' }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-xl shadow-indigo-100">

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">
            📸
          </div>
          <h1 className="font-black text-2xl text-indigo-900 leading-tight">
            {child
              ? `${child.name} is on Portrait Pals!`
              : "You've been invited to Portrait Pals"}
          </h1>
          <p className="text-indigo-500 font-semibold text-sm mt-3 leading-relaxed">
            {child
              ? `${child.name}'s daycare uses Portrait Pals to privately share friendship memories with families.`
              : 'Your daycare uses Portrait Pals to privately share childhood friendship memories.'}
          </p>
          <p className="text-indigo-400 font-semibold text-sm mt-2 leading-relaxed">
            Create your account to start receiving memories — shared only with linked family members, never on social media.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-teal-50 rounded-2xl px-4 py-3">
            <p className="text-xs font-extrabold text-teal-600 uppercase tracking-widest text-center">
              🔒 Private by default
            </p>
            <p className="text-xs font-semibold text-teal-500 mt-0.5 text-center">
              Only linked family members can see your child's photos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '🚫', text: 'Never on social media' },
              { emoji: '🤖', text: 'No AI training'       },
              { emoji: '🗑️', text: 'Delete anytime'       },
              { emoji: '👨‍👩‍👧', text: 'Family controlled'    },
            ].map(({ emoji, text }) => (
              <div key={text} className="bg-amber-50 rounded-xl px-3 py-2 flex items-center gap-2">
                <span className="text-base">{emoji}</span>
                <span className="text-xs font-bold text-indigo-700 leading-tight">{text}</span>
              </div>
            ))}
          </div>

          <button
            disabled
            className="w-full bg-teal-500 text-white font-black text-base rounded-2xl py-4 mt-1 opacity-60 cursor-not-allowed"
          >
            Create Parent Account
          </button>
          <p className="text-center text-xs text-indigo-400 font-semibold">
            Account creation is coming soon. Ask your educator to set up your access.
          </p>
        </div>
      </div>

      <Link
        to="/login"
        className="mt-6 text-xs font-bold text-indigo-400 underline underline-offset-2"
      >
        Already have an account? Sign in
      </Link>
    </div>
  );
}
