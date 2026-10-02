/**
 * app/api/comprovantes/route.js
 * 
 * Camada de Apresentação (Route Handlers / API).
 * Consumida por:
 * - Formulário web (/comprovante)
 * - Futuros clientes móveis (React Native / Flutter)
 * - Integrações externas
 */
import { NextResponse } from 'next/server';
import { criarComprovante, listarComprovantes } from '@/services/comprovante.service';
import { resolverTenantDaRequisicao, validarTenantAtivo } from '@/services/tenant.service';
import { withTenant } from '@/lib/prisma';
import { tratarErroApi } from '@/lib/errors';
import { validarDTO, CriarComprovanteDTO } from '@/dtos';

// GET — lista os comprovantes da paróquia/tenant identificada
export async function GET(request) {
  try {
    const tenant = await resolverTenantDaRequisicao(request, { fallbackParaDefault: true });
    
    // Executa no contexto do tenant
    const comprovantes = await withTenant(tenant.id, async () => {
      return listarComprovantes({ tenantId: tenant.id });
    });

    return NextResponse.json({ comprovantes, tenant: { id: tenant.id, nome: tenant.nome } });
  } catch (error) {
    console.error('Erro ao listar comprovantes:', error);
    return tratarErroApi(error, 'Erro interno ao listar comprovantes.');
  }
}

// POST — recebe multipart/form-data e cria um novo comprovante no tenant validado
export async function POST(request) {
  try {
    const formData = await request.formData();
    const dadosBrutos = {
      nome: formData.get('nome'),
      telefone: formData.get('telefone'),
      observacao: formData.get('observacao'),
      tenant_id: formData.get('tenant_id'),
    };
    const foto = formData.get('foto');

    // Validação DTO dos campos de entrada
    const dadosValidados = validarDTO(CriarComprovanteDTO, dadosBrutos);

    // 1. Identifica e valida o tenant (por form, header, subdomínio ou fallback)
    let tenant;
    if (dadosValidados.tenant_id) {
      tenant = await validarTenantAtivo(dadosValidados.tenant_id);
    } else {
      tenant = await resolverTenantDaRequisicao(request, { fallbackParaDefault: true });
    }

    // 2. Executa a criação no contexto assíncrono blindado do tenant
    const result = await withTenant(tenant.id, async () => {
      return criarComprovante({
        nome: dadosValidados.nome,
        telefone: dadosValidados.telefone,
        observacao: dadosValidados.observacao,
        foto,
        tenantId: tenant.id,
      });
    });

    return NextResponse.json({ ...result, tenant_id: tenant.id }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar comprovante:', error);
    return tratarErroApi(error, 'Erro interno ao salvar comprovante.');
  }
}

