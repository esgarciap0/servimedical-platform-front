import { PDFDocument, PDFImage, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib'
import type { AphPayload, AphResponse } from '../types/aph'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 22
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const COLORS = {
  navy: rgb(0.04, 0.15, 0.26),
  navySoft: rgb(0.08, 0.24, 0.38),
  blue: rgb(0.02, 0.34, 0.62),
  cyan: rgb(0.02, 0.55, 0.78),
  red: rgb(0.78, 0.06, 0.12),
  green: rgb(0.04, 0.48, 0.34),
  amber: rgb(0.86, 0.49, 0.08),
  slate: rgb(0.19, 0.25, 0.33),
  muted: rgb(0.43, 0.5, 0.59),
  border: rgb(0.79, 0.84, 0.9),
  divider: rgb(0.9, 0.93, 0.96),
  fill: rgb(0.97, 0.98, 0.99),
  tint: rgb(0.92, 0.97, 1),
  white: rgb(1, 1, 1),
}

type AphFull = AphPayload & Partial<Pick<AphResponse, 'id' | 'codigo' | 'createdAt' | 'updatedAt'>>

type Ctx = {
  doc: PDFDocument
  page: PDFPage
  bold: PDFFont
  normal: PDFFont
}

type KeyValue = {
  label: string
  value: string
  span?: number
  emphasis?: boolean
}

type TextOptions = {
  font?: PDFFont
  size?: number
  color?: ReturnType<typeof rgb>
  maxWidth?: number
}

export async function generatePdf(data: AphFull, logoBase64?: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const normal = await doc.embedFont(StandardFonts.Helvetica)
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const ctx: Ctx = { doc, page, bold, normal }
  const logo = await resolveLogo(doc, logoBase64)

  await drawSinglePage(ctx, data, logo)

  return doc.save()
}

async function drawSinglePage(ctx: Ctx, data: AphFull, logo: PDFImage | null): Promise<void> {
  drawPageBackground(ctx)

  drawHeader(ctx, data, logo)
  drawSummary(ctx, data)

  drawInfoPanel(ctx, {
    x: MARGIN,
    y: 718,
    width: 270,
    height: 100,
    title: 'Paciente y contacto',
    columns: 6,
    rowHeight: 18,
    cells: [
      kv('Paciente', fullName(data), 3, true),
      kv('Documento', joinValues([data.tipoDocumento, data.documento]), 2),
      kv('Sexo', data.sexo, 1),
      kv('Nacimiento', data.fechaNacimiento, 2),
      kv('Edad', data.edad, 1),
      kv('Celular', data.celular, 2),
      kv('Direccion', data.direccion, 3),
      kv('Municipio', joinLocation(data.departamento, data.ciudad), 3),
      kv('Acompanante', data.acompanante, 2),
      kv('Avisar a', joinValues([data.avisarA, data.numeroParaAvisar]), 4),
    ],
  })

  drawInfoPanel(ctx, {
    x: 303,
    y: 718,
    width: 270,
    height: 100,
    title: 'Evento, traslado y aseguramiento',
    columns: 6,
    rowHeight: 18,
    cells: [
      kv('Causa', data.causaExterna, 2, true),
      kv('Naturaleza', data.naturalezaEvento, 2),
      kv('Aseg.', data.estadoAseguramiento, 2),
      kv('Lugar', data.lugarOcurrencia, 3),
      kv('Origen', joinLocation(data.departamentoOrigen, data.municipioOrigen), 2),
      kv('Estado', data.estadoPaciente, 1, true),
      kv('Transportado a', data.transportadoA, 3, true),
      kv('Destino', joinLocation(data.departamentoTraslado, data.ciudadTransporte), 2),
      kv('Hab.', firstValue(data.codigoHabilitacion, data.codigoHabilitacionPrestadorRecibe), 1),
      kv('Plan', firstValue(data.planBeneficios, data.poliza, data.numeroPolizaSoat), 2),
      kv('Victima', data.condicionVictima, 2),
    ],
  })

  drawClinicalPanel(ctx, data, MARGIN, 606, 270, 130)
  await drawInjuryPanel(ctx, data, 303, 606, 270, 130)

  drawNarrativePair(ctx, data, MARGIN, 464, CONTENT_WIDTH, 120)
  drawCareAndAdmin(ctx, data, MARGIN, 332, CONTENT_WIDTH, 112)
  drawCrewAndSignatures(ctx, data, MARGIN, 208, CONTENT_WIDTH, 124)
  drawFooter(ctx, data)
}

function drawPageBackground(ctx: Ctx): void {
  ctx.page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: COLORS.white,
  })
}

function drawHeader(ctx: Ctx, data: AphFull, logo: PDFImage | null): void {
  const height = 52

  ctx.page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - MARGIN - height,
    width: CONTENT_WIDTH,
    height,
    color: COLORS.navy,
  })
  ctx.page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - MARGIN - height,
    width: 5,
    height,
    color: COLORS.cyan,
  })

  drawLogo(ctx, logo, MARGIN + 14, PAGE_HEIGHT - MARGIN - 42, 34, 34)
  drawText(ctx, 'ATENCION PREHOSPITALARIA', MARGIN + 60, PAGE_HEIGHT - MARGIN - 22, {
    font: ctx.bold,
    size: 14,
    color: COLORS.white,
    maxWidth: 292,
  })
  drawText(ctx, 'Registro clinico y operativo de ambulancia - IPS Servimedical', MARGIN + 61, PAGE_HEIGHT - MARGIN - 38, {
    size: 7,
    color: rgb(0.76, 0.87, 0.95),
    maxWidth: 292,
  })

  const metaX = PAGE_WIDTH - MARGIN - 158
  ctx.page.drawRectangle({
    x: metaX,
    y: PAGE_HEIGHT - MARGIN - 41,
    width: 140,
    height: 30,
    color: COLORS.navySoft,
    borderColor: rgb(0.16, 0.48, 0.67),
    borderWidth: 0.6,
  })
  drawText(ctx, 'FAPH v1', metaX + 9, PAGE_HEIGHT - MARGIN - 23, {
    font: ctx.bold,
    size: 8,
    color: COLORS.white,
  })
  drawText(ctx, 'Version 01/03/2025', metaX + 9, PAGE_HEIGHT - MARGIN - 35, {
    size: 6.1,
    color: rgb(0.75, 0.87, 0.95),
  })
  drawText(ctx, firstValue(data.codigo, data.id ? String(data.id) : '', 'Autogenerado'), metaX + 70, PAGE_HEIGHT - MARGIN - 29, {
    font: ctx.bold,
    size: 6.3,
    color: rgb(0.8, 0.93, 1),
    maxWidth: 60,
  })
}

function drawSummary(ctx: Ctx, data: AphFull): void {
  const y = 758
  const height = 29
  const gap = 5
  const items = [
    { label: 'Codigo APH', value: firstValue(data.codigo, data.id ? String(data.id) : '', 'Autogenerado'), color: COLORS.blue },
    { label: 'Prioridad', value: data.prioridad, color: priorityColor(data.prioridad) },
    { label: 'Movil', value: data.movil, color: COLORS.green },
    { label: 'Placa', value: data.placa, color: COLORS.slate },
    { label: 'Fecha / hora', value: joinValues([data.fechaAccidente, data.horaAccidente]), color: COLORS.slate },
    { label: 'Llegada', value: data.horaLlegada, color: COLORS.slate },
  ]
  const width = (CONTENT_WIDTH - gap * (items.length - 1)) / items.length

  items.forEach((item, index) => {
    const x = MARGIN + index * (width + gap)
    ctx.page.drawRectangle({
      x,
      y: y - height,
      width,
      height,
      color: COLORS.fill,
      borderColor: COLORS.border,
      borderWidth: 0.55,
    })
    ctx.page.drawRectangle({
      x,
      y: y - height,
      width: 3,
      height,
      color: item.color,
    })
    drawText(ctx, item.label.toUpperCase(), x + 9, y - 11, {
      font: ctx.bold,
      size: 5.2,
      color: COLORS.muted,
      maxWidth: width - 14,
    })
    drawText(ctx, nvl(item.value) || 'Sin dato', x + 9, y - 23, {
      font: ctx.bold,
      size: 7.6,
      color: COLORS.slate,
      maxWidth: width - 14,
    })
  })
}

function drawInfoPanel(
    ctx: Ctx,
    options: {
      x: number
      y: number
      width: number
      height: number
      title: string
      cells: KeyValue[]
      columns: number
      rowHeight: number
    },
): void {
  drawSectionFrame(ctx, options.x, options.y, options.width, options.height, options.title)
  drawKeyGrid(ctx, {
    x: options.x + 8,
    y: options.y - 21,
    width: options.width - 16,
    cells: options.cells,
    columns: options.columns,
    rowHeight: options.rowHeight,
    gap: 3,
  })
}

function drawClinicalPanel(ctx: Ctx, data: AphFull, x: number, y: number, width: number, height: number): void {
  drawSectionFrame(ctx, x, y, width, height, 'Evaluacion clinica')

  const innerX = x + 8
  const innerY = y - 22
  const vitalW = width - 16
  const glasgowW = 86
  const sampleW = width - 24 - glasgowW

  drawSubHeader(ctx, innerX, innerY, vitalW, 15, 'Signos vitales')
  const vitals = [
    ['PA', data.presion],
    ['FC', data.frecuenciaCardiaca],
    ['FR', data.frecuenciaRespiratoria],
    ['Temp', data.temperatura],
  ]
  const vitalCellW = vitalW / vitals.length
  vitals.forEach(([label, value], index) => {
    const cellX = innerX + index * vitalCellW
    ctx.page.drawRectangle({
      x: cellX,
      y: innerY - 43,
      width: vitalCellW,
      height: 28,
      color: index % 2 === 0 ? COLORS.white : COLORS.fill,
      borderColor: COLORS.divider,
      borderWidth: 0.45,
    })
    drawText(ctx, label, cellX + 6, innerY - 25, {
      font: ctx.bold,
      size: 6.1,
      color: COLORS.muted,
    })
    drawText(ctx, nvl(value) || '-', cellX + 6, innerY - 38, {
      font: ctx.bold,
      size: 8.4,
      color: COLORS.slate,
      maxWidth: vitalCellW - 12,
    })
  })

  const lowerY = innerY - 52
  const glasgowX = innerX
  drawSubHeader(ctx, glasgowX, lowerY, glasgowW, 15, 'Glasgow')
  drawKeyGrid(ctx, {
    x: glasgowX,
    y: lowerY - 18,
    width: glasgowW,
    cells: [kv('RO', data.ro), kv('RV', data.rv), kv('RM', data.rm), kv('Total', sumNumbers([data.ro, data.rv, data.rm]), 3, true)],
    columns: 3,
    rowHeight: 18,
    gap: 3,
  })

  const sampleX = glasgowX + glasgowW + 8
  drawSubHeader(ctx, sampleX, lowerY, sampleW, 15, 'Antecedentes')
  drawWrappedText(ctx, buildSampleHistory(data), {
    x: sampleX + 5,
    y: lowerY - 24,
    width: sampleW - 10,
    height: 48,
    lineHeight: 7.6,
    font: ctx.normal,
    size: 6.2,
    color: COLORS.slate,
  })

}

async function drawInjuryPanel(ctx: Ctx, data: AphFull, x: number, y: number, width: number, height: number): Promise<void> {
  drawSectionFrame(ctx, x, y, width, height, 'Ubicacion de lesiones')

  const imageX = x + 8
  const imageY = y - height + 10
  const imageW = 155
  const imageH = height - 22

  ctx.page.drawRectangle({
    x: imageX,
    y: imageY,
    width: imageW,
    height: imageH,
    color: COLORS.fill,
    borderColor: COLORS.divider,
    borderWidth: 0.45,
  })

  if (data.lesionesImagen && data.lesionesImagen.trim()) {
    try {
      const image = await embedBase64Image(ctx.doc, data.lesionesImagen)
      drawImageContained(ctx.page, image, {
        x: imageX,
        y: imageY,
        width: imageW,
        height: imageH,
        paddingX: 5,
        paddingY: 5,
      })
    } catch {
      drawBodySilhouettes(ctx, imageX, imageY, imageW, imageH, data.lesiones)
    }
  } else {
    drawBodySilhouettes(ctx, imageX, imageY, imageW, imageH, data.lesiones)
  }

  const textX = imageX + imageW + 10
  drawText(ctx, 'Lesiones registradas', textX, y - 31, {
    font: ctx.bold,
    size: 7.2,
    color: COLORS.blue,
  })
  drawWrappedText(ctx, listValues(data.lesiones), {
    x: textX,
    y: y - 44,
    width: width - imageW - 28,
    height: 34,
    lineHeight: 7.4,
    font: ctx.normal,
    size: 6.3,
    color: COLORS.slate,
  })
  drawText(ctx, 'Descripcion del evento', textX, y - 88, {
    font: ctx.bold,
    size: 7.2,
    color: COLORS.blue,
  })
  drawWrappedText(ctx, firstValue(data.descripcionOtroEvento, data.causaExterna, 'Sin dato'), {
    x: textX,
    y: y - 101,
    width: width - imageW - 28,
    height: 34,
    lineHeight: 7.4,
    font: ctx.normal,
    size: 6.3,
    color: COLORS.slate,
  })
}

function drawNarrativePair(ctx: Ctx, data: AphFull, x: number, y: number, width: number, height: number): void {
  drawSectionFrame(ctx, x, y, width, height, 'Hallazgos y diagnostico')

  const gap = 8
  const boxY = y - 22
  const boxH = height - 30
  const leftW = 205
  const rightW = width - leftW - gap - 16

  drawTextBox(ctx, x + 8, boxY, leftW, boxH, 'Diagnostico / motivo de consulta', firstValue(data.diagnosticos, data.descripcionOtroEvento))
  drawTextBox(ctx, x + 8 + leftW + gap, boxY, rightW, boxH, 'Hallazgos clinicos', data.hallazgos)
}

function drawCareAndAdmin(ctx: Ctx, data: AphFull, x: number, y: number, width: number, height: number): void {
  drawSectionFrame(ctx, x, y, width, height, 'Procedimientos, materiales y datos administrativos')

  const gap = 8
  const boxY = y - 22
  const boxH = height - 30
  const procW = 158
  const materialW = 160
  const adminW = width - procW - materialW - gap * 2 - 16

  drawTextBox(ctx, x + 8, boxY, procW, boxH, 'Procedimientos', listValues(data.procedimientos))
  drawTextBox(ctx, x + 8 + procW + gap, boxY, materialW, boxH, 'Materiales y drogas', nvl(data.materiales))
  drawTextBox(
      ctx,
      x + 8 + procW + gap + materialW + gap,
      boxY,
      adminW,
      boxH,
      'SOAT / administracion',
      joinValues(
          [
            labelValue('Traslado', firstValue(data.traslado, data.tipoTraslado)),
            labelValue('Servicio', data.tipoServicioTransporte),
            labelValue('Vehiculo', joinValues([data.placaVehiculo, data.tipoVehiculo])),
            labelValue('SIRAS', data.numeroRadicadoSiras),
            labelValue('Propietario', fullOwnerName(data)),
            labelValue('Cond. vehiculo', fullVehicleDriverName(data)),
          ],
          ' | ',
      ),
  )
}

function drawCrewAndSignatures(ctx: Ctx, data: AphFull, x: number, y: number, width: number, height: number): void {
  drawSectionFrame(ctx, x, y, width, height, 'Tripulacion, recepcion y firmas')

  const colW = (width - 16) / 3
  const topY = y - 22
  const crew = [
    { role: 'Conductor', value: joinPersonDoc(data.conductor, data.documentoConductor), label: 'Firma conductor / responsable' },
    { role: 'Encargado del traslado', value: joinPersonDoc(data.paramedico, data.documentoParamedico), label: 'Firma / sello traslado' },
    { role: 'Recibe paciente', value: joinPersonDoc(data.medico, data.documentoMedico), label: 'Firma / sello recibe' },
  ]

  crew.forEach((item, index) => {
    const cellX = x + 8 + index * colW
    ctx.page.drawRectangle({
      x: cellX,
      y: y - height + 8,
      width: colW,
      height: height - 30,
      color: index % 2 === 0 ? COLORS.white : COLORS.fill,
      borderColor: COLORS.border,
      borderWidth: 0.45,
    })
    drawText(ctx, item.role.toUpperCase(), cellX + 7, topY - 9, {
      font: ctx.bold,
      size: 5.8,
      color: COLORS.muted,
      maxWidth: colW - 14,
    })
    drawText(ctx, item.value || 'Sin dato', cellX + 7, topY - 21, {
      font: ctx.bold,
      size: 7,
      color: COLORS.slate,
      maxWidth: colW - 14,
    })
    ctx.page.drawLine({
      start: { x: cellX + 20, y: y - height + 25 },
      end: { x: cellX + colW - 20, y: y - height + 25 },
      thickness: 0.45,
      color: COLORS.muted,
    })
    drawCenteredText(ctx, item.label, cellX + colW / 2, y - height + 13, ctx.bold, 5.8, COLORS.slate)
  })
}

function drawFooter(ctx: Ctx, data: AphFull): void {
  const legal =
    'El profesional de la salud certifica que las lesiones registradas corresponden a los hallazgos clinicos documentados durante la atencion prehospitalaria. Articulo 32 Decreto 056 de 2015, Ministerio de Salud y Proteccion Social.'

  drawWrappedText(ctx, legal, {
    x: MARGIN,
    y: 20,
    width: CONTENT_WIDTH - 170,
    height: 12,
    lineHeight: 6,
    font: ctx.normal,
    size: 5.2,
    color: COLORS.muted,
  })
  drawText(ctx, joinValues([firstValue(data.codigo, 'APH'), 'Pagina 1 de 1'], ' - '), PAGE_WIDTH - MARGIN - 142, 14, {
    font: ctx.bold,
    size: 6,
    color: COLORS.muted,
    maxWidth: 138,
  })
}

function drawSectionFrame(ctx: Ctx, x: number, y: number, width: number, height: number, title: string): void {
  ctx.page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 0.55,
  })
  ctx.page.drawRectangle({
    x,
    y: y - 17,
    width,
    height: 17,
    color: COLORS.tint,
    borderColor: rgb(0.72, 0.86, 0.95),
    borderWidth: 0.35,
  })
  ctx.page.drawRectangle({
    x,
    y: y - 17,
    width: 4,
    height: 17,
    color: COLORS.cyan,
  })
  drawText(ctx, title.toUpperCase(), x + 10, y - 11.5, {
    font: ctx.bold,
    size: 7.3,
    color: COLORS.blue,
    maxWidth: width - 18,
  })
}

function drawSubHeader(ctx: Ctx, x: number, y: number, width: number, height: number, title: string): void {
  ctx.page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: COLORS.fill,
    borderColor: COLORS.divider,
    borderWidth: 0.45,
  })
  drawText(ctx, title.toUpperCase(), x + 5, y - 10, {
    font: ctx.bold,
    size: 5.8,
    color: COLORS.blue,
    maxWidth: width - 10,
  })
}

function drawKeyGrid(
    ctx: Ctx,
    options: {
      x: number
      y: number
      width: number
      cells: KeyValue[]
      columns: number
      rowHeight: number
      gap: number
    },
): void {
  const colWidth = (options.width - options.gap * (options.columns - 1)) / options.columns
  let x = options.x
  let y = options.y
  let used = 0

  for (const cell of options.cells) {
    const span = Math.min(cell.span || 1, options.columns)

    if (used + span > options.columns) {
      x = options.x
      y -= options.rowHeight + options.gap
      used = 0
    }

    const width = colWidth * span + options.gap * (span - 1)
    drawKeyCell(ctx, x, y, width, options.rowHeight, cell)

    x += width + options.gap
    used += span
  }
}

function drawKeyCell(ctx: Ctx, x: number, y: number, width: number, height: number, cell: KeyValue): void {
  ctx.page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: cell.emphasis ? rgb(0.95, 0.99, 1) : COLORS.white,
    borderColor: cell.emphasis ? rgb(0.57, 0.77, 0.9) : COLORS.divider,
    borderWidth: cell.emphasis ? 0.55 : 0.4,
  })
  drawText(ctx, cell.label.toUpperCase(), x + 5, y - 6.8, {
    font: ctx.bold,
    size: 4.5,
    color: COLORS.muted,
    maxWidth: width - 10,
  })
  drawText(ctx, cell.value || 'Sin dato', x + 5, y - height + 3.6, {
    font: cell.emphasis ? ctx.bold : ctx.normal,
    size: cell.emphasis ? 6.1 : 5.8,
    color: COLORS.slate,
    maxWidth: width - 10,
  })
}

function drawTextBox(ctx: Ctx, x: number, y: number, width: number, height: number, title: string, value: string): void {
  ctx.page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: COLORS.white,
    borderColor: COLORS.divider,
    borderWidth: 0.45,
  })
  ctx.page.drawRectangle({
    x,
    y: y - 15,
    width,
    height: 15,
    color: COLORS.fill,
    borderColor: COLORS.divider,
    borderWidth: 0.35,
  })
  drawText(ctx, title.toUpperCase(), x + 6, y - 10, {
    font: ctx.bold,
    size: 5.9,
    color: COLORS.blue,
    maxWidth: width - 12,
  })
  drawWrappedText(ctx, value || 'Sin dato', {
    x: x + 7,
    y: y - 25,
    width: width - 14,
    height: height - 24,
    lineHeight: 7.4,
    font: ctx.normal,
    size: 6.3,
    color: COLORS.slate,
  })
}

function drawLogo(ctx: Ctx, logo: PDFImage | null, x: number, y: number, width: number, height: number): void {
  ctx.page.drawRectangle({
    x,
    y,
    width,
    height,
    color: COLORS.white,
    borderColor: rgb(0.66, 0.82, 0.91),
    borderWidth: 0.55,
  })

  if (logo) {
    drawImageContained(ctx.page, logo, {
      x,
      y,
      width,
      height,
      paddingX: 3,
      paddingY: 3,
    })
    return
  }

  drawCenteredText(ctx, 'SM', x + width / 2, y + height / 2 - 4, ctx.bold, 10, COLORS.blue)
}

function drawBodySilhouettes(
  ctx: Ctx,
  x: number,
  y: number,
  width: number,
  height: number,
  lesiones: string[] | undefined,
): void {
  const halfW = width / 2
  const leftCX = x + halfW / 2
  const rightCX = x + halfW * 3 / 2
  const figH = height - 14
  const figBottom = y + 12

  drawOneSilhouette(ctx, leftCX, figBottom, figH)
  drawOneSilhouette(ctx, rightCX, figBottom, figH)

  drawCenteredText(ctx, 'FRONTAL', leftCX, y + 5, ctx.normal, 4.5, COLORS.muted)
  drawCenteredText(ctx, 'DORSAL', rightCX, y + 5, ctx.normal, 4.5, COLORS.muted)

  if (lesiones && lesiones.length > 0) {
    paintLesionMarks(ctx, lesiones, leftCX, figBottom, figH, true)
    paintLesionMarks(ctx, lesiones, rightCX, figBottom, figH, false)
  }
}

function drawOneSilhouette(ctx: Ctx, cx: number, figBottom: number, figH: number): void {
  const page = ctx.page
  const stroke = COLORS.muted
  const fill = COLORS.white
  const bw = 0.75

  const headR    = figH * 0.08
  const headCY   = figBottom + figH * 0.92

  const neckW    = figH * 0.08
  const neckBotY = headCY - headR          // bottom of neck = bottom of head
  const neckH    = figH * 0.06

  const sBarW    = figH * 0.42             // shoulder bar spans arms
  const sBarH    = figH * 0.06
  const sBarBotY = neckBotY - neckH        // shoulder bar sits below neck

  const torsoW   = figH * 0.28
  const torsoH   = figH * 0.30
  const torsoBotY = sBarBotY - torsoH

  const armW     = figH * 0.08
  const armH     = figH * 0.40            // arms from shoulder to pelvis level
  const armBotY  = sBarBotY - armH

  const pelvisW  = figH * 0.30
  const pelvisH  = figH * 0.10
  const pelvisBotY = torsoBotY - pelvisH

  const legW     = figH * 0.11
  const legH     = pelvisBotY - figBottom  // legs fill to pelvis bottom
  const legBotY  = figBottom

  page.drawCircle({ x: cx, y: headCY, size: headR, borderColor: stroke, borderWidth: bw, color: fill })
  page.drawRectangle({ x: cx - neckW / 2, y: neckBotY, width: neckW, height: neckH, color: fill, borderColor: stroke, borderWidth: bw })
  page.drawRectangle({ x: cx - sBarW / 2, y: sBarBotY, width: sBarW, height: sBarH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 1 })
  page.drawRectangle({ x: cx - torsoW / 2, y: torsoBotY, width: torsoW, height: torsoH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 1 })
  page.drawRectangle({ x: cx - sBarW / 2, y: armBotY, width: armW, height: armH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 2 })
  page.drawRectangle({ x: cx + sBarW / 2 - armW, y: armBotY, width: armW, height: armH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 2 })
  page.drawRectangle({ x: cx - pelvisW / 2, y: pelvisBotY, width: pelvisW, height: pelvisH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 1 })
  page.drawRectangle({ x: cx - pelvisW / 2, y: legBotY, width: legW, height: legH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 2 })
  page.drawRectangle({ x: cx + pelvisW / 2 - legW, y: legBotY, width: legW, height: legH, color: fill, borderColor: stroke, borderWidth: bw, borderRadius: 2 })
}

function paintLesionMarks(
  ctx: Ctx,
  lesiones: string[],
  cx: number,
  figBottom: number,
  figH: number,
  frontView: boolean,
): void {
  const page = ctx.page
  for (const raw of lesiones) {
    const norm = raw
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    let side = 0
    if (norm.includes('DERECH')) side = frontView ? 1 : -1
    if (norm.includes('IZQUIERD')) side = frontView ? -1 : 1

    // [offsetX from cx, centerY from figBottom, markW, markH] — all as fraction of figH
    let zone: [number, number, number, number] | null = null

    if (norm.includes('CABEZA') || norm.includes('CRANEO') || norm.includes('FRONTAL') || norm.includes('CARA')) {
      zone = [0, 0.92, 0.18, 0.18]
    } else if (norm.includes('CUELLO') || norm.includes('CERVICAL')) {
      zone = [0, 0.87, 0.09, 0.06]
    } else if (norm.includes('HOMBRO')) {
      zone = [side * 0.17, 0.81, 0.10, 0.07]
    } else if (norm.includes('BRAZO') || norm.includes('HUMERO')) {
      zone = [side * 0.17, 0.62, 0.09, 0.16]
    } else if (norm.includes('ANTEBRAZO') || norm.includes('MUNECA') || norm.includes('MANO')) {
      zone = [side * 0.17, 0.44, 0.09, 0.10]
    } else if (norm.includes('TORAX') || norm.includes('TORACI') || norm.includes('HEMITORA') || norm.includes('COSTILLA') || norm.includes('PECHO')) {
      zone = [side * 0.06, 0.65, 0.20, 0.12]
    } else if (norm.includes('ABDOMEN') || norm.includes('VIENTRE')) {
      zone = [side * 0.04, 0.54, 0.18, 0.09]
    } else if (norm.includes('ESPALDA') || norm.includes('LUMBAR') || norm.includes('DORSAL')) {
      zone = [side * 0.04, 0.60, 0.20, 0.18]
    } else if (norm.includes('CADERA') || norm.includes('PELVIS')) {
      zone = [side * 0.05, 0.43, 0.20, 0.10]
    } else if (norm.includes('RODILLA')) {
      zone = [side * 0.095, 0.17, 0.09, 0.05]
    } else if (norm.includes('MUSLO') || norm.includes('FEMUR') || norm.includes('PIERNA')) {
      zone = [side * 0.095, 0.26, 0.10, 0.14]
    } else if (norm.includes('TOBILLO') || norm.includes('PIE')) {
      zone = [side * 0.095, 0.04, 0.09, 0.06]
    }

    if (zone) {
      const [ox, oy, zw, zh] = zone
      page.drawRectangle({
        x: cx + ox * figH - (zw * figH) / 2,
        y: figBottom + oy * figH - (zh * figH) / 2,
        width: zw * figH,
        height: zh * figH,
        color: COLORS.red,
        opacity: 0.75,
        borderRadius: 1.5,
      })
    }
  }
}

async function resolveLogo(doc: PDFDocument, logoBase64?: string): Promise<PDFImage | null> {
  if (!logoBase64) {
    return null
  }

  try {
    const logoBytes = base64ToBytes(removeBase64Prefix(logoBase64))
    return embedImage(doc, logoBytes, logoBase64)
  } catch {
    return null
  }
}

async function embedBase64Image(doc: PDFDocument, base64Image: string): Promise<PDFImage> {
  const cleanBase64 = removeBase64Prefix(base64Image)
  const bytes = base64ToBytes(cleanBase64)
  return embedImage(doc, bytes, base64Image)
}

async function embedImage(doc: PDFDocument, bytes: Uint8Array, source: string): Promise<PDFImage> {
  const lowerSource = source.toLowerCase()
  const isJpg =
    lowerSource.startsWith('data:image/jpeg') ||
    lowerSource.startsWith('data:image/jpg') ||
    (bytes[0] === 0xff && bytes[1] === 0xd8)

  if (isJpg) {
    return doc.embedJpg(bytes)
  }

  return doc.embedPng(bytes)
}

function drawImageContained(
    page: PDFPage,
    image: PDFImage,
    box: {
      x: number
      y: number
      width: number
      height: number
      paddingX: number
      paddingY: number
    },
): void {
  const availableWidth = box.width - box.paddingX * 2
  const availableHeight = box.height - box.paddingY * 2

  if (availableWidth <= 0 || availableHeight <= 0) {
    return
  }

  const imageRatio = image.width / image.height
  const boxRatio = availableWidth / availableHeight
  let drawWidth = availableWidth
  let drawHeight = availableHeight

  if (imageRatio > boxRatio) {
    drawHeight = drawWidth / imageRatio
  } else {
    drawWidth = drawHeight * imageRatio
  }

  page.drawImage(image, {
    x: box.x + (box.width - drawWidth) / 2,
    y: box.y + (box.height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  })
}

function drawText(ctx: Ctx, text: string, x: number, y: number, options: TextOptions = {}): void {
  const font = options.font || ctx.normal
  const size = options.size || 7
  const safeText = options.maxWidth ? fitText(text, options.maxWidth, font, size) : cleanText(text)

  ctx.page.drawText(safeText, {
    x,
    y,
    font,
    size,
    color: options.color || COLORS.slate,
  })
}

function drawWrappedText(
    ctx: Ctx,
    value: string,
    options: {
      x: number
      y: number
      width: number
      height: number
      lineHeight: number
      font: PDFFont
      size: number
      color: ReturnType<typeof rgb>
    },
): void {
  const maxLines = Math.max(1, Math.floor(options.height / options.lineHeight))
  const lines = wrapText(value, options.width, options.font, options.size, maxLines)

  lines.forEach((line, index) => {
    ctx.page.drawText(line, {
      x: options.x,
      y: options.y - index * options.lineHeight,
      font: options.font,
      size: options.size,
      color: options.color,
    })
  })
}

function wrapText(value: string, width: number, font: PDFFont, size: number, maxLines: number): string[] {
  const text = cleanText(value)

  if (!text) {
    return ['']
  }

  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  let consumed = 0

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word

    if (measureWidth(candidate, font, size) <= width) {
      current = candidate
      consumed += 1
      continue
    }

    if (current) {
      lines.push(current)
      current = ''
    }

    if (measureWidth(word, font, size) > width) {
      lines.push(fitText(word, width, font, size))
      consumed += 1
    } else {
      current = word
      consumed += 1
    }

    if (lines.length === maxLines) {
      break
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current)
  }

  if (consumed < words.length && lines.length > 0) {
    lines[lines.length - 1] = fitText(`${lines[lines.length - 1]}...`, width, font, size)
  }

  return lines.slice(0, maxLines)
}

function drawCenteredText(
    ctx: Ctx,
    text: string,
    centerX: number,
    y: number,
    font: PDFFont,
    size: number,
    color = COLORS.slate,
): void {
  const safeText = cleanText(text)

  ctx.page.drawText(safeText, {
    x: centerX - measureWidth(safeText, font, size) / 2,
    y,
    font,
    size,
    color,
  })
}

function fitText(value: string, maxWidth: number, font: PDFFont, size: number): string {
  const text = cleanText(value)

  if (!text || measureWidth(text, font, size) <= maxWidth) {
    return text
  }

  const suffix = '...'
  let end = text.length

  while (end > 0 && measureWidth(`${text.slice(0, end)}${suffix}`, font, size) > maxWidth) {
    end -= 1
  }

  return `${text.slice(0, Math.max(0, end)).trimEnd()}${suffix}`
}

function kv(label: string, value: string | null | undefined, span = 1, emphasis = false): KeyValue {
  return {
    label,
    value: nvl(value),
    span,
    emphasis,
  }
}

function buildSampleHistory(data: AphFull): string {
  return joinValues(
      [
        labelValue('Alergias', data.alergia),
        labelValue('Liquidos', data.liquidos),
        labelValue('Medicacion', data.medicacion),
        labelValue('Patologicos', data.patologicos),
      ],
      ' | ',
  )
}

function labelValue(label: string, value: string | null | undefined): string {
  return `${label}: ${nvl(value) || 'Sin dato'}`
}

function fullName(data: AphFull): string {
  return joinValues([data.primerNombre, data.segundoNombre, data.primerApellido, data.segundoApellido])
}

function fullOwnerName(data: AphFull): string {
  return joinValues([
    data.primerNombrePropietario,
    data.segundoNombrePropietario,
    data.primerApellidoPropietario,
    data.segundoApellidoPropietario,
  ])
}

function fullVehicleDriverName(data: AphFull): string {
  return joinValues([
    data.primerNombreConductorVehiculo,
    data.segundoNombreConductorVehiculo,
    data.primerApellidoConductorVehiculo,
    data.segundoApellidoConductorVehiculo,
  ])
}

function joinPersonDoc(name: string, doc: string): string {
  return joinValues([name, doc])
}

function joinLocation(department: string, city: string): string {
  return joinValues([department, city], ' / ')
}

function joinValues(values: Array<string | null | undefined>, separator = ' '): string {
  return values.map(nvl).filter(Boolean).join(separator)
}

function firstValue(...values: Array<string | number | null | undefined>): string {
  for (const value of values) {
    const text = typeof value === 'number' ? String(value) : nvl(value)

    if (text) {
      return text
    }
  }

  return ''
}

function listValues(values: string[] | null | undefined): string {
  return values && values.length > 0 ? values.map(nvl).filter(Boolean).join(', ') : 'Sin dato'
}

function sumNumbers(values: Array<string | null | undefined>): string {
  const numbers = values.map((value) => Number(value)).filter((value) => Number.isFinite(value))

  if (numbers.length !== values.length) {
    return ''
  }

  return String(numbers.reduce((sum, current) => sum + current, 0))
}

function priorityColor(priority: string): ReturnType<typeof rgb> {
  const value = nvl(priority).toLowerCase()

  if (value.includes('1') || value.includes('alta') || value.includes('rojo')) {
    return COLORS.red
  }

  if (value.includes('2') || value.includes('media') || value.includes('amarillo')) {
    return COLORS.amber
  }

  return COLORS.green
}

function nvl(value: string | null | undefined): string {
  return value && value.trim() ? value.trim() : ''
}

function cleanText(value: string): string {
  return nvl(value)
      .replace(/[\u2010-\u2015]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/\u00a0/g, ' ')
      .replace(/[^\u0009\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/g, '')
}

function removeBase64Prefix(base64: string): string {
  return base64.includes(',') ? base64.substring(base64.indexOf(',') + 1) : base64
}

function measureWidth(text: string, font: PDFFont, size: number): number {
  if (!text) {
    return 0
  }

  return font.widthOfTextAtSize(text, size)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/\s/g, ''))
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}
