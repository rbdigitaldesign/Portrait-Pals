import { useSearchParams, Link } from 'react-router-dom';
import { Camera, Lock, ShieldOff, Sparkles, Trash2, Users } from 'lucide-react';
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
          <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-teal-600" />
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
          <div className="bg-teal-50 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock size={15} className="text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-teal-600 uppercase tracking-widest">Private by default</p>
              <p className="text-xs font-semibold text-teal-500 mt-0.5">
                Only linked family members can see your child's photos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: ShieldOff, text: 'Never on social media', bg: 'bg-rose-50',   iconBg: 'bg-rose-100',   iconColor: 'text-rose-500'   },
              { icon: Sparkles,  text: 'No AI training',        bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
              { icon: Trash2,    text: 'Delete anytime',        bg: 'bg-amber-50',  iconBg: 'bg-amber-100',  iconColor: 'text-amber-600'  },
              { icon: Users,     text: 'Family controlled',     bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
            ].map(({ icon: Icon, text, bg, iconBg, iconColor }) => (
              <div key={text} className={`${bg} rounded-xl px-3 py-2.5 flex items-center gap-2.5`}>
                <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={iconColor} />
                </div>
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
