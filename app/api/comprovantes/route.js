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
import { AppError } from '@/lib/errors';

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
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ erro: error.message || 'Erro interno' }, { status });
  }
}

// POST — recebe multipart/form-data e cria um novo comprovante no tenant validado
export async function POST(request) {
  try {
    const formData = await request.formData();
    const nome      = formData.get('nome');
    const telefone  = formData.get('telefone');
    const foto      = formData.get('foto');
    const formTenant = formData.get('tenant_id');

    // 1. Identifica e valida o tenant (por form, header, subdomínio ou fallback)
    let tenant;
    if (formTenant) {
      tenant = await validarTenantAtivo(formTenant);
    } else {
      tenant = await resolverTenantDaRequisicao(request, { fallbackParaDefault: true });
    }

    // 2. Executa a criação no contexto assíncrono blindado do tenant
    const result = await withTenant(tenant.id, async () => {
      return criarComprovante({
        nome,
        telefone,
        foto,
        tenantId: tenant.id,
      });
    });

    return NextResponse.json({ ...result, tenant_id: tenant.id }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar comprovante:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { erro: error.message || 'Erro interno ao salvar.' },
      { status }
    );
  }
}
