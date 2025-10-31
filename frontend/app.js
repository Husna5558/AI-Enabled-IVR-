/* Simple frontend logic for the HTML demo UI.
   Uses plain fetch() to call the backend endpoints.
*/
(function(){
  const $ = sel => document.querySelector(sel)

  function backend(){
    return ($('#backendUrl').value || 'http://127.0.0.1:8000').replace(/\/$/, '')
  }

  async function loadFlows(){
    const url = backend() + '/flows'
    try{
      const r = await fetch(url)
      const j = await r.json()
      const list = j.flows || []
      const el = $('#flowsList')
      if(!list.length) el.innerText = '(no flows)'
      else el.innerHTML = list.map(f=>`<div>• ${escapeHtml(JSON.stringify(f))}</div>`).join('')
    }catch(e){
      $('#flowsList').innerText = 'Error: '+e.message
    }
  }

  async function sendWebhook(){
    const url = backend() + '/vxml/webhook'
    const payload = {
      sessionId: ($('#sessionId').value) || null,
      input: { value: $('#userInput').value }
    }
    try{
      const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
      const j = await r.json()
      $('#webhookResp').innerText = JSON.stringify(j, null, 2)
    }catch(e){
      $('#webhookResp').innerText = 'Error: '+e.message
    }
  }

  async function analyzeNLU(){
    const url = backend() + '/nlu/process'
    const form = new URLSearchParams()
    form.set('text', $('#nluText').value)
    try{
      const r = await fetch(url, {method:'POST', body: form.toString(), headers:{'Content-Type':'application/x-www-form-urlencoded'}})
      const j = await r.json()
      $('#nluResp').innerText = JSON.stringify(j, null, 2)
    }catch(e){
      $('#nluResp').innerText = 'Error: '+e.message
    }
  }

  function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;' }[c]||c)) }

  document.addEventListener('DOMContentLoaded', ()=>{
    $('#loadFlowsBtn').addEventListener('click', loadFlows)
    $('#sendWebhookBtn').addEventListener('click', sendWebhook)
    $('#nluBtn').addEventListener('click', analyzeNLU)
  })

})()
