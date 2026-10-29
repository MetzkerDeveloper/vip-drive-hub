import { createClient } from 'npm:@supabase/supabase-js@2';
const json=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'}});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return json({});
 if(req.method!=='POST')return json({error:'Método inválido'},405);
 const token=req.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');
 if(!token)return json({error:'Não autorizado'},401);
 const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const authClient=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false}});
 const {data:{user},error:authError}=await authClient.auth.getUser(token);
 if(authError||!user)return json({error:'Sessão inválida'},401);
 const elevated=createClient(url,service,{auth:{persistSession:false}});
 const {data:actor}=await elevated.from('admin_users').select('role,is_active').eq('user_id',user.id).maybeSingle();
 if(!actor?.is_active||actor.role!=='admin')return json({error:'Acesso exclusivo de administrador'},403);
 let body:Record<string,unknown>;try{body=await req.json()}catch{return json({error:'JSON inválido'},400)}
 const action=String(body.action||'');
 if(action==='list'){
 const {data:members,error}=await elevated.from('admin_users').select('user_id,full_name,role,is_active,created_at').order('created_at',{ascending:false});
 if(error)return json({error:error.message},500);
 const {data:users,error:listError}=await elevated.auth.admin.listUsers({perPage:1000});
 if(listError)return json({error:listError.message},500);
 return json({users:(members||[]).map(m=>({...m,email:users.users.find(u=>u.id===m.user_id)?.email||'',last_sign_in_at:users.users.find(u=>u.id===m.user_id)?.last_sign_in_at||null}))});
 }
 if(action==='create'){
 const email=String(body.email||'').trim().toLowerCase(),full_name=String(body.full_name||'').trim(),role=body.role==='admin'?'admin':'manager',password=String(body.password||'');
 if(!/^\S+@\S+\.\S+$/.test(email)||!full_name||password.length<12)return json({error:'Informe nome, e-mail válido e senha com pelo menos 12 caracteres'},400);
 const {data:created,error}=await elevated.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name}});
 if(error||!created.user)return json({error:error?.message||'Erro ao criar usuário'},400);
 const {error:memberError}=await elevated.from('admin_users').insert({user_id:created.user.id,full_name,role,is_active:true});
 if(memberError){await elevated.auth.admin.deleteUser(created.user.id);return json({error:memberError.message},500)}
 return json({ok:true});
 }
 const id=String(body.user_id||'');
 if(!/^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id))return json({error:'Usuário inválido'},400);
 const {data:target}=await elevated.from('admin_users').select('role,is_active').eq('user_id',id).maybeSingle();
 if(!target)return json({error:'Usuário não encontrado'},404);
 if(action==='toggle'){
 const active=body.is_active===true;
 if(id===user.id&&!active)return json({error:'Você não pode desativar sua própria conta'},400);
 if(target.role==='admin'&&!active){const {count}=await elevated.from('admin_users').select('user_id',{count:'exact',head:true}).eq('role','admin').eq('is_active',true);if((count||0)<=1)return json({error:'Não é possível desativar o último administrador'},400)}
 const {error}=await elevated.from('admin_users').update({is_active:active}).eq('user_id',id);
 return error?json({error:error.message},500):json({ok:true});
 }
 if(action==='password'){
 const password=String(body.password||'');
 if(password.length<12)return json({error:'A senha deve ter pelo menos 12 caracteres'},400);
 const {error}=await elevated.auth.admin.updateUserById(id,{password});
 return error?json({error:error.message},400):json({ok:true});
 }
 if(action==='role'){
 const role=body.role==='admin'?'admin':body.role==='manager'?'manager':null;
 if(!role)return json({error:'Perfil inválido'},400);
 if(id===user.id&&role!=='admin')return json({error:'Não altere seu próprio perfil'},400);
 if(target.role==='admin'&&role!=='admin'){const {count}=await elevated.from('admin_users').select('user_id',{count:'exact',head:true}).eq('role','admin').eq('is_active',true);if((count||0)<=1)return json({error:'Não remova o último administrador'},400)}
 const {error}=await elevated.from('admin_users').update({role}).eq('user_id',id);
 return error?json({error:error.message},500):json({ok:true});
 }
 return json({error:'Ação desconhecida'},400);
});