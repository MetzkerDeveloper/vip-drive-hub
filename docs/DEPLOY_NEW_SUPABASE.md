# VIP Drive Hub — novo Supabase (início do zero)

## Projeto
- Supabase project: `pintuozepszirzknwrzs` — região `sa-east-1`
- Dashboard: https://supabase.com/dashboard/project/pintuozepszirzknwrzs
- Banco novo: `public.vehicles` e `public.contacts`
- `vehicles.is_sold`: `false` = disponível; `true` = vendido
- Bucket público `vehicles`, RLS habilitado nas duas tabelas
- Migration aplicada diretamente ao novo projeto: `initialize_vip_drive_hub_schema`
- Dados do Lovable **não** foram migrados, conforme decisão de começar do zero.

## Pré-requisitos de publicação
1. Configurar o primeiro usuário administrativo em **Supabase > Authentication > Users** (não há usuários migrados).
2. O controle de acesso foi reforçado na migration `restrict_admin_operations_to_allowlisted_users`. Depois de criar o usuário em Authentication > Users, copie o UUID do usuário e adicione-o no SQL Editor: `INSERT INTO public.admin_users(user_id) VALUES ('UUID_DO_USUARIO');`. Nunca coloque um UUID fictício. Somente usuários dessa tabela conseguem acessar as operações administrativas. Não habilitar cadastro aberto.
3. Validar `npm ci`, `npm run build`, `npm test`, `npm run lint`.
4. Validar login, logout, upload de imagens, cadastro/edição e marcação vendido/disponível, filtro, formulário de contatos e navegação mobile.
5. Somente após os testes, mesclar o PR para a branch `main` e atualizar o deployment que usa essa branch.

## Credenciais
A branch da funcionalidade contém em `.env` apenas a **chave publishable** do projeto novo (destinada ao navegador), URL e ID. Nunca inserir `service_role` ou secrets no frontend.

## Observação
Até a publicação de uma nova versão do site, o deployment atual ainda pode usar o Supabase antigo do Lovable. O primeiro administrador deve ser criado e a autorização restrita antes da troca de produção.
