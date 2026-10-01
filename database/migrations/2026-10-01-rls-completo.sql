-- 2026-10-01: RLS completo do schema funcional do Business Plan Builder
-- Requer Neon Auth e auth.user_id() disponíveis no banco.

CREATE OR REPLACE FUNCTION public.usuario_pode_acessar_espaco(p_espaco_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS 'SELECT EXISTS (
  SELECT 1 FROM espacos_trabalho e
  WHERE e.id = p_espaco_id
    AND (
      e.proprietario_usuario_id = (select auth.user_id())::uuid
      OR EXISTS (
        SELECT 1 FROM membros_espaco_trabalho m
        WHERE m.espaco_trabalho_id = e.id
          AND m.usuario_id = (select auth.user_id())::uuid
      )
    )
)';

CREATE OR REPLACE FUNCTION public.usuario_pode_acessar_plano(p_plano_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS 'SELECT EXISTS (
  SELECT 1
  FROM planos_negocio p
  JOIN espacos_trabalho e ON e.id = p.espaco_trabalho_id
  WHERE p.id = p_plano_id
    AND (
      p.proprietario_usuario_id = (select auth.user_id())::uuid
      OR e.proprietario_usuario_id = (select auth.user_id())::uuid
      OR EXISTS (
        SELECT 1 FROM membros_espaco_trabalho m
        WHERE m.espaco_trabalho_id = e.id
          AND m.usuario_id = (select auth.user_id())::uuid
      )
    )
)';

ALTER FUNCTION public.usuario_pode_acessar_espaco(uuid) OWNER TO neondb_owner;
ALTER FUNCTION public.usuario_pode_acessar_plano(uuid) OWNER TO neondb_owner;

ALTER TABLE public.usuarios_perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.espacos_trabalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_espaco_trabalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_negocio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analises_ambientais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analises_oportunidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas_valor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_swot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pestel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forcas_porter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secoes_plano ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_financeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cenarios_financeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projecoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_complementares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.versoes_plano ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links_compartilhamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exportacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.painel_gestao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas_plano ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_atividade ENABLE ROW LEVEL SECURITY;

-- As políticas são aplicadas como parte desta migração; ao evoluir a autorização, atualize os nomes/definições com cuidado.
DROP POLICY IF EXISTS usuarios_perfis_select ON public.usuarios_perfis;
DROP POLICY IF EXISTS usuarios_perfis_insert ON public.usuarios_perfis;
DROP POLICY IF EXISTS usuarios_perfis_update ON public.usuarios_perfis;
DROP POLICY IF EXISTS usuarios_perfis_delete ON public.usuarios_perfis;
CREATE POLICY usuarios_perfis_select ON public.usuarios_perfis FOR SELECT TO authenticated USING (usuario_autenticacao_id = (select auth.user_id())::uuid);
CREATE POLICY usuarios_perfis_insert ON public.usuarios_perfis FOR INSERT TO authenticated WITH CHECK (usuario_autenticacao_id = (select auth.user_id())::uuid);
CREATE POLICY usuarios_perfis_update ON public.usuarios_perfis FOR UPDATE TO authenticated USING (usuario_autenticacao_id = (select auth.user_id())::uuid) WITH CHECK (usuario_autenticacao_id = (select auth.user_id())::uuid);
CREATE POLICY usuarios_perfis_delete ON public.usuarios_perfis FOR DELETE TO authenticated USING (usuario_autenticacao_id = (select auth.user_id())::uuid);

DROP POLICY IF EXISTS espacos_trabalho_select ON public.espacos_trabalho;
DROP POLICY IF EXISTS espacos_trabalho_insert ON public.espacos_trabalho;
DROP POLICY IF EXISTS espacos_trabalho_update ON public.espacos_trabalho;
DROP POLICY IF EXISTS espacos_trabalho_delete ON public.espacos_trabalho;
CREATE POLICY espacos_trabalho_select ON public.espacos_trabalho FOR SELECT TO authenticated USING (public.usuario_pode_acessar_espaco(id));
CREATE POLICY espacos_trabalho_insert ON public.espacos_trabalho FOR INSERT TO authenticated WITH CHECK (proprietario_usuario_id = (select auth.user_id())::uuid);
CREATE POLICY espacos_trabalho_update ON public.espacos_trabalho FOR UPDATE TO authenticated USING (proprietario_usuario_id = (select auth.user_id())::uuid) WITH CHECK (proprietario_usuario_id = (select auth.user_id())::uuid);
CREATE POLICY espacos_trabalho_delete ON public.espacos_trabalho FOR DELETE TO authenticated USING (proprietario_usuario_id = (select auth.user_id())::uuid);

DROP POLICY IF EXISTS membros_espaco_trabalho_select ON public.membros_espaco_trabalho;
DROP POLICY IF EXISTS membros_espaco_trabalho_insert ON public.membros_espaco_trabalho;
DROP POLICY IF EXISTS membros_espaco_trabalho_update ON public.membros_espaco_trabalho;
DROP POLICY IF EXISTS membros_espaco_trabalho_delete ON public.membros_espaco_trabalho;
CREATE POLICY membros_espaco_trabalho_select ON public.membros_espaco_trabalho FOR SELECT TO authenticated USING (usuario_id = (select auth.user_id())::uuid OR EXISTS (SELECT 1 FROM espacos_trabalho e WHERE e.id = membros_espaco_trabalho.espaco_trabalho_id AND e.proprietario_usuario_id = (select auth.user_id())::uuid));
CREATE POLICY membros_espaco_trabalho_insert ON public.membros_espaco_trabalho FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM espacos_trabalho e WHERE e.id = membros_espaco_trabalho.espaco_trabalho_id AND e.proprietario_usuario_id = (select auth.user_id())::uuid));
CREATE POLICY membros_espaco_trabalho_update ON public.membros_espaco_trabalho FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM espacos_trabalho e WHERE e.id = membros_espaco_trabalho.espaco_trabalho_id AND e.proprietario_usuario_id = (select auth.user_id())::uuid)) WITH CHECK (EXISTS (SELECT 1 FROM espacos_trabalho e WHERE e.id = membros_espaco_trabalho.espaco_trabalho_id AND e.proprietario_usuario_id = (select auth.user_id())::uuid));
CREATE POLICY membros_espaco_trabalho_delete ON public.membros_espaco_trabalho FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM espacos_trabalho e WHERE e.id = membros_espaco_trabalho.espaco_trabalho_id AND e.proprietario_usuario_id = (select auth.user_id())::uuid));

DROP POLICY IF EXISTS planos_negocio_select ON public.planos_negocio;
DROP POLICY IF EXISTS planos_negocio_insert ON public.planos_negocio;
DROP POLICY IF EXISTS planos_negocio_update ON public.planos_negocio;
DROP POLICY IF EXISTS planos_negocio_delete ON public.planos_negocio;
CREATE POLICY planos_negocio_select ON public.planos_negocio FOR SELECT TO authenticated USING (public.usuario_pode_acessar_plano(id));
CREATE POLICY planos_negocio_insert ON public.planos_negocio FOR INSERT TO authenticated WITH CHECK (proprietario_usuario_id = (select auth.user_id())::uuid AND EXISTS (SELECT 1 FROM espacos_trabalho e WHERE e.id = planos_negocio.espaco_trabalho_id AND e.proprietario_usuario_id = (select auth.user_id())::uuid));
CREATE POLICY planos_negocio_update ON public.planos_negocio FOR UPDATE TO authenticated USING (public.usuario_pode_acessar_plano(id)) WITH CHECK (public.usuario_pode_acessar_plano(id));
CREATE POLICY planos_negocio_delete ON public.planos_negocio FOR DELETE TO authenticated USING (proprietario_usuario_id = (select auth.user_id())::uuid);

CREATE POLICY analises_ambientais_all ON public.analises_ambientais FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY analises_oportunidade_all ON public.analises_oportunidade FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY propostas_valor_all ON public.propostas_valor FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY itens_swot_all ON public.itens_swot FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY itens_pestel_all ON public.itens_pestel FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY forcas_porter_all ON public.forcas_porter FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY secoes_plano_all ON public.secoes_plano FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY planos_financeiros_all ON public.planos_financeiros FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY planos_complementares_all ON public.planos_complementares FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY versoes_plano_all ON public.versoes_plano FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY links_compartilhamento_all ON public.links_compartilhamento FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY exportacoes_all ON public.exportacoes FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY painel_gestao_all ON public.painel_gestao FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));
CREATE POLICY alertas_plano_all ON public.alertas_plano FOR ALL TO authenticated USING (public.usuario_pode_acessar_plano(plano_negocio_id)) WITH CHECK (public.usuario_pode_acessar_plano(plano_negocio_id));

CREATE POLICY cenarios_financeiros_all ON public.cenarios_financeiros FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM planos_financeiros pf WHERE pf.id = cenarios_financeiros.plano_financeiro_id AND public.usuario_pode_acessar_plano(pf.plano_negocio_id)))
WITH CHECK (EXISTS (SELECT 1 FROM planos_financeiros pf WHERE pf.id = cenarios_financeiros.plano_financeiro_id AND public.usuario_pode_acessar_plano(pf.plano_negocio_id)));

CREATE POLICY projecoes_financeiras_all ON public.projecoes_financeiras FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM cenarios_financeiros cf JOIN planos_financeiros pf ON pf.id = cf.plano_financeiro_id WHERE cf.id = projecoes_financeiras.cenario_financeiro_id AND public.usuario_pode_acessar_plano(pf.plano_negocio_id)))
WITH CHECK (EXISTS (SELECT 1 FROM cenarios_financeiros cf JOIN planos_financeiros pf ON pf.id = cf.plano_financeiro_id WHERE cf.id = projecoes_financeiras.cenario_financeiro_id AND public.usuario_pode_acessar_plano(pf.plano_negocio_id)));

DROP POLICY IF EXISTS registros_atividade_select ON public.registros_atividade;
DROP POLICY IF EXISTS registros_atividade_insert ON public.registros_atividade;
DROP POLICY IF EXISTS registros_atividade_update ON public.registros_atividade;
DROP POLICY IF EXISTS registros_atividade_delete ON public.registros_atividade;
CREATE POLICY registros_atividade_select ON public.registros_atividade FOR SELECT TO authenticated USING ((plano_negocio_id IS NULL AND usuario_id = (select auth.user_id())::uuid) OR (plano_negocio_id IS NOT NULL AND public.usuario_pode_acessar_plano(plano_negocio_id)));
CREATE POLICY registros_atividade_insert ON public.registros_atividade FOR INSERT TO authenticated WITH CHECK (usuario_id = (select auth.user_id())::uuid AND (plano_negocio_id IS NULL OR public.usuario_pode_acessar_plano(plano_negocio_id)));
CREATE POLICY registros_atividade_update ON public.registros_atividade FOR UPDATE TO authenticated USING (usuario_id = (select auth.user_id())::uuid) WITH CHECK (usuario_id = (select auth.user_id())::uuid);
CREATE POLICY registros_atividade_delete ON public.registros_atividade FOR DELETE TO authenticated USING (usuario_id = (select auth.user_id())::uuid);
