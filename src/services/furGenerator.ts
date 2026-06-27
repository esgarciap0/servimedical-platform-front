import * as XLSX from 'xlsx'
import type { AphResponse } from '../types/aph'

/**
 * Mapeo de columnas FUR (A-BJ) a campos del AphResponse.
 * Las columnas A y B no vienen del APH (NIT_PRESTADOR, NUM_FACTURA).
 * Las columnas AC, AV, AX, AY no se mapean.
 */
const FUR_COLUMNS: { header: string; field: keyof AphResponse | null }[] = [
  { header: 'NIT_PRESTADOR', field: null },
  { header: 'NUM_FACTURA', field: null },
  { header: 'Tipo_documento_identidad_victima', field: 'tipoDocumento' },
  { header: 'Numero_documento_identidad_victima', field: 'documento' },
  { header: 'Tipo_de_poblacion_especial', field: 'tipoPoblacion' },
  { header: 'Primer_nombre_victima', field: 'primerNombre' },
  { header: 'Segundo_nombre_victima', field: 'segundoNombre' },
  { header: 'Primer_apellido_victima', field: 'primerApellido' },
  { header: 'Segundo_apellido_victima', field: 'segundoApellido' },
  { header: 'Direccion_residencia_victima', field: 'direccion' },
  { header: 'Codigo_municipio_residencia_victima', field: 'codigoMunicipioResidencia' },
  { header: 'Telefono_victima', field: 'celular' },
  { header: 'Naturaleza_del_evento', field: 'naturalezaEvento' },
  { header: 'Descripcion_del_otro_evento', field: 'descripcionOtroEvento' },
  { header: 'Condicion_victima', field: 'condicionVictima' },
  { header: 'Fecha_de_ocurrencia_evento', field: 'fechaAccidente' },
  { header: 'Zona_de_ocurrencia_evento', field: 'zonaOrigen' },
  { header: 'Codigo_municipio_ocurrencia_evento', field: 'codigoMunicipioOcurrencia' },
  { header: 'Direccion_de_ocurrencia_evento', field: 'lugarOcurrencia' },
  { header: 'Descripcion_corta_de_lo_ocurrido_en_el_evento', field: 'hallazgos' },
  { header: 'Estado_de_aseguramiento', field: 'estadoAseguramiento' },
  { header: 'Placa_vehiculo', field: 'placaVehiculo' },
  { header: 'Tipo_de_Vehiculo', field: 'tipoVehiculo' },
  { header: 'Codigo_de_la_aseguradora', field: 'codigoAseguradora' },
  { header: 'Numero_de_poliza_SOAT', field: 'numeroPolizaSoat' },
  { header: 'Fecha_de_inicio_de_vigencia_de_la_poliza', field: 'fechaInicioVigencia' },
  { header: 'Fecha_final_de_vigencia_de_la_poliza', field: 'fechaFinVigencia' },
  { header: 'Numero_de_radicado_SIRAS', field: 'numeroRadicadoSiras' },
  { header: 'Cobro_por_agotamiento_tope_Aseguradora', field: null },
  { header: 'Tipo_de_documento_de_identidad_del_propietario', field: 'tipoDocumentoPropietario' },
  { header: 'Numero_de_documento_de_identidad_del_propietario', field: 'numeroDocumentoPropietario' },
  { header: 'Primer_nombre_del_propietario_o_razon_social', field: 'primerNombrePropietario' },
  { header: 'Segundo_nombre_del_propietario', field: 'segundoNombrePropietario' },
  { header: 'Primer_apellido_del_propietario', field: 'primerApellidoPropietario' },
  { header: 'Segundo_apellido_del_propietario', field: 'segundoApellidoPropietario' },
  { header: 'Direccion_de_residencia_del_propietario', field: 'direccionResidenciaPropietario' },
  { header: 'Telefono_de_residencia_del_propietario', field: 'telefonoResidenciaPropietario' },
  { header: 'Codigo_del_municipio_de_residencia_del_propietario', field: 'codigoMunicipioResidenciaPropietario' },
  { header: 'Tipo_de_documento_de_identidad_del_conductor', field: 'tipoDocumentoConductorVehiculo' },
  { header: 'Numero_de_documento_de_identidad_del_conductor', field: 'numeroDocumentoConductorVehiculo' },
  { header: 'Primer_nombre_del_conductor', field: 'primerNombreConductorVehiculo' },
  { header: 'Segundo_nombre_del_conductor', field: 'segundoNombreConductorVehiculo' },
  { header: 'Primer_apellido_del_conductor', field: 'primerApellidoConductorVehiculo' },
  { header: 'Segundo_apellido_del_conductor', field: 'segundoApellidoConductorVehiculo' },
  { header: 'Codigo_del_municipio_de_residencia_del_conductor', field: 'codigoMunicipioResidenciaConductorVehiculo' },
  { header: 'Direccion_de_residencia_del_conductor', field: 'direccionResidenciaConductorVehiculo' },
  { header: 'Telefono_de_residencia_del_conductor', field: 'telefonoResidenciaConductorVehiculo' },
  { header: 'Uso_material_de_osteosintesis_en_la_atencion', field: null },
  { header: 'Es_atencion_inicial_paciente_remitido_o_control', field: 'esAtencionInicialPacienteRemitidoOControl' },
  { header: 'Placa_ambulancia_que_realiza_el_traslado_secundario', field: null },
  { header: 'Tipo_de_servicio_del_transporte_secundario', field: null },
  { header: 'Codigo_de_habilitacion_del_prestador_que_remite', field: 'codigoHabilitacion' },
  { header: 'Codigo_de_habilitacion_del_prestador_que_recibe', field: 'codigoHabilitacionPrestadorRecibe' },
  { header: 'TIPO_de_documento_Profesional_que_recibe', field: 'tipoDocumentoProfesionalRecibe' },
  { header: 'Numero_de_documento_Profesional_que_recibe', field: 'documentoMedico' },
  { header: 'Fecha_de_aceptacion', field: 'fechaAceptacion' },
  { header: 'Hora_aceptacion', field: 'horaAceptacion' },
  { header: 'Tipo_de_servicio_del_transporte', field: 'traslado' },
  { header: 'Placa_ambulancia_que_realiza_el_traslado', field: 'placa' },
  { header: 'Codigo_de_habilitacion_del_prestador_que_recibe_transporte_primario', field: 'codigoHabilitacionRecibeTransportePrimario' },
  { header: 'Transporte_de_la_victima_desde_el_sitio_del_evento_Direccion', field: 'direccionOrigenTransportePrimario' },
  { header: 'Transporte_de_la_victima_hasta_el_fin_del_recorrido_direccion_IPS', field: 'direccionDestinoTransportePrimario' },
]

export function generateFurExcel(aph: AphResponse): void {
  const headers = FUR_COLUMNS.map((c) => c.header)
  const row = FUR_COLUMNS.map((c) => {
    if (!c.field) return ''
    const value = aph[c.field]
    return value != null ? String(value) : ''
  })

  const ws = XLSX.utils.aoa_to_sheet([headers, row])

  // Ajustar ancho de columnas
  ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length, 15) }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'FUR')

  const fileName = `FUR_${aph.documento || aph.id}_${aph.fechaAccidente || 'sin-fecha'}.xlsx`
  XLSX.writeFile(wb, fileName)
}
