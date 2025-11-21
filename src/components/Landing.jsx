import { useEffect, useState } from 'react'

function formatCurrency(n){
  try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n||0)} catch {return n}
}

export default function Landing({ slug, backend }){
  const [data, setData] = useState(null)
  const [form, setForm] = useState({ name:'', mobile:'', amount:'', mode:'gpay', proof_url:'', note:'' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(()=>{ fetch(`${backend}/public/projects/${slug}`).then(r=>r.json()).then(setData).catch(()=>setData({error:'Not found'})) },[slug, backend])

  const submit = async (e)=>{
    e.preventDefault()
    if(!data?.project?.id) return
    setSaving(true)
    try{
      const res = await fetch(`${backend}/contributions`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          project_id: data.project.id,
          name: form.name||undefined,
          mobile: form.mobile||undefined,
          amount: parseFloat(form.amount),
          mode: form.mode,
          proof_url: form.proof_url||undefined,
          note: form.note||undefined
        })
      })
      if(!res.ok) throw new Error('Failed')
      setMsg('Thank you! Contribution recorded.')
      setForm({ name:'', mobile:'', amount:'', mode:'gpay', proof_url:'', note:'' })
      // refresh recent
      const fresh = await fetch(`${backend}/public/projects/${slug}`).then(r=>r.json())
      setData(fresh)
    }catch(err){ setMsg('Could not save. Please try again.') }
    finally{ setSaving(false) }
  }

  if(!data) return <div className="text-white">Loading...</div>
  if(data.error) return <div className="text-white">{data.error}</div>

  const p = data.project

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">{p.title}</h1>
      <p className="text-blue-200 mb-6">{p.description}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-blue-500/20">
          <h2 className="font-semibold mb-3">Contribute</h2>
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full bg-slate-900/60 rounded px-3 py-2" placeholder="Your name (optional)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="w-full bg-slate-900/60 rounded px-3 py-2" placeholder="Mobile (optional)" value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})} />
            <input className="w-full bg-slate-900/60 rounded px-3 py-2" placeholder="Amount (INR)" type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
            <select className="w-full bg-slate-900/60 rounded px-3 py-2" value={form.mode} onChange={e=>setForm({...form, mode:e.target.value})}>
              <option value="gpay">GPay</option>
              <option value="online">Online</option>
              <option value="direct">Direct</option>
            </select>
            <input className="w-full bg-slate-900/60 rounded px-3 py-2" placeholder="Proof URL / Screenshot link (optional)" value={form.proof_url} onChange={e=>setForm({...form, proof_url:e.target.value})} />
            <textarea className="w-full bg-slate-900/60 rounded px-3 py-2" placeholder="Note (optional)" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} />
            <button disabled={saving} className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2 font-semibold">{saving? 'Saving...' : 'Submit Contribution'}</button>
            {msg && <p className="text-sm text-blue-300">{msg}</p>}
          </form>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-blue-500/20">
          <h2 className="font-semibold mb-2">Project Totals</h2>
          <p className="text-2xl mb-4">{formatCurrency(data.total)}</p>
          {p.gpay_upi && (
            <div className="mb-4">
              <p className="text-sm text-blue-300">UPI:</p>
              <p className="font-mono">{p.gpay_upi}</p>
            </div>
          )}
          {p.gpay_url && (
            <a href={p.gpay_url} className="inline-block bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded">Pay via GPay</a>
          )}
          {p.gpay_qr_image && (
            <div className="mt-3">
              <img src={p.gpay_qr_image} alt="GPay QR" className="rounded max-h-64" />
            </div>
          )}
          <h3 className="font-semibold mt-6 mb-2">Recent Contributions</h3>
          <div className="space-y-2 max-h-64 overflow-auto pr-2">
            {data.recent_contributions?.map((c,i)=> (
              <div key={i} className="flex justify-between text-sm bg-slate-900/40 rounded px-3 py-2">
                <span>{c.name || 'Guest'}</span>
                <span>{formatCurrency(c.amount)}</span>
              </div>
            ))}
            {(!data.recent_contributions || data.recent_contributions.length===0) && (
              <p className="text-blue-300">No contributions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
